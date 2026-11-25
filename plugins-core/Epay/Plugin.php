<?php

namespace Plugin\Epay;

use App\Services\Plugin\AbstractPlugin;
use App\Contracts\PaymentInterface;

class Plugin extends AbstractPlugin implements PaymentInterface
{
    public function boot(): void
    {
        $this->filter('available_payment_methods', function ($methods) {
            if ($this->getConfig('enabled', true)) {
                $methods['EPay'] = [
                    'name' => $this->getConfig('display_name', '易支付'),
                    'icon' => $this->getConfig('icon', '💳'),
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
            'url' => [
                'label' => '支付网关地址',
                'type' => 'string',
                'required' => true,
                'description' => '请填写完整的支付网关地址，包括协议（http或https）'
            ],
            'pid' => [
                'label' => '商户ID',
                'type' => 'string',
                'description' => '请填写商户ID',
                'required' => true
            ],
            'key' => [
                'label' => '通信密钥',
                'type' => 'string',
                'required' => true,
                'description' => '请填写通信密钥'
            ],
            'type' => [
                'label' => '支付类型',
                'type' => 'string',
                'description' => '支付类型，如: alipay, wxpay, qqpay 等，可自定义'
            ],
            'fee_inclusive' => [
                'label' => '网关金额含手续费',
                'type' => 'string',
                'description' => '填 1 表示传给网关的是含手续费的总价（网关不自动加费时用，如易彩）；留空表示传原价（网关自动加费时用，如天一/蔬菜）'
            ],
        ];
    }

    public function pay($order): array
    {
        // checkout() passes total_amount fee-inclusive (base + handling) so
        // the order page can display the real amount the customer pays.
        // Whether the gateway gets the base price or the fee-inclusive total
        // depends on the gateway: TY/SC add the fee themselves on their side,
        // so they must receive only the base amount, otherwise the fee is
        // charged twice. YC has no auto-add-fee setting, so it must receive
        // the fee-inclusive total, otherwise no fee is collected at all.
        // Controlled per payment method by the `fee_inclusive` config flag
        // (1 = send total incl. handling, empty = send base only).
        if (!empty($this->getConfig('fee_inclusive'))) {
            $gatewayAmount = $order['total_amount'] / 100;
        } else {
            $gatewayAmount = ($order['total_amount'] - ($order['handling_amount'] ?? 0)) / 100;
        }
        // Each payment attempt gets a unique out_trade_no at the gateway.
        // Xboard reuses the same order trade_no when the user switches payment
        // methods mid-order; gateways reject a repeated out_trade_no whose
        // parameters changed ("支付参数有变化，请更换订单号重新发起支付").
        // Appending a per-attempt suffix makes every attempt unique, so
        // switching methods just works. The suffix is stripped back in
        // notify(). Order trade_no values are all digits
        // (Helper::generateOrderNo), so a '-' separator can never collide
        // with the original value.
        $outTradeNo = $order['trade_no'] . '-' . time() . mt_rand(1000, 9999);
        $params = [
            'money' => $gatewayAmount,
            'name' => $order['trade_no'],
            'notify_url' => $order['notify_url'],
            'return_url' => $order['return_url'],
            'out_trade_no' => $outTradeNo,
            'pid' => $this->getConfig('pid')
        ];

        if ($paymentType = $this->getConfig('type')) {
            $params['type'] = $paymentType;
        }

        ksort($params);
        $str = stripslashes(urldecode(http_build_query($params))) . $this->getConfig('key');
        $params['sign'] = md5($str);
        $params['sign_type'] = 'MD5';

        return [
            'type' => 1,
            'data' => $this->getConfig('url') . '/submit.php?' . http_build_query($params)
        ];
    }

    public function notify($params): array|bool
    {
        $secret = $this->getConfig('key');
        if (!is_string($secret) || trim($secret) === '' || !is_array($params)) {
            return false;
        }
        // EPay V1 spec: sign, sign_type and empty values do not participate
        // in the signature. Some gateways send an empty `param=` field, and
        // Laravel converts empty query strings to null, which would fail the
        // type check below and break signature verification. Drop empty/null
        // values up front so the notification verifies either way.
        $params = array_filter($params, fn($v) => $v !== '' && $v !== null);
        foreach ($params as $value) {
            if (!is_string($value) && !is_int($value)) {
                return false;
            }
        }
        if (!is_string($params['sign'] ?? null)
            || !is_string($params['out_trade_no'] ?? null) || trim($params['out_trade_no']) === ''
            || !is_string($params['trade_no'] ?? null) || trim($params['trade_no']) === '') {
            return false;
        }
        $pid = $this->getConfig('pid');
        if ((!is_string($pid) && !is_int($pid)) || trim((string) $pid) === ''
            || (string) ($params['pid'] ?? '') !== (string) $pid
            || ($params['trade_status'] ?? null) !== 'TRADE_SUCCESS'
            || ($params['sign_type'] ?? 'MD5') !== 'MD5') {
            return false;
        }

        $sign = $params['sign'];
        unset($params['sign'], $params['sign_type']);
        ksort($params);
        $str = stripslashes(urldecode(http_build_query($params))) . $secret;

        if (!hash_equals(md5($str), $sign)) {
            return false;
        }

        // Strip the per-attempt suffix appended in pay() so the order lookup
        // uses the original Xboard trade_no. The signature above was already
        // verified against the suffixed value the gateway signed.
        $outTradeNo = $params['out_trade_no'];
        $dashPos = strpos($outTradeNo, '-');
        if ($dashPos !== false) {
            $outTradeNo = substr($outTradeNo, 0, $dashPos);
        }

        return [
            'trade_no' => $outTradeNo,
            'callback_no' => $params['trade_no']
        ];
    }
}