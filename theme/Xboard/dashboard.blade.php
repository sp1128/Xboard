<!doctype html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{{$title}}</title>
  <script type="module" crossorigin src="/theme/{{$theme}}/assets/umi.js"></script>
  @include('theme::Xboard.console')
</head>

<body>

  <script>
    window.routerBase = "/";
    window.settings = {
      title: @json($title),
      assets_path: '/theme/{{$theme}}/assets',
      theme: {
        color: '{{ $theme_config['theme_color'] ?? "default" }}',
      },
      version: @json($version),
      background_url: @json($theme_config['background_url'] ?? ''),
      description: @json($description),
      i18n: [
        'zh-CN',
        'en-US',
        'ja-JP',
        'vi-VN',
        'ko-KR',
        'zh-TW',
        'fa-IR'
      ],
      logo: @json($logo)
    }
  </script>
  <div id="app"></div>
  {!! $theme_config['custom_html'] ?? '' !!}
  <!-- ===== 星屿StarLink 主题注入（第一阶段，fork 内置，不依赖 custom_html 设置） ===== -->
  <style>
    /* 客户端下载悬浮按钮（左下角，避开右侧 Chatwoot 气泡） */
    #sl-dl-btn{position:fixed;left:18px;bottom:20px;z-index:9998;width:52px;height:52px;border-radius:50%;background:var(--sl-primary,#165dff);border:0;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(22,93,255,.35);font-size:22px;cursor:pointer}
    #sl-dl-btn:hover{transform:scale(1.05)}
    #sl-dl-panel{display:none;position:fixed;left:18px;bottom:84px;z-index:9998;width:280px;max-width:calc(100vw - 36px);background:var(--sl-surface,#fff);border:1px solid var(--sl-line,#e5e6eb);border-radius:8px;padding:16px;box-shadow:0 12px 32px rgba(29,33,41,.12);color:var(--sl-text,#1d2129);font-size:14px}
    #sl-dl-panel h4{color:var(--sl-text,#1d2129);font-size:15px;margin-bottom:8px}
    #sl-dl-panel a{display:block;color:var(--sl-primary,#165dff);padding:7px 0;border-bottom:1px solid var(--sl-line,#e5e6eb)}
    #sl-dl-panel a:last-child{border-bottom:none}
    #sl-dl-panel p{color:var(--sl-muted,#86909c);font-size:12px;margin-top:10px;line-height:1.6}
    /* 导出配置文件行：它是 n-list 的直接子级（不在任何 n-list-item 里），hover 背景自己补 */
    [data-sl-export]:hover{background-color:rgb(243,244,246)}
    @media (max-width:640px){
      #sl-dl-btn{bottom:76px}
      #sl-dl-panel{bottom:140px}
    }
  </style>
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
  <!-- ===== 星屿StarLink 主题注入（第二阶段）：订阅弹窗加“导出配置文件” ===== -->
  <script>
  (function(){
    var TOKEN_KEY = 'VUE_NAIVE_ACCESS_TOKEN';
    var ROW_MARK = 'data-sl-export';
    function getAccessToken(){
      try{
        var raw = localStorage.getItem(TOKEN_KEY);
        if(!raw || raw === 'null' || raw === 'undefined') return null;
        try{ var o = JSON.parse(raw); if(o && typeof o === 'object' && o.value) return o.value; }catch(e){}
        return raw;
      }catch(e){ return null; }
    }
    function findHiddifyRow(){
      var els = document.querySelectorAll('.cursor-pointer');
      for(var i = 0; i < els.length; i++){
        var el = els[i];
        if(el.getAttribute(ROW_MARK)) continue;
        var t = el.textContent || '';
        if(t.indexOf('Hiddify') !== -1 && el.classList.contains('flex')) return el;
      }
      return null;
    }
    function insertExportRow(){
      if(document.querySelector('[' + ROW_MARK + ']')) return;
      var row = findHiddifyRow();
      if(!row || !row.parentNode) return;
      var clone = row.cloneNode(true);
      clone.setAttribute(ROW_MARK, '1');
      var iconDiv = clone.querySelector('div');
      if(iconDiv){ iconDiv.innerHTML = '<span style="font-size:22px;line-height:32px;display:inline-block;width:32px;text-align:center;color:#165dff">↓</span>'; }
      var divs = clone.querySelectorAll('div');
      for(var i = 0; i < divs.length; i++){
        if((divs[i].textContent || '').indexOf('Hiddify') !== -1){ divs[i].textContent = '导出配置文件'; }
      }
      clone.addEventListener('click', function(e){ if(e){ e.stopPropagation(); if(e.preventDefault) e.preventDefault(); } downloadConfig(); });
      // 注意：row 的父级是 Naive UI 的 n-list-item（hover 背景挂在它身上）。
      // 克隆行必须插到 list-item 后面（成为 n-list 的直接子级）；插在 row 后面会落进
      // Hiddify 的 list-item 里，导致 hover 其中一行时整个 item（含两行）一起变灰。
      var item = (row.closest && row.closest('.n-list-item')) || row.parentNode;
      var parent = item.parentNode;
      if(parent) parent.insertBefore(clone, item.nextSibling);
    }
    async function downloadConfig(){
      try{
        var token = getAccessToken();
        if(!token){ alert('登录已过期，请重新登录后再试'); return; }
        var res = await fetch('/api/v1/user/getSubscribe', {headers:{'Authorization':'Bearer ' + token}});
        var body = await res.json();
        var subUrl = null;
        if(body){
          if(typeof body.data === 'string') subUrl = body.data;
          else if(body.data && typeof body.data.subscribe_url === 'string') subUrl = body.data.subscribe_url;
          else if(typeof body === 'string') subUrl = body;
        }
        if(!subUrl || subUrl.indexOf('http') !== 0) throw new Error('no subscribe url');
        var dlUrl = subUrl + (subUrl.indexOf('?') === -1 ? '?flag=meta' : '&flag=meta');
        var r2 = await fetch(dlUrl);
        if(!r2.ok) throw new Error('subscribe fetch failed');
        var text = await r2.text();
        if(!text || text.indexOf('proxies') === -1) throw new Error('bad config');
        var blob = new Blob([text], {type:'text/yaml'});
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'StarLink.yaml';
        document.body.appendChild(a);
        a.click();
        setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 2000);
      }catch(e){
        alert('导出失败，请重试，或用“复制订阅地址”导入');
      }
    }
    var obs = new MutationObserver(function(){ insertExportRow(); });
    obs.observe(document.body, {childList:true, subtree:true});
    insertExportRow();
  })();
  </script>
  <!-- ===== 星屿StarLink 主题注入（第三阶段）：支付弹窗美化 + 支付后提示 ===== -->
  <style>
    /* 支付弹窗：固定宽度 400px，纵向居中布局 */
    .sl-pay-modal{width:400px!important;max-width:calc(100vw - 32px)!important;border-radius:18px!important;overflow:hidden}
    .sl-pay-modal .n-card__content{padding:28px 28px 22px!important;display:flex!important;flex-direction:column!important;align-items:center!important}
    /* 二维码：白底圆角卡片 + 阴影，居中 */
    .sl-pay-modal .pay-qrcode{position:relative!important;height:auto!important;width:auto!important;display:flex;justify-content:center;padding:14px;background:#fff;border:1px solid #f0e6c8;border-radius:14px;box-shadow:0 8px 24px rgba(201,162,39,.16);margin:6px auto 4px}
    .sl-pay-modal .pay-qrcode canvas,.sl-pay-modal .pay-qrcode svg{width:230px!important;height:230px!important}
    .sl-pay-modal .n-divider{width:100%!important}
    /* 等待支付中：金色 + 脉冲圆点，禁止竖排 */
    .sl-pay-wait{white-space:nowrap!important;font-size:17px!important;font-weight:600;color:#b08d1e!important;text-align:center;margin-top:16px!important;display:flex;align-items:center;justify-content:center;gap:8px}
    .sl-pay-wait::before{content:'';width:9px;height:9px;border-radius:50%;background:#c9a227;animation:sl-pay-pulse 1.2s ease-in-out infinite}
    @keyframes sl-pay-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.5}}
    /* 支付后提示：浅底圆角提示框，占满卡片宽，强制换行 */
    .sl-pay-tip{margin-top:18px;width:100%;min-width:0;max-width:100%;flex-shrink:1;box-sizing:border-box;background:#fdf8e7;border:1px solid #f0e6c8;border-radius:10px;padding:12px 14px;font-size:13px;line-height:1.7;color:#7a6a2f;text-align:left;white-space:normal!important;word-break:break-all!important;overflow-wrap:break-word!important}
    .sl-pay-tip b{color:#8a6d00}
  </style>
  <script>
  (function(){
    var TIP_MARK = 'data-sl-pay-tip';
    var TIP_TEXT = '已支付但页面没有反应？请先查看订阅是否已生效：<b>已生效就不用管它</b>；还没生效请提交工单或联系客服，我们会尽快处理。';
    function enhancePayModal(){
      var qr = document.querySelector('.pay-qrcode');
      if(!qr) return;
      var card = qr.closest('.n-card');
      if(!card) return;
      if(!card.classList.contains('sl-pay-modal')) card.classList.add('sl-pay-modal');
      // 等待支付中文字加样式
      var waitEl = null;
      var divs = card.querySelectorAll('div');
      for(var i = 0; i < divs.length; i++){
        var t = (divs[i].textContent || '').trim();
        if(t === '等待支付中' || t.indexOf('等待支付中') === 0){
          if(!divs[i].classList.contains('sl-pay-wait')) divs[i].classList.add('sl-pay-wait');
          waitEl = divs[i];
        }
      }
      if(!waitEl) return;
      // 提示框：插到等待文字后面，已存在则跳过
      if(card.querySelector('[' + TIP_MARK + ']')) return;
      var tip = document.createElement('div');
      tip.setAttribute(TIP_MARK, '1');
      tip.className = 'sl-pay-tip';
      tip.innerHTML = TIP_TEXT;
      waitEl.parentNode.insertBefore(tip, waitEl.nextSibling);
    }
    var obs = new MutationObserver(function(){ enhancePayModal(); });
    obs.observe(document.body, {childList:true, subtree:true});
    enhancePayModal();
  })();
  </script>
  <!-- ===== 星屿StarLink 主题注入（第四阶段）：结账按钮防重复点击 ===== -->
  <style>
    .sl-checkout-busy{opacity:.6!important;pointer-events:none!important;cursor:not-allowed!important}
    .sl-checkout-busy .n-button__content::after{content:'处理中…';margin-left:6px}
  </style>
  <script>
  (function(){
    var BUSY_MS = 10000; // 最多锁 10 秒，超时自动解锁（接口失败时也能重按）
    var busy = false;
    var busyTimer = null;
    function findCheckoutBtn(){
      var btns = document.querySelectorAll('button');
      for(var i = 0; i < btns.length; i++){
        var t = (btns[i].textContent || '').trim();
        if(t === '结账' || t.indexOf('结账') === 0) return btns[i];
      }
      return null;
    }
    function unlock(){
      busy = false;
      if(busyTimer){ clearTimeout(busyTimer); busyTimer = null; }
      var btn = findCheckoutBtn();
      if(btn) btn.classList.remove('sl-checkout-busy');
    }
    function lock(){
      busy = true;
      var btn = findCheckoutBtn();
      if(btn) btn.classList.add('sl-checkout-busy');
      if(busyTimer) clearTimeout(busyTimer);
      busyTimer = setTimeout(unlock, BUSY_MS);
    }
    // 捕获阶段拦截重复点击：第一次放行并上锁，锁住期间的点击直接拦掉
    document.addEventListener('click', function(e){
      var btn = e.target && e.target.closest ? e.target.closest('button') : null;
      if(!btn) return;
      var t = (btn.textContent || '').trim();
      if(t !== '结账' && t.indexOf('结账') !== 0) return;
      if(busy){
        if(e.stopPropagation) e.stopPropagation();
        if(e.preventDefault) e.preventDefault();
        return;
      }
      lock();
    }, true);
    // 支付弹窗出现即解锁（二维码已出，允许关闭后重按）
    var obs = new MutationObserver(function(){
      if(document.querySelector('.pay-qrcode')) unlock();
    });
    obs.observe(document.body, {childList:true, subtree:true});
  })();
  </script>
</body>

</html>
