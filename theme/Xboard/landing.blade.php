<!doctype html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="description" content="星屿StarLink：普通线路住宅 IP 节点（日本 100 分 / 美国 97 分），早晚高峰可能会卡顿，日常用 AI 没问题。" />
  <title>{{$title}} - 原生住宅 IP 节点</title>
  <style>
    /* 访客落地页。布局参考聚盟云：深色底、左文右图首屏、套餐表、2×2 卖点、发光 CTA。 */
    body.sl-landing-page{--bg:#1b1f2a;--bg-raise:#21263a;--card:#232837;--card-hi:#2a3044;--line:rgba(255,255,255,.08);--line-hi:rgba(255,255,255,.16);--text:rgba(255,255,255,.92);--muted:#8d95a8;--faint:#5f6779;--primary:#165dff;--primary-hi:#4080ff;--glow-a:rgba(22,93,255,.22);--glow-b:rgba(168,72,255,.16);--ok:#23c343}
    /* :where() 让清零规则优先级为 0，否则 #id 会盖过下面所有 .sl-* 的间距 */
    :where(#sl-landing,#sl-landing *){box-sizing:border-box;margin:0;padding:0}
    body.sl-landing-page{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",Roboto,sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
    body.sl-landing-page>div[style*="text-align:center"]{display:none!important}/* custom_html 自带页脚与本页 footer 重复 */
    #sl-landing{overflow-x:clip}
    #sl-landing a{color:inherit;text-decoration:none}
    .sl-flag{display:inline-block;width:18px;height:12px;border-radius:2px;vertical-align:-1px;margin-right:6px;box-shadow:0 0 0 1px rgba(255,255,255,.12)}
    #sl-landing a:focus-visible,#sl-landing button:focus-visible{outline:2px solid var(--primary-hi);outline-offset:3px;border-radius:6px}
    :where(#sl-landing) .wrap{max-width:1200px;margin:0 auto;padding:0 24px}
    :where(#sl-landing) section{padding:96px 0;scroll-margin-top:56px}

    /* 按钮 */
    .sl-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:40px;padding:0 28px;border-radius:6px;font-size:14px;font-weight:500;border:1px solid transparent;cursor:pointer;white-space:nowrap;transition:background .15s,border-color .15s,box-shadow .15s}
    .sl-btn-primary{background:var(--primary);color:#fff!important}
    .sl-btn-primary:hover{background:var(--primary-hi);box-shadow:0 6px 24px rgba(22,93,255,.35)}
    .sl-btn-ghost{border-color:var(--line-hi);color:var(--text)!important;background:rgba(255,255,255,.03)}
    .sl-btn-ghost:hover{border-color:rgba(255,255,255,.32);background:rgba(255,255,255,.06)}
    .sl-btn-sm{height:30px;padding:0 14px;font-size:13px}
    .sl-btn-lg{height:44px;padding:0 36px;font-size:15px}

    /* 导航 */
    .sl-nav{position:sticky;top:0;z-index:50;background:rgba(27,31,42,.88);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
    .sl-nav .wrap{height:56px;display:flex;align-items:center;gap:28px}
    .sl-brand{display:flex;align-items:center;gap:8px;font-size:17px;font-weight:700;letter-spacing:.2px;color:#fff}
    .sl-brand i{display:grid;place-items:center;width:24px;height:24px;border-radius:6px;background:var(--primary);color:#fff;font-style:normal;font-size:14px}
    .sl-nav nav{display:flex;gap:24px;font-size:14px;color:var(--muted)}
    .sl-nav nav a:hover{color:#fff}
    .sl-nav .sl-nav-end{margin-left:auto;display:flex;align-items:center;gap:16px;font-size:14px}
    .sl-nav .sl-nav-end>a:not(.sl-btn){color:var(--muted)}
    .sl-nav .sl-nav-end>a:not(.sl-btn):hover{color:#fff}

    /* 首屏 */
    .sl-hero{position:relative;overflow:hidden}
    .sl-hero .wrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;gap:32px;min-height:calc(100vh - 56px);max-height:760px;padding-top:40px;padding-bottom:40px}
    .sl-pill{display:inline-flex;align-items:center;gap:8px;padding:3px 12px;border:1px solid var(--line-hi);border-radius:999px;font-size:12px;color:var(--muted);background:rgba(255,255,255,.03)}
    .sl-pill:before{content:"";width:6px;height:6px;border-radius:50%;background:var(--ok);box-shadow:0 0 8px var(--ok)}
    .sl-hero h1{margin-top:20px;font-size:clamp(32px,3.4vw,48px);line-height:1.22;font-weight:400;color:rgba(255,255,255,.86);letter-spacing:.5px}
    .sl-hero h1 b{font-weight:800;color:#fff}
    .sl-hero-desc{display:flex;gap:10px;margin-top:22px;max-width:520px;font-size:15px;color:var(--muted);line-height:1.75}
    .sl-hero-desc i{flex:none;display:grid;place-items:center;width:20px;height:20px;margin-top:3px;border-radius:5px;background:var(--primary);color:#fff;font-style:normal;font-size:12px;font-weight:700}
    .sl-scores{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
    .sl-scores span{padding:6px 12px;border-radius:6px;background:var(--card);border:1px solid var(--line);font-size:13px;color:var(--muted)}
    .sl-scores b{color:#fff;margin-left:4px}
    .sl-hero-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:36px}
    .sl-hero-art{position:relative;aspect-ratio:1/1;max-width:560px;width:100%;justify-self:end}
    .sl-hero-art:before{content:"";position:absolute;inset:8%;border-radius:50%;background:radial-gradient(circle at 40% 40%,var(--glow-a),transparent 62%),radial-gradient(circle at 70% 70%,var(--glow-b),transparent 60%);filter:blur(30px)}
    .sl-hero-art svg{position:relative;width:100%;height:100%}
    .sl-pulse{transform-origin:center;transform-box:fill-box;animation:sl-pulse 2.6s ease-out infinite}
    .sl-pulse.d2{animation-delay:1.3s}
    @keyframes sl-pulse{from{opacity:.7;transform:scale(1)}to{opacity:0;transform:scale(3.2)}}
    .sl-dash{stroke-dasharray:4 6;animation:sl-dash 1.8s linear infinite}
    @keyframes sl-dash{to{stroke-dashoffset:-20}}

    /* 区块标题 */
    .sl-head{text-align:center;margin-bottom:40px}
    .sl-head h2{font-size:clamp(26px,3vw,36px);font-weight:700;color:#fff;letter-spacing:1px}
    .sl-head p{margin-top:10px;color:var(--muted);font-size:14px}
    .sl-regions{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin:-12px 0 40px}
    .sl-regions span{padding:5px 14px;border-radius:999px;background:var(--card);border:1px solid var(--line);font-size:13px;color:rgba(255,255,255,.8)}

    /* 套餐表 */
    .sl-glow{position:relative}
    .sl-glow:before{content:"";position:absolute;inset:-60px -40px;z-index:0;pointer-events:none;background:radial-gradient(50% 60% at 25% 50%,var(--glow-a),transparent 70%),radial-gradient(50% 60% at 78% 50%,var(--glow-b),transparent 70%);filter:blur(20px)}
    .sl-glow>*{position:relative;z-index:1}
    .sl-table{max-width:1080px;margin:0 auto;border:1px solid var(--line);border-radius:10px;background:rgba(30,34,47,.92);overflow:hidden}
    .sl-table table{width:100%;border-collapse:collapse;font-size:14px}
    .sl-table th{padding:14px 20px;text-align:left;font-weight:400;color:var(--muted);border-bottom:1px solid var(--line);white-space:nowrap}
    .sl-table th+th{border-left:1px solid var(--line)}
    .sl-table td{padding:16px 20px;border-bottom:1px solid var(--line);vertical-align:middle;color:rgba(255,255,255,.9)}
    .sl-table tr:last-child td{border-bottom:0}
    .sl-table tbody tr:hover td{background:rgba(255,255,255,.025)}
    .sl-table .sl-plan-name{font-weight:600;color:#fff}
    .sl-table .sl-plan-note{margin-top:4px;font-size:12px;color:var(--faint);line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;max-width:260px}
    .sl-table .sl-strong{font-weight:600}
    .sl-table .sl-price{font-weight:600;white-space:nowrap;font-variant-numeric:tabular-nums}
    .sl-table .sl-price small{font-weight:400;color:var(--muted)}
    .sl-table td:last-child{text-align:right}
    .sl-state{padding:40px 20px!important;text-align:center!important;color:var(--muted)!important}
    .sl-after-table{text-align:center;margin-top:72px}
    .sl-after-table h3{font-size:clamp(22px,2.6vw,32px);font-weight:700;color:#fff;margin-bottom:24px;letter-spacing:1px}

    /* 卖点卡 */
    .sl-grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:32px 64px;max-width:1080px;margin:0 auto}
    .sl-feature{padding:24px;border:1px solid var(--line);border-radius:8px;background:linear-gradient(180deg,rgba(255,255,255,.015),rgba(255,255,255,.04));transition:border-color .2s}
    .sl-feature:hover{border-color:var(--line-hi)}
    .sl-ico{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--card-hi);border:1px solid var(--line-hi);color:#fff;margin-bottom:18px}
    .sl-ico svg{width:20px;height:20px}
    .sl-feature h3{font-size:20px;font-weight:600;color:#fff;margin-bottom:8px}
    .sl-feature p{font-size:14px;color:var(--muted);line-height:1.8}

    /* 节点 */
    .sl-nodes{max-width:1080px;margin:0 auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
    .sl-node{position:relative;overflow:hidden;padding:32px;border:1px solid var(--line);border-radius:10px;background:var(--bg-raise)}
    .sl-node:after{content:"";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,var(--glow-a),transparent 70%)}
    .sl-node.us:after{background:radial-gradient(circle,var(--glow-b),transparent 70%)}
    .sl-node-top{display:flex;align-items:center;gap:12px;font-size:18px;font-weight:600;color:#fff}
    .sl-node-top em{display:flex}.sl-node-top .sl-flag{width:30px;height:20px}
    .sl-node-score{margin-top:22px;display:flex;align-items:baseline;gap:6px;color:var(--muted);font-size:13px}
    .sl-node-score b{font-size:44px;font-weight:700;color:#fff;line-height:1;font-variant-numeric:tabular-nums}
    .sl-bar{margin-top:14px;height:6px;border-radius:3px;background:rgba(255,255,255,.07);overflow:hidden}
    .sl-bar i{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,var(--primary),#7b61ff)}
    .sl-node p{margin-top:14px;font-size:13px;color:var(--muted)}
    .sl-nodes-note{text-align:center;margin-top:24px;font-size:13px;color:var(--faint)}

    /* 客户端 */
    .sl-clients{max-width:1080px;margin:0 auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}
    .sl-client{display:flex;flex-direction:column;padding:22px;border:1px solid var(--line);border-radius:8px;background:var(--card);transition:border-color .2s,transform .2s}
    .sl-client:hover{border-color:rgba(22,93,255,.6);transform:translateY(-2px)}
    .sl-client h3{font-size:16px;color:#fff;font-weight:600}
    .sl-client p{flex:1;margin-top:6px;font-size:13px;color:var(--muted);line-height:1.7}
    .sl-client span{margin-top:14px;font-size:13px;color:var(--primary-hi)}

    /* 邀请 / 频道 */
    .sl-duo{max-width:1080px;margin:0 auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
    .sl-duo .sl-feature .sl-btn{margin-top:20px}

    /* 收尾 CTA */
    .sl-final{text-align:center;padding:140px 0!important}
    .sl-final h2{font-size:clamp(26px,3.2vw,40px);font-weight:800;color:#fff;letter-spacing:1px;margin-bottom:28px}

    /* 页脚 */
    .sl-footer{border-top:1px solid var(--line)}
    .sl-footer .wrap{display:grid;grid-template-columns:2fr 1fr 1fr;gap:32px;padding-top:48px;padding-bottom:40px}
    .sl-footer p{margin-top:16px;font-size:14px;color:var(--faint)}
    .sl-footer h4{font-size:15px;font-weight:500;color:#fff;margin-bottom:14px}
    .sl-footer ul{list-style:none;display:grid;gap:10px;font-size:14px;color:var(--muted)}
    .sl-footer ul a:hover{color:#fff}
    .sl-chip{display:inline-block;padding:4px 10px;border:1px solid var(--line-hi);border-radius:4px;background:rgba(255,255,255,.04);font-size:13px;color:rgba(255,255,255,.85)}
    .sl-copy{border-top:1px solid var(--line)}
    .sl-copy .wrap{display:flex;justify-content:space-between;gap:16px;padding-top:18px;padding-bottom:24px;font-size:13px;color:var(--faint)}

    .sl-float{position:fixed;right:20px;bottom:24px;z-index:60;display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:#229ed9;color:#fff!important;font-size:22px;box-shadow:0 6px 20px rgba(34,158,217,.4);transition:transform .15s}
    .sl-float:hover{transform:scale(1.06)}

    @media (max-width:960px){
      .sl-nav nav{display:none}
      .sl-hero .wrap{grid-template-columns:1fr;min-height:0;max-height:none;padding-top:56px;padding-bottom:24px;text-align:center}
      .sl-hero-desc{margin-left:auto;margin-right:auto;text-align:left}
      .sl-scores,.sl-hero-cta{justify-content:center}
      .sl-hero-art{justify-self:center;max-width:380px}
      .sl-clients{grid-template-columns:repeat(2,minmax(0,1fr))}
      .sl-grid2{gap:20px}
    }
    @media (max-width:720px){
      :where(#sl-landing) .wrap{padding-left:16px;padding-right:16px}
      :where(#sl-landing) section{padding:64px 0}
      .sl-nav .wrap{gap:12px}
      .sl-nav .sl-nav-end{gap:10px}
      .sl-nav .sl-nav-end .sl-btn{padding:0 14px}
      .sl-hero .wrap{padding-top:40px}
      .sl-hero h1{font-size:30px}
      .sl-hero-desc{font-size:14px}
      .sl-hero-art{max-width:260px}
      .sl-grid2,.sl-nodes,.sl-duo,.sl-clients{grid-template-columns:1fr}
      /* 套餐表在手机上转成卡片 */
      .sl-table{background:transparent;border:0;overflow:visible}
      .sl-table thead{display:none}
      .sl-table table,.sl-table tbody,.sl-table tr,.sl-table td{display:block;width:100%}
      .sl-table tbody{display:grid;gap:12px}
      .sl-table tr{border:1px solid var(--line);border-radius:10px;background:rgba(30,34,47,.95);padding:6px 0}
      .sl-table td{display:flex;justify-content:space-between;gap:16px;padding:8px 18px;border:0;text-align:right}
      .sl-table td:before{content:attr(data-label);color:var(--muted);text-align:left}
      .sl-table td:first-child{display:block;text-align:left;padding-top:12px;padding-bottom:10px;border-bottom:1px solid var(--line);margin-bottom:4px}
      .sl-table td:first-child:before,.sl-table td:last-child:before{content:none}
      .sl-table .sl-plan-note{max-width:none}
      .sl-table td:last-child{padding-top:10px;padding-bottom:12px}
      .sl-table td:last-child .sl-btn{width:100%;height:38px}
      .sl-table .sl-state{display:block}
      .sl-final{padding:96px 0!important}
      .sl-footer .wrap{grid-template-columns:1fr 1fr}
      .sl-footer .wrap>div:first-child{grid-column:1/-1}
      .sl-copy .wrap{flex-direction:column;gap:6px}
    }
    @media (prefers-reduced-motion:reduce){.sl-pulse,.sl-dash{animation:none}.sl-client,.sl-btn{transition:none}.sl-client:hover{transform:none}}
  </style>
  @include('theme::Xboard.console')
</head>

<body class="sl-landing-page">
  <div id="sl-landing">
    <header class="sl-nav">
      <div class="wrap">
        <a class="sl-brand" href="/"><i aria-hidden="true">✦</i>星屿StarLink</a>
        <nav aria-label="页面导航">
          <a href="#plans">套餐</a>
          <a href="#features">服务说明</a>
          <a href="#clients">客户端</a>
          <a href="#invite">邀请返佣</a>
        </nav>
        <div class="sl-nav-end">
          <a href="/#/login">登录</a>
          <a class="sl-btn sl-btn-primary sl-btn-sm" href="/#/register">注册</a>
        </div>
      </div>
    </header>

    <div class="sl-hero">
      <div class="wrap">
        <div>
          <span class="sl-pill">住宅 IP | 日本 · 美国 | AI 可用</span>
          <h1><b>星屿StarLink</b><br />连接世界，探索更多可能</h1>
          <p class="sl-hero-desc"><i aria-hidden="true">#</i><span>普通线路住宅 IP 节点，覆盖日本与美国，日常用 AI 没问题。早晚高峰可能会卡顿；需要三网优化线路，可提工单定制（另外收费）。</span></p>
          <div class="sl-scores">
            <span><svg class="sl-flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#bc002d"/></svg>日本节点<b>100 分</b></span>
            <span><svg class="sl-flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#b22234"/><path d="M0 3h30M0 6h30M0 9h30M0 12h30M0 15h30M0 18h30" stroke="#fff" stroke-width="1.5"/><rect width="13" height="10.5" fill="#3c3b6e"/></svg>美国节点<b>97 分</b></span>
            <span>2026-11-19 实测</span>
          </div>
          <div class="sl-hero-cta">
            <a class="sl-btn sl-btn-primary sl-btn-lg" href="#plans">立即购买</a>
            <a class="sl-btn sl-btn-ghost sl-btn-lg" href="/#/register">注册领 1 元体验包</a>
          </div>
        </div>
        <div class="sl-hero-art" aria-hidden="true">
          <svg viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="sl-g-sphere" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(210 200) rotate(50) scale(260)"><stop stop-color="#2b3a66"/><stop offset=".6" stop-color="#1c2340"/><stop offset="1" stop-color="#161a2b"/></radialGradient>
              <linearGradient id="sl-g-rim" x1="80" y1="80" x2="440" y2="440" gradientUnits="userSpaceOnUse"><stop stop-color="#4080ff" stop-opacity=".9"/><stop offset=".5" stop-color="#7b61ff" stop-opacity=".25"/><stop offset="1" stop-color="#a848ff" stop-opacity=".7"/></linearGradient>
              <linearGradient id="sl-g-arc" x1="150" y1="0" x2="390" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#4080ff"/><stop offset="1" stop-color="#b15cff"/></linearGradient>
              <clipPath id="sl-clip"><circle cx="260" cy="260" r="180"/></clipPath>
            </defs>
            <ellipse cx="260" cy="260" rx="250" ry="84" transform="rotate(-18 260 260)" stroke="url(#sl-g-rim)" stroke-opacity=".35"/>
            <circle cx="260" cy="260" r="180" fill="url(#sl-g-sphere)"/>
            <g clip-path="url(#sl-clip)" stroke="#6f8fff" stroke-opacity=".16">
              <ellipse cx="260" cy="260" rx="180" ry="60"/><ellipse cx="260" cy="260" rx="180" ry="120"/>
              <path d="M80 260h360M260 80v360"/>
              <ellipse cx="260" cy="260" rx="60" ry="180"/><ellipse cx="260" cy="260" rx="120" ry="180"/>
            </g>
            <circle cx="260" cy="260" r="180" stroke="url(#sl-g-rim)" stroke-width="1.5"/>
            <path class="sl-dash" d="M170 300 C 210 150, 330 140, 372 220" stroke="url(#sl-g-arc)" stroke-width="2" stroke-linecap="round"/>
            <circle class="sl-pulse" cx="372" cy="220" r="6" fill="#4080ff"/>
            <circle cx="372" cy="220" r="5" fill="#fff"/><circle cx="372" cy="220" r="9" stroke="#4080ff" stroke-width="2"/>
            <circle class="sl-pulse d2" cx="170" cy="300" r="6" fill="#b15cff"/>
            <circle cx="170" cy="300" r="5" fill="#fff"/><circle cx="170" cy="300" r="9" stroke="#b15cff" stroke-width="2"/>
            <g font-family="system-ui,sans-serif" font-size="13" fill="#c9d2ea">
              <rect x="384" y="186" width="58" height="24" rx="6" fill="#232837" stroke="#ffffff22"/><text x="397" y="203">日本</text>
              <rect x="96" y="312" width="58" height="24" rx="6" fill="#232837" stroke="#ffffff22"/><text x="109" y="329">美国</text>
            </g>
            <circle cx="96" cy="140" r="2" fill="#4080ff"/><circle cx="448" cy="380" r="2.5" fill="#a848ff"/><circle cx="420" cy="110" r="1.5" fill="#fff" fill-opacity=".6"/><circle cx="130" cy="430" r="1.5" fill="#fff" fill-opacity=".5"/>
          </svg>
        </div>
      </div>
    </div>

    <section id="plans">
      <div class="wrap">
        <div class="sl-head">
          <h2>热门订阅计划</h2>
          <p>价格与流量以站内为准，下单前请先看下方服务说明</p>
        </div>
        <div class="sl-regions"><span><svg class="sl-flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#bc002d"/></svg>日本</span><span><svg class="sl-flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#b22234"/><path d="M0 3h30M0 6h30M0 9h30M0 12h30M0 15h30M0 18h30" stroke="#fff" stroke-width="1.5"/><rect width="13" height="10.5" fill="#3c3b6e"/></svg>美国</span></div>
        <div class="sl-glow">
          <div class="sl-table">
            <table>
              <thead><tr><th>套餐</th><th>流量</th><th>网络速度</th><th>设备数量</th><th>价格</th><th><span class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">操作</span></th></tr></thead>
              <tbody id="sl-plans-body" aria-live="polite" aria-busy="true">
                <tr><td class="sl-state" colspan="6">正在获取可用套餐…</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="sl-after-table">
          <h3>立即注册，选购更多订阅计划</h3>
          <a class="sl-btn sl-btn-primary sl-btn-lg" href="/#/register">开始选购</a>
        </div>
      </div>
    </section>

    <section id="features">
      <div class="wrap">
        <div class="sl-head">
          <h2>先说清楚，再决定</h2>
          <p>我们把线路情况讲在前面，按需选择适合自己的订阅</p>
        </div>
        <div class="sl-grid2">
          <div class="sl-feature">
            <div class="sl-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg></div>
            <h3>住宅 IP 节点</h3>
            <p>节点为普通线路住宅 IP，覆盖日本与美国。早晚高峰可能会卡顿，我们不夸大线路质量。</p>
          </div>
          <div class="sl-feature">
            <div class="sl-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/></svg></div>
            <h3>日常用 AI 没问题</h3>
            <p>ChatGPT、Claude 等 AI 工具日常使用稳定。</p>
          </div>
          <div class="sl-feature">
            <div class="sl-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg></div>
            <h3>可定制三网优化线路</h3>
            <p>需要更稳定的线路，可提工单或联系客服，定制三网优化线路住宅 IP 节点（另外收费）。</p>
          </div>
          <div class="sl-feature">
            <div class="sl-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></div>
            <h3>套餐规则透明</h3>
            <p>设备数、流量重置方式及有效期，以各套餐详情和下单页面为准，下单前都能看到。</p>
          </div>
        </div>
      </div>
    </section>

    <section id="nodes">
      <div class="wrap">
        <div class="sl-head">
          <h2>日本与美国住宅 IP 节点</h2>
          <p>节点评分为实测结果，分数会随时间变化</p>
        </div>
        <div class="sl-nodes">
          <div class="sl-node">
            <div class="sl-node-top"><em><svg class="sl-flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#bc002d"/></svg></em>日本节点</div>
            <div class="sl-node-score"><b>100</b>分</div>
            <div class="sl-bar"><i style="width:100%"></i></div>
            <p>普通线路住宅 IP</p>
          </div>
          <div class="sl-node us">
            <div class="sl-node-top"><em><svg class="sl-flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#b22234"/><path d="M0 3h30M0 6h30M0 9h30M0 12h30M0 15h30M0 18h30" stroke="#fff" stroke-width="1.5"/><rect width="13" height="10.5" fill="#3c3b6e"/></svg></em>美国节点</div>
            <div class="sl-node-score"><b>97</b>分</div>
            <div class="sl-bar"><i style="width:97%"></i></div>
            <p>普通线路住宅 IP</p>
          </div>
        </div>
        <p class="sl-nodes-note">评分于 2026-11-19 实测</p>
      </div>
    </section>

    <section id="clients">
      <div class="wrap">
        <div class="sl-head">
          <h2>客户端下载</h2>
          <p>注册登录后，在仪表盘复制订阅链接，导入下面任一客户端即可使用</p>
        </div>
        <div class="sl-clients">
          <a class="sl-client" href="https://github.com/clash-verge-rev/clash-verge-rev/releases" target="_blank" rel="noopener"><h3>Clash Verge</h3><p>Windows / macOS，推荐桌面端使用</p><span>去下载 →</span></a>
          <a class="sl-client" href="https://apps.apple.com/us/app/shadowrocket/id932747118" target="_blank" rel="noopener"><h3>Shadowrocket</h3><p>iOS（App Store 付费应用），推荐苹果手机使用</p><span>去 App Store →</span></a>
          <a class="sl-client" href="https://github.com/chen08209/FlClash/releases" target="_blank" rel="noopener"><h3>FlClash</h3><p>Android / Windows / macOS，全平台通用</p><span>去下载 →</span></a>
          <a class="sl-client" href="https://github.com/2dust/v2rayNG/releases" target="_blank" rel="noopener"><h3>v2rayNG</h3><p>Android，轻量稳定</p><span>去下载 →</span></a>
        </div>
      </div>
    </section>

    <section id="invite">
      <div class="wrap">
        <div class="sl-duo">
          <div class="sl-feature">
            <h3>邀请好友，得 10% 返佣</h3>
            <p>注册后在「我的邀请」里生成专属邀请链接，好友通过链接注册并购买，你得订单金额 10% 返佣，满 ¥10 可提现（支付宝）。每人最多 5 个邀请码。</p>
            <a class="sl-btn sl-btn-primary" href="/#/register">注册后邀请好友</a>
          </div>
          <div class="sl-feature">
            <h3>Telegram 频道</h3>
            <p>节点状态、优惠活动、套餐更新都在频道里发。遇到问题也可以在频道里找到客服入口。</p>
            <a class="sl-btn sl-btn-ghost" href="https://t.me/starlinkshop888" target="_blank" rel="noopener">加入 t.me/starlinkshop888</a>
          </div>
        </div>
      </div>
    </section>

    <section class="sl-final sl-glow">
      <div class="wrap">
        <h2>为日常连接而来的住宅 IP 服务</h2>
        <a class="sl-btn sl-btn-primary sl-btn-lg" href="/#/login">进入控制台</a>
      </div>
    </section>

    <footer class="sl-footer">
      <div class="wrap">
        <div>
          <a class="sl-brand" href="/"><i aria-hidden="true">✦</i>星屿StarLink</a>
          <p>普通线路住宅 IP 节点 · 日本与美国</p>
        </div>
        <div>
          <h4>资源</h4>
          <ul>
            <li><a href="#plans">立即购买</a></li>
            <li><a href="#clients">客户端下载</a></li>
            <li><a href="https://blog.sp1128.top/tos/" target="_blank" rel="noopener">服务条款</a></li>
          </ul>
        </div>
        <div>
          <h4>联系我们</h4>
          <ul>
            <li><a class="sl-chip" href="https://t.me/starlinkshop888" target="_blank" rel="noopener">Telegram：starlinkshop888</a></li>
            <li><a href="/#/ticket">提交工单</a></li>
          </ul>
        </div>
      </div>
      <div class="sl-copy">
        <div class="wrap"><span>Copyright © 2026 星屿StarLink. All rights reserved.</span><span>原生住宅 IP 服务</span></div>
      </div>
    </footer>

    <a class="sl-float" href="https://t.me/starlinkshop888" target="_blank" rel="noopener" title="Telegram 频道 / 客服" aria-label="Telegram 频道 / 客服">✈</a>
  </div><!-- /#sl-landing -->

  <script>
    window.routerBase = "/";
    window.settings = {
      title: @json($title),
      assets_path: '/theme/{{$theme}}/assets',
      theme: { color: '{{ $theme_config['theme_color'] ?? "default" }}' },
      version: @json($version),
      background_url: @json($theme_config['background_url'] ?? ''),
      description: @json($description),
      i18n: ['zh-CN','en-US','ja-JP','vi-VN','ko-KR','zh-TW','fa-IR'],
      logo: @json($logo)
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
    /* ---- 已登录用户 / 走 #/login 等 SPA 路由时，直接在页内启动原 SPA ---- */
    var spaBooted = false;
    function bootSPA(){
      if(spaBooted) return; spaBooted = true;
      if(getToken()) { try{ document.cookie = 'sl_logged_in=1;path=/;max-age=2592000'; }catch(e){} }
      var landing = document.getElementById('sl-landing');
      if(landing) landing.style.display = 'none';
      document.body.classList.remove('sl-landing-page');
      var app = document.createElement('div');
      app.id = 'app';
      document.body.appendChild(app);
      var s = document.createElement('script');
      s.type = 'module'; s.setAttribute('crossorigin','');
      s.src = '/theme/{{$theme}}/assets/umi.js';
      document.body.appendChild(s);
    }
    function needsSPA(){ return !!getToken() || /^#\//.test(location.hash || ''); }
    window.addEventListener('hashchange', function(){ if(needsSPA()) bootSPA(); });
    if(needsSPA()){
      bootSPA();
      return;
    }
    /* ---- 套餐表：公开 guest API，只展示后端真实字段 ---- */
    var body = document.getElementById('sl-plans-body');
    var PERIODS = [['month_price','月'],['quarter_price','季'],['half_year_price','半年'],['year_price','年'],['two_year_price','两年'],['three_year_price','三年'],['onetime_price','一次性']];
    function esc(s){
      return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    function money(cents){
      var y = Number(cents) / 100;
      return Number.isInteger(y) ? String(y) : y.toFixed(2);
    }
    function state(text){ body.innerHTML = '<tr><td class="sl-state" colspan="6">' + text + '</td></tr>'; }
    function row(p){
      var period = PERIODS.filter(function(pair){ var v = p[pair[0]]; return v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v)) && Number(v) >= 0; })[0];
      var price = '<span>' + (period ? '¥' + money(p[period[0]]) + '<small> / ' + period[1] + '</small>' : '<small>暂无价格</small>') + '</span>';
      // 套餐说明按纯文本处理：后端 HTML 不能在这里变成可执行标记。
      var doc = new DOMParser().parseFromString(String(p.content || ''), 'text/html').body;
      doc.querySelectorAll('script,style,iframe,object').forEach(function(el){ el.remove(); });
      var note = (doc.textContent || '').replace(/\s+/g, ' ').trim();
      var traffic = p.transfer_enable == null ? '以套餐为准' : esc(p.transfer_enable) + ' GB';
      // 后端约定：null 表示不限；缺字段时不做推断。
      var speed = p.speed_limit === null ? '不限速' : Number(p.speed_limit) > 0 ? esc(p.speed_limit) + ' Mbps' : '以套餐为准';
      var devices = p.device_limit === null ? '不限设备数量' : Number(p.device_limit) > 0 ? esc(p.device_limit) + ' 台' : '以套餐为准';
      var href = /^\d+$/.test(String(p.id)) ? '/#/plan/' + p.id : '/#/plan';
      return '<tr class="sl-plan-row">'
        + '<td data-label="套餐"><div class="sl-plan-name">' + esc(p.name || '订阅套餐') + '</div>' + (note ? '<div class="sl-plan-note">' + esc(note) + '</div>' : '') + '</td>'
        + '<td data-label="流量">' + traffic + '</td>'
        + '<td data-label="网络速度" class="sl-strong">' + speed + '</td>'
        + '<td data-label="设备数量" class="sl-strong">' + devices + '</td>'
        + '<td data-label="价格" class="sl-price">' + price + '</td>'
        + '<td><a class="sl-btn sl-btn-ghost sl-btn-sm" href="' + href + '">立即购买</a></td>'
        + '</tr>';
    }
    fetch('/api/v1/guest/plan/fetch')
      .then(function(r){ if(!r.ok) throw new Error('Plan request failed'); return r.json(); })
      .then(function(j){
        var plans = (j && Array.isArray(j.data)) ? j.data : [];
        body.setAttribute('aria-busy', 'false');
        if(!plans.length){ state('暂无在售套餐，请稍后再来或联系客服。'); return; }
        body.innerHTML = plans.map(row).join('');
      })
      .catch(function(){
        body.setAttribute('aria-busy', 'false');
        state('套餐加载失败，请刷新页面，或联系客服。');
      });
  })();
  </script>
  {!! $theme_config['custom_html'] ?? '' !!}
</body>

</html>
