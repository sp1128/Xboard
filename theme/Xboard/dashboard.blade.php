<!doctype html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no" />
  <title>{{$title}}</title>
  <script type="module" crossorigin src="/theme/{{$theme}}/assets/umi.js"></script>
</head>

<body>

  <script>
    window.routerBase = "/";
    window.settings = {
      title: '{{$title}}',
      assets_path: '/theme/{{$theme}}/assets',
      theme: {
        color: '{{ $theme_config['theme_color'] ?? "default" }}',
      },
      version: '{{$version}}',
      background_url: '{{$theme_config['background_url']}}',
      description: '{{$description}}',
      i18n: [
        'zh-CN',
        'en-US',
        'ja-JP',
        'vi-VN',
        'ko-KR',
        'zh-TW',
        'fa-IR'
      ],
      logo: '{{$logo}}'
    }
  </script>
  <div id="app"></div>
  {!! $theme_config['custom_html'] !!}
  <!-- ===== 星屿StarLink 主题注入（第一阶段，fork 内置，不依赖 custom_html 设置） ===== -->
  <style>
    /* TRIALUP8 倒计时横幅：顶部通栏，可关闭 */
    #sl-promo-bar{display:none;position:fixed;top:0;left:0;right:0;z-index:9999;background:linear-gradient(90deg,#3a2f05,#57470a);border-bottom:1px solid #C9A227;color:#fde68a;font-size:13px}
    #sl-promo-bar .in{max-width:1080px;margin:0 auto;padding:9px 14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    #sl-promo-bar .code{background:#C9A227;color:#111;padding:1px 8px;border-radius:6px;font-weight:800;letter-spacing:1px}
    #sl-promo-bar .cd{font-weight:700;color:#fff;font-variant-numeric:tabular-nums}
    #sl-promo-bar a{color:#fff;font-weight:700}
    #sl-promo-bar .close{margin-left:auto;background:none;border:none;color:#fde68a;font-size:18px;cursor:pointer;line-height:1}
    body.sl-promo-on{padding-top:40px}
    /* 客户端下载悬浮按钮（左下角，避开右侧 Chatwoot 气泡） */
    #sl-dl-btn{position:fixed;left:18px;bottom:20px;z-index:9998;width:52px;height:52px;border-radius:50%;background:#111827;border:1px solid #C9A227;color:#C9A227;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,.4);font-size:22px;cursor:pointer}
    #sl-dl-btn:hover{transform:scale(1.05)}
    #sl-dl-panel{display:none;position:fixed;left:18px;bottom:84px;z-index:9998;width:280px;max-width:calc(100vw - 36px);background:#0f172a;border:1px solid #334155;border-radius:14px;padding:16px;box-shadow:0 12px 32px rgba(0,0,0,.5);color:#e2e8f0;font-size:14px}
    #sl-dl-panel h4{color:#f8fafc;font-size:15px;margin-bottom:8px}
    #sl-dl-panel a{display:block;color:#C9A227;padding:7px 0;border-bottom:1px solid #1e293b}
    #sl-dl-panel a:last-child{border-bottom:none}
    #sl-dl-panel p{color:#94a3b8;font-size:12px;margin-top:10px;line-height:1.6}
    @media (max-width:640px){
      #sl-dl-btn{bottom:76px}
      #sl-dl-panel{bottom:140px}
    }
  </style>
  <div id="sl-promo-bar">
    <div class="in">
      <span>🎉 体验包用户升级立享 8 折，优惠码 <span class="code">TRIALUP8</span>，仅剩 <span class="cd" id="sl-promo-cd">--天 --:--:--</span>，截止 2026-12-19 23:59</span>
      <a href="/#/plan">立即升级 →</a>
      <button class="close" id="sl-promo-close" aria-label="关闭">×</button>
    </div>
  </div>
  <button id="sl-dl-btn" title="客户端下载" aria-label="客户端下载">↓</button>
  <div id="sl-dl-panel">
    <h4>客户端下载</h4>
    <a href="https://github.com/clash-verge-rev/clash-verge-rev/releases" target="_blank" rel="noopener">Clash Verge（Windows / macOS）</a>
    <a href="https://apps.apple.com/us/app/shadowrocket/id932747118" target="_blank" rel="noopener">Shadowrocket（iOS App Store）</a>
    <a href="https://github.com/chen08209/FlClash/releases" target="_blank" rel="noopener">FlClash（Android / Windows / macOS）</a>
    <a href="https://github.com/2dust/v2rayNG/releases" target="_blank" rel="noopener">v2rayNG（Android）</a>
    <p>登录后在仪表盘复制订阅链接，导入客户端即可使用。</p>
  </div>
  <script>
  (function(){
    /* ---- 登录态 cookie 同步：routes/web.php 按 sl_logged_in 决定首屏渲染落地页还是 SPA ---- */
    var TOKEN_KEY = 'VUE_NAIVE_ACCESS_TOKEN';
    function hasToken(){
      try{
        var raw = localStorage.getItem(TOKEN_KEY);
        if(!raw || raw === 'null' || raw === 'undefined') return false;
        var v = raw;
        try{ var o = JSON.parse(raw); if(o && typeof o === 'object' && o.value){ v = o.value; } else if(o === null){ return false; } }catch(e){}
        return !!v && v !== 'null' && v !== 'undefined';
      }catch(e){ return false; }
    }
    function hasCookie(){ return document.cookie.indexOf('sl_logged_in=1') !== -1; }
    function syncCookie(){
      var t = hasToken();
      if(t && !hasCookie()){ try{ document.cookie = 'sl_logged_in=1;path=/;max-age=2592000'; }catch(e){} }
      else if(!t && hasCookie()){ try{ document.cookie = 'sl_logged_in=;path=/;max-age=0'; }catch(e){} }
    }
    window.addEventListener('hashchange', syncCookie);
    window.addEventListener('storage', function(e){ if(e && e.key === TOKEN_KEY) syncCookie(); });
    document.addEventListener('visibilitychange', function(){ if(!document.hidden) syncCookie(); });
    syncCookie();
    setInterval(syncCookie, 5000);
    /* ---- TRIALUP8 倒计时横幅（截止 2026-12-19 23:59 北京时间） ---- */
    var bar = document.getElementById('sl-promo-bar');
    var cdEl = document.getElementById('sl-promo-cd');
    var end = new Date('2026-12-19T23:59:59+08:00').getTime();
    function tick(){
      var left = end - Date.now();
      if(left <= 0){ bar.style.display = 'none'; document.body.classList.remove('sl-promo-on'); return; }
      var d = Math.floor(left / 86400000);
      var h = Math.floor(left % 86400000 / 3600000);
      var m = Math.floor(left % 3600000 / 60000);
      var s = Math.floor(left % 60000 / 1000);
      cdEl.textContent = d + '天 ' + ('0'+h).slice(-2) + ':' + ('0'+m).slice(-2) + ':' + ('0'+s).slice(-2);
    }
    function showBar(){
      if(Date.now() >= end) return;
      try{ if(sessionStorage.getItem('sl_promo_closed') === '1') return; }catch(e){}
      bar.style.display = 'block';
      document.body.classList.add('sl-promo-on');
      tick();
      setInterval(tick, 1000);
    }
    document.getElementById('sl-promo-close').addEventListener('click', function(){
      bar.style.display = 'none';
      document.body.classList.remove('sl-promo-on');
      try{ sessionStorage.setItem('sl_promo_closed', '1'); }catch(e){}
    });
    showBar();
    /* ---- 客户端下载悬浮按钮 ---- */
    var btn = document.getElementById('sl-dl-btn');
    var panel = document.getElementById('sl-dl-panel');
    btn.addEventListener('click', function(){
      panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
    });
    panel.addEventListener('click', function(e){
      if(e.target && e.target.tagName === 'A'){ panel.style.display = 'none'; }
    });
  })();
  </script>
</body>

</html>