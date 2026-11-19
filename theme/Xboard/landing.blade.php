<!doctype html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no" />
  <meta name="description" content="星屿StarLink：普通线路住宅 IP 节点（日本 100 分 / 美国 97 分），早晚高峰可能会卡顿，日常用 AI 没问题。" />
  <title>{{$title}} - 原生住宅 IP 节点</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0b0f14;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;line-height:1.6}
    a{color:#C9A227;text-decoration:none}
    a:hover{text-decoration:underline}
    .wrap{max-width:1080px;margin:0 auto;padding:0 20px}
    /* 顶部导航 */
    .nav{position:sticky;top:0;z-index:50;background:rgba(11,15,20,.92);backdrop-filter:blur(8px);border-bottom:1px solid #1e293b}
    .nav-in{max-width:1080px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;gap:16px}
    .brand{font-size:20px;font-weight:800;color:#f8fafc;letter-spacing:.5px;white-space:nowrap}
    .brand b{color:#C9A227}
    .nav-links{display:flex;gap:18px;margin-left:12px;font-size:14px}
    .nav-links a{color:#94a3b8}
    .nav-links a:hover{color:#e2e8f0;text-decoration:none}
    .nav-btns{margin-left:auto;display:flex;gap:10px}
    .btn{display:inline-block;padding:9px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;border:1px solid transparent;text-align:center}
    .btn:hover{text-decoration:none}
    .btn-gold{background:linear-gradient(135deg,#C9A227,#a8861a);color:#fff}
    .btn-ghost{border-color:#334155;color:#e2e8f0;background:transparent}
    /* 倒计时横幅 */
    .promo{display:none;background:linear-gradient(90deg,#3a2f05,#57470a);border-bottom:1px solid #C9A227;color:#fde68a;font-size:14px}
    .promo-in{max-width:1080px;margin:0 auto;padding:10px 20px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .promo .code{background:#C9A227;color:#111;padding:1px 8px;border-radius:6px;font-weight:800;letter-spacing:1px}
    .promo .cd{font-weight:700;color:#fff;font-variant-numeric:tabular-nums}
    .promo .close{margin-left:auto;background:none;border:none;color:#fde68a;font-size:18px;cursor:pointer;line-height:1}
    /* Hero */
    .hero{padding:72px 0 48px;text-align:center;background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(201,162,39,.16),transparent)}
    .hero h1{font-size:40px;line-height:1.25;font-weight:800;color:#f8fafc}
    .hero h1 span{color:#C9A227}
    .hero p{margin:18px auto 0;max-width:640px;color:#94a3b8;font-size:16px}
    .hero .scores{margin-top:22px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
    .score{background:#111827;border:1px solid #1e293b;border-radius:12px;padding:10px 18px;font-size:14px}
    .score b{color:#C9A227;font-size:18px}
    .hero .cta{margin-top:28px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
    .hero .cta .btn{padding:12px 30px;font-size:16px}
    .hero .sub{margin-top:14px;font-size:13px;color:#64748b}
    /* 区块标题 */
    section{padding:44px 0}
    h2.sec{font-size:24px;color:#f8fafc;margin-bottom:8px}
    p.sec-sub{color:#94a3b8;font-size:14px;margin-bottom:22px}
    /* 套餐表 */
    .table-wrap{overflow-x:auto;border:1px solid #1e293b;border-radius:14px;background:#0f172a}
    table.plans{width:100%;border-collapse:collapse;min-width:640px;font-size:14px}
    table.plans th,table.plans td{padding:14px 16px;text-align:left;border-bottom:1px solid #1e293b;vertical-align:top}
    table.plans tr:last-child td{border-bottom:none}
    table.plans th{color:#94a3b8;font-weight:600;background:#111827;white-space:nowrap}
    table.plans td.price{color:#C9A227;font-weight:800;font-size:17px;white-space:nowrap}
    table.plans td.traffic{white-space:nowrap;font-weight:700}
    table.plans td.content{color:#cbd5e1;font-size:13px;line-height:1.7}
    .tag{display:inline-block;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;margin-left:6px;vertical-align:middle}
    .tag-rec{background:#059669;color:#fff}
    .tag-trial{background:#334155;color:#e2e8f0}
    .tag-onetime{background:#7c3aed;color:#fff}
    .plans-empty,.plans-err{padding:28px;text-align:center;color:#94a3b8}
    /* 实话口径 */
    .honest{background:#111827;border:1px solid #1e293b;border-radius:14px;padding:22px}
    .honest li{margin:6px 0 6px 18px;color:#cbd5e1;font-size:14px}
    .honest li b{color:#f8fafc}
    /* 客户端下载 */
    .dl-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
    .dl-card{display:block;background:#0f172a;border:1px solid #1e293b;border-radius:14px;padding:18px}
    .dl-card:hover{border-color:#C9A227;text-decoration:none}
    .dl-card h3{color:#f8fafc;font-size:16px}
    .dl-card p{color:#94a3b8;font-size:13px;margin-top:4px}
    .dl-card .go{color:#C9A227;font-size:13px;font-weight:700;margin-top:10px;display:inline-block}
    /* 返佣 / TG */
    .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
    .col-card{background:#0f172a;border:1px solid #1e293b;border-radius:14px;padding:22px}
    .col-card h3{color:#f8fafc;font-size:17px;margin-bottom:8px}
    .col-card p{color:#94a3b8;font-size:14px}
    .col-card .btn{margin-top:14px}
    /* 页脚 */
    footer{border-top:1px solid #1e293b;padding:28px 0 40px;text-align:center;color:#64748b;font-size:13px;line-height:2}
    footer a{color:#94a3b8;margin:0 10px}
    /* 悬浮 TG 按钮（仅访客页，登录用户用 Chatwoot） */
    .tg-float{position:fixed;right:18px;bottom:20px;z-index:60;width:52px;height:52px;border-radius:50%;background:#229ED9;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(34,158,217,.45);font-size:24px}
    .tg-float:hover{text-decoration:none;transform:scale(1.05)}
    /* custom_html 自带的页脚 div 与本页 footer 重复，在落地页上隐藏（SPA 启动路径下 custom_html 仍需保留，故不删它） */
    body>div[style*="text-align:center"]{display:none!important}
    @media (max-width:640px){
      .hero{padding:48px 0 36px}
      .hero h1{font-size:28px}
      .nav-links{display:none}
      .brand{font-size:17px}
    }
  </style>
</head>

<body>
  <div id="sl-landing">
  <header class="nav">
    <div class="nav-in">
      <a class="brand" href="/"><b>星屿</b>StarLink</a>
      <nav class="nav-links">
        <a href="#plans">套餐</a>
        <a href="#clients">客户端</a>
        <a href="#invite">邀请返佣</a>
        <a href="https://t.me/starlinkshop888" target="_blank" rel="noopener">Telegram 频道</a>
      </nav>
      <div class="nav-btns">
        <a class="btn btn-ghost" href="/#/login">登录</a>
        <a class="btn btn-gold" href="/#/register">注册</a>
      </div>
    </div>
  </header>

  <div class="promo" id="sl-promo">
    <div class="promo-in">
      <span>🎉 体验包用户升级立享 8 折，优惠码 <span class="code">TRIALUP8</span>，仅剩 <span class="cd" id="sl-countdown">--天 --:--:--</span>，截止 2026-12-19 23:59</span>
      <a href="/#/register" style="color:#fff;font-weight:700">立即升级 →</a>
      <button class="close" id="sl-promo-close" aria-label="关闭">×</button>
    </div>
  </div>

  <div class="wrap">
    <div class="hero">
      <h1>原生住宅 IP 节点<br /><span>日常用 AI，稳稳的</span></h1>
      <p>日本、美国原生住宅 IP。实话先说在前面：普通线路，早晚高峰可能会卡顿，日常用 AI、查资料没问题；刷视频等需要高速体验的，可以定制三网优化高速线路（另外收费）。</p>
      <div class="scores">
        <div class="score">🇯🇵 日本节点 <b>100 分</b></div>
        <div class="score">🇺🇸 美国节点 <b>97 分</b></div>
        <div class="score">📅 分数 2026-11-19 实测</div>
      </div>
      <div class="cta">
        <a class="btn btn-gold" href="/#/register">注册领 1 元体验包</a>
        <a class="btn btn-ghost" href="https://t.me/starlinkshop888" target="_blank" rel="noopener">Telegram 频道</a>
      </div>
      <p class="sub">体验包 1G 流量 ¥1 · 月付套餐 ¥18.88 起 · 不限设备数</p>
    </div>

    <section id="plans">
      <h2 class="sec">套餐</h2>
      <p class="sec-sub">价格与流量以站内为准，下单前请先看上面的实话说明。</p>
      <div class="table-wrap">
        <table class="plans">
          <thead>
            <tr><th>套餐</th><th>流量</th><th>价格</th><th>说明</th><th></th></tr>
          </thead>
          <tbody id="sl-plans-body">
            <tr><td colspan="5"><div class="plans-empty">套餐加载中…</div></td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 class="sec">先说清楚，再决定</h2>
      <div class="honest">
        <ul>
          <li><b>普通线路：</b>节点为普通线路住宅 IP，早晚高峰速度受线路影响，可能会卡顿，不承诺高速体验。</li>
          <li><b>日常用 AI 没问题：</b>ChatGPT、Claude 等日常使用稳定。</li>
          <li><b>需要高速：</b>刷视频、下载等需要高速体验的，可提工单或联系客服，定制三网优化高速线路住宅 IP 节点（另外收费）。</li>
          <li><b>不限设备：</b>套餐不限设备数；流量按月重置（体验包为一次性）。</li>
        </ul>
      </div>
    </section>

    <section id="clients">
      <h2 class="sec">客户端下载</h2>
      <p class="sec-sub">注册登录后，在仪表盘复制订阅链接，导入下面任一客户端即可使用。</p>
      <div class="dl-grid">
        <a class="dl-card" href="https://github.com/clash-verge-rev/clash-verge-rev/releases" target="_blank" rel="noopener">
          <h3>Clash Verge</h3><p>Windows / macOS，推荐桌面端使用</p><span class="go">去下载 →</span>
        </a>
        <a class="dl-card" href="https://apps.apple.com/us/app/shadowrocket/id932747118" target="_blank" rel="noopener">
          <h3>Shadowrocket</h3><p>iOS（App Store 付费应用），推荐苹果手机使用</p><span class="go">去 App Store →</span>
        </a>
        <a class="dl-card" href="https://github.com/chen08209/FlClash/releases" target="_blank" rel="noopener">
          <h3>FlClash</h3><p>Android / Windows / macOS，全平台通用</p><span class="go">去下载 →</span>
        </a>
        <a class="dl-card" href="https://github.com/2dust/v2rayNG/releases" target="_blank" rel="noopener">
          <h3>v2rayNG</h3><p>Android，轻量稳定</p><span class="go">去下载 →</span>
        </a>
      </div>
    </section>

    <section id="invite">
      <h2 class="sec">邀请返佣</h2>
      <div class="cols">
        <div class="col-card">
          <h3>邀请好友，得 10% 返佣</h3>
          <p>注册后在「我的邀请」里生成专属邀请链接，好友通过链接注册并购买，你得订单金额 10% 返佣，满 ¥10 可提现（支付宝）。每人最多 5 个邀请码。</p>
          <a class="btn btn-gold" href="/#/register">注册后邀请好友</a>
        </div>
        <div class="col-card">
          <h3>Telegram 频道</h3>
          <p>节点状态、优惠活动、套餐更新都在频道里发。遇到问题也可以在频道里找到客服入口。</p>
          <a class="btn btn-ghost" href="https://t.me/starlinkshop888" target="_blank" rel="noopener">加入 t.me/starlinkshop888</a>
        </div>
      </div>
    </section>
  </div>

  <footer>
    <a href="https://blog.sp1128.top/tos/" target="_blank" rel="noopener">服务条款</a>
    <a href="/#/ticket">联系客服</a>
    <a href="https://t.me/starlinkshop888" target="_blank" rel="noopener">Telegram 频道</a>
    <br /><span>© 2026 星屿StarLink · 原生住宅 IP · All rights reserved.</span>
  </footer>

  <a class="tg-float" href="https://t.me/starlinkshop888" target="_blank" rel="noopener" title="Telegram 频道 / 客服">✈</a>
  </div><!-- /#sl-landing -->

  <script>
    window.routerBase = "/";
    window.settings = {
      title: '{{$title}}',
      assets_path: '/theme/{{$theme}}/assets',
      theme: { color: '{{ $theme_config['theme_color'] ?? "default" }}' },
      version: '{{$version}}',
      background_url: '{{$theme_config['background_url']}}',
      description: '{{$description}}',
      i18n: ['zh-CN','en-US','ja-JP','vi-VN','ko-KR','zh-TW','fa-IR'],
      logo: '{{$logo}}'
    };
  </script>
  <script>
  (function(){
    var TOKEN_KEY = 'VUE_NAIVE_ACCESS_TOKEN';
    function getToken(){
      try{
        var raw = localStorage.getItem(TOKEN_KEY);
        if(!raw || raw === 'null' || raw === 'undefined') return null;
        var v = raw;
        try{ var o = JSON.parse(raw); if(o && typeof o === 'object' && o.value){ v = o.value; } else if(o === null){ return null; } }catch(e){}
        if(!v || v === 'null' || v === 'undefined') return null;
        return v;
      }catch(e){ return null; }
    }
    /* ---- 已登录用户 / 走登录注册找回密码路由时，直接在页内启动 SPA ---- */
    var spaBooted = false;
    function bootSPA(){
      if(spaBooted) return; spaBooted = true;
      try{ document.cookie = 'sl_logged_in=1;path=/;max-age=2592000'; }catch(e){}
      var landing = document.getElementById('sl-landing');
      if(landing) landing.style.display = 'none';
      var app = document.createElement('div');
      app.id = 'app';
      document.body.appendChild(app);
      var s = document.createElement('script');
      s.type = 'module'; s.setAttribute('crossorigin','');
      s.src = '/theme/{{$theme}}/assets/umi.js';
      document.body.appendChild(s);
    }
    var hash = (location.hash || '').toLowerCase();
    if(getToken() || hash.indexOf('#/login') === 0 || hash.indexOf('#/register') === 0 || hash.indexOf('#/forgetpassword') === 0){
      bootSPA();
      return;
    }
    /* ---- TRIALUP8 倒计时横幅（截止 2026-12-19 23:59 北京时间） ---- */
    var promo = document.getElementById('sl-promo');
    var cdEl = document.getElementById('sl-countdown');
    var end = new Date('2026-12-19T23:59:59+08:00').getTime();
    function tick(){
      var left = end - Date.now();
      if(left <= 0){ promo.style.display = 'none'; return; }
      var d = Math.floor(left / 86400000);
      var h = Math.floor(left % 86400000 / 3600000);
      var m = Math.floor(left % 3600000 / 60000);
      var s = Math.floor(left % 60000 / 1000);
      cdEl.textContent = d + '天 ' + ('0'+h).slice(-2) + ':' + ('0'+m).slice(-2) + ':' + ('0'+s).slice(-2);
    }
    try{
      if(sessionStorage.getItem('sl_promo_closed') !== '1' && Date.now() < end){
        promo.style.display = 'block';
        tick();
        setInterval(tick, 1000);
      }
    }catch(e){
      if(Date.now() < end){ promo.style.display = 'block'; tick(); setInterval(tick, 1000); }
    }
    document.getElementById('sl-promo-close').addEventListener('click', function(){
      promo.style.display = 'none';
      try{ sessionStorage.setItem('sl_promo_closed', '1'); }catch(e){}
    });
    /* ---- 套餐对比表：公开 guest API ---- */
    var body = document.getElementById('sl-plans-body');
    function fmtPrice(cents){
      if(cents === null || cents === undefined) return null;
      var y = cents / 100;
      return '¥' + (Number.isInteger(y) ? y : y.toFixed(2));
    }
    function esc(s){
      return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    fetch('/api/v1/guest/plan/fetch')
      .then(function(r){ return r.json(); })
      .then(function(j){
        var plans = (j && j.data) || [];
        if(!plans.length){
          body.innerHTML = '<tr><td colspan="5"><div class="plans-empty">暂无在售套餐，请稍后再来或联系客服。</div></td></tr>';
          return;
        }
        body.innerHTML = plans.map(function(p){
          var price = fmtPrice(p.month_price);
          var period = '月付';
          if(price === null){ price = fmtPrice(p.onetime_price); period = '一次性'; }
          if(price === null){ price = fmtPrice(p.year_price); period = '年付'; }
          if(price === null){ price = '—'; }
          var name = esc(p.name || '');
          var tag = '';
          if(name.indexOf('500G') !== -1 && period === '月付') tag = '<span class="tag tag-rec">推荐</span>';
          else if(period === '一次性') tag = '<span class="tag tag-trial">试用</span>';
          var traffic = (p.transfer_enable == null ? '—' : esc(p.transfer_enable) + ' GB');
          var content = p.content ? String(p.content).replace(/\n/g, '<br>') : '';
          return '<tr><td><b>' + name + '</b>' + tag + '</td><td class="traffic">' + traffic + '</td><td class="price">' + price + '<div style="font-size:12px;color:#94a3b8;font-weight:400">' + period + '</div></td><td class="content">' + content + '</td><td><a class="btn btn-gold" style="padding:7px 16px;white-space:nowrap" href="/#/register">购买</a></td></tr>';
        }).join('');
      })
      .catch(function(){
        body.innerHTML = '<tr><td colspan="5"><div class="plans-err">套餐加载失败，请刷新页面，或联系客服。</div></td></tr>';
      });
  })();
  </script>
  {!! $theme_config['custom_html'] !!}
</body>

</html>
