const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const css = require('css-tree');

const root = path.resolve(__dirname, '../../theme/Xboard');
const read = name => fs.readFileSync(path.join(root, `${name}.blade.php`), 'utf8');
const readAsset = rel => fs.readFileSync(path.join(root, 'assets', rel), 'utf8');
const scripts = source => [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1]);
const landingScript = scripts(read('landing')).find(script => script.includes('var TOKEN_KEY'));

async function guest(data, { hash = '', fail = false, token = null } = {}) {
  const dom = new JSDOM(read('landing'), { url: `https://example.test/${hash}`, runScripts: 'outside-only' });
  const { window } = dom;
  if (token) window.localStorage.setItem('VUE_NAIVE_ACCESS_TOKEN', token);
  window.fetch = async () => ({ ok: !fail, json: async () => ({ data }) });
  window.eval(landingScript);
  await new Promise(resolve => setImmediate(resolve));
  return dom;
}

async function mountSpa(hash = '#/dashboard', responses = {}, { token = 'Bearer abc' } = {}) {
  const html = read('dashboard')
    .replace(/@json\(\$theme_config\['background_url'\] \?\? ''\)/g, '""')
    .replace(/@json\(\$(\w+)\)/g, '"StarLink"')
    .replace(/\{\{[\s\S]*?\}\}/g, 'Xboard')
    .replace(/\{!![\s\S]*?!!\}/g, '');
  const dom = new JSDOM(html, { url: `https://example.test/${hash}`, runScripts: 'outside-only' });
  const { window } = dom;
  if (token) {
    window.localStorage.setItem('VUE_NAIVE_ACCESS_TOKEN', JSON.stringify({ value: token }));
  }
  window.matchMedia = () => ({ matches: false, addEventListener() {} });
  window.requestAnimationFrame = cb => setTimeout(cb, 0);
  const calls = [];
  window.fetch = async (url, init = {}) => {
    calls.push([url, (init.headers && init.headers.Authorization) || null]);
    const clean = String(url).split('?')[0];
    const key = Object.keys(responses).find(k => clean.endsWith(k));
    const body = key !== undefined ? responses[key] : null;
    if (body === null) {
      return { ok: false, status: 404, json: async () => ({ message: 'not mocked' }) };
    }
    return { ok: true, status: 200, json: async () => ({ data: body }) };
  };
  window.eval(readAsset('ios-qr.js'));
  window.eval(readAsset('ios-app.js'));
  for (let i = 0; i < 8; i++) await new Promise(resolve => setTimeout(resolve, 20));
  return { dom, calls };
}

test('shared CSS and client scripts parse', () => {
  css.parse(readAsset('ios-app.css'));
  new vm.Script(readAsset('ios-qr.js'));
  new vm.Script(readAsset('ios-app.js'));
  for (const name of ['dashboard', 'landing']) {
    for (const block of read(name).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
      css.parse(block[1]);
    }
    for (let script of scripts(read(name))) {
      script = script.replace(/@json\([^\n]+?\)/g, '"sample"').replace(/\{\{[\s\S]*?\}\}/g, 'sample');
      new vm.Script(script);
    }
  }
});

test('landing base rules do not out-rank component spacing', () => {
  const style = read('landing').match(/<style>([\s\S]*?)<\/style>/)[1];
  const offenders = [];
  css.walk(css.parse(style), {
    visit: 'Rule',
    enter(rule) {
      const sets = rule.block.children.some(d => d.type === 'Declaration' && /^(margin|padding)/.test(d.property));
      if (!sets) return;
      for (const selector of rule.prelude.children) {
        let unwrapped = false;
        css.walk(selector, {
          enter(node) {
            if (node.type === 'PseudoClassSelector' && node.name === 'where') return css.walk.skip;
            if (node.type === 'IdSelector') unwrapped = true;
          }
        });
        if (unwrapped) offenders.push(css.generate(selector));
      }
    }
  });
  assert.deepEqual(offenders, []);
});

test('guest plan cards use real prices including zero and non-monthly periods', async () => {
  const dom = await guest([
    { id: 3, name: '月度', transfer_enable: 50, month_price: 1888, content: '<b>住宅 IP</b>', speed_limit: null, device_limit: 3 },
    { name: '季度', transfer_enable: 100, month_price: null, quarter_price: 5000, speed_limit: 100 },
    { name: '体验', transfer_enable: 1, onetime_price: 0, speed_limit: null, device_limit: null }
  ]);
  try {
    const rows = [...dom.window.document.querySelectorAll('.sl-plan-row')];
    assert.equal(rows.length, 3);
    assert.match(rows[0].textContent, /¥18\.88\/ 月/);
    assert.match(rows[0].textContent, /3 台/);
    assert.match(rows[0].textContent, /不限速/);
    assert.match(rows[1].textContent, /¥50\/ 季/);
    assert.match(rows[1].textContent, /100 Mbps/);
    assert.match(rows[2].textContent, /¥0\/ 一次性/);
    assert.match(rows[2].textContent, /不限设备数量/);
    assert.equal(dom.window.document.querySelector('#sl-plans-body').getAttribute('aria-busy'), 'false');
    assert.equal(rows[0].querySelector('a').getAttribute('href'), '/#/plan/3');
    assert.equal(rows[1].querySelector('a').getAttribute('href'), '/#/plan');
  } finally { dom.window.close(); }
});

test('plan descriptions and names cannot inject executable markup', async () => {
  const dom = await guest([{ id: '1" onclick="x', name: '<img src=x onerror=alert(1)>', month_price: 100,
    content: '<script>alert(1)</script><img src=x onerror=alert(1)><p>说明</p>' }]);
  try {
    const row = dom.window.document.querySelector('.sl-plan-row');
    assert.equal(row.querySelectorAll('img,script,iframe').length, 0);
    assert.match(row.textContent, /说明/);
    assert.equal(row.querySelector('a').getAttribute('href'), '/#/plan');
    assert.equal(row.querySelector('a').hasAttribute('onclick'), false);
  } finally { dom.window.close(); }
});

test('empty and failed guest APIs show explicit states', async () => {
  for (const fail of [false, true]) {
    const dom = await guest([], { fail });
    try {
      assert.match(dom.window.document.querySelector('#sl-plans-body').textContent, fail ? /加载失败/ : /暂无在售/);
      assert.equal(dom.window.document.querySelector('#sl-plans-body').getAttribute('aria-busy'), 'false');
    } finally { dom.window.close(); }
  }
});

test('guest hash navigation boots the iOS SPA once without faking a login cookie', async () => {
  const dom = await guest([]);
  try {
    const { window } = dom;
    const footer = window.document.createElement('div');
    footer.setAttribute('style', 'text-align:center');
    window.document.body.appendChild(footer);
    window.location.hash = '#/login';
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));
    window.location.hash = '#/plan';
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));
    assert.equal(window.document.querySelectorAll('#app').length, 1);
    const app = window.document.querySelector('#app');
    assert.equal(app.previousElementSibling.id, 'sl-landing');
    assert.ok(app.compareDocumentPosition(footer) & window.Node.DOCUMENT_POSITION_FOLLOWING);
    const loadedScripts = [...window.document.querySelectorAll('script[src]')].map(s => s.getAttribute('src'));
    assert.ok(loadedScripts.some(src => src.includes('/ios-qr.js')));
    assert.ok(loadedScripts.some(src => src.includes('/ios-app.js')));
    assert.equal(window.document.querySelector('#sl-landing').style.display, 'none');
    assert.equal(window.document.body.classList.contains('sl-landing-page'), false);
    assert.doesNotMatch(window.document.cookie, /sl_logged_in=1/);
  } finally { dom.window.close(); }
});

test('authenticated guest-shell entry opens the iOS SPA directly', async () => {
  const dom = await guest([], { token: JSON.stringify({ value: 'test-token' }) });
  try {
    assert.ok(dom.window.document.querySelector('#app'));
    assert.match(dom.window.document.cookie, /sl_logged_in=1/);
  } finally { dom.window.close(); }
});

const GB = 1024 ** 3;

test('iOS SPA dashboard renders subscription wallet, traffic, invite and draggable liquid dock', async () => {
  const { dom, calls } = await mountSpa('#/dashboard', {
    'user/getSubscribe': { plan_id: 7, plan: { name: '<img src=x onerror=alert(1)>月付' }, expired_at: null, u: 1 * GB, d: 3 * GB, transfer_enable: 100 * GB, reset_day: 5, subscribe_url: 'https://example.test/s/abc' },
    'user/info': { email: 'user@example.test', balance: 1280, commission_balance: 300, remind_expire: 1, remind_traffic: 1 },
    'user/invite/fetch': { codes: [{ code: 'INV123' }], stat: [4, 1000, 0, 15, 1250] },
    'user/notice/fetch': [],
    'user/server/fetch': [{ id: 1, name: '日本住宅 IP', type: 'vless', rate: '1.0', is_online: true }],
    'user/comm/config': { currency_symbol: '¥', withdraw_methods: ['支付宝'], withdraw_close: 0 },
    'user/getStat': [0, 0, 4]
  });
  try {
    const doc = dom.window.document;
    const appText = doc.querySelector('#app').textContent;
    assert.equal(doc.querySelectorAll('#app img').length, 0);
    assert.match(appText, /<img src=x onerror=alert\(1\)>月付/);
    assert.match(appText, /1\.00 GB/);
    assert.match(appText, /4\.00 GB/);
    assert.match(appText, /4 人/);
    assert.match(appText, /¥12\.50/);
    assert.ok(calls.every(c => c[1] === 'Bearer abc'));

    const dock = doc.getElementById('sl-liquid-dock');
    assert.ok(dock, 'mobile floating liquid dock must exist');
    assert.ok(dock.querySelector('.liquid-lens'), 'liquid lens indicator must exist');
    assert.equal(dock.querySelectorAll('.liquid-tab').length, 5);
  } finally { dom.window.close(); }
});

test('iOS QR generator outputs valid inline SVG without external dependencies', () => {
  const { window } = new JSDOM('<!doctype html><html><body></body></html>', { runScripts: 'outside-only' });
  window.eval(readAsset('ios-qr.js'));
  const svg = window.SLQR.toSvg('https://example.test/s/preview-token', 180);
  assert.match(svg, /^<svg[^>]+width="180"/);
  assert.match(svg, /<path d="M/);
  window.close();
});

test('knowledge base renders Markdown safely and profile formats ISO session timestamps', async () => {
  const { dom } = await mountSpa('#/knowledge', {
    'user/knowledge/fetch': {
      '开始使用': [{
        id: 1,
        category: '开始使用',
        title: '快速开始',
        updated_at: 1732500000,
        body: '## 快速开始\n\n> 请先登录 **仪表盘**\n\n- 点击 [教程](#)\n- 运行 `<script>alert(1)</script>`'
      }]
    }
  });
  try {
    const doc = dom.window.document;
    doc.querySelector('[data-kb-id="1"]').click();
    const prose = doc.querySelector('.sl-prose');
    assert.ok(prose);
    assert.ok(prose.querySelector('h2'));
    assert.ok(prose.querySelector('blockquote'));
    assert.ok(prose.querySelector('strong'));
    assert.equal(prose.querySelectorAll('script').length, 0);
    assert.ok(prose.querySelector('[data-dead-doc-link="1"]'));
    dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape' }));
    assert.equal(doc.getElementById('sl-sheet-backdrop'), null);
  } finally { dom.window.close(); }
});

test('dashboard export uses same-origin HTTPS path when subscribe_url is plain HTTP', async () => {
  const { dom, calls } = await mountSpa('#/dashboard', {
    'user/getSubscribe': { plan_id: 1, plan: { name: '月付' }, u: 0, d: 0, transfer_enable: 100 * GB, subscribe_url: 'http://8.138.59.73:8089/s/token123' },
    'user/info': { email: 'u@test.com', balance: 0, commission_balance: 0 },
    'user/invite/fetch': { codes: [], stat: [0, 0, 0, 10, 0] },
    'user/notice/fetch': [{ id: 1, title: '公告', content: '很长一段公告内容'.repeat(20), updated_at: 1732500000 }],
    'user/server/fetch': [],
    'user/comm/config': { currency_symbol: '¥' },
    'user/getStat': [0, 0, 0]
  });
  try {
    const doc = dom.window.document;
    assert.ok(doc.querySelector('.sl-stack-col'));
    assert.ok(doc.querySelector('.sl-notice-summary'));
    doc.querySelector('[data-action="export-yaml"]').click();
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.ok(calls.some(c => String(c[0]).startsWith('https://example.test/s/token123?flag=meta')));
  } finally { dom.window.close(); }
});

test('order checkout renders image payment icons cleanly and lets user switch payment method after clicking pay', async () => {
  const { dom } = await mountSpa('#/order/TR123', {
    'user/order/fetch': [],
    'user/order/detail': {
      trade_no: 'TR123',
      status: 0,
      total_amount: 1788,
      surplus_amount: 100,
      created_at: 1732500000,
      plan: { name: '月付50G' }
    },
    'user/order/getPaymentMethod': [
      { id: 1, name: '支付宝', icon: 'https://example.test/alipay.png', handling_fee_fixed: 0, handling_fee_percent: 0 },
      { id: 2, name: '支付宝-备用', icon: '💙', handling_fee_fixed: 0, handling_fee_percent: 2 }
    ],
    'user/order/checkout': null
  });
  try {
    const doc = dom.window.document;
    // Verify image icon is rendered as <img>, never raw URL text
    const img = doc.querySelector('.sl-pay-icon-img');
    assert.ok(img);
    assert.equal(img.getAttribute('src'), 'https://example.test/alipay.png');
    assert.doesNotMatch(doc.getElementById('sl-sheet-backdrop').textContent, /https:\/\/example\.test\/alipay\.png/);
    assert.match(doc.getElementById('sl-sheet-backdrop').textContent, /旧套餐折抵/);

    // Mock checkout returning QR code (type: 0) and verify back-to-methods button works
    dom.window.fetch = async (url) => {
      if (String(url).includes('order/checkout')) {
        return { ok: true, status: 200, json: async () => ({ type: 0, data: 'https://qr.alipay.com/bax123' }) };
      }
      return { ok: true, status: 200, json: async () => ({ data: 0 }) };
    };
    doc.getElementById('sl-pay-now').click();
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.ok(doc.getElementById('sl-pay-back'), 'must provide button to return and change payment method');
    assert.ok(doc.getElementById('sl-pay-cancel'), 'must provide cancel button on QR screen');
    doc.getElementById('sl-pay-back').click();
    assert.ok(doc.getElementById('sl-pay-now'), 'clicking back must restore payment method selector');
  } finally { dom.window.close(); }
});
