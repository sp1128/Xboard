// Local, read-only visual preview. This is not a PHP server or a backend proxy.
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
  { id: 1, name: '轻量连接 · 演示', transfer_enable: 50, month_price: 1888, content: '适合日常 AI 与资料查阅\n普通线路住宅 IP 节点\n价格与配置仅用于样式演示' },
  { id: 2, name: '日常相伴 · 演示', transfer_enable: 200, month_price: 3888, content: '日本与美国住宅 IP\n早晚高峰可能会卡顿\n价格与配置仅用于样式演示' },
  { id: 3, name: '从容探索 · 演示', transfer_enable: 500, month_price: 6888, content: '按需选择适合自己的订阅\n三网优化线路可提工单定制\n价格与配置仅用于样式演示' }
];
for (const plan of examples) Object.assign(plan, { quarter_price: null, half_year_price: null, year_price: null, two_year_price: null, three_year_price: null, onetime_price: null, reset_price: null, show: true, sell: true, renew: true, group_id: 1, tags: ['演示'], speed_limit: null, device_limit: null, reset_traffic_method: 1, capacity_limit: null, sort: plan.id });
const now = Math.floor(Date.now() / 1000);
const gb = 1024 ** 3;
const user = { email: 'preview@example.test', uuid: '00000000-0000-4000-8000-000000000001', plan_id: 2, transfer_enable: 200 * gb, u: 2.4 * gb, d: 38.6 * gb, expired_at: now + 25 * 86400, created_at: now - 60 * 86400, last_login_at: now, balance: 1280, commission_balance: 300, commission_rate: 10, discount: null, remind_expire: 1, remind_traffic: 1, banned: 0, telegram_id: null, avatar_url: '' };
const order = { id: 1, trade_no: 'PREVIEW202611200001', plan_id: 2, plan: examples[1], period: 'month_price', total_amount: 3888, balance_amount: 0, discount_amount: 0, surplus_amount: 0, refund_amount: 0, status: 3, type: 1, created_at: now - 5 * 86400, updated_at: now - 5 * 86400, paid_at: now - 5 * 86400, payment: null };
const ticket = { id: 1, subject: '如何导入订阅？（演示工单）', level: 1, status: 0, reply_status: 1, created_at: now - 86400, updated_at: now, message: [{ id: 1, is_me: true, message: '这是用于预览样式的演示工单。', created_at: now - 86400 }, { id: 2, is_me: false, message: '请在仪表盘复制订阅链接，再导入客户端。', created_at: now }] };
const article = { id: 1, category: '开始使用', title: '安装客户端与导入订阅（演示）', updated_at: now, body: '<h2>开始使用</h2><p>安装适合设备的客户端，在仪表盘复制订阅链接并导入。</p><p>此处仅展示文档样式，没有真实订阅。</p>' };
const config = { app_name: values.title, app_description: values.description, email_verify: 0, is_recaptcha: 0, is_register: 1, currency: 'CNY', currency_symbol: '¥', is_telegram: 0, withdraw_methods: ['支付宝'], withdraw_close: 0, commission_distribution_enable: 0 };
function demoData(url) {
  const endpoint = url.pathname.replace('/api/v1/', '');
  switch (endpoint) {
    case 'guest/comm/config': case 'user/comm/config': return config;
    case 'guest/plan/fetch': case 'user/plan/fetch': return url.searchParams.get('id') ? examples.find(plan => plan.id === Number(url.searchParams.get('id'))) ?? examples[0] : examples;
    case 'user/info': return user;
    case 'user/checkLogin': return { is_login: true, is_admin: false };
    case 'user/getSubscribe': return { ...user, token: 'preview-only', subscribe_url: 'http://127.0.0.1:' + port + '/preview-subscription-disabled', reset_day: 25, next_reset_at: now + 25 * 86400, plan: examples[1] };
    case 'user/getStat': return [0, 1, 3];
    case 'user/notice/fetch': return [{ id: 1, title: '欢迎体验新版界面', content: '<p>当前为本地演示环境，所有账户、节点及订单均为演示数据。</p>', tags: [], show: 1, created_at: now, updated_at: now }];
    case 'user/server/fetch': return ['日本住宅 IP · 演示', '美国住宅 IP · 演示'].map((name, index) => ({ id: index + 1, type: 'vless', name, rate: '1.0', tags: ['演示'], is_online: index === 0, cache_key: 'preview-' + index, last_check_at: now }));
    case 'user/order/fetch': return [order];
    case 'user/order/detail': return { ...order, try_out_plan_id: 0 };
    case 'user/order/getPaymentMethod': return [];
    case 'user/invite/fetch': return { codes: [{ id: 1, code: 'DEMOONLY', status: 0, created_at: now, updated_at: now }], stat: [3, 800, 200, 10, 300] };
    case 'user/invite/details': return [];
    case 'user/ticket/fetch': return url.searchParams.get('id') ? ticket : [ticket];
    case 'user/knowledge/fetch': return url.searchParams.get('id') ? article : { '开始使用': [article] };
    case 'user/stat/getTrafficLog': return Array.from({ length: 7 }, (_, index) => ({ d: (index + 1) * .4 * gb, u: .1 * gb, record_at: now - index * 86400, server_rate: 1 }));
    case 'user/getActiveSession': return [];
    default: return undefined;
  }
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    res.setHeader('Cache-Control', 'no-store');
    if (url.pathname.startsWith('/api/')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      const data = req.method === 'GET' ? demoData(url) : undefined;
      if (data !== undefined) {
        res.end(JSON.stringify({ data, total: Array.isArray(data) ? data.length : undefined }));
      } else {
        res.statusCode = 403;
        res.end(JSON.stringify({ code: 403, message: '本地演示仅支持查看，不能登录、保存、下单或付款。' }));
      }
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
    const state = demo ? '<script>localStorage.setItem("VUE_NAIVE_ACCESS_TOKEN",JSON.stringify({value:"local-preview-only",time:Date.now(),expire:Date.now()+86400000}));</script>' : '<script>localStorage.removeItem("VUE_NAIVE_ACCESS_TOKEN");document.cookie="sl_logged_in=;path=/;max-age=0";</script>';
    const notice = '<aside style="position:relative;z-index:10000;background:#e8edf3;color:#636970;padding:9px 20px;text-align:center;font:13px/1.6 system-ui">本地样式预览 · 所有数据均为演示 · 不支持保存、下单或付款　<a href="/" style="color:#0066cc">首页</a>　<a href="/#/login" style="color:#0066cc">登录页</a>　<a href="/?demo=1#/dashboard" style="color:#0066cc">进入演示控制台</a></aside>';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const locale = '<script>if(!localStorage.getItem("VUE_NAIVE_LOCALE"))localStorage.setItem("VUE_NAIVE_LOCALE",JSON.stringify({value:"zh-CN",time:Date.now(),expire:null}));</script>';
    res.end(html.replace(/<body[^>]*>/, tag => tag + locale + state + notice));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end(error.message);
  }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
