// Local interactive preview server. Not a PHP server or production backend.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../theme/Xboard');
const port = Number(process.env.THEME_PREVIEW_PORT || 4186);
const values = { title: '星屿StarLink', theme: 'Xboard', version: 'local-preview', description: '星屿用户端本地样式预览', logo: '' };

async function render(name) {
  let html = await fs.readFile(path.join(root, `${name}.blade.php`), 'utf8');
  for (const match of [...html.matchAll(/@include\('theme::Xboard\.([\w-]+)'\)/g)]) {
    html = html.replace(match[0], await render(match[1]));
  }
  html = html.replace(/\{\{--[\s\S]*?--\}\}/g, '')
    .replace(/\{!![\s\S]*?!!\}/g, '')
    .replace(/@json\(\$theme_config\['background_url'\] \?\? ''\)/g, '""')
    .replace(/@json\(\$(\w+)\)/g, (_, key) => JSON.stringify(values[key] ?? ''))
    .replace(/\{\{\s*\$theme_config\['theme_color'\][\s\S]*?\}\}/g, 'blue')
    .replace(/\{\{\s*\$(\w+)\s*\}\}/g, (_, key) => values[key] ?? '');
  return html;
}

const examples = [
  {
    id: 1, name: '轻量连接 · 演示', transfer_enable: 50,
    month_price: 1888, quarter_price: 5200, year_price: 18800, onetime_price: null,
    tags: ['入门'],
    content: '适合日常 AI 与资料查阅\n普通线路住宅 IP 节点\n价格与配置仅用于样式演示'
  },
  {
    id: 2, name: '日常相伴 · 演示', transfer_enable: 200,
    month_price: 3888, quarter_price: 10800, year_price: null, onetime_price: null,
    tags: ['推荐'],
    content: '日本与美国原生住宅 IP + 10 个机房节点\n早晚高峰可能会卡顿\n价格与配置仅用于样式演示'
  },
  {
    id: 3, name: '从容探索 · 演示', transfer_enable: 500,
    month_price: 6888, quarter_price: null, year_price: null, onetime_price: null,
    tags: ['大流量'],
    content: '按需选择适合自己的订阅\n三网优化线路可提工单定制\n价格与配置仅用于样式演示'
  },
  {
    id: 4, name: '机房流量 150G · 演示', transfer_enable: 150,
    month_price: null, quarter_price: null, year_price: null, onetime_price: 2990,
    tags: ['长期有效'],
    content: '一次性购买长期有效\n36 个机房 IP 节点，不限设备\n价格与配置仅用于样式演示'
  }
];
for (const plan of examples) {
  Object.assign(plan, {
    half_year_price: null, two_year_price: null, three_year_price: null, reset_price: null,
    show: true, sell: true, renew: true, group_id: 1, speed_limit: null, device_limit: null,
    reset_traffic_method: 1, capacity_limit: null, sort: plan.id
  });
}

const now = Math.floor(Date.now() / 1000);
const gb = 1024 ** 3;
const user = {
  email: 'preview@example.test', uuid: '00000000-0000-4000-8000-000000000001',
  plan_id: 2, transfer_enable: 200 * gb, u: 2.4 * gb, d: 38.6 * gb,
  expired_at: now + 25 * 86400, created_at: now - 60 * 86400, last_login_at: now,
  balance: 0, commission_balance: 300, commission_rate: 10, discount: null,
  remind_expire: 1, remind_traffic: 1, banned: 0, telegram_id: null, avatar_url: ''
};

const alipaySvg = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#1677ff"/><text x="12" y="16.5" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif" font-weight="bold">支</text></svg>');
const paymentMethods = [
  { id: 1, name: '支付宝（演示扫码）', payment: 'AlipayF2f', icon: alipaySvg, handling_fee_fixed: 0, handling_fee_percent: 0 },
  { id: 2, name: '微信支付（演示跳转）', payment: 'Epay', icon: '💚', handling_fee_fixed: 0, handling_fee_percent: 2 },
  { id: 3, name: '支付宝-备用（演示）', payment: 'Zhiyishou', icon: '💙', handling_fee_fixed: 100, handling_fee_percent: 0 }
];

const orders = [
  {
    id: 1, trade_no: 'PREVIEW202611200001', plan_id: 2, plan: examples[1], period: 'month_price',
    total_amount: 3888, balance_amount: 0, discount_amount: 0, surplus_amount: 0, refund_amount: 0,
    handling_amount: null, status: 3, type: 1, created_at: now - 5 * 86400, updated_at: now - 5 * 86400,
    paid_at: now - 5 * 86400, payment: null
  }
];

const ticket = {
  id: 1, subject: '如何导入订阅？（演示工单）', level: 1, status: 0, reply_status: 1,
  created_at: now - 86400, updated_at: now,
  message: [
    { id: 1, is_me: true, message: '这是用于预览样式的演示工单。', created_at: now - 86400 },
    { id: 2, is_me: false, message: '请在仪表盘复制订阅链接，再导入客户端。', created_at: now }
  ]
};
const article = {
  id: 1, category: '开始使用', title: '安装客户端与导入订阅（演示）', updated_at: now,
  body: '## 开始使用\n\n> 演示优惠码：可输入 `DEMO80`（8折）或 `DEMO5`（立减¥5）测试下单。\n\n1. 安装适合设备的客户端。\n2. 在 **仪表盘** 点击一键导入或复制订阅链接。'
};
const config = {
  app_name: values.title, app_description: values.description, email_verify: 0, is_recaptcha: 0,
  is_register: 1, currency: 'CNY', currency_symbol: '¥', is_telegram: 0,
  withdraw_methods: ['支付宝'], withdraw_close: 0, commission_distribution_enable: 0
};

function readJsonBody(req) {
  return new Promise(resolve => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { resolve({}); }
    });
  });
}

function checkCoupon(code) {
  const c = String(code || '').trim().toUpperCase();
  if (c === 'DEMO80') return { id: 1, name: '演示 8 折优惠', type: 2, value: 20 };
  if (c === 'DEMO5') return { id: 2, name: '演示立减 ¥5', type: 1, value: 500 };
  return null;
}

function demoGet(url) {
  const endpoint = url.pathname.replace('/api/v1/', '');
  switch (endpoint) {
    case 'guest/comm/config': case 'user/comm/config': return config;
    case 'guest/plan/fetch': case 'user/plan/fetch':
      return url.searchParams.get('id') ? examples.find(plan => plan.id === Number(url.searchParams.get('id'))) ?? examples[0] : examples;
    case 'user/info': return user;
    case 'user/checkLogin': return { is_login: true, is_admin: false };
    case 'user/getSubscribe':
      return { ...user, token: 'preview-only', subscribe_url: 'http://127.0.0.1:' + port + '/preview-subscription-disabled', reset_day: 25, next_reset_at: now + 25 * 86400, plan: examples[1] };
    case 'user/getStat': return [orders.filter(o => o.status === 0).length, 1, 3];
    case 'user/notice/fetch':
      return [{ id: 1, title: '欢迎体验新版 iOS 风格界面', content: '<p>当前为本地演示环境，购买订阅支持优惠码（<code>DEMO80</code> / <code>DEMO5</code>）、下单、选择支付方式及扫码模拟确认。</p>', tags: [], show: 1, created_at: now, updated_at: now }];
    case 'user/server/fetch':
      return ['日本住宅 IP · 演示', '美国住宅 IP · 演示', '香港机房节点 · 演示', '新加坡优化节点 · 演示'].map((name, index) => ({
        id: index + 1, type: 'vless', name, rate: '1.0', tags: ['演示'], is_online: index !== 3, cache_key: 'preview-' + index, last_check_at: now
      }));
    case 'user/order/fetch': {
      const st = url.searchParams.get('status');
      return st !== null && st !== '' ? orders.filter(o => o.status === Number(st)) : orders;
    }
    case 'user/order/detail': {
      const no = url.searchParams.get('trade_no');
      const found = orders.find(o => o.trade_no === no) || orders[0];
      return { ...found, try_out_plan_id: 0 };
    }
    case 'user/order/check': {
      const no = url.searchParams.get('trade_no');
      const found = orders.find(o => o.trade_no === no);
      return found ? found.status : 0;
    }
    case 'user/order/getPaymentMethod': return paymentMethods;
    case 'user/invite/fetch': return { codes: [{ id: 1, code: 'DEMOONLY', status: 0, created_at: now, updated_at: now }], stat: [3, 800, 200, 10, 300] };
    case 'user/invite/details': return [];
    case 'user/ticket/fetch': return url.searchParams.get('id') ? ticket : [ticket];
    case 'user/knowledge/fetch': return url.searchParams.get('id') ? article : { '开始使用': [article] };
    case 'user/stat/getTrafficLog':
      return Array.from({ length: 7 }, (_, index) => ({ d: (index + 1) * .4 * gb, u: .1 * gb, record_at: now - index * 86400, server_rate: 1 }));
    case 'user/getActiveSession': return [];
    default: return undefined;
  }
}

async function handleApiPost(url, req, res) {
  const endpoint = url.pathname.replace('/api/v1/', '');
  const body = await readJsonBody(req);
  const ts = Math.floor(Date.now() / 1000);

  if (endpoint === 'user/coupon/check') {
    const c = checkCoupon(body.code);
    if (!c) {
      res.statusCode = 400;
      res.end(JSON.stringify({ status: 'fail', message: '优惠券无效（可输入 DEMO80 或 DEMO5 测试）' }));
      return;
    }
    res.end(JSON.stringify({ data: c }));
    return;
  }

  if (endpoint === 'user/order/save') {
    const pending = orders.find(o => o.status === 0);
    if (pending) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: '您有未付款或开通中的订单，请稍后再试或将其取消' }));
      return;
    }
    const plan = examples.find(p => p.id === Number(body.plan_id));
    if (!plan || plan[body.period] == null) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: '套餐或周期无效' }));
      return;
    }
    const base = Number(plan[body.period]);
    let discountAmount = 0;
    if (body.coupon_code) {
      const c = checkCoupon(body.coupon_code);
      if (!c) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: '优惠券无效（可输入 DEMO80 或 DEMO5 测试）' }));
        return;
      }
      discountAmount = c.type === 1 ? Math.min(base, c.value) : Math.round(base * (c.value / 100));
    }
    const surplusAmount = plan.id !== 1 ? 100 : 0; // Simulate ¥1 existing-plan deduction for demo clarity
    const totalAmount = Math.max(0, base - discountAmount - surplusAmount);
    const tradeNo = 'DEMO' + Date.now();
    orders.unshift({
      id: orders.length + 1, trade_no: tradeNo, plan_id: plan.id, plan, period: body.period,
      total_amount: totalAmount, balance_amount: 0, discount_amount: discountAmount, surplus_amount: surplusAmount,
      refund_amount: 0, handling_amount: null, status: 0, type: 1, created_at: ts, updated_at: ts, paid_at: null, payment: null
    });
    res.end(JSON.stringify({ data: tradeNo }));
    return;
  }

  if (endpoint === 'user/order/checkout') {
    const order = orders.find(o => o.trade_no === body.trade_no && o.status === 0);
    if (!order) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: '订单不存在或已支付' }));
      return;
    }
    if (order.total_amount <= 0) {
      order.status = 3;
      order.paid_at = ts;
      res.end(JSON.stringify({ type: -1, data: true }));
      return;
    }
    const m = paymentMethods.find(x => x.id === Number(body.method));
    if (!m) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: '支付方式不可用' }));
      return;
    }
    order.payment_id = m.id;
    order.payment = m;
    const payUrl = `http://127.0.0.1:${port}/demo-pay?trade_no=${encodeURIComponent(order.trade_no)}`;
    res.end(JSON.stringify({ type: m.id === 2 ? 1 : 0, data: payUrl }));
    return;
  }

  if (endpoint === 'user/order/cancel') {
    const order = orders.find(o => o.trade_no === body.trade_no && o.status === 0);
    if (!order) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: '只可以取消待支付订单' }));
      return;
    }
    order.status = 2;
    order.updated_at = ts;
    res.end(JSON.stringify({ data: true }));
    return;
  }

  res.statusCode = 403;
  res.end(JSON.stringify({ code: 403, message: '本地演示支持订阅下单/优惠券/支付交互，暂不支持该操作。' }));
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    res.setHeader('Cache-Control', 'no-store');
    if (url.pathname.startsWith('/api/')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      if (req.method === 'POST') {
        await handleApiPost(url, req, res);
        return;
      }
      const data = req.method === 'GET' ? demoGet(url) : undefined;
      if (data !== undefined) {
        res.end(JSON.stringify({ data, total: Array.isArray(data) ? data.length : undefined }));
      } else {
        res.statusCode = 403;
        res.end(JSON.stringify({ code: 403, message: '本地演示暂不支持该接口。' }));
      }
      return;
    }
    if (url.pathname === '/demo-pay') {
      const no = url.searchParams.get('trade_no');
      const order = orders.find(o => o.trade_no === no);
      if (order && order.status === 0) {
        order.status = 3;
        order.paid_at = Math.floor(Date.now() / 1000);
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>模拟支付完成</title></head><body style="font-family:system-ui;background:#f2f2f7;display:grid;place-items:center;min-height:100vh;margin:0"><div style="background:#fff;padding:28px 32px;border-radius:20px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.08)"><div style="font-size:36px">✅</div><h2 style="margin:10px 0 6px">模拟支付已确认</h2><p style="color:#666;font-size:14px">原页面将在 3 秒内自动更新订单状态，你可以关闭此标签页。</p></div></body></html>');
      return;
    }
    if (url.pathname.startsWith('/theme/Xboard/assets/')) {
      const asset = path.resolve(root, url.pathname.slice('/theme/Xboard/'.length));
      if (!asset.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
      const ctype = asset.endsWith('.js')
        ? 'application/javascript; charset=utf-8'
        : asset.endsWith('.css')
          ? 'text/css; charset=utf-8'
          : asset.endsWith('.svg')
            ? 'image/svg+xml'
            : 'application/octet-stream';
      res.setHeader('Content-Type', ctype);
      res.end(await fs.readFile(asset));
      return;
    }
    if (url.pathname !== '/') { res.writeHead(404).end('Not found'); return; }
    const demo = url.searchParams.has('demo');
    const html = await render(demo ? 'dashboard' : 'landing');
    const state = demo
      ? '<script>localStorage.setItem("VUE_NAIVE_ACCESS_TOKEN",JSON.stringify({value:"local-preview-only",time:Date.now(),expire:Date.now()+86400000}));</script>'
      : '<script>localStorage.removeItem("VUE_NAIVE_ACCESS_TOKEN");document.cookie="sl_logged_in=;path=/;max-age=0";</script>';
    const notice = '<aside style="position:relative;z-index:10000;background:#e8edf3;color:#636970;padding:9px 20px;text-align:center;font:13px/1.6 system-ui">本地演示预览 · 订阅下单支持优惠码 <code>DEMO80</code> / <code>DEMO5</code> 与支付/取消交互　<a href="/" style="color:#0066cc">首页</a>　<a href="/#/login" style="color:#0066cc">登录页</a>　<a href="/?demo=1#/dashboard" style="color:#0066cc">控制台</a>　<a href="/?demo=1#/plan" style="color:#0066cc">订阅商店</a></aside>';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const locale = '<script>if(!localStorage.getItem("VUE_NAIVE_LOCALE"))localStorage.setItem("VUE_NAIVE_LOCALE",JSON.stringify({value:"zh-CN",time:Date.now(),expire:null}));</script>';
    res.end(html.replace(/<body[^>]*>/, tag => tag + locale + state + notice));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end(error.message);
  }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
