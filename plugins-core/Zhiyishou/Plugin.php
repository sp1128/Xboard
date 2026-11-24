<?php

namespace Plugin\Zhiyishou;

use App\Services\Plugin\AbstractPlugin;
use App\Contracts\PaymentInterface;
use App\Exceptions\ApiException;
use Illuminate\Support\Facades\Log;
use Plugin\Zhiyishou\library\Zhiyishou;

require_once __DIR__ . '/library/Zhiyishou.php';

class Plugin extends AbstractPlugin implements PaymentInterface
{
    public function boot(): void
    {
        $this->filter('available_payment_methods', function ($methods) {
            if ($this->getConfig('enabled', true)) {
                $methods['Zhiyishou'] = [
                    'name' => $this->getConfig('display_name', '支付宝智易收'),
                    'icon' => $this->getConfig('icon', '💙'),
                    'plugin_code' => $this->getPluginCode(),
                    'type' => 'plugin'
                ];
            }
            return $methods;
        });
    }

    public function form(): array
    {
        return [
            'app_id' => [
                'label' => '支付宝APPID',
                'type' => 'string',
                'required' => true,
                'description' => '支付宝开放平台应用的APPID'
            ],
            'private_key' => [
                'label' => '应用私钥',
                'type' => 'text',
                'required' => true,
                'description' => '应用私钥，用于签名（PKCS#8 单行 base64 即可）'
            ],
            'public_key' => [
                'label' => '支付宝公钥',
                'type' => 'text',
                'required' => true,
                'description' => '支付宝公钥，用于验签'
            ],
            'product_name' => [
                'label' => '自定义商品名称',
                'type' => 'string',
                'description' => '将会体现在支付宝账单中'
            ]
        ];
    }

    public function pay($order): array
    {
        try {
            $gateway = new Zhiyishou();
            // 智能体个人收款的下单接口（应用已签约）：alipay.aipay.trade.precreate
            // 注意不是当面付的 alipay.trade.precreate，也不是电脑网站支付的 page.pay
            $gateway->setMethod('alipay.aipay.trade.precreate');
            $gateway->setAppId($this->getConfig('app_id'));
            $gateway->setPrivateKey($this->getConfig('private_key'));
            $gateway->setAlipayPublicKey($this->getConfig('public_key'));
            $gateway->setNotifyUrl($order['notify_url']);
            $gateway->setBizContent([
                'subject' => $this->getConfig('product_name') ?? (admin_setting('app_name', 'XBoard') . ' - 订阅'),
                'out_trade_no' => $order['trade_no'],
                'total_amount' => $order['total_amount'] / 100,
                'amount' => $order['total_amount'] / 100,
                'agent_id' => $this->getConfig('agent_id') ?? '',
                'agent_name' => $this->getConfig('agent_name') ?? '',
            ]);
            $gateway->send();
            return [
                'type' => 0,
                'data' => $gateway->getPayUrl()
            ];
        } catch (\Exception $e) {
            Log::error($e);
            throw new ApiException($e->getMessage());
        }
    }

    public function notify($params): array|bool
    {
        if ($params['trade_status'] !== 'TRADE_SUCCESS')
            return false;

        $gateway = new Zhiyishou();
        $gateway->setAppId($this->getConfig('app_id'));
        $gateway->setPrivateKey($this->getConfig('private_key'));
        $gateway->setAlipayPublicKey($this->getConfig('public_key'));

        try {
            if ($gateway->verify($params)) {
                return [
                    'trade_no' => $params['out_trade_no'],
                    'callback_no' => $params['trade_no']
                ];
            } else {
                return false;
            }
        } catch (\Exception $e) {
            return false;
        }
    }
}
