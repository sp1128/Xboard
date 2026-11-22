<?php

namespace Plugin\CoinRemitter;

use App\Services\Plugin\AbstractPlugin;
use App\Contracts\PaymentInterface;
use App\Exceptions\ApiException;

class Plugin extends AbstractPlugin implements PaymentInterface
{
    public function boot(): void
    {
        $this->filter('available_payment_methods', function ($methods) {
            if ($this->getConfig('enabled', true)) {
                $methods['CoinRemitter'] = [
                    'name' => $this->getConfig('display_name', 'USDT (TRC20)'),
                    'icon' => $this->getConfig('icon', '₮'),
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
            'api_key' => [
                'label' => '钱包 API Key',
                'type' => 'string',
                'required' => true,
                'description' => 'CoinRemitter 后台 USDT 钱包的 API Key（注册 coinremitter.com 后建 USDT-TRC20 钱包获取，无需实名）'
            ],
            'api_password' => [
                'label' => '钱包 API Password',
                'type' => 'string',
                'required' => true,
                'description' => 'CoinRemitter 后台 USDT 钱包的 API Password'
            ],
            'network' => [
                'label' => '网络',
                'type' => 'string',
                'required' => false,
                'description' => 'TRC20（推荐，手续费低）或 ERC20，默认 TRC20'
            ],
            'expiry_minutes' => [
                'label' => '账单有效期（分钟）',
                'type' => 'string',
                'required' => false,
                'description' => '默认 60 分钟，客户须在此时间内付款'
            ],
        ];
    }

    public function pay($order): array
    {
        $network = strtoupper(trim($this->getConfig('network', 'TRC20')));
        if (!in_array($network, ['TRC20', 'ERC20'], true)) {
            $network = 'TRC20';
        }
        $coin = $network === 'ERC20' ? 'USDTERC20' : 'USDTTRC20';
        $expiry = (int) $this->getConfig('expiry_minutes', 60);
        if ($expiry <= 0) {
            $expiry = 60;
        }

        // CoinRemitter 按 fiat_currency 把人民币金额换算成 USDT，汇率由它实时算
        $params = [
            'amount' => sprintf('%.2f', $order['total_amount'] / 100),
            'fiat_currency' => 'CNY',
            'name' => 'StarLink-' . $order['trade_no'],
            'description' => 'StarLink plan order ' . $order['trade_no'],
            'notify_url' => $order['notify_url'],
            'success_url' => $order['return_url'],
            'expiry_time_in_minutes' => (string) $expiry,
            'custom_data1' => $order['trade_no'],
        ];

        $ret_raw = $this->apiPost(
            "https://api.coinremitter.com/api/v1/{$coin}/create-invoice",
            $params
        );
        $ret = @json_decode($ret_raw, true);

        if (empty($ret['success']) || empty($ret['data']['url'])) {
            $msg = $ret['msg'] ?? $ret['message'] ?? 'create invoice failed';
            throw new ApiException('CoinRemitter: ' . $msg);
        }

        return [
            'type' => 1,
            'data' => $ret['data']['url'],
        ];
    }

    public function notify($params): array|bool
    {
        // CoinRemitter 账单回调是 multipart/form-data，字段含 invoice_id / status_code / custom_data1
        if (!is_array($params)) {
            return false;
        }
        $statusCode = (string) ($params['status_code'] ?? '');
        $invoiceId = (string) ($params['invoice_id'] ?? '');
        $tradeNo = (string) ($params['custom_data1'] ?? '');
        if ($tradeNo === '' || $invoiceId === '') {
            return false;
        }
        // 只有已付才放行；再向 CoinRemitter 查一次账单状态防伪造回调
        if ($statusCode !== '1') {
            return false;
        }
        $checked = $this->verifyInvoicePaid($invoiceId);
        if (!$checked) {
            return false;
        }

        return [
            'trade_no' => $tradeNo,
            'callback_no' => $invoiceId
        ];
    }

    private function verifyInvoicePaid(string $invoiceId): bool
    {
        $network = strtoupper(trim($this->getConfig('network', 'TRC20')));
        if (!in_array($network, ['TRC20', 'ERC20'], true)) {
            $network = 'TRC20';
        }
        $coin = $network === 'ERC20' ? 'USDTERC20' : 'USDTTRC20';
        $ret_raw = $this->apiPost(
            "https://api.coinremitter.com/api/v1/{$coin}/get-invoice",
            ['invoice_id' => $invoiceId]
        );
        $ret = @json_decode($ret_raw, true);
        if (empty($ret['success']) || empty($ret['data'])) {
            return false;
        }
        return (string) ($ret['data']['status_code'] ?? '') === '1';
    }

    private function apiPost(string $url, array $params): string|false
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'x-api-key: ' . $this->getConfig('api_key'),
            'x-api-password: ' . $this->getConfig('api_password'),
            'Content-Type: application/x-www-form-urlencoded',
        ]);
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }
}
