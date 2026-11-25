<!doctype html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <meta name="description" content="星屿StarLink：住宅 IP 节点（日本 100 分 / 美国 97 分）+ 36 个机房 IP 节点，覆盖日本、新加坡、香港、台湾、美国、加拿大、德国、英国、印度，日常用 AI 没问题。" />
  <title>{{$title}} - 住宅 IP · 机房 IP 节点</title>
  <style>
    /* iOS 26 Liquid Glass 访客落地页 */
    :where(#sl-landing,#sl-landing *){box-sizing:border-box;margin:0;padding:0}
    body.sl-landing-page{
      --bg:#f2f2f7;--surface:#ffffff;--surface-2:#ffffff;--fill:rgba(118,118,128,.12);--fill-2:rgba(120,120,128,.08);
      --line:rgba(60,60,67,.12);--text:#000000;--muted:rgba(60,60,67,.65);--faint:rgba(60,60,67,.38);
      --accent:#007aff;--accent-soft:rgba(0,122,255,.12);--accent-glow:rgba(0,122,255,.26);
      --ok:#34c759;--indigo:#5856d6;--glass:rgba(255,255,255,.78);
      --shadow:0 2px 14px rgba(0,0,0,.045),0 0 0 .5px rgba(0,0,0,.04);
      --shadow-lg:0 16px 40px rgba(0,0,0,.08),0 0 0 .5px rgba(0,0,0,.05);
      margin:0;background:var(--bg);color:var(--text);
      font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
      line-height:1.55;-webkit-font-smoothing:antialiased;
    }
    html.dark body.sl-landing-page{
      --bg:#000000;--surface:#1c1c1e;--surface-2:#2c2c2e;--fill:rgba(118,118,128,.24);--fill-2:rgba(120,120,128,.16);
      --line:rgba(84,84,88,.48);--text:#ffffff;--muted:rgba(235,235,245,.65);--faint:rgba(235,235,245,.38);
      --accent:#0a84ff;--accent-soft:rgba(10,132,255,.18);--accent-glow:rgba(10,132,255,.32);
      --ok:#30d158;--indigo:#5e5ce6;--glass:rgba(28,28,30,.78);
      --shadow:0 2px 14px rgba(0,0,0,.35),0 0 0 .5px rgba(255,255,255,.08);
      --shadow-lg:0 18px 42px rgba(0,0,0,.55),0 0 0 .5px rgba(255,255,255,.1);
    }
    body.sl-landing-page>div[style*="text-align:center"]{display:none!important}
    #sl-landing{overflow-x:clip}
    #sl-landing a{color:inherit;text-decoration:none}
    :where(#sl-landing) .wrap{max-width:1160px;margin:0 auto;padding:0 22px}
    :where(#sl-landing) section{padding:64px 0;scroll-margin-top:64px}

    /* Frosted Navbar */
    .sl-nav{position:sticky;top:0;z-index:50;background:var(--glass);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:.5px solid var(--line)}
    .sl-nav .wrap{height:58px;display:flex;align-items:center;gap:24px}
    .sl-brand{display:flex;align-items:center;gap:9px;font-size:16.5px;font-weight:700;letter-spacing:-.2px}
    .sl-brand i{display:grid;place-items:center;width:28px;height:28px;border-radius:9px;background:var(--accent);color:#fff;font-style:normal;font-size:14px}
    .sl-nav nav{display:flex;gap:24px;font-size:14px;color:var(--muted)}
    .sl-nav nav a:hover{color:var(--text)}
    .sl-nav-end{margin-left:auto;display:flex;align-items:center;gap:10px;font-size:14px}

    /* Pill Buttons */
    .sl-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:40px;padding:0 22px;border-radius:9999px;font-size:14px;font-weight:600;border:0;cursor:pointer;white-space:nowrap;transition:transform .15s,opacity .15s}
    .sl-btn:active{transform:scale(.965)}
    .sl-btn-primary{background:var(--accent);color:#fff!important;box-shadow:0 8px 22px var(--accent-glow)}
    .sl-btn-tinted{background:var(--accent-soft);color:var(--accent)!important}
    .sl-btn-gray{background:var(--fill);color:var(--text)!important}
    .sl-btn-sm{height:32px;padding:0 14px;font-size:13px}
    .sl-btn-lg{height:46px;padding:0 28px;font-size:15px}

    /* Hero */
    .sl-hero{padding:52px 0 36px}
    .sl-hero-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);align-items:center;gap:40px}
    .sl-pill{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:9999px;background:var(--surface);box-shadow:var(--shadow);font-size:12px;font-weight:500;color:var(--muted)}
    .sl-pill:before{content:"";width:7px;height:7px;border-radius:50%;background:var(--ok);box-shadow:0 0 8px var(--ok)}
    .sl-hero h1{margin-top:18px;font-size:clamp(32px,3.8vw,48px);line-height:1.15;font-weight:700;letter-spacing:-.8px}
    .sl-hero h1 span{color:var(--accent)}
    .sl-hero-desc{margin-top:16px;max-width:540px;font-size:15px;color:var(--muted);line-height:1.7}
    .sl-hero-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}
    .sl-stat-widgets{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:26px;max-width:520px}
    .sl-widget{background:var(--surface);border-radius:18px;padding:14px 16px;box-shadow:var(--shadow)}
    .sl-widget-label{font-size:12px;color:var(--muted);display:flex;align-items:center;justify-content:space-between}
    .sl-widget-val{font-size:24px;font-weight:700;margin-top:4px;font-variant-numeric:tabular-nums}
    .sl-widget-val small{font-size:12px;font-weight:500;color:var(--muted);margin-left:2px}

    /* Wallet Hero Stack */
    .sl-stack{position:relative;display:grid;gap:14px}
    .sl-stack:before{content:"";position:absolute;inset:-16px;border-radius:50%;background:radial-gradient(circle at 30% 30%,var(--accent-glow),transparent 62%),radial-gradient(circle at 80% 70%,rgba(175,82,222,.22),transparent 60%);filter:blur(26px);pointer-events:none}
    .sl-wallet{position:relative;z-index:1;border-radius:22px;padding:24px;color:#fff;background:linear-gradient(135deg,var(--accent),#5856d6 58%,#7d4cdb);box-shadow:0 18px 40px var(--accent-glow);overflow:hidden}
    .sl-wallet:after{content:"";position:absolute;right:-50px;top:-60px;width:210px;height:210px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.24),transparent 70%)}
    .sl-wallet-top{display:flex;justify-content:space-between;font-size:12px;opacity:.88}
    .sl-wallet-title{font-size:22px;font-weight:700;margin-top:10px}
    .sl-wallet-sub{font-size:12.5px;opacity:.84;margin-top:4px}
    .sl-wallet-bar{margin-top:18px;height:7px;border-radius:9999px;background:rgba(255,255,255,.25);overflow:hidden}
    .sl-wallet-bar i{display:block;height:100%;width:24%;background:#fff;border-radius:9999px}
    .sl-wallet-foot{display:flex;justify-content:space-between;font-size:12px;opacity:.9;margin-top:8px;font-variant-numeric:tabular-nums}

    /* Inset Group & Cards */
    .sl-group{position:relative;z-index:1;background:var(--surface);border-radius:18px;box-shadow:var(--shadow);overflow:hidden}
    .sl-row{display:flex;align-items:center;gap:12px;padding:13px 16px;position:relative}
    .sl-row+.sl-row:before{content:"";position:absolute;top:0;left:58px;right:0;height:.5px;background:var(--line)}
    .sl-ico{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;color:#fff;font-size:14px;flex:none}
    .sl-row-main{flex:1;min-width:0}
    .sl-row-main b{display:block;font-size:14px;font-weight:600}
    .sl-row-main span{display:block;font-size:12px;color:var(--muted)}
    .sl-row-tag{font-size:12px;font-weight:600;color:var(--accent)}

    /* Section Head */
    .sl-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:24px}
    .sl-head h2{font-size:clamp(24px,3vw,32px);font-weight:700;letter-spacing:-.4px}
    .sl-head p{margin-top:4px;font-size:14px;color:var(--muted)}
    .sl-seg{display:inline-flex;padding:3px;border-radius:11px;background:var(--fill);gap:2px}
    .sl-seg button{border:0;background:transparent;padding:6px 14px;border-radius:8px;font-family:inherit;font-size:13px;font-weight:500;color:var(--muted);cursor:pointer}
    .sl-seg button.is-active{background:var(--surface-2);color:var(--text);box-shadow:0 1px 4px rgba(0,0,0,.1)}

    /* Plans Grid */
    .sl-plans-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
    .sl-plan-card{background:var(--surface);border-radius:22px;padding:24px;box-shadow:var(--shadow);display:flex;flex-direction:column}
    .sl-plan-card.is-hot{box-shadow:var(--shadow-lg),0 0 0 1.5px var(--accent)}
    .sl-plan-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .sl-plan-name{font-size:18px;font-weight:700}
    .sl-badge{padding:3px 10px;border-radius:9999px;font-size:11.5px;font-weight:600;background:var(--fill);color:var(--muted)}
    .sl-plan-card.is-hot .sl-badge{background:var(--accent);color:#fff}
    .sl-plan-price{margin-top:14px;font-size:30px;font-weight:700;font-variant-numeric:tabular-nums}
    .sl-plan-card.is-hot .sl-plan-price{color:var(--accent)}
    .sl-plan-price small{font-size:13px;font-weight:400;color:var(--muted);margin-left:3px}
    .sl-plan-note{margin-top:8px;font-size:13px;color:var(--muted);min-height:40px;line-height:1.55}
    .sl-plan-specs{margin:16px 0 20px;padding-top:14px;border-top:.5px solid var(--line);display:grid;gap:9px;font-size:13px;flex:1}
    .sl-plan-specs div{display:flex;justify-content:space-between;gap:12px}
    .sl-plan-specs span{color:var(--muted)}
    .sl-plan-specs b{font-weight:600;font-variant-numeric:tabular-nums}
    .sl-state-box{grid-column:1/-1;background:var(--surface);border-radius:18px;padding:36px 20px;text-align:center;color:var(--muted);box-shadow:var(--shadow)}

    /* Bento Grids */
    .sl-grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
    .sl-card{background:var(--surface);border-radius:20px;padding:24px;box-shadow:var(--shadow)}
    .sl-card h3{font-size:18px;font-weight:700;margin-bottom:8px}
    .sl-card p{font-size:13.5px;color:var(--muted);line-height:1.7}
    .sl-regions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
    .sl-regions span{padding:5px 12px;border-radius:9999px;background:var(--fill-2);font-size:12.5px;font-weight:500}

    /* Clients */
    .sl-clients{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
    .sl-client{background:var(--surface);border-radius:18px;padding:18px;box-shadow:var(--shadow);display:flex;align-items:center;gap:12px;transition:transform .16s}
    .sl-client:hover{transform:translateY(-2px)}
    .sl-client-app{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;font-size:20px;color:#fff;flex:none}
    .sl-client h3{font-size:15px;font-weight:700}
    .sl-client p{font-size:12px;color:var(--muted);margin-top:2px}

    /* Footer */
    .sl-footer{border-top:.5px solid var(--line);padding:36px 0 40px;color:var(--muted);font-size:13px}
    .sl-footer .wrap{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px}
    .sl-footer-links{display:flex;flex-wrap:wrap;gap:20px}
    .sl-footer-links a:hover{color:var(--text)}

    .sl-float{position:fixed;right:20px;bottom:22px;z-index:60;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:#229ed9;color:#fff!important;font-size:20px;box-shadow:0 8px 24px rgba(34,158,217,.38)}

    @media (max-width:960px){
      .sl-nav nav{display:none}
      .sl-hero-grid,.sl-plans-grid{grid-template-columns:1fr}
      .sl-clients{grid-template-columns:repeat(2,minmax(0,1fr))}
    }
    @media (max-width:680px){
      :where(#sl-landing) section{padding:44px 0}
      .sl-grid2,.sl-clients{grid-template-columns:1fr}
      .sl-stat-widgets{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
      .sl-widget{padding:11px 10px}
      .sl-widget-val{font-size:20px}
    }
  </style>
</head>

<body class="sl-landing-page">
  <div id="sl-landing">
    <header class="sl-nav">
      <div class="wrap">
        <a class="sl-brand" href="/"><i aria-hidden="true">✦</i><span>{{$title}}</span></a>
        <nav aria-label="页面导航">
          <a href="#plans">订阅套餐</a>
          <a href="#features">服务说明</a>
          <a href="#clients">客户端</a>
          <a href="#invite">邀请返佣</a>
        </nav>
        <div class="sl-nav-end">
          <button type="button" id="sl-landing-theme" class="sl-btn sl-btn-gray sl-btn-sm" aria-label="切换深浅模式">☀️</button>
          <a class="sl-btn sl-btn-tinted sl-btn-sm" href="/#/login">登录</a>
          <a class="sl-btn sl-btn-primary sl-btn-sm" href="/#/register">注册</a>
        </div>
      </div>
    </header>

    <div class="sl-hero">
      <div class="wrap sl-hero-grid">
        <div>
          <span class="sl-pill">住宅 IP · 机房 IP | 9 个地区 | AI 日常可用</span>
          <h1>星屿 StarLink<br /><span>像使用原生应用一样从容。</span></h1>
          <p class="sl-hero-desc">月付含日本、美国原生住宅 IP，另送 10 个机房 IP 节点 + 2 个优化节点；机房 IP 覆盖日本、新加坡、香港、台湾、美国、加拿大、德国、英国、印度。日常使用 ChatGPT、Claude 稳定，早晚高峰可能会卡顿；需要三网优化线路可提工单定制（另收费）。</p>
          <div class="sl-hero-cta">
            <a class="sl-btn sl-btn-primary sl-btn-lg" href="#plans">立即选购套餐</a>
            <a class="sl-btn sl-btn-tinted sl-btn-lg" href="/#/register">注册领 1 元体验包</a>
          </div>
          <div class="sl-stat-widgets">
            <div class="sl-widget">
              <div class="sl-widget-label"><span>🇯🇵 日本住宅</span></div>
              <div class="sl-widget-val">100<small>分</small></div>
            </div>
            <div class="sl-widget">
              <div class="sl-widget-label"><span>🇺🇸 美国住宅</span></div>
              <div class="sl-widget-val">97<small>分</small></div>
            </div>
            <div class="sl-widget">
              <div class="sl-widget-label"><span>机房覆盖</span></div>
              <div class="sl-widget-val">36<small>节点</small></div>
            </div>
          </div>
        </div>

        <div class="sl-stack" aria-hidden="true">
          <div class="sl-wallet">
            <div class="sl-wallet-top"><span>星屿 StarLink · 订阅通行证</span><span>2026-11-19 实测</span></div>
            <div class="sl-wallet-title">日常相伴 · 住宅月付</div>
            <div class="sl-wallet-sub">含 JP / US 原生住宅 IP + 12 个附赠节点</div>
            <div class="sl-wallet-bar"><i></i></div>
            <div class="sl-wallet-foot"><span>已用 48.2 GB</span><span>总计 200 GB</span></div>
          </div>
          <div class="sl-group">
            <div class="sl-row">
              <div class="sl-ico" style="background:#34c759">⚡</div>
              <div class="sl-row-main"><b>一键导入 Shadowrocket / Clash</b><span>扫码或复制订阅链接，10 秒完成配置</span></div>
              <span class="sl-row-tag">全平台</span>
            </div>
            <div class="sl-row">
              <div class="sl-ico" style="background:#5856d6">✦</div>
              <div class="sl-row-main"><b>ChatGPT / Claude 原生解锁</b><span>住宅 IP 环境纯净，日常开发与 AI 稳定</span></div>
              <span class="sl-row-tag">可用</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section id="plans">
      <div class="wrap">
        <div class="sl-head">
          <div>
            <h2>热门订阅计划</h2>
            <p>价格与流量以站内实时配置为准，下单前请先查看下方服务说明</p>
          </div>
          <div class="sl-seg" id="sl-plan-seg">
            <button type="button" data-filter="all" class="is-active">全部</button>
            <button type="button" data-filter="monthly">月付</button>
            <button type="button" data-filter="onetime">一次性</button>
          </div>
        </div>
        <div id="sl-plans-body" class="sl-plans-grid" aria-live="polite" aria-busy="true">
          <div class="sl-state-box">正在获取可用套餐…</div>
        </div>
      </div>
    </section>

    <section id="features">
      <div class="wrap">
        <div class="sl-head">
          <div>
            <h2>先说清楚，再决定</h2>
            <p>不夸大高峰表现，把线路覆盖与适用场景讲在前面</p>
          </div>
        </div>
        <div class="sl-grid2">
          <div class="sl-card">
            <h3>住宅 IP + 机房 IP 混合覆盖</h3>
            <p>日本（100 分）与美国（97 分）原生住宅 IP，月付另附赠 10 个机房节点与 2 个 Kamatera 优化节点；机房节点共有 36 个可选。</p>
            <div class="sl-regions">
              <span>🇯🇵 日本</span><span>🇺🇸 美国</span><span>🇸🇬 新加坡</span><span>🇭🇰 香港</span><span>🇹🇼 台湾</span><span>🇩🇪 德国</span><span>🇨🇦 加拿大</span><span>🇬🇧 英国</span><span>🇮🇳 印度</span>
            </div>
          </div>
          <div class="sl-card">
            <h3>日常 AI 稳定 · 支持定制优化</h3>
            <p>ChatGPT、Claude 等常用 AI 工具日常使用无忧；早晚高峰普通线路可能会有波动。如对延迟稳定性有更高要求，可提工单定制三网优化线路（另收费）。</p>
          </div>
        </div>
      </div>
    </section>

    <section id="clients">
      <div class="wrap">
        <div class="sl-head">
          <div>
            <h2>全平台客户端</h2>
            <p>注册登录后，在 iOS 风格控制台一键导入或导出 Clash 配置文件</p>
          </div>
        </div>
        <div class="sl-clients">
          <a class="sl-client" href="https://apps.apple.com/us/app/shadowrocket/id932747118" target="_blank" rel="noopener">
            <div class="sl-client-app" style="background:linear-gradient(135deg,#007aff,#5856d6)">🚀</div>
            <div><h3>Shadowrocket</h3><p>iOS / iPadOS · App Store</p></div>
          </a>
          <a class="sl-client" href="https://github.com/clash-verge-rev/clash-verge-rev/releases" target="_blank" rel="noopener">
            <div class="sl-client-app" style="background:linear-gradient(135deg,#34c759,#0099b8)">💻</div>
            <div><h3>Clash Verge</h3><p>Windows / macOS 桌面端</p></div>
          </a>
          <a class="sl-client" href="https://github.com/chen08209/FlClash/releases" target="_blank" rel="noopener">
            <div class="sl-client-app" style="background:linear-gradient(135deg,#ff9500,#ff3b30)">📱</div>
            <div><h3>FlClash</h3><p>Android / 桌面全平台</p></div>
          </a>
          <a class="sl-client" href="https://github.com/2dust/v2rayNG/releases" target="_blank" rel="noopener">
            <div class="sl-client-app" style="background:linear-gradient(135deg,#af52de,#5856d6)">⚡</div>
            <div><h3>v2rayNG</h3><p>Android 轻量稳定</p></div>
          </a>
        </div>
      </div>
    </section>

    <section id="invite">
      <div class="wrap">
        <div class="sl-grid2">
          <div class="sl-card">
            <h3>邀请好友，得 10% 返佣</h3>
            <p>注册后在「我的邀请」生成专属邀请链接，好友下单即得 10% 返佣，满 ¥10 支持支付宝提现或直接划转余额使用。</p>
            <div style="margin-top:16px"><a class="sl-btn sl-btn-primary sl-btn-sm" href="/#/register">注册后邀请好友</a></div>
          </div>
          <div class="sl-card">
            <h3>Telegram 频道与客服</h3>
            <p>节点状态播报、线路更新与活动通知都会在频道第一时间发布，也可随时在站内提交工单联系客服。</p>
            <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
              <a class="sl-btn sl-btn-tinted sl-btn-sm" href="https://t.me/starlinkshop888" target="_blank" rel="noopener">加入 t.me/starlinkshop888</a>
              <a class="sl-btn sl-btn-gray sl-btn-sm" href="/#/ticket">提交工单</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="sl-footer">
      <div class="wrap">
        <span>© 2026 {{$title}} · 住宅 IP &amp; 机房 IP 服务</span>
        <div class="sl-footer-links">
          <a href="#plans">订阅套餐</a>
          <a href="#clients">客户端下载</a>
          <a href="https://blog.sp1128.top/tos/" target="_blank" rel="noopener">服务条款</a>
          <a href="/#/login">进入控制台</a>
        </div>
      </div>
    </footer>

    <a class="sl-float" href="https://t.me/starlinkshop888" target="_blank" rel="noopener" title="Telegram 频道 / 客服" aria-label="Telegram 频道 / 客服">✈</a>
  </div>

  <script>
    window.routerBase = "/";
    window.settings = {
      title: @json($title),
      assets_path: '/theme/{{$theme}}/assets',
      theme: { color: '{{ $theme_config['theme_color'] ?? "default" }}' },
      version: @json($version),
      background_url: @json($theme_config['background_url'] ?? ''),
      description: @json($description),
      i18n: ['zh-CN', 'en-US', 'ja-JP', 'vi-VN', 'ko-KR', 'zh-TW', 'fa-IR'],
      logo: @json($logo)
    };
  </script>
  <script>
  (function(){
    var TOKEN_KEY = 'VUE_NAIVE_ACCESS_TOKEN';
    var THEME_KEY = 'SL_IOS_THEME';
    function applyLandingTheme(){
      try{
        var saved = localStorage.getItem(THEME_KEY) || 'auto';
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var dark = saved === 'dark' || (saved === 'auto' && prefersDark);
        document.documentElement.classList.toggle('dark', dark);
        document.documentElement.setAttribute('data-sl-theme', dark ? 'dark' : 'light');
        var btn = document.getElementById('sl-landing-theme');
        if(btn) btn.textContent = dark ? '🌙' : '☀️';
      }catch(e){}
    }
    applyLandingTheme();
    var themeBtn = document.getElementById('sl-landing-theme');
    if(themeBtn){
      themeBtn.addEventListener('click', function(){
        var dark = document.documentElement.classList.contains('dark');
        try{ localStorage.setItem(THEME_KEY, dark ? 'light' : 'dark'); }catch(e){}
        applyLandingTheme();
      });
    }

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

    var spaBooted = false;
    function bootSPA(){
      if(spaBooted) return;
      spaBooted = true;
      if(getToken()){ try{ document.cookie = 'sl_logged_in=1;path=/;max-age=2592000'; }catch(e){} }
      var landing = document.getElementById('sl-landing');
      if(landing) landing.style.display = 'none';
      document.body.classList.remove('sl-landing-page');
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/theme/{{$theme}}/assets/ios-app.css';
      document.head.appendChild(link);
      var app = document.createElement('div');
      app.id = 'app';
      if(landing) landing.parentNode.insertBefore(app, landing.nextSibling);
      else document.body.appendChild(app);
      var qr = document.createElement('script');
      qr.async = false;
      qr.src = '/theme/{{$theme}}/assets/ios-qr.js';
      document.body.appendChild(qr);
      var s = document.createElement('script');
      s.async = false;
      s.src = '/theme/{{$theme}}/assets/ios-app.js';
      document.body.appendChild(s);
    }
    function needsSPA(){ return !!getToken() || /^#\//.test(location.hash || ''); }
    window.addEventListener('hashchange', function(){ if(needsSPA()) bootSPA(); });
    if(needsSPA()){
      bootSPA();
      return;
    }

    var body = document.getElementById('sl-plans-body');
    var PERIODS = [['month_price','月'],['quarter_price','季'],['half_year_price','半年'],['year_price','年'],['two_year_price','两年'],['three_year_price','三年'],['onetime_price','一次性']];
    var allPlans = [];
    var activeFilter = 'all';

    function esc(s){
      return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    function money(cents){
      var y = Number(cents) / 100;
      return Number.isInteger(y) ? String(y) : y.toFixed(2);
    }
    function stateBox(text){
      body.innerHTML = '<div class="sl-state-box">' + esc(text) + '</div>';
    }
    function cardHtml(p, idx){
      var period = PERIODS.filter(function(pair){ var v = p[pair[0]]; return v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v)) && Number(v) >= 0; })[0];
      var price = period ? '¥' + money(p[period[0]]) + '<small>/ ' + period[1] + '</small>' : '<small>暂无价格</small>';
      var doc = new DOMParser().parseFromString(String(p.content || ''), 'text/html').body;
      doc.querySelectorAll('script,style,iframe,object').forEach(function(el){ el.remove(); });
      var note = (doc.textContent || '').replace(/\s+/g, ' ').trim();
      var traffic = p.transfer_enable == null ? '以套餐为准' : esc(p.transfer_enable) + ' GB';
      var speed = p.speed_limit === null ? '不限速' : Number(p.speed_limit) > 0 ? esc(p.speed_limit) + ' Mbps' : '以套餐为准';
      var devices = p.device_limit === null ? '不限设备数量' : Number(p.device_limit) > 0 ? esc(p.device_limit) + ' 台' : '以套餐为准';
      var href = /^\d+$/.test(String(p.id)) ? '/#/plan/' + p.id : '/#/plan';
      var hot = idx === 1;
      return '<article class="sl-plan-row sl-plan-card' + (hot ? ' is-hot' : '') + '">'
        + '<div class="sl-plan-head"><div class="sl-plan-name">' + esc(p.name || '订阅套餐') + '</div><span class="sl-badge">' + (hot ? '推荐' : '可用') + '</span></div>'
        + '<div class="sl-plan-price">' + price + '</div>'
        + '<div class="sl-plan-note">' + (note ? esc(note) : '适合日常连接与 AI 使用') + '</div>'
        + '<div class="sl-plan-specs">'
          + '<div><span>可用流量</span><b>' + traffic + '</b></div>'
          + '<div><span>网络速度</span><b>' + speed + '</b></div>'
          + '<div><span>设备数量</span><b>' + devices + '</b></div>'
        + '</div>'
        + '<a class="sl-btn ' + (hot ? 'sl-btn-primary' : 'sl-btn-tinted') + '" style="width:100%" href="' + href + '">立即购买</a>'
        + '</article>';
    }
    function renderPlans(){
      var list = allPlans.filter(function(p){
        if(activeFilter === 'monthly') return p.month_price != null;
        if(activeFilter === 'onetime') return p.onetime_price != null;
        return true;
      });
      if(!list.length){ stateBox('暂无在售套餐，请稍后再来或联系客服。'); return; }
      body.innerHTML = list.map(cardHtml).join('');
    }
    document.querySelectorAll('#sl-plan-seg button').forEach(function(btn){
      btn.addEventListener('click', function(){
        document.querySelectorAll('#sl-plan-seg button').forEach(function(b){ b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        activeFilter = btn.getAttribute('data-filter') || 'all';
        renderPlans();
      });
    });

    fetch('/api/v1/guest/plan/fetch')
      .then(function(r){ if(!r.ok) throw new Error('Plan request failed'); return r.json(); })
      .then(function(j){
        allPlans = (j && Array.isArray(j.data)) ? j.data : [];
        body.setAttribute('aria-busy', 'false');
        renderPlans();
      })
      .catch(function(){
        body.setAttribute('aria-busy', 'false');
        stateBox('套餐加载失败，请刷新页面，或联系客服。');
      });
  })();
  </script>
  {!! $theme_config['custom_html'] ?? '' !!}
</body>

</html>
