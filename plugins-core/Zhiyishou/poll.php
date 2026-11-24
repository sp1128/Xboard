<?php
// 智易收订单轮询兜底：支付宝 Agent 收款单的异步通知可能不到达，
// 定时主动查未支付的智易收订单，查到 TRADE_SUCCESS 就自动开通。
// 用法：docker exec xboard-xboard-1 php /tmp/zhiyishou-poll.php
require '/www/vendor/autoload.php';
$app = require '/www/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Order;
use App\Models\Payment;
use App\Services\OrderService;
use App\Services\Plugin\HookManager;

$pay = Payment::where('payment', 'Zhiyishou')->first();
if (!$pay) { echo "NO_ZHIYISHOU_PAYMENT\n"; exit(0); }
$cfg = is_string($pay->config) ? json_decode($pay->config, true) : $pay->config;

$since = time() - 86400; // 只查 24 小时内的待支付单
$orders = Order::where('payment_id', $pay->id)
    ->where('status', Order::STATUS_PENDING)
    ->where('created_at', '>=', $since)
    ->orderBy('id')
    ->get();

echo "pending=" . count($orders) . PHP_EOL;
foreach ($orders as $order) {
    $gw = new Plugin\Zhiyishou\library\Zhiyishou();
    $gw->setMethod('alipay.trade.query');
    $gw->setAppId($cfg['app_id']);
    $gw->setPrivateKey($cfg['private_key']);
    $gw->setAlipayPublicKey($cfg['public_key']);
    $gw->setBizContent(['out_trade_no' => $order->trade_no]);
    try {
        $gw->send();
        $resp = $gw->getResponse();
        $st = $resp['trade_status'] ?? '';
        echo $order->trade_no . " status=" . $st . PHP_EOL;
        if ($st === 'TRADE_SUCCESS') {
            $svc = new OrderService($order);
            if ($svc->paid($resp['trade_no'] ?? '')) {
                HookManager::call('payment.notify.success', $order);
                echo "  -> marked paid, trade_no=" . ($resp['trade_no'] ?? '') . PHP_EOL;
            } else {
                echo "  -> paid() returned false" . PHP_EOL;
            }
        }
    } catch (Throwable $e) {
        echo $order->trade_no . " query_fail: " . $e->getMessage() . PHP_EOL;
    }
}
echo "done\n";
