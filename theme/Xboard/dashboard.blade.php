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
      clone.addEventListener('click', function(){ downloadConfig(); });
      row.parentNode.insertBefore(clone, row.nextSibling);
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
</body>

</html>
