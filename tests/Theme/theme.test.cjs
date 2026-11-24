const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const css = require('css-tree');

const root = path.resolve(__dirname, '../../theme/Xboard');
const read = name => fs.readFileSync(path.join(root, `${name}.blade.php`), 'utf8');
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

test('shared CSS and client scripts parse', () => {
  for (const name of ['console', 'console-dashboard', 'dashboard', 'landing']) {
    for (const block of read(name).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
      css.parse(block[1]);
    }
    for (let script of scripts(read(name))) {
      // Blade is rendered by Laravel in production; stand in for its scalar JSON values.
      script = script.replace(/@json\([^\n]+?\)/g, '"sample"').replace(/\{\{[\s\S]*?\}\}/g, 'sample');
      new vm.Script(script);
    }
  }
});

test('landing base rules do not out-rank component spacing', () => {
  // A bare #sl-landing selector beats every .sl-* rule, so a reset or base rule there wipes buttons, cards and headings.
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

test('guest plan table uses real prices including zero and non-monthly periods', async () => {
  const dom = await guest([
    { id: 3, name: '月度', transfer_enable: 50, month_price: 1888, content: '<b>住宅 IP</b>', speed_limit: null, device_limit: 3 },
    { name: '季度', transfer_enable: 100, month_price: null, quarter_price: 5000, speed_limit: 100 },
    { name: '体验', transfer_enable: 1, onetime_price: 0, speed_limit: null, device_limit: null }
  ]);
  try {
    const rows = [...dom.window.document.querySelectorAll('.sl-plan-row')];
    assert.equal(rows.length, 3);
    assert.match(rows[0].textContent, /¥18\.88 \/ 月/);
    assert.match(rows[0].textContent, /3 台/);
    assert.match(rows[0].textContent, /不限速/);
    assert.match(rows[1].textContent, /¥50 \/ 季/);
    assert.match(rows[1].textContent, /100 Mbps/);
    assert.match(rows[2].textContent, /¥0 \/ 一次性/);
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

test('guest hash navigation starts the original SPA once without faking a login cookie', async () => {
  const dom = await guest([]);
  try {
    const { window } = dom;
    // custom_html (site footer) is already in the page when a visitor clicks through from the landing page.
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
    assert.ok(app.compareDocumentPosition(footer) & window.Node.DOCUMENT_POSITION_FOLLOWING, 'custom_html footer must stay below the SPA');
    assert.equal(window.document.querySelectorAll('script[type="module"]').length, 1);
    assert.equal(window.document.querySelector('#sl-landing').style.display, 'none');
    assert.equal(window.document.body.classList.contains('sl-landing-page'), false);
    assert.doesNotMatch(window.document.cookie, /sl_logged_in=1/);
  } finally { dom.window.close(); }
});

test('authenticated guest-shell entry opens the SPA directly', async () => {
  const dom = await guest([], { token: JSON.stringify({ value: 'test-token' }) });
  try {
    assert.ok(dom.window.document.querySelector('#app'));
    assert.match(dom.window.document.cookie, /sl_logged_in=1/);
  } finally { dom.window.close(); }
});

test('console layer is styles only and loads on both entry pages', () => {
  assert.equal(scripts(read('console')).length, 0);
  for (const name of ['dashboard', 'landing']) {
    const includes = read(name).match(/@include\('theme::Xboard\.console'\)/g) || [];
    assert.equal(includes.length, 1, name);
  }
  assert.doesNotMatch(read('dashboard') + read('landing'), /Xboard\.(appearance|glass)/);
});

test('solid primary fill skips text buttons such as order actions', () => {
  // Naive UI text buttons share n-button--primary-type; only their inline style tells them apart.
  const style = read('console').match(/<style[^>]*>([\s\S]*?)<\/style>/)[1];
  const fills = [];
  css.walk(css.parse(style), {
    visit: 'Rule',
    enter(rule) {
      const fill = rule.block.children.some(d => d.type === 'Declaration' && d.property === '--n-color' && /--sl-primary\)/.test(css.generate(d.value)));
      if (fill) fills.push(css.generate(rule.prelude));
    }
  });
  const { window } = new JSDOM('<button id="solid" class="n-button n-button--primary-type" style="--n-color: #0665d0; --n-padding: 0 18px;"></button>'
    + '<button id="text" class="n-button n-button--primary-type" style="--n-color: #0000; --n-padding: initial;"></button>');
  const hits = id => fills.some(selector => window.document.getElementById(id).matches(selector));
  assert.equal(hits('solid'), true);
  assert.equal(hits('text'), false);
  window.close();
});

const dashScript = scripts(read('console-dashboard'))[0];
const DASH_HTML = '<div id="app"><section class="cus-scroll-y"><div>'
  + '<div class="n-card" id="banner"></div>'
  + '<div class="n-card" id="orig"><div class="n-card-header__main">我的订阅</div></div>'
  + '<div class="n-card"><div class="n-card-header__main">捷径</div></div>'
  + '</div></section></div>';

async function dashboard(responses) {
  const dom = new JSDOM(DASH_HTML, { url: 'https://example.test/#/dashboard', runScripts: 'outside-only' });
  const { window } = dom;
  window.localStorage.setItem('VUE_NAIVE_ACCESS_TOKEN', JSON.stringify({ value: 'Bearer abc' }));
  const calls = [];
  window.fetch = async (url, init) => {
    calls.push([url, init.headers.Authorization]);
    const key = Object.keys(responses).find(k => url.endsWith(k));
    const body = key ? responses[key] : null;
    return { ok: body !== null, json: async () => ({ data: body }) };
  };
  window.eval(dashScript);
  for (let i = 0; i < 10; i++) await new Promise(resolve => setTimeout(resolve, 40));
  return { dom, calls };
}
const GB = 1024 ** 3;

test('dashboard blocks render real subscription, traffic and invite data', async () => {
  const { dom, calls } = await dashboard({
    'user/getSubscribe': { plan_id: 7, plan: { name: '<img src=x onerror=alert(1)>月付' }, expired_at: null, u: 1 * GB, d: 3 * GB, transfer_enable: 100 * GB, reset_day: 5, subscribe_url: 'https://example.test/s/abc' },
    'user/invite/fetch': { codes: [], stat: [4, 1000, 0, 15, 1250] }
  });
  try {
    const doc = dom.window.document;
    const dash = doc.querySelector('#sl-dash');
    assert.ok(dash);
    assert.equal(dash.nextElementSibling.id, 'orig');
    assert.ok(doc.querySelector('#orig').classList.contains('sl-dash-replaced'));
    assert.equal(dash.querySelectorAll('img').length, 0);
    assert.match(dash.textContent, /<img src=x onerror=alert\(1\)>月付/);
    assert.match(dash.textContent, /长期有效 · 5 天后重置流量/);
    assert.match(dash.textContent, /上行流量1\.00 GB/);
    assert.match(dash.textContent, /总计使用4\.00 GB/);
    assert.match(dash.textContent, /邀请人数4 人/);
    assert.match(dash.textContent, /佣金比例15%/);
    assert.match(dash.textContent, /可用佣金¥12\.50/);
    assert.equal(dash.querySelector('.sl-sub-actions a').getAttribute('href'), '#/plan/7');
    assert.ok(calls.every(call => call[1] === 'Bearer abc'));
    assert.equal(doc.querySelectorAll('#sl-dash').length, 1);
  } finally { dom.window.close(); }
});

test('dashboard blocks offer purchase when there is no plan', async () => {
  const { dom } = await dashboard({
    'user/getSubscribe': { plan_id: null, plan: null, u: 0, d: 0, transfer_enable: 0 },
    'user/invite/fetch': null
  });
  try {
    const dash = dom.window.document.querySelector('#sl-dash');
    assert.match(dash.textContent, /暂无订阅/);
    assert.equal(dash.querySelector('.sl-sub-actions a').getAttribute('href'), '#/plan');
    assert.match(dash.textContent, /邀请数据暂时无法读取/);
  } finally { dom.window.close(); }
});

test('dashboard keeps the original subscription card when data cannot be read', async () => {
  const { dom } = await dashboard({ 'user/getSubscribe': null });
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelector('#sl-dash'), null);
    assert.equal(doc.querySelector('#orig').classList.contains('sl-dash-replaced'), false);
  } finally { dom.window.close(); }
});
