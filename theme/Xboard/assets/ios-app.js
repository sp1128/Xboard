/* ==========================================================================
   星屿 StarLink · iOS 26 Liquid Glass Console SPA
   Zero-build ES5/ES6 module speaking directly to Xboard /api/v1/*
   ========================================================================== */
(function () {
  'use strict';

  var TOKEN_KEY = 'VUE_NAIVE_ACCESS_TOKEN';
  var THEME_KEY = 'SL_IOS_THEME';
  var ACCENT_KEY = 'SL_IOS_ACCENT';
  var INVITE_KEY = 'SL_INVITE_CODE';

  var PERIODS = [
    ['month_price', '月付', '月'],
    ['quarter_price', '季付', '季'],
    ['half_year_price', '半年付', '半年'],
    ['year_price', '年付', '年'],
    ['two_year_price', '两年付', '两年'],
    ['three_year_price', '三年付', '三年'],
    ['onetime_price', '一次性', '一次性'],
    ['reset_price', '重置流量包', '次']
  ];

  var ORDER_STATUS = {
    0: ['待支付', 'ios-pill-orange'],
    1: ['开通中', 'ios-pill-blue'],
    2: ['已取消', 'ios-pill-gray'],
    3: ['已完成', 'ios-pill-green'],
    4: ['已折抵', 'ios-pill-gray']
  };

  var ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-4.5v-6h-6v6H4.5A1.5 1.5 0 0 1 3 20z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1.5 13h-15z"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.4 0-2.7-.3-3.9-.9L3 21l1.9-5.2A8.5 8.5 0 1 1 21 11.5z"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>',
    receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
  };

  var DOCK_TABS = [
    { key: 'dashboard', label: '首页', icon: 'home', hash: '#/dashboard' },
    { key: 'plan', label: '套餐', icon: 'bag', hash: '#/plan' },
    { key: 'node', label: '节点', icon: 'globe', hash: '#/node' },
    { key: 'ticket', label: '工单', icon: 'chat', hash: '#/ticket' },
    { key: 'profile', label: '我的', icon: 'user', hash: '#/profile' }
  ];

  var state = {
    route: 'dashboard',
    param: null,
    sub: null,
    info: null,
    invite: null,
    notices: [],
    plans: null,
    servers: null,
    orders: null,
    tickets: null,
    knowledge: null,
    trafficLogs: null,
    guestConfig: null,
    userConfig: null,
    paymentMethods: null,
    giftHistory: null,
    sessions: null,
    stat: null,
    planFilter: 'all',
    nodeFilter: 'all',
    nodeSearch: '',
    knowledgeSearch: '',
    selectedNotice: 0,
    loadingRoute: false,
    pollTimer: null
  };

  /* -------------------- Utilities -------------------- */
  function settings() { return window.settings || {}; }
  function siteTitle() { return settings().title || '星屿StarLink'; }
  function currencySymbol() { return (state.userConfig && state.userConfig.currency_symbol) || '¥'; }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function sanitizeHtml(raw) {
    try {
      var doc = new DOMParser().parseFromString(String(raw || ''), 'text/html');
      doc.body.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach(function (el) { el.remove(); });
      doc.body.querySelectorAll('*').forEach(function (el) {
        Array.from(el.attributes).forEach(function (attr) {
          var name = attr.name.toLowerCase();
          var val = String(attr.value || '').trim().toLowerCase();
          if (name.indexOf('on') === 0 || ((name === 'href' || name === 'src') && val.indexOf('javascript:') === 0)) {
            el.removeAttribute(attr.name);
          }
        });
      });
      return doc.body.innerHTML;
    } catch (e) {
      return esc(raw);
    }
  }

  function plainText(raw) {
    try {
      var doc = new DOMParser().parseFromString(String(raw || ''), 'text/html').body;
      doc.querySelectorAll('script,style,iframe,object').forEach(function (el) { el.remove(); });
      return (doc.textContent || '').replace(/\s+/g, ' ').trim();
    } catch (e) {
      return String(raw || '');
    }
  }

  function money(cents) {
    var n = (Number(cents) || 0) / 100;
    return currencySymbol() + (Number.isInteger(n) ? String(n) : n.toFixed(2));
  }

  function gb(bytes) {
    var n = Number(bytes) || 0;
    if (n >= 1073741824) return (n / 1073741824).toFixed(2) + ' GB';
    if (n >= 1048576) return (n / 1048576).toFixed(1) + ' MB';
    return (n / 1024).toFixed(0) + ' KB';
  }

  function fmtDate(ts, withTime) {
    if (!ts) return '长期有效';
    var ms = Number(ts) > 1e12 ? Number(ts) : Number(ts) * 1000;
    var d = new Date(ms);
    if (isNaN(d.getTime())) return '-';
    var p = function (v) { return ('0' + v).slice(-2); };
    var date = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    return withTime ? date + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) : date;
  }

  function flagOf(name) {
    var s = String(name || '');
    if (/日本|JP|Tokyo|Osaka/i.test(s)) return '🇯🇵';
    if (/美国|US|Los Angeles|Seattle|San Jose|New York/i.test(s)) return '🇺🇸';
    if (/香港|HK|Hong Kong/i.test(s)) return '🇭🇰';
    if (/台湾|TW|Taiwan|Taipei/i.test(s)) return '🇹🇼';
    if (/新加坡|SG|Singapore/i.test(s)) return '🇸🇬';
    if (/英国|UK|London|GB/i.test(s)) return '🇬🇧';
    if (/德国|DE|Frankfurt|Germany/i.test(s)) return '🇩🇪';
    if (/加拿大|CA|Canada|Toronto/i.test(s)) return '🇨🇦';
    if (/印度|IN|India|Mumbai/i.test(s)) return '🇮🇳';
    if (/韩国|KR|Korea|Seoul/i.test(s)) return '🇰🇷';
    return '🌐';
  }

  /* -------------------- Token & Cookie -------------------- */
  function getToken() {
    try {
      var raw = localStorage.getItem(TOKEN_KEY);
      if (!raw || raw === 'null' || raw === 'undefined') return null;
      var val = raw;
      try {
        var o = JSON.parse(raw);
        if (o && typeof o === 'object') val = o.value || null;
        else if (o === null) return null;
      } catch (e) {}
      if (!val || val === 'null' || val === 'undefined') return null;
      return val;
    } catch (e) { return null; }
  }

  function setToken(authData) {
    try {
      localStorage.setItem(TOKEN_KEY, JSON.stringify({
        value: authData,
        time: Date.now(),
        expire: Date.now() + 86400000 * 30
      }));
      document.cookie = 'sl_logged_in=1;path=/;max-age=2592000';
    } catch (e) {}
  }

  function clearToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      document.cookie = 'sl_logged_in=;path=/;max-age=0';
    } catch (e) {}
  }

  function syncCookie() {
    var t = getToken();
    var has = document.cookie.indexOf('sl_logged_in=1') !== -1;
    try {
      if (t && !has) document.cookie = 'sl_logged_in=1;path=/;max-age=2592000';
      else if (!t && has) document.cookie = 'sl_logged_in=;path=/;max-age=0';
    } catch (e) {}
  }

  /* -------------------- Theme & Accent -------------------- */
  function defaultAccentFromConfig() {
    var c = (settings().theme && settings().theme.color) || 'blue';
    if (c === 'darkblue') return 'indigo';
    return 'blue';
  }

  function applyAppearance() {
    var savedTheme = localStorage.getItem(THEME_KEY) || 'auto';
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = savedTheme === 'dark' || (savedTheme === 'auto' && prefersDark);
    document.documentElement.setAttribute('data-sl-theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
    var accent = localStorage.getItem(ACCENT_KEY) || defaultAccentFromConfig();
    document.documentElement.setAttribute('data-sl-accent', accent);
  }

  function toggleDarkMode() {
    var cur = document.documentElement.getAttribute('data-sl-theme') === 'dark';
    localStorage.setItem(THEME_KEY, cur ? 'light' : 'dark');
    applyAppearance();
    render();
  }

  function setAccent(accent) {
    localStorage.setItem(ACCENT_KEY, accent);
    applyAppearance();
    render();
  }

  /* -------------------- Toast & Sheet -------------------- */
  function toast(msg, isError) {
    var wrap = document.getElementById('sl-toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'sl-toast-wrap';
      wrap.className = 'ios-toast-wrap';
      document.body.appendChild(wrap);
    }
    var item = document.createElement('div');
    item.className = 'ios-toast';
    item.innerHTML = '<span style="color:' + (isError ? 'var(--ios-red)' : 'var(--ios-green)') + '">' + (isError ? '●' : '✓') + '</span><span>' + esc(msg) + '</span>';
    wrap.appendChild(item);
    setTimeout(function () { item.remove(); }, 2800);
  }

  function openSheet(title, bodyHtml, onMount) {
    closeSheet();
    var backdrop = document.createElement('div');
    backdrop.id = 'sl-sheet-backdrop';
    backdrop.className = 'ios-sheet-backdrop';
    backdrop.innerHTML =
      '<div class="ios-sheet" role="dialog" aria-modal="true">' +
        '<div class="ios-sheet-head">' +
          '<strong style="font-size:16px">' + esc(title) + '</strong>' +
          '<button type="button" id="sl-sheet-close" class="ios-btn ios-btn-gray ios-btn-sm">完成</button>' +
        '</div>' +
        '<div class="ios-sheet-body">' + bodyHtml + '</div>' +
      '</div>';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeSheet();
    });
    backdrop.querySelector('#sl-sheet-close').addEventListener('click', closeSheet);
    if (typeof onMount === 'function') onMount(backdrop);
  }

  function closeSheet() {
    if (state.pollTimer) { clearInterval(state.pollTimer); state.pollTimer = null; }
    var el = document.getElementById('sl-sheet-backdrop');
    if (el) el.remove();
  }

  /* -------------------- API Client -------------------- */
  function api(path, opts) {
    opts = opts || {};
    var base = (window.routerBase || '/').replace(/\/?$/, '/');
    var headers = { 'Accept': 'application/json' };
    var token = getToken();
    if (token && !opts.noAuth) headers['Authorization'] = token;
    var fetchOpts = { method: opts.method || 'GET', headers: headers };
    if (opts.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      fetchOpts.body = JSON.stringify(opts.body);
    }
    return fetch(base + 'api/v1/' + path, fetchOpts).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (json) {
        if (res.status === 401) {
          clearToken();
          navigate('login');
          throw new Error((json && json.message) || '登录已过期，请重新登录');
        }
        if (!res.ok) {
          var firstErr = json && json.errors && Object.values(json.errors)[0];
          var msg = (Array.isArray(firstErr) ? firstErr[0] : null) || (json && json.message) || ('请求失败 (' + res.status + ')');
          throw new Error(msg);
        }
        return json;
      });
    });
  }

  function copyText(text, okMsg) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast(okMsg || '已复制到剪贴板');
      }, function () {
        fallbackCopy(text, okMsg);
      });
    } else {
      fallbackCopy(text, okMsg);
    }
  }

  function fallbackCopy(text, okMsg) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast(okMsg || '已复制到剪贴板'); }
    catch (e) { toast('复制失败，请手动复制', true); }
    ta.remove();
  }

  /* -------------------- Routing -------------------- */
  function parseHash() {
    var h = location.hash || '';
    var qIdx = h.indexOf('?');
    var queryStr = qIdx !== -1 ? h.slice(qIdx + 1) : '';
    var clean = (qIdx !== -1 ? h.slice(0, qIdx) : h).replace(/^#\/?/, '');
    var parts = clean.split('/').filter(Boolean);
    var route = parts[0] || (getToken() ? 'dashboard' : 'login');
    var param = parts[1] || null;
    var query = {};
    if (queryStr) {
      queryStr.split('&').forEach(function (kv) {
        var pair = kv.split('=');
        if (pair[0]) query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      });
    }
    return { route: route, param: param, query: query };
  }

  function navigate(route, param) {
    var target = '#/' + route + (param ? '/' + encodeURIComponent(param) : '');
    if (location.hash === target) onRouteChange();
    else location.hash = target;
  }

  function isAuthRoute(r) {
    return r === 'login' || r === 'register' || r === 'reset-password';
  }

  function activeDockKey(route) {
    if (route === 'dashboard' || route === 'traffic') return 'dashboard';
    if (route === 'plan') return 'plan';
    if (route === 'node') return 'node';
    if (route === 'ticket') return 'ticket';
    return 'profile';
  }

  /* -------------------- Data Loaders -------------------- */
  function loadDashboardData(force) {
    if (!force && state.sub) return Promise.resolve();
    return Promise.all([
      api('user/getSubscribe').then(function (r) { state.sub = r.data; }),
      api('user/info').then(function (r) { state.info = r.data; }).catch(function () {}),
      api('user/invite/fetch').then(function (r) { state.invite = r.data; }).catch(function () {}),
      api('user/notice/fetch').then(function (r) { state.notices = Array.isArray(r.data) ? r.data : []; }).catch(function () {}),
      api('user/server/fetch').then(function (r) { state.servers = Array.isArray(r.data) ? r.data : []; }).catch(function () {}),
      api('user/comm/config').then(function (r) { state.userConfig = r.data; }).catch(function () {}),
      api('user/getStat').then(function (r) { state.stat = r.data; }).catch(function () {})
    ]);
  }

  function loadRouteData(route) {
    if (route === 'dashboard') return loadDashboardData(false);
    if (route === 'plan') {
      return Promise.all([
        loadDashboardData(false),
        api('user/plan/fetch').then(function (r) { state.plans = Array.isArray(r.data) ? r.data : []; })
      ]);
    }
    if (route === 'node') {
      return api('user/server/fetch').then(function (r) { state.servers = Array.isArray(r.data) ? r.data : []; });
    }
    if (route === 'order') {
      return api('user/order/fetch').then(function (r) { state.orders = Array.isArray(r.data) ? r.data : []; });
    }
    if (route === 'ticket') {
      return api('user/ticket/fetch').then(function (r) { state.tickets = Array.isArray(r.data) ? r.data : []; });
    }
    if (route === 'invite') {
      return Promise.all([
        loadDashboardData(false),
        api('user/invite/fetch').then(function (r) { state.invite = r.data; }),
        api('user/invite/details').then(function (r) { state.inviteDetails = Array.isArray(r.data) ? r.data : []; }).catch(function () {})
      ]);
    }
    if (route === 'traffic') {
      return Promise.all([
        loadDashboardData(false),
        api('user/stat/getTrafficLog').then(function (r) { state.trafficLogs = Array.isArray(r.data) ? r.data : []; })
      ]);
    }
    if (route === 'knowledge') {
      return api('user/knowledge/fetch?language=zh-CN').then(function (r) { state.knowledge = r.data || {}; });
    }
    if (route === 'profile') {
      return Promise.all([
        loadDashboardData(false),
        api('user/getActiveSession').then(function (r) { state.sessions = Array.isArray(r.data) ? r.data : []; }).catch(function () {}),
        api('user/gift-card/history').then(function (r) { state.giftHistory = Array.isArray(r.data) ? r.data : []; }).catch(function () {})
      ]);
    }
    return Promise.resolve();
  }

  /* -------------------- Actions & Sheets -------------------- */
  function exportClashConfig() {
    var subUrl = state.sub && state.sub.subscribe_url;
    if (!subUrl) {
      api('user/getSubscribe').then(function (r) {
        state.sub = r.data;
        if (state.sub && state.sub.subscribe_url) exportClashConfig();
        else toast('暂无订阅链接', true);
      }).catch(function (e) { toast(e.message, true); });
      return;
    }
    var dlUrl = subUrl + (subUrl.indexOf('?') === -1 ? '?flag=meta' : '&flag=meta');
    fetch(dlUrl).then(function (r) {
      if (!r.ok) throw new Error('配置文件获取失败');
      return r.text();
    }).then(function (text) {
      if (!text || text.indexOf('proxies') === -1) throw new Error('暂未获取到有效配置');
      var blob = new Blob([text], { type: 'text/yaml' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'StarLink.yaml';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      toast('已导出 StarLink.yaml');
    }).catch(function () {
      toast('导出失败，请复制订阅链接手动导入', true);
    });
  }

  function openSubscribeSheet() {
    var url = (state.sub && state.sub.subscribe_url) || '';
    if (!url) { toast('当前暂无有效订阅链接', true); return; }
    var enc = encodeURIComponent(url);
    var b64 = btoa(unescape(encodeURIComponent(url)));
    var qrSvg = window.SLQR ? window.SLQR.toSvg(url, 176) : '';
    var nameEnc = encodeURIComponent(siteTitle());

    var html =
      '<div style="text-align:center;margin-bottom:16px">' +
        '<div style="display:inline-block;padding:10px;background:#fff;border-radius:16px;box-shadow:var(--ios-shadow)">' + qrSvg + '</div>' +
        '<div class="sl-muted" style="font-size:12px;margin-top:8px">使用 Shadowrocket / 客户端扫码导入</div>' +
      '</div>' +
      '<div class="ios-group" style="margin-bottom:14px">' +
        '<div class="ios-row ios-row-clickable" data-action="copy-sub">' +
          '<div class="ios-badge-icon" style="background:var(--ios-accent)">📋</div>' +
          '<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600">复制订阅链接</div><div class="sl-muted" style="font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(url) + '</div></div>' +
          '<span class="sl-faint">›</span>' +
        '</div>' +
        '<a class="ios-row ios-row-clickable" href="shadowrocket://add/sub://' + esc(b64) + '?remark=' + nameEnc + '">' +
          '<div class="ios-badge-icon" style="background:#5856d6">🚀</div>' +
          '<div style="flex:1"><div style="font-size:14px;font-weight:600">导入到 Shadowrocket</div><div class="sl-muted" style="font-size:12px">iOS / iPadOS 一键拉起</div></div>' +
          '<span class="sl-faint">›</span>' +
        '</a>' +
        '<a class="ios-row ios-row-clickable" href="clash://install-config?url=' + enc + '&name=' + nameEnc + '">' +
          '<div class="ios-badge-icon" style="background:var(--ios-green)">💻</div>' +
          '<div style="flex:1"><div style="font-size:14px;font-weight:600">导入到 Clash Verge / FlClash</div><div class="sl-muted" style="font-size:12px">Windows / macOS / Android</div></div>' +
          '<span class="sl-faint">›</span>' +
        '</a>' +
        '<a class="ios-row ios-row-clickable" href="surge:///install-config?url=' + enc + '">' +
          '<div class="ios-badge-icon" style="background:var(--ios-orange)">⚡</div>' +
          '<div style="flex:1"><div style="font-size:14px;font-weight:600">导入到 Surge / Loon</div><div class="sl-muted" style="font-size:12px">Apple 生态专业客户端</div></div>' +
          '<span class="sl-faint">›</span>' +
        '</a>' +
        '<div class="ios-row ios-row-clickable" data-action="export-yaml">' +
          '<div class="ios-badge-icon" style="background:var(--ios-teal)">↓</div>' +
          '<div style="flex:1"><div style="font-size:14px;font-weight:600">导出配置文件 (StarLink.yaml)</div><div class="sl-muted" style="font-size:12px">Clash Meta 标准 YAML 直接下载</div></div>' +
          '<span class="sl-faint">›</span>' +
        '</div>' +
      '</div>';

    openSheet('一键导入订阅', html, function (root) {
      root.querySelector('[data-action="copy-sub"]').addEventListener('click', function () {
        copyText(url, '订阅链接已复制');
      });
      root.querySelector('[data-action="export-yaml"]').addEventListener('click', exportClashConfig);
    });
  }

  function openNoticeSheet(idx) {
    var n = state.notices[idx || 0];
    if (!n) return;
    var html =
      '<div style="font-size:17px;font-weight:700;margin-bottom:6px">' + esc(n.title) + '</div>' +
      '<div class="sl-muted" style="font-size:12px;margin-bottom:14px">' + fmtDate(n.updated_at || n.created_at, true) + '</div>' +
      '<div class="sl-prose">' + sanitizeHtml(n.content || '') + '</div>';
    openSheet('系统公告', html);
  }

  function openPlanCheckoutSheet(plan) {
    var available = PERIODS.filter(function (p) {
      var v = plan[p[0]];
      return v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v)) && Number(v) >= 0;
    });
    if (!available.length) { toast('该套餐暂无可用购买周期', true); return; }
    var selectedPeriod = available[0][0];
    var couponInfo = null;

    function calcFinal(baseCents) {
      if (!couponInfo) return baseCents;
      if (Number(couponInfo.type) === 1) return Math.max(0, baseCents - Number(couponInfo.value || 0));
      if (Number(couponInfo.type) === 2) return Math.max(0, Math.round(baseCents * (100 - Number(couponInfo.value || 0)) / 100));
      return baseCents;
    }

    function buildHtml() {
      var base = Number(plan[selectedPeriod]) || 0;
      var finalAmt = calcFinal(base);
      return (
        '<div class="ios-card ios-card-pad" style="margin-bottom:14px">' +
          '<div style="font-size:18px;font-weight:700">' + esc(plan.name) + '</div>' +
          '<div class="sl-muted" style="font-size:12.5px;margin-top:4px">' + esc(plainText(plan.content)) + '</div>' +
          '<div style="display:flex;gap:12px;margin-top:12px;font-size:12.5px">' +
            '<span class="ios-pill ios-pill-blue">流量 ' + (plan.transfer_enable == null ? '不限' : esc(plan.transfer_enable) + ' GB') + '</span>' +
            '<span class="ios-pill ios-pill-gray">' + (plan.speed_limit ? esc(plan.speed_limit) + ' Mbps' : '不限速') + '</span>' +
            '<span class="ios-pill ios-pill-gray">' + (plan.device_limit ? esc(plan.device_limit) + ' 台设备' : '不限设备') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="ios-section-title">选择订阅周期</div>' +
        '<div class="ios-group" style="margin-bottom:14px">' +
          available.map(function (p) {
            var active = p[0] === selectedPeriod;
            return '<div class="ios-row ios-row-clickable no-inset" data-period="' + esc(p[0]) + '">' +
              '<div style="flex:1;font-size:14px;font-weight:600">' + esc(p[1]) + '</div>' +
              '<div class="sl-tabular" style="font-size:15px;font-weight:700;color:' + (active ? 'var(--ios-accent)' : 'var(--ios-text)') + '">' + money(plan[p[0]]) + '</div>' +
              '<div style="width:20px;text-align:right;color:var(--ios-accent);font-weight:700">' + (active ? '✓' : '') + '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div class="ios-section-title">优惠券（可选）</div>' +
        '<div style="display:flex;gap:8px;margin-bottom:16px">' +
          '<input id="sl-coupon-input" class="ios-field-box" placeholder="输入优惠码" value="' + esc(couponInfo ? couponInfo._code : '') + '" />' +
          '<button type="button" id="sl-coupon-btn" class="ios-btn ios-btn-tinted">验证</button>' +
        '</div>' +
        (couponInfo ? '<div class="ios-pill ios-pill-green" style="margin-bottom:14px">✓ 已应用优惠：' + esc(couponInfo.name || couponInfo._code) + '</div>' : '') +
        '<div class="ios-card ios-card-pad" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">' +
          '<span class="sl-muted" style="font-size:14px">应付金额</span>' +
          '<strong class="sl-tabular" style="font-size:24px;color:var(--ios-accent)">' + money(finalAmt) + '</strong>' +
        '</div>' +
        '<button type="button" id="sl-order-submit" class="ios-btn ios-btn-primary ios-btn-block">提交订单并支付</button>'
      );
    }

    function mountSheet(root) {
      root.querySelectorAll('[data-period]').forEach(function (el) {
        el.addEventListener('click', function () {
          selectedPeriod = el.getAttribute('data-period');
          root.querySelector('.ios-sheet-body').innerHTML = buildHtml();
          mountSheet(root);
        });
      });
      root.querySelector('#sl-coupon-btn').addEventListener('click', function () {
        var code = root.querySelector('#sl-coupon-input').value.trim();
        if (!code) { toast('请输入优惠码', true); return; }
        api('user/coupon/check', {
          method: 'POST',
          body: { code: code, plan_id: plan.id, period: selectedPeriod }
        }).then(function (r) {
          couponInfo = r.data || {};
          couponInfo._code = code;
          toast('优惠码验证成功');
          root.querySelector('.ios-sheet-body').innerHTML = buildHtml();
          mountSheet(root);
        }).catch(function (e) { toast(e.message, true); });
      });
      root.querySelector('#sl-order-submit').addEventListener('click', function () {
        var btn = root.querySelector('#sl-order-submit');
        btn.disabled = true;
        btn.textContent = '创建订单中...';
        var code = root.querySelector('#sl-coupon-input').value.trim();
        api('user/order/save', {
          method: 'POST',
          body: { plan_id: plan.id, period: selectedPeriod, coupon_code: code || undefined }
        }).then(function (r) {
          var tradeNo = r.data;
          toast('订单创建成功');
          state.orders = null;
          openOrderDetailSheet(tradeNo);
        }).catch(function (e) {
          btn.disabled = false;
          btn.textContent = '提交订单并支付';
          toast(e.message, true);
        });
      });
    }

    openSheet('确认订阅方案', buildHtml(), mountSheet);
  }

  function openOrderDetailSheet(tradeNo) {
    openSheet('订单详情', '<div class="sl-muted" style="text-align:center;padding:24px">正在加载订单信息...</div>');
    Promise.all([
      api('user/order/detail?trade_no=' + encodeURIComponent(tradeNo)),
      api('user/order/getPaymentMethod').catch(function () { return { data: [] }; })
    ]).then(function (res) {
      var order = res[0].data;
      var methods = Array.isArray(res[1].data) ? res[1].data : [];
      var st = ORDER_STATUS[order.status] || ['未知', 'ios-pill-gray'];
      var selectedMethod = methods[0] ? methods[0].id : null;
      var payResult = null;

      function renderOrderBody(root) {
        var body = root.querySelector('.ios-sheet-body');
        var fee = 0;
        var mObj = methods.find(function (m) { return m.id === selectedMethod; });
        if (mObj && (mObj.handling_fee_fixed || mObj.handling_fee_percent)) {
          fee = Math.round((Number(order.total_amount) * (Number(mObj.handling_fee_percent || 0) / 100)) + Number(mObj.handling_fee_fixed || 0));
        }

        var html =
          '<div class="ios-card ios-card-pad" style="margin-bottom:14px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
              '<span style="font-size:16px;font-weight:700">' + esc((order.plan && order.plan.name) || '订阅订单') + '</span>' +
              '<span class="ios-pill ' + st[1] + '">' + st[0] + '</span>' +
            '</div>' +
            '<div class="sl-muted" style="font-size:12px">订单号：' + esc(order.trade_no) + '</div>' +
            '<div class="sl-muted" style="font-size:12px;margin-top:2px">创建时间：' + fmtDate(order.created_at, true) + '</div>' +
            '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:14px;padding-top:12px;border-top:0.5px solid var(--ios-line)">' +
              '<span class="sl-muted" style="font-size:13px">订单金额</span>' +
              '<strong class="sl-tabular" style="font-size:22px;color:var(--ios-accent)">' + money(Number(order.total_amount) + fee) + '</strong>' +
            '</div>' +
          '</div>';

        if (order.status === 0) {
          if (payResult && payResult.type === 0) {
            var qr = window.SLQR ? window.SLQR.toSvg(payResult.data, 184) : '';
            html +=
              '<div class="ios-card ios-card-pad" style="text-align:center;margin-bottom:14px">' +
                '<div style="display:inline-block;padding:10px;background:#fff;border-radius:16px;box-shadow:var(--ios-shadow)">' + qr + '</div>' +
                '<div style="font-size:13px;font-weight:600;margin-top:10px">请使用对应 App 扫码完成支付</div>' +
                '<div class="sl-muted" style="font-size:12px;margin-top:4px">支付完成后页面会自动确认（每 3 秒检查一次）</div>' +
                (String(payResult.data).indexOf('http') === 0 ? '<a class="ios-btn ios-btn-tinted ios-btn-sm" style="margin-top:10px" href="' + esc(payResult.data) + '" target="_blank" rel="noopener">直接打开支付链接</a>' : '') +
              '</div>';
          } else {
            if (methods.length) {
              html += '<div class="ios-section-title">选择支付方式</div><div class="ios-group" style="margin-bottom:14px">' +
                methods.map(function (m) {
                  var active = m.id === selectedMethod;
                  return '<div class="ios-row ios-row-clickable no-inset" data-mid="' + m.id + '">' +
                    '<span style="font-size:18px">' + esc(m.icon || '💳') + '</span>' +
                    '<div style="flex:1;font-size:14px;font-weight:600">' + esc(m.name) + '</div>' +
                    '<span style="color:var(--ios-accent);font-weight:700">' + (active ? '✓' : '') + '</span>' +
                  '</div>';
                }).join('') +
              '</div>';
            }
            html += '<div style="display:flex;gap:10px">' +
              '<button type="button" id="sl-pay-cancel" class="ios-btn ios-btn-danger" style="flex:1">取消订单</button>' +
              '<button type="button" id="sl-pay-now" class="ios-btn ios-btn-primary" style="flex:2">立即支付</button>' +
            '</div>';
          }
        }
        body.innerHTML = html;

        body.querySelectorAll('[data-mid]').forEach(function (el) {
          el.addEventListener('click', function () {
            selectedMethod = Number(el.getAttribute('data-mid'));
            renderOrderBody(root);
          });
        });

        var cancelBtn = body.querySelector('#sl-pay-cancel');
        if (cancelBtn) {
          cancelBtn.addEventListener('click', function () {
            api('user/order/cancel', { method: 'POST', body: { trade_no: order.trade_no } }).then(function () {
              toast('订单已取消');
              state.orders = null;
              closeSheet();
              if (state.route === 'order') loadRouteData('order').then(render);
            }).catch(function (e) { toast(e.message, true); });
          });
        }

        var payBtn = body.querySelector('#sl-pay-now');
        if (payBtn) {
          payBtn.addEventListener('click', function () {
            if (Number(order.total_amount) > 0 && !selectedMethod) {
              toast('暂无可用支付方式', true);
              return;
            }
            payBtn.disabled = true;
            payBtn.textContent = '拉起支付中...';
            api('user/order/checkout', {
              method: 'POST',
              body: { trade_no: order.trade_no, method: selectedMethod }
            }).then(function (resPay) {
              if (resPay.type === -1) {
                toast('支付成功，订阅已生效');
                state.sub = null; state.orders = null;
                closeSheet();
                navigate('dashboard');
                return;
              }
              if (resPay.type === 1 && resPay.data) {
                window.open(resPay.data, '_blank', 'noopener');
                toast('已打开支付页面，等待回调确认');
              }
              payResult = resPay;
              renderOrderBody(root);
              if (state.pollTimer) clearInterval(state.pollTimer);
              state.pollTimer = setInterval(function () {
                api('user/order/check?trade_no=' + encodeURIComponent(order.trade_no)).then(function (chk) {
                  if (chk.data === 3 || chk.data === 1) {
                    clearInterval(state.pollTimer);
                    state.pollTimer = null;
                    toast('支付已确认！');
                    state.sub = null; state.orders = null;
                    closeSheet();
                    loadRouteData(state.route).then(render);
                  }
                }).catch(function () {});
              }, 3000);
            }).catch(function (e) {
              payBtn.disabled = false;
              payBtn.textContent = '立即支付';
              toast(e.message, true);
            });
          });
        }
      }

      var backdrop = document.getElementById('sl-sheet-backdrop');
      if (backdrop) renderOrderBody(backdrop);
    }).catch(function (e) {
      toast(e.message, true);
      closeSheet();
    });
  }

  function openNewTicketSheet() {
    var html =
      '<div style="display:grid;gap:12px">' +
        '<div><div class="ios-section-title" style="padding-left:4px">工单标题</div><input id="sl-tk-subject" class="ios-field-box" placeholder="例如：定制三网优化线路 / 客户端问题" /></div>' +
        '<div><div class="ios-section-title" style="padding-left:4px">优先级</div><div class="ios-seg" id="sl-tk-level"><button type="button" data-lv="0" class="is-active">低</button><button type="button" data-lv="1">中</button><button type="button" data-lv="2">高</button></div></div>' +
        '<div><div class="ios-section-title" style="padding-left:4px">问题描述</div><textarea id="sl-tk-msg" class="ios-field-box" rows="5" placeholder="请详细描述遇到的问题或定制需求..."></textarea></div>' +
        '<button type="button" id="sl-tk-submit" class="ios-btn ios-btn-primary ios-btn-block">提交工单</button>' +
      '</div>';
    openSheet('发起工单', html, function (root) {
      var lv = 0;
      root.querySelectorAll('#sl-tk-level button').forEach(function (b) {
        b.addEventListener('click', function () {
          root.querySelectorAll('#sl-tk-level button').forEach(function (x) { x.classList.remove('is-active'); });
          b.classList.add('is-active');
          lv = Number(b.getAttribute('data-lv'));
        });
      });
      root.querySelector('#sl-tk-submit').addEventListener('click', function () {
        var subject = root.querySelector('#sl-tk-subject').value.trim();
        var message = root.querySelector('#sl-tk-msg').value.trim();
        if (!subject || !message) { toast('请填写标题和问题描述', true); return; }
        api('user/ticket/save', { method: 'POST', body: { subject: subject, level: lv, message: message } }).then(function () {
          toast('工单已提交');
          closeSheet();
          loadRouteData('ticket').then(render);
        }).catch(function (e) { toast(e.message, true); });
      });
    });
  }

  function openTicketChatSheet(ticketId) {
    openSheet('工单对话', '<div class="sl-muted" style="text-align:center;padding:24px">加载对话中...</div>');
    api('user/ticket/fetch?id=' + encodeURIComponent(ticketId)).then(function (r) {
      var t = r.data;
      var msgs = Array.isArray(t.message) ? t.message : [];
      var closed = Number(t.status) === 1;
      var html =
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
          '<div style="font-size:15px;font-weight:700">' + esc(t.subject) + '</div>' +
          (closed ? '<span class="ios-pill ios-pill-gray">已关闭</span>' : '<button type="button" id="sl-tk-close" class="ios-btn ios-btn-danger ios-btn-sm">关闭工单</button>') +
        '</div>' +
        '<div class="ios-msg-list" style="margin-bottom:16px">' +
          msgs.map(function (m) {
            return '<div class="ios-msg-bubble ' + (m.is_me ? 'ios-msg-me' : 'ios-msg-staff') + '">' +
              '<div>' + esc(m.message) + '</div>' +
              '<div style="font-size:10px;opacity:.7;margin-top:4px">' + fmtDate(m.created_at, true) + '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
        (closed ? '' :
          '<div style="display:flex;gap:8px;padding-top:10px;border-top:0.5px solid var(--ios-line)">' +
            '<input id="sl-tk-reply" class="ios-field-box" placeholder="输入回复内容..." />' +
            '<button type="button" id="sl-tk-send" class="ios-btn ios-btn-primary">发送</button>' +
          '</div>');

      var backdrop = document.getElementById('sl-sheet-backdrop');
      if (!backdrop) return;
      backdrop.querySelector('.ios-sheet-body').innerHTML = html;

      var closeBtn = backdrop.querySelector('#sl-tk-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          api('user/ticket/close', { method: 'POST', body: { id: t.id } }).then(function () {
            toast('工单已关闭');
            closeSheet();
            loadRouteData('ticket').then(render);
          }).catch(function (e) { toast(e.message, true); });
        });
      }
      var sendBtn = backdrop.querySelector('#sl-tk-send');
      if (sendBtn) {
        sendBtn.addEventListener('click', function () {
          var msg = backdrop.querySelector('#sl-tk-reply').value.trim();
          if (!msg) return;
          api('user/ticket/reply', { method: 'POST', body: { id: t.id, message: msg } }).then(function () {
            toast('已回复');
            openTicketChatSheet(t.id);
          }).catch(function (e) { toast(e.message, true); });
        });
      }
    }).catch(function (e) {
      toast(e.message, true);
      closeSheet();
    });
  }

  function openGiftCardSheet() {
    var html =
      '<div style="display:grid;gap:12px">' +
        '<input id="sl-gc-code" class="ios-field-box" placeholder="输入礼品卡兑换码" />' +
        '<div id="sl-gc-preview"></div>' +
        '<div style="display:flex;gap:10px">' +
          '<button type="button" id="sl-gc-check" class="ios-btn ios-btn-tinted" style="flex:1">查询预览</button>' +
          '<button type="button" id="sl-gc-redeem" class="ios-btn ios-btn-primary" style="flex:1">立即兑换</button>' +
        '</div>' +
      '</div>';
    openSheet('礼品卡兑换', html, function (root) {
      root.querySelector('#sl-gc-check').addEventListener('click', function () {
        var code = root.querySelector('#sl-gc-code').value.trim();
        if (!code) { toast('请输入兑换码', true); return; }
        api('user/gift-card/check', { method: 'POST', body: { code: code } }).then(function (r) {
          var d = r.data || {};
          root.querySelector('#sl-gc-preview').innerHTML =
            '<div class="ios-card ios-card-pad" style="font-size:13px">' +
              '<div><strong>' + esc((d.code_info && d.code_info.template_name) || '礼品卡') + '</strong></div>' +
              '<div class="sl-muted" style="margin-top:4px">' + (d.can_redeem ? '✓ 当前账号满足兑换条件' : esc(d.reason || '暂不可兑换')) + '</div>' +
            '</div>';
        }).catch(function (e) { toast(e.message, true); });
      });
      root.querySelector('#sl-gc-redeem').addEventListener('click', function () {
        var code = root.querySelector('#sl-gc-code').value.trim();
        if (!code) { toast('请输入兑换码', true); return; }
        api('user/gift-card/redeem', { method: 'POST', body: { code: code } }).then(function (r) {
          toast((r.data && r.data.message) || '兑换成功');
          state.sub = null; state.info = null; state.giftHistory = null;
          closeSheet();
          loadRouteData(state.route).then(render);
        }).catch(function (e) { toast(e.message, true); });
      });
    });
  }

  function openPasswordSheet() {
    var html =
      '<div style="display:grid;gap:12px">' +
        '<input id="sl-pw-old" type="password" class="ios-field-box" placeholder="当前密码" />' +
        '<input id="sl-pw-new" type="password" class="ios-field-box" placeholder="新密码（至少 8 位）" />' +
        '<button type="button" id="sl-pw-save" class="ios-btn ios-btn-primary ios-btn-block">更新密码</button>' +
      '</div>';
    openSheet('修改登录密码', html, function (root) {
      root.querySelector('#sl-pw-save').addEventListener('click', function () {
        var old_password = root.querySelector('#sl-pw-old').value;
        var new_password = root.querySelector('#sl-pw-new').value;
        if (!old_password || !new_password) { toast('请填写完整', true); return; }
        api('user/changePassword', { method: 'POST', body: { old_password: old_password, new_password: new_password } }).then(function () {
          toast('密码修改成功');
          closeSheet();
        }).catch(function (e) { toast(e.message, true); });
      });
    });
  }

  function openKnowledgeSheet(article) {
    var html =
      '<div style="font-size:18px;font-weight:700;margin-bottom:6px">' + esc(article.title) + '</div>' +
      '<div class="sl-muted" style="font-size:12px;margin-bottom:14px">' + esc(article.category || '文档') + ' · 更新于 ' + fmtDate(article.updated_at, false) + '</div>' +
      '<div class="sl-prose">' + sanitizeHtml(article.body || '') + '</div>';
    openSheet('使用文档', html);
  }

  /* -------------------- View Renderers -------------------- */
  function renderAuth(mode) {
    var cfg = state.guestConfig || {};
    var tabMode = mode === 'register' ? 'register' : (mode === 'reset-password' ? 'reset' : 'login');
    var invitePrefill = localStorage.getItem(INVITE_KEY) || '';
    var showEmailCode = (tabMode === 'register' && cfg.is_email_verify) || tabMode === 'reset';

    return (
      '<div class="sl-auth-wrap">' +
        '<div class="sl-auth-card">' +
          '<div style="text-align:center;margin-bottom:22px">' +
            '<div class="sl-brand-mark" style="width:54px;height:54px;border-radius:16px;font-size:24px;margin:0 auto 12px;box-shadow:0 10px 26px var(--ios-accent-glow)">✦</div>' +
            '<h1 style="margin:0;font-size:23px;font-weight:700">' + esc(siteTitle()) + '</h1>' +
            '<p class="sl-muted" style="margin:4px 0 0;font-size:13px">' + (tabMode === 'register' ? '创建你的账号，立即开始连接' : (tabMode === 'reset' ? '通过邮箱验证码重设密码' : '登录进入 iOS 控制台')) + '</p>' +
          '</div>' +
          '<div class="ios-seg" style="width:100%;display:grid;grid-template-columns:repeat(3,1fr);margin-bottom:18px">' +
            '<button type="button" data-auth-nav="login" class="' + (tabMode === 'login' ? 'is-active' : '') + '">登录</button>' +
            '<button type="button" data-auth-nav="register" class="' + (tabMode === 'register' ? 'is-active' : '') + '">注册</button>' +
            '<button type="button" data-auth-nav="reset-password" class="' + (tabMode === 'reset' ? 'is-active' : '') + '">找回</button>' +
          '</div>' +
          '<form id="sl-auth-form" style="display:grid;gap:12px">' +
            '<div class="ios-group" style="box-shadow:none;border:0.5px solid var(--ios-line)">' +
              '<div class="ios-row no-inset"><span class="sl-muted" style="width:62px;font-size:13px;flex:none">邮箱</span><input id="sl-auth-email" class="ios-input" type="email" required placeholder="name@example.com" /></div>' +
              (showEmailCode ? '<div class="ios-row no-inset"><span class="sl-muted" style="width:62px;font-size:13px;flex:none">验证码</span><input id="sl-auth-code" class="ios-input" type="text" placeholder="6位邮箱验证码" /><button type="button" id="sl-send-code" class="ios-btn ios-btn-tinted ios-btn-sm">发送</button></div>' : '') +
              '<div class="ios-row no-inset"><span class="sl-muted" style="width:62px;font-size:13px;flex:none">' + (tabMode === 'reset' ? '新密码' : '密码') + '</span><input id="sl-auth-pwd" class="ios-input" type="password" required placeholder="' + (tabMode === 'login' ? '输入登录密码' : '至少 8 位字符') + '" /></div>' +
              (tabMode === 'register' ? '<div class="ios-row no-inset"><span class="sl-muted" style="width:62px;font-size:13px;flex:none">邀请码</span><input id="sl-auth-invite" class="ios-input" type="text" value="' + esc(invitePrefill) + '" placeholder="' + (cfg.is_invite_force ? '必填邀请码' : '选填邀请码') + '" /></div>' : '') +
            '</div>' +
            '<button type="submit" id="sl-auth-submit" class="ios-btn ios-btn-primary ios-btn-block" style="margin-top:4px;padding:12px 18px;font-size:15px">' +
              (tabMode === 'register' ? '注册并登录' : (tabMode === 'reset' ? '确认重置密码' : '登录')) +
            '</button>' +
          '</form>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;font-size:12.5px">' +
            '<a href="/" style="color:var(--ios-muted);text-decoration:none">← 返回首页</a>' +
            '<button type="button" id="sl-auth-theme" style="border:0;background:transparent;color:var(--ios-accent);cursor:pointer;font-size:12.5px;font-family:inherit">切换深浅模式</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderDashboard() {
    var s = state.sub || {};
    var used = (Number(s.u) || 0) + (Number(s.d) || 0);
    var total = Number(s.transfer_enable) || 0;
    var pct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
    var remain = Math.max(0, total - used);

    var expiryText = '暂未开通订阅';
    if (s.plan_id && s.plan) {
      if (!s.expired_at) expiryText = '长期有效';
      else {
        var ms = Number(s.expired_at) * 1000;
        var left = Math.ceil((ms - Date.now()) / 86400000);
        expiryText = left >= 0 ? ('于 ' + fmtDate(s.expired_at) + ' 到期 · 剩余 ' + left + ' 天') : ('已于 ' + fmtDate(s.expired_at) + ' 到期');
      }
      if (s.reset_day != null && s.reset_day !== '') expiryText += ' · ' + s.reset_day + ' 天后重置流量';
    }

    var inviteStat = (state.invite && Array.isArray(state.invite.stat)) ? state.invite.stat : null;
    var notice = state.notices && state.notices[0];
    var servers = Array.isArray(state.servers) ? state.servers.slice(0, 4) : [];

    return (
      '<div style="display:grid;gap:18px">' +
        (notice ?
          '<div class="ios-card ios-card-pad ios-row-clickable" data-action="open-notice" style="display:flex;align-items:center;gap:14px;cursor:pointer">' +
            '<div class="ios-badge-icon" style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--ios-accent),var(--ios-indigo))">📢</div>' +
            '<div style="flex:1;min-width:0">' +
              '<div style="font-size:14px;font-weight:700">' + esc(notice.title) + '</div>' +
              '<div class="sl-muted" style="font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(plainText(notice.content)) + '</div>' +
            '</div>' +
            '<span class="ios-btn ios-btn-tinted ios-btn-sm">查看</span>' +
          '</div>' : '') +

        '<div class="sl-bento">' +
          // Apple Wallet Subscription Card
          '<div class="ios-wallet">' +
            '<div class="ios-wallet-inner">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;opacity:.85">' +
                '<span>我的订阅</span>' +
                '<span style="padding:3px 10px;border-radius:9999px;background:rgba(255,255,255,.2)">' + (s.plan ? '生效中' : '未订阅') + '</span>' +
              '</div>' +
              '<div style="font-size:23px;font-weight:700;margin-top:8px">' + esc((s.plan && s.plan.name) || '暂无订阅套餐') + '</div>' +
              '<div style="font-size:12.5px;opacity:.84;margin-top:4px">' + esc(expiryText) + '</div>' +
              (s.plan ?
                '<div class="ios-wallet-bar"><i style="width:' + pct.toFixed(1) + '%"></i></div>' +
                '<div class="sl-tabular" style="display:flex;justify-content:space-between;font-size:12px;opacity:.9;margin-top:8px">' +
                  '<span>已用 ' + gb(used) + '（剩余 ' + gb(remain) + '）</span>' +
                  '<span>总计 ' + gb(total) + '</span>' +
                '</div>' : '') +
              '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px">' +
                (s.plan_id
                  ? '<button type="button" class="ios-btn ios-btn-sm" style="background:#fff;color:var(--ios-accent)" data-nav="plan" data-param="' + esc(s.plan_id) + '">续费订阅</button>' +
                    '<button type="button" class="ios-btn ios-btn-sm" style="background:rgba(255,255,255,.2);color:#fff" data-action="copy-sub">复制链接</button>' +
                    '<button type="button" class="ios-btn ios-btn-sm" style="background:rgba(255,255,255,.2);color:#fff" data-action="open-sub-sheet">一键导入</button>'
                  : '<button type="button" class="ios-btn ios-btn-sm" style="background:#fff;color:var(--ios-accent)" data-nav="plan">选购套餐</button>') +
              '</div>' +
            '</div>' +
          '</div>' +

          // Traffic Breakdown
          '<div class="ios-card ios-card-pad" style="display:flex;flex-direction:column;justify-content:space-between">' +
            '<div style="display:flex;justify-content:space-between;align-items:center">' +
              '<strong style="font-size:15px">流量使用</strong>' +
              '<a href="#/traffic" class="sl-accent" style="font-size:12.5px;text-decoration:none">明细 ›</a>' +
            '</div>' +
            '<div style="display:grid;gap:12px;margin:16px 0;font-size:13.5px">' +
              '<div style="display:flex;justify-content:space-between"><span class="sl-muted">● 上行流量</span><strong class="sl-tabular">' + gb(s.u) + '</strong></div>' +
              '<div style="display:flex;justify-content:space-between"><span class="sl-muted">● 下行流量</span><strong class="sl-tabular">' + gb(s.d) + '</strong></div>' +
              '<div style="display:flex;justify-content:space-between"><span class="sl-muted">● 总计已用</span><strong class="sl-tabular" style="color:var(--ios-accent)">' + gb(used) + '</strong></div>' +
            '</div>' +
            '<div class="sl-muted sl-tabular" style="font-size:12px;padding:8px 12px;border-radius:12px;background:var(--ios-fill-2)">剩余可用 <strong style="color:var(--ios-text)">' + gb(remain) + '</strong></div>' +
          '</div>' +

          // Invite Summary
          '<div class="ios-card ios-card-pad" style="display:flex;flex-direction:column;justify-content:space-between">' +
            '<div style="display:flex;justify-content:space-between;align-items:center">' +
              '<strong style="font-size:15px">我的邀请</strong>' +
              '<a href="#/invite" class="sl-accent" style="font-size:12.5px;text-decoration:none">管理 ›</a>' +
            '</div>' +
            (inviteStat ?
              '<div style="display:grid;gap:12px;margin:16px 0;font-size:13.5px">' +
                '<div style="display:flex;justify-content:space-between"><span class="sl-muted">已邀请人数</span><strong class="sl-tabular">' + inviteStat[0] + ' 人</strong></div>' +
                '<div style="display:flex;justify-content:space-between"><span class="sl-muted">返佣比例</span><strong class="sl-tabular" style="color:var(--ios-green)">' + inviteStat[3] + '%</strong></div>' +
                '<div style="display:flex;justify-content:space-between"><span class="sl-muted">可用佣金</span><strong class="sl-tabular" style="color:var(--ios-accent)">' + money(inviteStat[4]) + '</strong></div>' +
              '</div>' +
              '<button type="button" data-nav="invite" class="ios-btn ios-btn-tinted ios-btn-sm ios-btn-block">查看邀请码与提现</button>'
              : '<div class="sl-muted" style="font-size:13px;padding:20px 0">邀请数据暂不可用</div>') +
          '</div>' +
        '</div>' +

        '<div class="sl-grid-2">' +
          '<div>' +
            '<div class="ios-section-title">快捷操作</div>' +
            '<div class="ios-group">' +
              '<div class="ios-row ios-row-clickable" data-action="open-sub-sheet">' +
                '<div class="ios-badge-icon" style="background:var(--ios-accent)">📲</div>' +
                '<div style="flex:1"><div style="font-size:14px;font-weight:600">一键导入 / 二维码订阅</div><div class="sl-muted" style="font-size:12px">Shadowrocket / Clash / Surge / Loon</div></div>' +
                '<span class="sl-faint">›</span>' +
              '</div>' +
              '<div class="ios-row ios-row-clickable" data-action="export-yaml">' +
                '<div class="ios-badge-icon" style="background:var(--ios-teal)">↓</div>' +
                '<div style="flex:1"><div style="font-size:14px;font-weight:600">导出配置文件 (StarLink.yaml)</div><div class="sl-muted" style="font-size:12px">Clash Meta 标准 YAML 直接下载</div></div>' +
                '<span class="sl-faint">›</span>' +
              '</div>' +
              '<div class="ios-row ios-row-clickable" data-nav="knowledge">' +
                '<div class="ios-badge-icon" style="background:var(--ios-green)">📖</div>' +
                '<div style="flex:1"><div style="font-size:14px;font-weight:600">客户端配置教程</div><div class="sl-muted" style="font-size:12px">手把手图文使用指南</div></div>' +
                '<span class="sl-faint">›</span>' +
              '</div>' +
              '<div class="ios-row ios-row-clickable" data-nav="ticket">' +
                '<div class="ios-badge-icon" style="background:var(--ios-indigo)">💬</div>' +
                '<div style="flex:1"><div style="font-size:14px;font-weight:600">工单支持 / 定制三网优化</div><div class="sl-muted" style="font-size:12px">需要更稳定线路可提交工单定制</div></div>' +
                '<span class="sl-faint">›</span>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div>' +
            '<div style="display:flex;justify-content:space-between;align-items:center">' +
              '<div class="ios-section-title">常用节点状态</div>' +
              '<a href="#/node" class="sl-accent" style="font-size:12px;padding:0 10px 7px;text-decoration:none">全部 ›</a>' +
            '</div>' +
            '<div class="ios-group">' +
              (servers.length ? servers.map(function (srv) {
                return '<div class="ios-row">' +
                  '<span style="font-size:20px">' + flagOf(srv.name) + '</span>' +
                  '<div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(srv.name) + '</div>' +
                  '<div class="sl-muted" style="font-size:12px">' + esc(String(srv.type || '').toUpperCase()) + ' · ' + esc(srv.rate || '1.0') + 'x 倍率</div></div>' +
                  '<span class="ios-pill ' + (srv.is_online ? 'ios-pill-green' : 'ios-pill-red') + '">' + (srv.is_online ? '● 在线' : '● 离线') + '</span>' +
                '</div>';
              }).join('') : '<div class="ios-row no-inset"><span class="sl-muted" style="font-size:13px">开通订阅后即可查看可用节点列表</span></div>') +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div>' +
          '<div class="ios-section-title">客户端下载</div>' +
          '<div class="sl-grid-4">' +
            clientCard('Shadowrocket', 'iOS / iPadOS', 'https://apps.apple.com/us/app/shadowrocket/id932747118', '🚀', 'linear-gradient(135deg,#007aff,#5856d6)') +
            clientCard('Clash Verge', 'Windows / macOS', 'https://github.com/clash-verge-rev/clash-verge-rev/releases', '💻', 'linear-gradient(135deg,#34c759,#0099b8)') +
            clientCard('FlClash', '全平台通用', 'https://github.com/chen08209/FlClash/releases', '📱', 'linear-gradient(135deg,#ff9500,#ff3b30)') +
            clientCard('v2rayNG', 'Android 轻量', 'https://github.com/2dust/v2rayNG/releases', '⚡', 'linear-gradient(135deg,#af52de,#5856d6)') +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function clientCard(name, sub, url, emoji, grad) {
    return '<a class="ios-card ios-card-pad" href="' + esc(url) + '" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit">' +
      '<div style="width:42px;height:42px;border-radius:12px;background:' + grad + ';display:grid;place-items:center;font-size:19px;flex:none">' + emoji + '</div>' +
      '<div style="min-width:0"><div style="font-size:14px;font-weight:700">' + esc(name) + '</div><div class="sl-muted" style="font-size:11.5px">' + esc(sub) + '</div></div>' +
    '</a>';
  }

  function renderPlans() {
    var list = Array.isArray(state.plans) ? state.plans : [];
    var filtered = list.filter(function (p) {
      if (state.planFilter === 'monthly') return p.month_price != null;
      if (state.planFilter === 'onetime') return p.onetime_price != null;
      return true;
    });
    return (
      '<div style="display:grid;gap:18px">' +
        '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px">' +
          '<div><h2 style="margin:0;font-size:22px;font-weight:700">订阅商店</h2><div class="sl-muted" style="font-size:13px">选择适合你的流量与节点方案</div></div>' +
          '<div class="ios-seg">' +
            '<button type="button" data-plan-filter="all" class="' + (state.planFilter === 'all' ? 'is-active' : '') + '">全部</button>' +
            '<button type="button" data-plan-filter="monthly" class="' + (state.planFilter === 'monthly' ? 'is-active' : '') + '">月付</button>' +
            '<button type="button" data-plan-filter="onetime" class="' + (state.planFilter === 'onetime' ? 'is-active' : '') + '">一次性/流量</button>' +
          '</div>' +
        '</div>' +
        (filtered.length ? '<div class="sl-grid-3">' + filtered.map(function (p, idx) {
          var firstPeriod = PERIODS.find(function (pr) { return p[pr[0]] != null; });
          var priceText = firstPeriod ? money(p[firstPeriod[0]]) : '暂无价格';
          var unitText = firstPeriod ? ' / ' + firstPeriod[2] : '';
          var soldOut = p.capacity_limit === 0 || p.capacity_limit === '0' || p.capacity_limit === 'Sold out' || p.capacity_limit === '已售罄';
          var highlight = idx === 1;
          return '<div class="ios-card ios-card-pad" style="display:flex;flex-direction:column;' + (highlight ? 'box-shadow:var(--ios-shadow-lg),0 0 0 1.5px var(--ios-accent)' : '') + '">' +
            '<div style="display:flex;justify-content:space-between;align-items:center">' +
              '<strong style="font-size:17px">' + esc(p.name) + '</strong>' +
              (highlight ? '<span class="ios-pill ios-pill-blue">推荐</span>' : (Array.isArray(p.tags) && p.tags[0] ? '<span class="ios-pill ios-pill-gray">' + esc(p.tags[0]) + '</span>' : '')) +
            '</div>' +
            '<div class="sl-tabular" style="margin-top:12px;font-size:28px;font-weight:700;color:' + (highlight ? 'var(--ios-accent)' : 'var(--ios-text)') + '">' + priceText + '<span class="sl-muted" style="font-size:13px;font-weight:400">' + esc(unitText) + '</span></div>' +
            '<div class="sl-muted" style="font-size:12.5px;margin-top:6px;min-height:36px">' + esc(plainText(p.content)) + '</div>' +
            '<div style="border-top:0.5px solid var(--ios-line);margin:14px 0;padding-top:12px;display:grid;gap:8px;font-size:13px;flex:1">' +
              '<div style="display:flex;justify-content:space-between"><span class="sl-muted">可用流量</span><strong class="sl-tabular">' + (p.transfer_enable == null ? '不限' : esc(p.transfer_enable) + ' GB') + '</strong></div>' +
              '<div style="display:flex;justify-content:space-between"><span class="sl-muted">网络速度</span><strong>' + (p.speed_limit ? esc(p.speed_limit) + ' Mbps' : '不限速') + '</strong></div>' +
              '<div style="display:flex;justify-content:space-between"><span class="sl-muted">设备数量</span><strong>' + (p.device_limit ? esc(p.device_limit) + ' 台' : '不限设备') + '</strong></div>' +
            '</div>' +
            '<button type="button" data-buy-plan="' + esc(p.id) + '" class="ios-btn ' + (highlight ? 'ios-btn-primary' : 'ios-btn-tinted') + ' ios-btn-block" ' + (soldOut ? 'disabled' : '') + '>' + (soldOut ? '已售罄' : '立即选购') + '</button>' +
          '</div>';
        }).join('') + '</div>' : '<div class="ios-card ios-card-pad sl-muted" style="text-align:center">暂无可用订阅套餐</div>') +
      '</div>'
    );
  }

  function renderNodes() {
    var list = Array.isArray(state.servers) ? state.servers : [];
    var q = state.nodeSearch.trim().toLowerCase();
    var filtered = list.filter(function (s) {
      if (state.nodeFilter === 'online' && !s.is_online) return false;
      if (state.nodeFilter === 'residential' && String(s.name || '').indexOf('住宅') === -1) return false;
      if (q && String(s.name || '').toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    var onlineCount = list.filter(function (s) { return s.is_online; }).length;
    return (
      '<div style="display:grid;gap:16px">' +
        '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px">' +
          '<div><h2 style="margin:0;font-size:22px;font-weight:700">节点状态</h2><div class="sl-muted" style="font-size:13px">共 ' + list.length + ' 个节点 · ' + onlineCount + ' 个在线</div></div>' +
          '<div class="ios-seg">' +
            '<button type="button" data-node-filter="all" class="' + (state.nodeFilter === 'all' ? 'is-active' : '') + '">全部</button>' +
            '<button type="button" data-node-filter="online" class="' + (state.nodeFilter === 'online' ? 'is-active' : '') + '">在线</button>' +
            '<button type="button" data-node-filter="residential" class="' + (state.nodeFilter === 'residential' ? 'is-active' : '') + '">住宅 IP</button>' +
          '</div>' +
        '</div>' +
        '<input id="sl-node-search" class="ios-field-box" placeholder="搜索节点地区或名称..." value="' + esc(state.nodeSearch) + '" />' +
        '<div class="ios-group">' +
          (filtered.length ? filtered.map(function (s) {
            var tags = Array.isArray(s.tags) && s.tags.length ? ' · ' + s.tags.join(' / ') : '';
            return '<div class="ios-row">' +
              '<span style="font-size:22px">' + flagOf(s.name) + '</span>' +
              '<div style="flex:1;min-width:0">' +
                '<div style="font-size:14.5px;font-weight:600">' + esc(s.name) + '</div>' +
                '<div class="sl-muted" style="font-size:12px">' + esc(String(s.type || '').toUpperCase()) + ' · ' + esc(s.rate || '1.0') + 'x 倍率' + esc(tags) + '</div>' +
              '</div>' +
              '<span class="ios-pill ' + (s.is_online ? 'ios-pill-green' : 'ios-pill-red') + '">' + (s.is_online ? '● 在线' : '● 离线') + '</span>' +
            '</div>';
          }).join('') : '<div class="ios-row no-inset"><span class="sl-muted">暂无匹配的节点（未订阅或订阅已过期时节点列表为空）</span></div>') +
        '</div>' +
      '</div>'
    );
  }

  function renderOrders() {
    var list = Array.isArray(state.orders) ? state.orders : [];
    return (
      '<div style="display:grid;gap:16px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<h2 style="margin:0;font-size:22px;font-weight:700">我的订单</h2>' +
          '<a href="#/profile" class="ios-btn ios-btn-gray ios-btn-sm">返回</a>' +
        '</div>' +
        '<div class="ios-group">' +
          (list.length ? list.map(function (o) {
            var st = ORDER_STATUS[o.status] || ['未知', 'ios-pill-gray'];
            return '<div class="ios-row ios-row-clickable no-inset" data-order="' + esc(o.trade_no) + '">' +
              '<div style="flex:1;min-width:0">' +
                '<div style="font-size:14.5px;font-weight:600">' + esc((o.plan && o.plan.name) || '订阅订单') + '</div>' +
                '<div class="sl-muted" style="font-size:12px">' + esc(o.trade_no) + ' · ' + fmtDate(o.created_at, true) + '</div>' +
              '</div>' +
              '<div style="text-align:right;margin-right:4px">' +
                '<div class="sl-tabular" style="font-size:14.5px;font-weight:700">' + money(o.total_amount) + '</div>' +
                '<span class="ios-pill ' + st[1] + '" style="margin-top:2px">' + st[0] + '</span>' +
              '</div>' +
              '<span class="sl-faint">›</span>' +
            '</div>';
          }).join('') : '<div class="ios-row no-inset"><span class="sl-muted">暂无历史订单</span></div>') +
        '</div>' +
      '</div>'
    );
  }

  function renderTickets() {
    var list = Array.isArray(state.tickets) ? state.tickets : [];
    return (
      '<div style="display:grid;gap:16px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<div><h2 style="margin:0;font-size:22px;font-weight:700">我的工单</h2><div class="sl-muted" style="font-size:13px">技术支持与三网优化线路定制</div></div>' +
          '<button type="button" id="sl-new-ticket" class="ios-btn ios-btn-primary ios-btn-sm">＋ 新建工单</button>' +
        '</div>' +
        '<div class="ios-group">' +
          (list.length ? list.map(function (t) {
            var closed = Number(t.status) === 1;
            var replied = Number(t.reply_status) === 1;
            return '<div class="ios-row ios-row-clickable no-inset" data-ticket="' + esc(t.id) + '">' +
              '<div style="flex:1;min-width:0">' +
                '<div style="font-size:14.5px;font-weight:600">' + esc(t.subject) + '</div>' +
                '<div class="sl-muted" style="font-size:12px">更新于 ' + fmtDate(t.updated_at || t.created_at, true) + '</div>' +
              '</div>' +
              '<span class="ios-pill ' + (closed ? 'ios-pill-gray' : (replied ? 'ios-pill-green' : 'ios-pill-orange')) + '">' + (closed ? '已关闭' : (replied ? '已回复' : '待回复')) + '</span>' +
              '<span class="sl-faint">›</span>' +
            '</div>';
          }).join('') : '<div class="ios-row no-inset"><span class="sl-muted">暂无工单记录，点击右上角即可发起咨询</span></div>') +
        '</div>' +
      '</div>'
    );
  }

  function renderInvite() {
    var inv = state.invite || {};
    var stat = Array.isArray(inv.stat) ? inv.stat : [0, 0, 0, 10, 0];
    var codes = Array.isArray(inv.codes) ? inv.codes : [];
    var details = Array.isArray(state.inviteDetails) ? state.inviteDetails : [];
    var cfg = state.userConfig || {};
    var origin = location.origin || '';

    return (
      '<div style="display:grid;gap:18px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<h2 style="margin:0;font-size:22px;font-weight:700">我的邀请与佣金</h2>' +
          '<button type="button" id="sl-gen-invite" class="ios-btn ios-btn-primary ios-btn-sm">＋ 生成邀请码</button>' +
        '</div>' +
        '<div class="sl-grid-3">' +
          '<div class="ios-card ios-card-pad"><div class="sl-muted" style="font-size:12.5px">可用佣金</div><div class="sl-tabular" style="font-size:26px;font-weight:700;color:var(--ios-accent);margin-top:4px">' + money(stat[4]) + '</div><div style="display:flex;gap:8px;margin-top:12px"><button type="button" id="sl-transfer-btn" class="ios-btn ios-btn-tinted ios-btn-sm">划转余额</button>' + (!cfg.withdraw_close ? '<button type="button" id="sl-withdraw-btn" class="ios-btn ios-btn-gray ios-btn-sm">申请提现</button>' : '') + '</div></div>' +
          '<div class="ios-card ios-card-pad"><div class="sl-muted" style="font-size:12.5px">已邀注册人数</div><div class="sl-tabular" style="font-size:26px;font-weight:700;margin-top:4px">' + stat[0] + ' 人</div><div class="sl-muted" style="font-size:12px;margin-top:12px">当前返佣比例 ' + stat[3] + '%</div></div>' +
          '<div class="ios-card ios-card-pad"><div class="sl-muted" style="font-size:12.5px">累计有效佣金</div><div class="sl-tabular" style="font-size:26px;font-weight:700;color:var(--ios-green);margin-top:4px">' + money(stat[1]) + '</div><div class="sl-muted" style="font-size:12px;margin-top:12px">确认中：' + money(stat[2]) + '</div></div>' +
        '</div>' +
        '<div><div class="ios-section-title">专属邀请码（点击复制邀请链接）</div><div class="ios-group">' +
          (codes.length ? codes.map(function (c) {
            var link = origin + '/?code=' + encodeURIComponent(c.code) + '#/register?code=' + encodeURIComponent(c.code);
            return '<div class="ios-row ios-row-clickable no-inset" data-copy="' + esc(link) + '">' +
              '<div style="flex:1"><strong class="sl-tabular" style="font-size:15px">' + esc(c.code) + '</strong><div class="sl-muted" style="font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(link) + '</div></div>' +
              '<span class="ios-btn ios-btn-tinted ios-btn-sm">复制链接</span>' +
            '</div>';
          }).join('') : '<div class="ios-row no-inset"><span class="sl-muted">暂无邀请码，请点击右上角生成</span></div>') +
        '</div></div>' +
        (details.length ? '<div><div class="ios-section-title">返佣明细</div><div class="ios-group">' +
          details.map(function (d) {
            return '<div class="ios-row no-inset"><div style="flex:1"><div style="font-size:14px;font-weight:600">订单 #' + esc(d.trade_no || d.id) + '</div><div class="sl-muted" style="font-size:12px">' + fmtDate(d.created_at, true) + '</div></div><strong class="sl-tabular" style="color:var(--ios-green)">+' + money(d.get_amount) + '</strong></div>';
          }).join('') +
        '</div></div>' : '') +
      '</div>'
    );
  }

  function renderTraffic() {
    var list = Array.isArray(state.trafficLogs) ? state.trafficLogs : [];
    return (
      '<div style="display:grid;gap:16px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<h2 style="margin:0;font-size:22px;font-weight:700">本月流量明细</h2>' +
          '<a href="#/dashboard" class="ios-btn ios-btn-gray ios-btn-sm">返回</a>' +
        '</div>' +
        '<div class="ios-group">' +
          (list.length ? list.map(function (l) {
            var totalDay = (Number(l.u) || 0) + (Number(l.d) || 0);
            return '<div class="ios-row no-inset">' +
              '<div style="flex:1"><div style="font-size:14px;font-weight:600">' + fmtDate(l.record_at, false) + '</div><div class="sl-muted" style="font-size:12px">↑ ' + gb(l.u) + ' · ↓ ' + gb(l.d) + ' · 倍率 ' + esc(l.server_rate || 1) + 'x</div></div>' +
              '<strong class="sl-tabular">' + gb(totalDay) + '</strong>' +
            '</div>';
          }).join('') : '<div class="ios-row no-inset"><span class="sl-muted">本月暂无流量消耗记录</span></div>') +
        '</div>' +
      '</div>'
    );
  }

  function renderKnowledge() {
    var groups = state.knowledge && typeof state.knowledge === 'object' ? state.knowledge : {};
    var q = state.knowledgeSearch.trim().toLowerCase();
    var cats = Object.keys(groups);
    return (
      '<div style="display:grid;gap:16px">' +
        '<div><h2 style="margin:0;font-size:22px;font-weight:700">使用文档</h2><div class="sl-muted" style="font-size:13px">客户端下载、导入步骤与常见问题</div></div>' +
        '<input id="sl-kb-search" class="ios-field-box" placeholder="搜索文档关键字..." value="' + esc(state.knowledgeSearch) + '" />' +
        (cats.length ? cats.map(function (cat) {
          var items = (groups[cat] || []).filter(function (a) {
            return !q || String(a.title || '').toLowerCase().indexOf(q) !== -1;
          });
          if (!items.length) return '';
          return '<div><div class="ios-section-title">' + esc(cat) + '</div><div class="ios-group">' +
            items.map(function (a) {
              return '<div class="ios-row ios-row-clickable no-inset" data-kb-id="' + esc(a.id) + '">' +
                '<div style="flex:1"><div style="font-size:14.5px;font-weight:600">' + esc(a.title) + '</div><div class="sl-muted" style="font-size:12px">更新于 ' + fmtDate(a.updated_at, false) + '</div></div>' +
                '<span class="sl-faint">›</span>' +
              '</div>';
            }).join('') +
          '</div></div>';
        }).join('') : '<div class="ios-card ios-card-pad sl-muted" style="text-align:center">暂无使用文档</div>') +
      '</div>'
    );
  }

  function renderProfile() {
    var info = state.info || {};
    var isDark = document.documentElement.getAttribute('data-sl-theme') === 'dark';
    var accent = document.documentElement.getAttribute('data-sl-accent') || 'blue';
    var sessions = Array.isArray(state.sessions) ? state.sessions : [];

    return (
      '<div style="display:grid;gap:18px">' +
        // Account Header Card
        '<div class="ios-card ios-card-pad" style="display:flex;align-items:center;gap:14px">' +
          '<div style="width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,var(--ios-accent),var(--ios-purple));color:#fff;display:grid;place-items:center;font-size:20px;font-weight:700;flex:none">' + esc((info.email || 'S').charAt(0).toUpperCase()) + '</div>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-size:17px;font-weight:700;overflow:hidden;text-overflow:ellipsis">' + esc(info.email || '已登录用户') + '</div>' +
            '<div class="sl-muted sl-tabular" style="font-size:12.5px;margin-top:2px">账户余额 ' + money(info.balance) + ' · 佣金 ' + money(info.commission_balance) + '</div>' +
          '</div>' +
          '<button type="button" id="sl-gift-btn" class="ios-btn ios-btn-tinted ios-btn-sm">礼品卡兑换</button>' +
        '</div>' +

        // Navigation Group
        '<div><div class="ios-section-title">常用功能</div><div class="ios-group">' +
          '<div class="ios-row ios-row-clickable" data-nav="order"><div class="ios-badge-icon" style="background:var(--ios-accent)">🧾</div><span style="flex:1;font-size:14.5px;font-weight:500">我的订单</span><span class="sl-faint">›</span></div>' +
          '<div class="ios-row ios-row-clickable" data-nav="invite"><div class="ios-badge-icon" style="background:var(--ios-green)">🎁</div><span style="flex:1;font-size:14.5px;font-weight:500">邀请返佣与提现</span><span class="sl-faint">›</span></div>' +
          '<div class="ios-row ios-row-clickable" data-nav="traffic"><div class="ios-badge-icon" style="background:var(--ios-teal)">📊</div><span style="flex:1;font-size:14.5px;font-weight:500">本月流量明细</span><span class="sl-faint">›</span></div>' +
          '<div class="ios-row ios-row-clickable" data-nav="knowledge"><div class="ios-badge-icon" style="background:var(--ios-indigo)">📖</div><span style="flex:1;font-size:14.5px;font-weight:500">使用文档与教程</span><span class="sl-faint">›</span></div>' +
        '</div></div>' +

        // Appearance Group
        '<div><div class="ios-section-title">外观与提醒</div><div class="ios-group">' +
          '<div class="ios-row">' +
            '<div class="ios-badge-icon" style="background:#1c1c1e">' + (isDark ? '🌙' : '☀️') + '</div>' +
            '<div style="flex:1"><div style="font-size:14.5px;font-weight:500">深色模式</div><div class="sl-muted" style="font-size:12px">随 iOS 质感自动/手动切换</div></div>' +
            '<button type="button" id="sl-dark-switch" class="ios-switch ' + (isDark ? 'is-on' : '') + '" aria-label="切换深色模式"></button>' +
          '</div>' +
          '<div class="ios-row">' +
            '<div class="ios-badge-icon" style="background:var(--ios-accent)">🎨</div>' +
            '<div style="flex:1;font-size:14.5px;font-weight:500">主题强调色</div>' +
            '<div style="display:flex;gap:8px">' +
              ['blue', 'indigo', 'teal', 'purple'].map(function (c) {
                var colorMap = { blue: '#007aff', indigo: '#5856d6', teal: '#0099b8', purple: '#af52de' };
                return '<button type="button" data-pick-accent="' + c + '" style="width:22px;height:22px;border-radius:50%;border:2px solid ' + (accent === c ? 'var(--ios-text)' : 'transparent') + ';background:' + colorMap[c] + ';cursor:pointer"></button>';
              }).join('') +
            '</div>' +
          '</div>' +
          '<div class="ios-row">' +
            '<div class="ios-badge-icon" style="background:var(--ios-orange)">🔔</div>' +
            '<div style="flex:1"><div style="font-size:14.5px;font-weight:500">到期邮件提醒</div></div>' +
            '<button type="button" data-pref="remind_expire" class="ios-switch ' + (info.remind_expire ? 'is-on' : '') + '"></button>' +
          '</div>' +
          '<div class="ios-row">' +
            '<div class="ios-badge-icon" style="background:var(--ios-orange)">📶</div>' +
            '<div style="flex:1"><div style="font-size:14.5px;font-weight:500">流量耗尽邮件提醒</div></div>' +
            '<button type="button" data-pref="remind_traffic" class="ios-switch ' + (info.remind_traffic ? 'is-on' : '') + '"></button>' +
          '</div>' +
        '</div></div>' +

        // Security Group
        '<div><div class="ios-section-title">安全与账号</div><div class="ios-group">' +
          '<div class="ios-row ios-row-clickable" id="sl-pwd-btn"><div class="ios-badge-icon" style="background:var(--ios-indigo)">🔑</div><span style="flex:1;font-size:14.5px;font-weight:500">修改登录密码</span><span class="sl-faint">›</span></div>' +
          '<div class="ios-row ios-row-clickable" id="sl-reset-sub"><div class="ios-badge-icon" style="background:var(--ios-red)">🔄</div><div style="flex:1"><div style="font-size:14.5px;font-weight:500">重置订阅链接与 UUID</div><div class="sl-muted" style="font-size:12px">订阅链接泄露时使用</div></div><span class="sl-faint">›</span></div>' +
          '<div class="ios-row ios-row-clickable" id="sl-logout-btn"><div class="ios-badge-icon" style="background:var(--ios-red)">🚪</div><span style="flex:1;font-size:14.5px;font-weight:600;color:var(--ios-red)">退出登录</span></div>' +
        '</div></div>' +

        (sessions.length ? '<div><div class="ios-section-title">当前活跃会话 (' + sessions.length + ')</div><div class="ios-group">' +
          sessions.slice(0, 5).map(function (sess) {
            return '<div class="ios-row no-inset"><div style="flex:1"><div style="font-size:13.5px;font-weight:600">登录设备 #' + esc(sess.id) + '</div><div class="sl-muted" style="font-size:11.5px">最近使用 ' + esc(sess.last_used_at || sess.created_at || '-') + '</div></div></div>';
          }).join('') +
        '</div></div>' : '') +
      '</div>'
    );
  }

  /* -------------------- Shell & Liquid Glass Draggable Dock -------------------- */
  function pageTitle(route) {
    var map = {
      dashboard: '星屿',
      plan: '订阅商店',
      node: '节点状态',
      order: '我的订单',
      ticket: '我的工单',
      invite: '我的邀请',
      traffic: '流量明细',
      knowledge: '使用文档',
      profile: '我的'
    };
    return map[route] || siteTitle();
  }

  function renderShell(mainHtml) {
    var r = state.route;
    var activeDock = activeDockKey(r);
    var activeIdx = Math.max(0, DOCK_TABS.findIndex(function (t) { return t.key === activeDock; }));
    var isDark = document.documentElement.getAttribute('data-sl-theme') === 'dark';
    var email = (state.info && state.info.email) || (state.sub && state.sub.email) || '控制台';
    var bal = state.info ? money(state.info.balance) : '';
    var onlineNodes = Array.isArray(state.servers) ? state.servers.filter(function (s) { return s.is_online; }).length : null;

    var navItem = function (key, label, icon, badge) {
      return '<button type="button" class="sl-nav-item ' + (r === key ? 'is-active' : '') + '" data-nav="' + key + '">' +
        ICONS[icon] + '<span>' + label + '</span>' +
        (badge != null ? '<span class="ios-pill ios-pill-green" style="margin-left:auto;font-size:11px">' + badge + '</span>' : '') +
      '</button>';
    };

    return (
      '<div class="sl-shell">' +
        '<aside class="sl-sidebar">' +
          '<div>' +
            '<a class="sl-brand" href="#/dashboard"><span class="sl-brand-mark">✦</span><span>' + esc(siteTitle()) + '</span></a>' +
            '<div class="sl-nav-group">概览</div>' +
            navItem('dashboard', '仪表盘', 'home') +
            navItem('knowledge', '使用文档', 'book') +
            '<div class="sl-nav-group">订阅与节点</div>' +
            navItem('plan', '购买订阅', 'bag') +
            navItem('node', '节点状态', 'globe', onlineNodes != null ? onlineNodes + ' 在线' : null) +
            navItem('order', '我的订单', 'receipt') +
            '<div class="sl-nav-group">账户与支持</div>' +
            navItem('invite', '我的邀请', 'gift') +
            navItem('ticket', '我的工单', 'chat') +
            navItem('traffic', '流量明细', 'activity') +
          '</div>' +
          '<div class="ios-card ios-row-clickable" data-nav="profile" style="padding:10px 12px;display:flex;align-items:center;gap:10px;cursor:pointer;margin-top:16px">' +
            '<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--ios-accent),var(--ios-purple));color:#fff;display:grid;place-items:center;font-size:13px;font-weight:700;flex:none">' + esc(email.charAt(0).toUpperCase()) + '</div>' +
            '<div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(email) + '</div>' +
            (bal ? '<div class="sl-muted sl-tabular" style="font-size:11px">余额 ' + bal + '</div>' : '') + '</div>' +
            '<span class="sl-faint">›</span>' +
          '</div>' +
        '</aside>' +

        '<div class="sl-main">' +
          '<header class="sl-topbar">' +
            '<strong style="font-size:15.5px">' + esc(pageTitle(r)) + '</strong>' +
            '<div style="display:flex;align-items:center;gap:8px">' +
              '<button type="button" id="sl-top-theme" class="ios-btn ios-btn-gray ios-btn-sm" title="切换深浅模式">' + (isDark ? '🌙 深色' : '☀️ 浅色') + '</button>' +
              (state.notices.length ? '<button type="button" data-action="open-notice" class="ios-btn ios-btn-gray ios-btn-sm">🔔 公告</button>' : '') +
              '<button type="button" data-action="open-sub-sheet" class="ios-btn ios-btn-primary ios-btn-sm">一键导入订阅</button>' +
            '</div>' +
          '</header>' +

          '<div class="sl-mobile-header">' +
            '<h1 class="sl-mobile-title">' + esc(pageTitle(r)) + '</h1>' +
            '<div style="display:flex;align-items:center;gap:8px">' +
              '<button type="button" id="sl-mob-theme" class="ios-btn ios-btn-gray ios-btn-sm" aria-label="切换模式">' + (isDark ? '🌙' : '☀️') + '</button>' +
              '<button type="button" data-nav="profile" style="width:34px;height:34px;border-radius:50%;border:0;background:linear-gradient(135deg,var(--ios-accent),var(--ios-purple));color:#fff;font-weight:700;font-size:13px;cursor:pointer">' + esc(email.charAt(0).toUpperCase()) + '</button>' +
            '</div>' +
          '</div>' +

          '<main class="sl-content">' + mainHtml + '</main>' +
        '</div>' +

        // iOS 26 Floating Draggable Liquid Glass Capsule Dock (Mobile)
        '<div class="sl-dock-fade" aria-hidden="true"></div>' +
        '<div class="sl-dock-wrap">' +
          '<nav id="sl-liquid-dock" class="liquid-dock" data-active="' + activeIdx + '" aria-label="底部导航">' +
            '<div class="liquid-lens"></div>' +
            DOCK_TABS.map(function (t, i) {
              return '<div class="liquid-tab ' + (i === activeIdx ? 'is-active' : '') + '" data-index="' + i + '" data-route="' + t.key + '">' +
                ICONS[t.icon] + '<span>' + t.label + '</span>' +
              '</div>';
            }).join('') +
          '</nav>' +
        '</div>' +
      '</div>'
    );
  }

  function initLiquidDock() {
    var dock = document.getElementById('sl-liquid-dock');
    if (!dock) return;
    var lens = dock.querySelector('.liquid-lens');
    var tabs = Array.from(dock.querySelectorAll('.liquid-tab'));
    var activeIdx = Number(dock.dataset.active || 0);
    var dragging = false;

    function slotWidth() {
      var inner = dock.clientWidth - 8;
      return inner > 0 ? inner / tabs.length : 60;
    }

    function setVisual(x, scale, previewIdx) {
      var w = slotWidth();
      lens.style.width = w + 'px';
      lens.style.transform = 'translate3d(' + x + 'px, 0, 0) scale(' + scale + ')';
      tabs.forEach(function (t, i) { t.classList.toggle('is-active', i === previewIdx); });
    }

    function snapTo(idx, shouldNav) {
      activeIdx = Math.max(0, Math.min(tabs.length - 1, idx));
      dock.dataset.active = activeIdx;
      setVisual(activeIdx * slotWidth(), 1, activeIdx);
      if (shouldNav) {
        var target = tabs[activeIdx] && tabs[activeIdx].dataset.route;
        if (target && target !== state.route) navigate(target);
      }
    }

    function locate(clientX) {
      var rect = dock.getBoundingClientRect();
      var w = slotWidth();
      var rel = clientX - rect.left - 4;
      var maxX = (tabs.length - 1) * w;
      var clampedCenter = Math.max(w / 2, Math.min(rect.width - 8 - w / 2, rel));
      var idx = Math.max(0, Math.min(tabs.length - 1, Math.floor(rel / w)));
      var rawX = Math.max(-4, Math.min(maxX + 4, clampedCenter - w / 2));
      return { idx: idx, rawX: rawX };
    }

    dock.addEventListener('pointerdown', function (e) {
      dragging = true;
      dock.classList.add('is-dragging');
      if (dock.setPointerCapture) dock.setPointerCapture(e.pointerId);
      var pos = locate(e.clientX);
      setVisual(pos.rawX, 1.08, pos.idx);
    });

    dock.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var pos = locate(e.clientX);
      setVisual(pos.rawX, 1.08, pos.idx);
    });

    function finish(e) {
      if (!dragging) return;
      dragging = false;
      dock.classList.remove('is-dragging');
      var pos = locate(e.clientX);
      snapTo(pos.idx, true);
    }

    dock.addEventListener('pointerup', finish);
    dock.addEventListener('pointercancel', finish);
    window.addEventListener('resize', function () { snapTo(activeIdx, false); });
    requestAnimationFrame(function () { snapTo(activeIdx, false); });
  }

  /* -------------------- Render & Event Binding -------------------- */
  function render() {
    var root = document.getElementById('app');
    if (!root) return;
    document.body.classList.add('sl-ios-body');

    if (isAuthRoute(state.route)) {
      root.innerHTML = renderAuth(state.route);
      bindAuthEvents();
      return;
    }

    var bodyHtml = '';
    if (state.loadingRoute) {
      bodyHtml = '<div class="ios-card ios-card-pad sl-muted" style="text-align:center;padding:44px">正在加载...</div>';
    } else if (state.route === 'dashboard') bodyHtml = renderDashboard();
    else if (state.route === 'plan') bodyHtml = renderPlans();
    else if (state.route === 'node') bodyHtml = renderNodes();
    else if (state.route === 'order') bodyHtml = renderOrders();
    else if (state.route === 'ticket') bodyHtml = renderTickets();
    else if (state.route === 'invite') bodyHtml = renderInvite();
    else if (state.route === 'traffic') bodyHtml = renderTraffic();
    else if (state.route === 'knowledge') bodyHtml = renderKnowledge();
    else if (state.route === 'profile') bodyHtml = renderProfile();
    else bodyHtml = renderDashboard();

    root.innerHTML = renderShell(bodyHtml);
    initLiquidDock();
    bindShellEvents();
  }

  function bindAuthEvents() {
    document.querySelectorAll('[data-auth-nav]').forEach(function (b) {
      b.addEventListener('click', function () { navigate(b.getAttribute('data-auth-nav')); });
    });
    var themeBtn = document.getElementById('sl-auth-theme');
    if (themeBtn) themeBtn.addEventListener('click', toggleDarkMode);

    var sendBtn = document.getElementById('sl-send-code');
    if (sendBtn) {
      sendBtn.addEventListener('click', function () {
        var email = document.getElementById('sl-auth-email').value.trim();
        if (!email) { toast('请先输入邮箱地址', true); return; }
        sendBtn.disabled = true;
        api('passport/comm/sendEmailVerify', { method: 'POST', noAuth: true, body: { email: email } }).then(function () {
          toast('验证码已发送，请查收邮件');
          var sec = 60;
          var iv = setInterval(function () {
            sec--;
            if (sec <= 0) { clearInterval(iv); sendBtn.disabled = false; sendBtn.textContent = '发送'; }
            else sendBtn.textContent = sec + 's';
          }, 1000);
        }).catch(function (e) {
          sendBtn.disabled = false;
          toast(e.message, true);
        });
      });
    }

    var form = document.getElementById('sl-auth-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = document.getElementById('sl-auth-email').value.trim();
        var password = document.getElementById('sl-auth-pwd').value;
        var codeEl = document.getElementById('sl-auth-code');
        var invEl = document.getElementById('sl-auth-invite');
        var btn = document.getElementById('sl-auth-submit');
        btn.disabled = true;

        var endpoint = 'passport/auth/login';
        var payload = { email: email, password: password };
        if (state.route === 'register') {
          endpoint = 'passport/auth/register';
          if (codeEl) payload.email_code = codeEl.value.trim();
          if (invEl && invEl.value.trim()) payload.invite_code = invEl.value.trim();
        } else if (state.route === 'reset-password') {
          endpoint = 'passport/auth/forget';
          payload.email_code = codeEl ? codeEl.value.trim() : '';
        }

        api(endpoint, { method: 'POST', noAuth: true, body: payload }).then(function (r) {
          if (state.route === 'reset-password') {
            toast('密码已重置，请登录');
            navigate('login');
            return;
          }
          var authData = r.data && r.data.auth_data;
          if (!authData) throw new Error('登录响应异常');
          setToken(authData);
          toast('欢迎回来');
          navigate('dashboard');
        }).catch(function (err) {
          btn.disabled = false;
          toast(err.message, true);
        });
      });
    }
  }

  function bindShellEvents() {
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      el.addEventListener('click', function () {
        navigate(el.getAttribute('data-nav'), el.getAttribute('data-param') || undefined);
      });
    });

    var topTheme = document.getElementById('sl-top-theme');
    if (topTheme) topTheme.addEventListener('click', toggleDarkMode);
    var mobTheme = document.getElementById('sl-mob-theme');
    if (mobTheme) mobTheme.addEventListener('click', toggleDarkMode);

    document.querySelectorAll('[data-action="open-sub-sheet"]').forEach(function (el) {
      el.addEventListener('click', openSubscribeSheet);
    });
    document.querySelectorAll('[data-action="export-yaml"]').forEach(function (el) {
      el.addEventListener('click', exportClashConfig);
    });
    document.querySelectorAll('[data-action="copy-sub"]').forEach(function (el) {
      el.addEventListener('click', function () {
        copyText(state.sub && state.sub.subscribe_url, '订阅链接已复制');
      });
    });
    document.querySelectorAll('[data-action="open-notice"]').forEach(function (el) {
      el.addEventListener('click', function () { openNoticeSheet(0); });
    });
    document.querySelectorAll('[data-copy]').forEach(function (el) {
      el.addEventListener('click', function () { copyText(el.getAttribute('data-copy')); });
    });

    // Plans
    document.querySelectorAll('[data-plan-filter]').forEach(function (b) {
      b.addEventListener('click', function () { state.planFilter = b.getAttribute('data-plan-filter'); render(); });
    });
    document.querySelectorAll('[data-buy-plan]').forEach(function (b) {
      b.addEventListener('click', function () {
        var pid = Number(b.getAttribute('data-buy-plan'));
        var p = (state.plans || []).find(function (x) { return Number(x.id) === pid; });
        if (p) openPlanCheckoutSheet(p);
      });
    });

    // Nodes
    document.querySelectorAll('[data-node-filter]').forEach(function (b) {
      b.addEventListener('click', function () { state.nodeFilter = b.getAttribute('data-node-filter'); render(); });
    });
    var nodeSearch = document.getElementById('sl-node-search');
    if (nodeSearch) {
      nodeSearch.addEventListener('input', function () {
        state.nodeSearch = nodeSearch.value;
        render();
        var el = document.getElementById('sl-node-search');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      });
    }

    // Orders
    document.querySelectorAll('[data-order]').forEach(function (el) {
      el.addEventListener('click', function () { openOrderDetailSheet(el.getAttribute('data-order')); });
    });

    // Tickets
    var newTk = document.getElementById('sl-new-ticket');
    if (newTk) newTk.addEventListener('click', openNewTicketSheet);
    document.querySelectorAll('[data-ticket]').forEach(function (el) {
      el.addEventListener('click', function () { openTicketChatSheet(el.getAttribute('data-ticket')); });
    });

    // Invite
    var genInv = document.getElementById('sl-gen-invite');
    if (genInv) {
      genInv.addEventListener('click', function () {
        api('user/invite/save').then(function () {
          toast('邀请码已生成');
          loadRouteData('invite').then(render);
        }).catch(function (e) { toast(e.message, true); });
      });
    }
    var trBtn = document.getElementById('sl-transfer-btn');
    if (trBtn) {
      trBtn.addEventListener('click', function () {
        openSheet('划转佣金到余额', '<div style="display:grid;gap:12px"><input id="sl-tr-amt" type="number" step="0.01" class="ios-field-box" placeholder="输入划转金额（元）" /><button type="button" id="sl-tr-ok" class="ios-btn ios-btn-primary ios-btn-block">确认划转</button></div>', function (root) {
          root.querySelector('#sl-tr-ok').addEventListener('click', function () {
            var yuanVal = Number(root.querySelector('#sl-tr-amt').value);
            if (!yuanVal || yuanVal <= 0) { toast('请输入有效金额', true); return; }
            api('user/transfer', { method: 'POST', body: { transfer_amount: Math.round(yuanVal * 100) } }).then(function () {
              toast('划转成功');
              state.info = null;
              closeSheet();
              loadRouteData('invite').then(render);
            }).catch(function (e) { toast(e.message, true); });
          });
        });
      });
    }
    var wdBtn = document.getElementById('sl-withdraw-btn');
    if (wdBtn) {
      wdBtn.addEventListener('click', function () {
        var methods = (state.userConfig && state.userConfig.withdraw_methods) || ['支付宝'];
        openSheet('申请佣金提现',
          '<div style="display:grid;gap:12px">' +
            '<select id="sl-wd-method" class="ios-field-box">' + methods.map(function (m) { return '<option value="' + esc(m) + '">' + esc(m) + '</option>'; }).join('') + '</select>' +
            '<input id="sl-wd-acc" class="ios-field-box" placeholder="输入提现收款账号" />' +
            '<button type="button" id="sl-wd-ok" class="ios-btn ios-btn-primary ios-btn-block">提交提现工单</button>' +
          '</div>',
          function (root) {
            root.querySelector('#sl-wd-ok').addEventListener('click', function () {
              var m = root.querySelector('#sl-wd-method').value;
              var acc = root.querySelector('#sl-wd-acc').value.trim();
              if (!acc) { toast('请输入收款账号', true); return; }
              api('user/ticket/withdraw', { method: 'POST', body: { withdraw_method: m, withdraw_account: acc } }).then(function () {
                toast('提现申请已提交');
                closeSheet();
              }).catch(function (e) { toast(e.message, true); });
            });
          });
      });
    }

    // Knowledge
    var kbSearch = document.getElementById('sl-kb-search');
    if (kbSearch) {
      kbSearch.addEventListener('input', function () {
        state.knowledgeSearch = kbSearch.value;
        render();
        var el = document.getElementById('sl-kb-search');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      });
    }
    document.querySelectorAll('[data-kb-id]').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = Number(el.getAttribute('data-kb-id'));
        var groups = state.knowledge || {};
        var found = null;
        Object.keys(groups).some(function (k) {
          found = (groups[k] || []).find(function (a) { return Number(a.id) === id; });
          return !!found;
        });
        if (found) openKnowledgeSheet(found);
      });
    });

    // Profile
    var giftBtn = document.getElementById('sl-gift-btn');
    if (giftBtn) giftBtn.addEventListener('click', openGiftCardSheet);
    var darkSw = document.getElementById('sl-dark-switch');
    if (darkSw) darkSw.addEventListener('click', toggleDarkMode);
    document.querySelectorAll('[data-pick-accent]').forEach(function (b) {
      b.addEventListener('click', function () { setAccent(b.getAttribute('data-pick-accent')); });
    });
    document.querySelectorAll('[data-pref]').forEach(function (sw) {
      sw.addEventListener('click', function () {
        var key = sw.getAttribute('data-pref');
        var next = sw.classList.contains('is-on') ? 0 : 1;
        var body = {};
        body[key] = next;
        api('user/update', { method: 'POST', body: body }).then(function () {
          if (state.info) state.info[key] = next;
          toast('设置已保存');
          render();
        }).catch(function (e) { toast(e.message, true); });
      });
    });
    var pwdBtn = document.getElementById('sl-pwd-btn');
    if (pwdBtn) pwdBtn.addEventListener('click', openPasswordSheet);
    var resetBtn = document.getElementById('sl-reset-sub');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        openSheet('重置订阅安全信息',
          '<p class="sl-muted" style="font-size:13.5px;margin:0 0 16px">重置后，原订阅链接和节点 UUID 将立即失效，需要在客户端重新导入新订阅链接。</p>' +
          '<button type="button" id="sl-reset-confirm" class="ios-btn ios-btn-danger ios-btn-block">确认重置订阅链接</button>',
          function (root) {
            root.querySelector('#sl-reset-confirm').addEventListener('click', function () {
              api('user/resetSecurity').then(function (r) {
                if (state.sub && r.data) state.sub.subscribe_url = r.data;
                toast('订阅链接已重置');
                closeSheet();
                render();
              }).catch(function (e) { toast(e.message, true); });
            });
          });
      });
    }
    var logoutBtn = document.getElementById('sl-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        clearToken();
        state.sub = null; state.info = null;
        location.href = '/';
      });
    }
  }

  /* -------------------- Lifecycle -------------------- */
  function onRouteChange() {
    var parsed = parseHash();
    if (parsed.query && parsed.query.code) {
      try { localStorage.setItem(INVITE_KEY, parsed.query.code); } catch (e) {}
      api('passport/comm/pv', { method: 'POST', noAuth: true, body: { invite_code: parsed.query.code } }).catch(function () {});
    }
    if (parsed.route === 'login' && parsed.query && parsed.query.verify) {
      api('passport/auth/token2Login?verify=' + encodeURIComponent(parsed.query.verify), { noAuth: true }).then(function (r) {
        if (r.data && r.data.auth_data) {
          setToken(r.data.auth_data);
          navigate(parsed.query.redirect || 'dashboard');
        }
      }).catch(function (e) { toast(e.message, true); });
      return;
    }

    var token = getToken();
    if (!token && !isAuthRoute(parsed.route)) {
      state.route = 'login';
      state.param = null;
      api('guest/comm/config', { noAuth: true }).then(function (r) { state.guestConfig = r.data; render(); }).catch(render);
      return;
    }
    if (token && isAuthRoute(parsed.route)) {
      navigate('dashboard');
      return;
    }

    state.route = parsed.route;
    state.param = parsed.param;
    syncCookie();

    if (isAuthRoute(state.route)) {
      if (!state.guestConfig) {
        api('guest/comm/config', { noAuth: true }).then(function (r) { state.guestConfig = r.data; render(); }).catch(render);
      } else render();
      return;
    }

    state.loadingRoute = true;
    render();
    loadRouteData(state.route).then(function () {
      state.loadingRoute = false;
      render();
      if (state.route === 'plan' && state.param) {
        var target = (state.plans || []).find(function (p) { return String(p.id) === String(state.param); });
        if (target) openPlanCheckoutSheet(target);
      } else if (state.route === 'order' && state.param) {
        openOrderDetailSheet(state.param);
      }
    }).catch(function (e) {
      state.loadingRoute = false;
      render();
      toast(e.message, true);
    });
  }

  function boot() {
    applyAppearance();
    try {
      var sp = new URLSearchParams(location.search);
      var code = sp.get('code');
      if (code) localStorage.setItem(INVITE_KEY, code);
    } catch (e) {}
    syncCookie();
    window.addEventListener('hashchange', onRouteChange);
    setInterval(syncCookie, 5000);
    onRouteChange();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
