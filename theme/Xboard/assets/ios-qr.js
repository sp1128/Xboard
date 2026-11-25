/* Lightweight zero-dependency QR Code SVG generator (UTF-8 Byte Mode, Versions 1..10, EC Level L/M) */
(function (global) {
  'use strict';

  // GF(256) log/exp tables for Reed-Solomon (primitive poly 0x11d)
  var EXP = new Uint8Array(512);
  var LOG = new Uint8Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
  })();

  function gfMul(a, b) {
    return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]];
  }

  function rsGenPoly(ecLen) {
    var poly = [1];
    for (var i = 0; i < ecLen; i++) {
      var next = new Array(poly.length + 1).fill(0);
      var factor = EXP[i];
      for (var j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];
        next[j + 1] ^= gfMul(poly[j], factor);
      }
      poly = next;
    }
    return poly;
  }

  function rsEncode(data, ecLen) {
    var gen = rsGenPoly(ecLen);
    var res = data.slice().concat(new Array(ecLen).fill(0));
    for (var i = 0; i < data.length; i++) {
      var coef = res[i];
      if (coef !== 0) {
        for (var j = 0; j < gen.length; j++) {
          res[i + j] ^= gfMul(gen[j], coef);
        }
      }
    }
    return res.slice(data.length);
  }

  // Version specs for EC Level L: [version, totalDataBytes, ecBytesPerBlock, blockCount1, dataPerBlock1, blockCount2, dataPerBlock2, alignCoords]
  var SPECS = [
    [1, 19, 7, 1, 19, 0, 0, []],
    [2, 34, 10, 1, 34, 0, 0, [6, 18]],
    [3, 55, 15, 1, 55, 0, 0, [6, 22]],
    [4, 80, 20, 1, 80, 0, 0, [6, 26]],
    [5, 108, 26, 1, 108, 0, 0, [6, 30]],
    [6, 136, 18, 2, 68, 0, 0, [6, 34]],
    [7, 156, 20, 2, 78, 0, 0, [6, 22, 38]],
    [8, 194, 24, 2, 97, 0, 0, [6, 24, 42]],
    [9, 232, 30, 2, 116, 0, 0, [6, 26, 46]],
    [10, 274, 18, 2, 68, 2, 69, [6, 28, 50]],
    [11, 324, 20, 4, 81, 0, 0, [6, 30, 54]],
    [12, 370, 24, 2, 92, 2, 93, [6, 32, 58]]
  ];

  function utf8Bytes(str) {
    if (typeof TextEncoder !== 'undefined') return Array.from(new TextEncoder().encode(str));
    var out = [];
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 128) out.push(c);
      else if (c < 2048) out.push(192 | (c >> 6), 128 | (c & 63));
      else out.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
    }
    return out;
  }

  function makeBitBuffer() {
    var bits = [];
    return {
      push: function (val, len) {
        for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
      },
      bits: bits
    };
  }

  function buildMatrix(text) {
    var bytes = utf8Bytes(String(text || ''));
    var spec = null;
    for (var s = 0; s < SPECS.length; s++) {
      var ver = SPECS[s][0];
      var cap = SPECS[s][1];
      var lenBits = ver <= 9 ? 8 : 16;
      if (4 + lenBits + bytes.length * 8 <= cap * 8) {
        spec = SPECS[s];
        break;
      }
    }
    if (!spec) return null;

    var ver = spec[0], totalData = spec[1], ecPerBlock = spec[2];
    var b1 = spec[3], d1 = spec[4], b2 = spec[5], d2 = spec[6], align = spec[7];
    var bb = makeBitBuffer();
    bb.push(0x4, 4); // Byte mode
    bb.push(bytes.length, ver <= 9 ? 8 : 16);
    for (var i = 0; i < bytes.length; i++) bb.push(bytes[i], 8);
    if (bb.bits.length + 4 <= totalData * 8) bb.push(0, 4);
    while (bb.bits.length % 8 !== 0) bb.push(0, 1);

    var dataBytes = [];
    for (var k = 0; k < bb.bits.length; k += 8) {
      var byteVal = 0;
      for (var b = 0; b < 8; b++) byteVal = (byteVal << 1) | bb.bits[k + b];
      dataBytes.push(byteVal);
    }
    var pads = [0xec, 0x11], pi = 0;
    while (dataBytes.length < totalData) { dataBytes.push(pads[pi % 2]); pi++; }

    var blocks = [], ecs = [], offset = 0;
    for (var i1 = 0; i1 < b1; i1++) {
      var blk1 = dataBytes.slice(offset, offset + d1);
      offset += d1;
      blocks.push(blk1);
      ecs.push(rsEncode(blk1, ecPerBlock));
    }
    for (var i2 = 0; i2 < b2; i2++) {
      var blk2 = dataBytes.slice(offset, offset + d2);
      offset += d2;
      blocks.push(blk2);
      ecs.push(rsEncode(blk2, ecPerBlock));
    }

    var codewords = [];
    var maxD = Math.max(d1, d2);
    for (var c = 0; c < maxD; c++) {
      for (var bi = 0; bi < blocks.length; bi++) {
        if (c < blocks[bi].length) codewords.push(blocks[bi][c]);
      }
    }
    for (var e = 0; e < ecPerBlock; e++) {
      for (var bi2 = 0; bi2 < ecs.length; bi2++) codewords.push(ecs[bi2][e]);
    }

    var size = ver * 4 + 17;
    var mat = Array.from({ length: size }, function () { return new Int8Array(size).fill(-1); });
    var fixed = Array.from({ length: size }, function () { return new Uint8Array(size); });

    function setFixed(r, c, v) {
      if (r >= 0 && r < size && c >= 0 && c < size) {
        mat[r][c] = v ? 1 : 0;
        fixed[r][c] = 1;
      }
    }

    function finder(r0, c0) {
      for (var r = -1; r <= 7; r++) {
        for (var c = -1; c <= 7; c++) {
          var inBox = r >= 0 && r <= 6 && c >= 0 && c <= 6;
          var dark = inBox && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
          setFixed(r0 + r, c0 + c, dark);
        }
      }
    }
    finder(0, 0);
    finder(0, size - 7);
    finder(size - 7, 0);

    for (var t = 8; t < size - 8; t++) {
      setFixed(6, t, t % 2 === 0);
      setFixed(t, 6, t % 2 === 0);
    }
    setFixed(size - 8, 8, 1);

    for (var ai = 0; ai < align.length; ai++) {
      for (var aj = 0; aj < align.length; aj++) {
        var ar = align[ai], ac = align[aj];
        if (fixed[ar][ac]) continue;
        for (var dr = -2; dr <= 2; dr++) {
          for (var dc = -2; dc <= 2; dc++) {
            setFixed(ar + dr, ac + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
          }
        }
      }
    }

    // Reserve format info (15 bits) + version info if >=7
    for (var f = 0; f < 9; f++) {
      if (!fixed[8][f]) { mat[8][f] = 0; fixed[8][f] = 1; }
      if (!fixed[f][8]) { mat[f][8] = 0; fixed[f][8] = 1; }
    }
    for (var f2 = 0; f2 < 8; f2++) {
      mat[8][size - 1 - f2] = 0; fixed[8][size - 1 - f2] = 1;
      if (f2 < 7) { mat[size - 1 - f2][8] = 0; fixed[size - 1 - f2][8] = 1; }
    }
    if (ver >= 7) {
      for (var vr = 0; vr < 6; vr++) {
        for (var vc = 0; vc < 3; vc++) {
          mat[vr][size - 11 + vc] = 0; fixed[vr][size - 11 + vc] = 1;
          mat[size - 11 + vc][vr] = 0; fixed[size - 11 + vc][vr] = 1;
        }
      }
    }

    // Place data bits with mask 0 ((r + c) % 2 === 0) — simple, deterministic, high reliability with EC-L
    var allBits = [];
    for (var cw = 0; cw < codewords.length; cw++) {
      for (var bit = 7; bit >= 0; bit--) allBits.push((codewords[cw] >>> bit) & 1);
    }

    // Pick best mask (0..7) by simple penalty score
    function applyMask(maskId) {
      var m = mat.map(function (row) { return row.slice(); });
      var bi = 0, dir = -1, row = size - 1;
      for (var col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (var c2 = 0; c2 < 2; c2++) {
            var cc = col - c2;
            if (!fixed[row][cc]) {
              var bitVal = bi < allBits.length ? allBits[bi++] : 0;
              var mask = false;
              if (maskId === 0) mask = (row + cc) % 2 === 0;
              else if (maskId === 1) mask = row % 2 === 0;
              else if (maskId === 2) mask = cc % 3 === 0;
              else if (maskId === 3) mask = (row + cc) % 3 === 0;
              else if (maskId === 4) mask = (Math.floor(row / 2) + Math.floor(cc / 3)) % 2 === 0;
              else if (maskId === 5) mask = ((row * cc) % 2) + ((row * cc) % 3) === 0;
              else if (maskId === 6) mask = (((row * cc) % 2) + ((row * cc) % 3)) % 2 === 0;
              else mask = (((row + cc) % 2) + ((row * cc) % 3)) % 2 === 0;
              m[row][cc] = mask ? (bitVal ^ 1) : bitVal;
            }
          }
          row += dir;
          if (row < 0 || row >= size) { row -= dir; dir = -dir; break; }
        }
      }
      // Write format info for EC-L (01) + maskId
      var fmt = (1 << 3) | maskId;
      var rem = fmt << 10;
      for (var b = 14; b >= 10; b--) if ((rem >>> b) & 1) rem ^= 0x537 << (b - 10);
      var bits15 = ((fmt << 10) | rem) ^ 0x5412;
      for (var p = 0; p < 15; p++) {
        var v = (bits15 >>> p) & 1;
        if (p < 6) m[p][8] = v;
        else if (p < 8) m[p + 1][8] = v;
        else m[size - 15 + p][8] = v;
        if (p < 8) m[8][size - 1 - p] = v;
        else if (p < 9) m[8][15 - p] = v;
        else m[8][14 - p] = v;
      }
      if (ver >= 7) {
        var vrem = ver << 12;
        for (var vb = 17; vb >= 12; vb--) if ((vrem >>> vb) & 1) vrem ^= 0x1f25 << (vb - 12);
        var vbits = (ver << 12) | vrem;
        for (var vp = 0; vp < 18; vp++) {
          var vv = (vbits >>> vp) & 1;
          m[Math.floor(vp / 3)][size - 11 + (vp % 3)] = vv;
          m[size - 11 + (vp % 3)][Math.floor(vp / 3)] = vv;
        }
      }
      return m;
    }

    function penalty(m) {
      var score = 0;
      for (var r = 0; r < size; r++) {
        var run = 1;
        for (var c = 1; c < size; c++) {
          if (m[r][c] === m[r][c - 1]) { run++; if (run === 5) score += 3; else if (run > 5) score++; }
          else run = 1;
        }
      }
      for (var c2 = 0; c2 < size; c2++) {
        var run2 = 1;
        for (var r2 = 1; r2 < size; r2++) {
          if (m[r2][c2] === m[r2 - 1][c2]) { run2++; if (run2 === 5) score += 3; else if (run2 > 5) score++; }
          else run2 = 1;
        }
      }
      return score;
    }

    var best = null, bestScore = Infinity;
    for (var mid = 0; mid < 8; mid++) {
      var cand = applyMask(mid);
      var sc = penalty(cand);
      if (sc < bestScore) { bestScore = sc; best = cand; }
    }
    return best;
  }

  function toSvg(text, px) {
    var sizePx = px || 180;
    var mat = buildMatrix(text);
    if (!mat) return '<div style="padding:16px;font-size:12px;color:#888">内容过长，请直接复制链接</div>';
    var n = mat.length;
    var pad = 2;
    var total = n + pad * 2;
    var path = '';
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (mat[r][c]) path += 'M' + (c + pad) + ',' + (r + pad) + 'h1v1h-1z';
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + total + ' ' + total + '" width="' + sizePx + '" height="' + sizePx + '" style="background:#fff;border-radius:12px;display:block"><path d="' + path + '" fill="#000"/></svg>';
  }

  global.SLQR = { toSvg: toSvg };
})(window);
