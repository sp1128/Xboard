{{-- 仪表盘区块（参考聚盟云）：蓝色订阅卡 + 流量使用 + 我的邀请 + 客户端下载。
     只在 #/dashboard 插入，数据用当前登录 token 读取 user/getSubscribe 与 user/invite/fetch（只读）。
     读取失败时不插入，原 Xboard「我的订阅」卡保持可见；成功后才隐藏原卡，避免重复。 --}}
<style id="sl-dash-style">
#sl-dash{display:grid;gap:16px;margin:0 0 16px}
@media (min-width:768px){#sl-dash{gap:20px;margin:20px 0}}
#sl-dash .sl-row{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr);gap:16px}
#sl-dash .sl-box{background:var(--sl-surface,#fff);border:1px solid var(--sl-line,#e5e6eb);border-radius:var(--sl-radius,8px);padding:16px 20px;color:var(--sl-text,#1d2129);min-width:0}
#sl-dash .sl-box h3{margin:0 0 14px;font-size:15px;font-weight:500;display:flex;align-items:center;justify-content:space-between}
#sl-dash .sl-box h3 a{font-size:13px;font-weight:400;color:var(--sl-primary,#165dff);text-decoration:none}
#sl-dash .sl-sub{position:relative;overflow:hidden;background:linear-gradient(135deg,#165dff,#3c7eff 60%,#6a5cff);border:0;color:#fff;display:flex;flex-direction:column}
#sl-dash .sl-sub:after{content:"";position:absolute;right:-50px;top:-60px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,.08)}
#sl-dash .sl-sub h3{color:rgba(255,255,255,.85)}
#sl-dash .sl-sub-name{font-size:22px;font-weight:600;line-height:1.3;overflow-wrap:anywhere}
#sl-dash .sl-sub-meta{margin-top:6px;font-size:13px;color:rgba(255,255,255,.8)}
#sl-dash .sl-sub-bar{margin-top:16px;height:6px;border-radius:3px;background:rgba(255,255,255,.25);overflow:hidden}
#sl-dash .sl-sub-bar i{display:block;height:100%;background:#fff;border-radius:3px}
#sl-dash .sl-sub-used{margin-top:8px;font-size:12px;color:rgba(255,255,255,.85);display:flex;justify-content:space-between;gap:8px}
#sl-dash .sl-sub-actions{position:relative;z-index:1;margin-top:auto;padding-top:16px;display:flex;flex-wrap:wrap;gap:10px}
#sl-dash .sl-sub-actions a,#sl-dash .sl-sub-actions button{display:inline-flex;align-items:center;height:30px;padding:0 14px;border-radius:6px;font-size:13px;cursor:pointer;text-decoration:none;border:1px solid rgba(255,255,255,.55);background:transparent;color:#fff;font-family:inherit}
#sl-dash .sl-sub-actions a:first-child{background:#fff;border-color:#fff;color:#165dff;font-weight:500}
#sl-dash .sl-sub-empty{flex:1;display:grid;place-items:center;text-align:center;gap:6px;padding:8px 0;font-size:14px;color:rgba(255,255,255,.85)}
#sl-dash .sl-list{list-style:none;margin:0;padding:0;display:grid;gap:12px;font-size:13px}
#sl-dash .sl-list li{display:flex;align-items:center;gap:8px;color:var(--sl-muted,#86909c)}
#sl-dash .sl-list li b{margin-left:auto;font-weight:500;color:var(--sl-text,#1d2129);font-variant-numeric:tabular-nums;white-space:nowrap}
#sl-dash .sl-dot{width:8px;height:8px;border-radius:50%;flex:none}
#sl-dash .sl-apps{display:grid;grid-template-columns:repeat(4,minmax(0,140px));gap:12px}
#sl-dash .sl-app{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border:1px solid var(--sl-line,#e5e6eb);border-radius:8px;color:var(--sl-text,#1d2129);text-decoration:none;font-size:13px;text-align:center;transition:border-color .15s,color .15s}
#sl-dash .sl-app:hover{border-color:var(--sl-primary,#165dff);color:var(--sl-primary,#165dff)}
#sl-dash .sl-app svg{width:30px;height:30px;color:var(--sl-primary,#165dff)}
#sl-dash .sl-app small{font-size:12px;color:var(--sl-muted,#86909c)}
.sl-dash-replaced{display:none!important}
/* 原「捷径」列表改成聚盟云那样的左侧蓝条操作行 */
#sl-dash~.n-card .n-list-item{border-left:3px solid var(--sl-primary,#165dff);margin:10px 0;border-radius:4px}
#sl-dash~.n-card .n-list-item .n-list-item__divider{display:none}
#sl-dash~.n-card .n-list-item svg,#sl-dash~.n-card .n-list-item .n-icon{color:var(--sl-primary,#165dff)}
@media (max-width:1100px){#sl-dash .sl-row{grid-template-columns:1fr 1fr}#sl-dash .sl-sub{grid-column:1/-1}}
@media (max-width:640px){#sl-dash .sl-row{grid-template-columns:1fr}#sl-dash .sl-apps{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>
<script>
(function () {
  var TOKEN_KEY = 'VUE_NAIVE_ACCESS_TOKEN';
  var SUB_TITLES = ['我的订阅', '我的訂閱', 'My Subscription', 'My subscription'];
  var APPS = [
    ['Windows', 'Clash Verge', 'https://github.com/clash-verge-rev/clash-verge-rev/releases', 'desktop'],
    ['macOS', 'Clash Verge', 'https://github.com/clash-verge-rev/clash-verge-rev/releases', 'desktop'],
    ['iOS', 'Shadowrocket', 'https://apps.apple.com/us/app/shadowrocket/id932747118', 'phone'],
    ['Android', 'FlClash / v2rayNG', 'https://github.com/chen08209/FlClash/releases', 'phone']
  ];
  var ICONS = {
    desktop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>'
  };

  function token() {
    try {
      var raw = localStorage.getItem(TOKEN_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      return o && typeof o === 'object' ? (o.value || null) : (typeof o === 'string' ? o : null);
    } catch (e) { return null; }
  }
  function api(path, auth) {
    var base = (window.routerBase || '/').replace(/\/?$/, '/');
    return fetch(base + 'api/v1/' + path, { headers: { Authorization: auth } })
      .then(function (r) { if (!r.ok) throw new Error(path); return r.json(); })
      .then(function (j) { if (!j || j.data == null) throw new Error(path); return j.data; });
  }
  function gb(bytes) {
    var n = Number(bytes) || 0;
    return (n / 1073741824).toFixed(2) + ' GB';
  }
  function yuan(cents) {
    var n = (Number(cents) || 0) / 100;
    return '¥' + (Number.isInteger(n) ? n : n.toFixed(2));
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function route() { return (location.hash.replace(/^#\/?/, '').split(/[/?]/)[0]) || 'dashboard'; }

  function subCard(s) {
    var box = el('section', 'sl-box sl-sub');
    var h = el('h3', null, '我的订阅');
    box.appendChild(h);
    var actions = el('div', 'sl-sub-actions');
    if (!s.plan_id || !s.plan) {
      var empty = el('div', 'sl-sub-empty');
      empty.appendChild(el('div', null, '暂无订阅'));
      empty.appendChild(el('div', null, '选择一个套餐，开始使用'));
      box.appendChild(empty);
      var buy = el('a', null, '购买订阅'); buy.href = '#/plan';
      actions.appendChild(buy);
      box.appendChild(actions);
      return box;
    }
    box.appendChild(el('div', 'sl-sub-name', s.plan.name || '订阅套餐'));
    var meta;
    if (!s.expired_at) meta = '长期有效';
    else {
      var ms = Number(s.expired_at) * 1000;
      var d = new Date(ms);
      var left = Math.ceil((ms - Date.now()) / 86400000);
      var date = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
      meta = left >= 0 ? '于 ' + date + ' 到期，剩余 ' + left + ' 天' : '已于 ' + date + ' 到期';
    }
    if (s.reset_day != null && s.reset_day !== '') meta += ' · ' + s.reset_day + ' 天后重置流量';
    box.appendChild(el('div', 'sl-sub-meta', meta));
    var used = (Number(s.u) || 0) + (Number(s.d) || 0);
    var total = Number(s.transfer_enable) || 0;
    var bar = el('div', 'sl-sub-bar'); var fill = el('i');
    fill.style.width = (total ? Math.min(100, used / total * 100) : 0).toFixed(1) + '%';
    bar.appendChild(fill); box.appendChild(bar);
    var usedRow = el('div', 'sl-sub-used');
    usedRow.appendChild(el('span', null, '已用 ' + gb(used)));
    usedRow.appendChild(el('span', null, '总计 ' + gb(total)));
    box.appendChild(usedRow);
    var renew = el('a', null, '续费订阅'); renew.href = '#/plan/' + encodeURIComponent(s.plan_id);
    actions.appendChild(renew);
    if (s.subscribe_url && navigator.clipboard) {
      var copy = el('button', null, '复制订阅链接'); copy.type = 'button';
      copy.addEventListener('click', function () {
        navigator.clipboard.writeText(s.subscribe_url).then(function () { copy.textContent = '已复制'; }, function () { copy.textContent = '复制失败，请到「一键订阅」'; });
        setTimeout(function () { copy.textContent = '复制订阅链接'; }, 2000);
      });
      actions.appendChild(copy);
    }
    box.appendChild(actions);
    return box;
  }
  function listCard(title, link, rows) {
    var box = el('section', 'sl-box');
    var h = el('h3', null, title);
    if (link) { var a = el('a', null, link[0]); a.href = link[1]; h.appendChild(a); }
    box.appendChild(h);
    var ul = el('ul', 'sl-list');
    rows.forEach(function (r) {
      var li = el('li');
      var dot = el('span', 'sl-dot'); dot.style.background = r[2];
      li.appendChild(dot); li.appendChild(el('span', null, r[0])); li.appendChild(el('b', null, r[1]));
      ul.appendChild(li);
    });
    box.appendChild(ul);
    return box;
  }
  function appsCard() {
    var box = el('section', 'sl-box');
    box.appendChild(el('h3', null, '客户端下载'));
    var grid = el('div', 'sl-apps');
    APPS.forEach(function (app) {
      var a = el('a', 'sl-app'); a.href = app[2]; a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = ICONS[app[3]];
      a.appendChild(el('span', null, app[0]));
      a.appendChild(el('small', null, app[1]));
      grid.appendChild(a);
    });
    box.appendChild(grid);
    return box;
  }
  function build(sub, invite) {
    var root = el('div'); root.id = 'sl-dash';
    var row = el('div', 'sl-row');
    row.appendChild(subCard(sub));
    var u = Number(sub.u) || 0, d = Number(sub.d) || 0;
    row.appendChild(listCard('流量使用', ['明细', '#/traffic'], [
      ['上行流量', gb(u), '#00b42a'], ['下行流量', gb(d), '#f53f3f'], ['总计使用', gb(u + d), '#165dff']
    ]));
    var stat = invite && Array.isArray(invite.stat) ? invite.stat : null;
    row.appendChild(listCard('我的邀请', ['邀请', '#/invite'], stat ? [
      ['邀请人数', stat[0] + ' 人', '#00b42a'], ['佣金比例', stat[3] + '%', '#f53f3f'], ['可用佣金', yuan(stat[4]), '#165dff']
    ] : [['邀请数据暂时无法读取', '', '#c9cdd4']]));
    root.appendChild(row);
    root.appendChild(appsCard());
    return root;
  }
  function originalSubCard(container) {
    var cards = container.querySelectorAll('.n-card');
    for (var i = 0; i < cards.length; i++) {
      var head = cards[i].querySelector('.n-card-header__main');
      if (head && SUB_TITLES.indexOf(head.textContent.trim()) !== -1) return cards[i];
    }
    return null;
  }

  // 每次进入仪表盘读取一次数据；SPA 重绘时用缓存同步插入，不重复请求。
  var visit = 0, data = null, loading = false;
  function update() {
    if (route() !== 'dashboard') return;
    var container = document.querySelector('#app .cus-scroll-y > div:not(.n-back-top-placeholder)');
    if (!container || container.querySelector('#sl-dash')) return;
    var anchor = originalSubCard(container);
    if (!anchor) return; // 等原仪表盘渲染完成
    if (data) {
      anchor.parentNode.insertBefore(build(data[0], data[1]), anchor);
      anchor.classList.add('sl-dash-replaced');
      return;
    }
    if (loading) return;
    var auth = token();
    if (!auth) return;
    loading = true;
    var mine = visit;
    Promise.all([
      api('user/getSubscribe', auth),
      api('user/invite/fetch', auth).catch(function () { return null; })
    ]).then(function (res) {
      if (mine !== visit) return;
      data = res;
      schedule();
    }).catch(function () { /* 读取失败：保留原「我的订阅」卡，本次进入不再重试 */ });
  }
  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    setTimeout(function () { queued = false; update(); }, 30);
  }
  function start() {
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', function () {
      if (route() === 'dashboard') { visit++; data = null; loading = false; }
      schedule();
    });
    schedule();
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
</script>
