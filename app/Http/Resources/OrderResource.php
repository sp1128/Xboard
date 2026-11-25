<?php

namespace App\Http\Resources;

use App\Models\Order;
use App\Services\PlanService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Order
 */
class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        // The user-facing amount must be the real payable total: base price
        // plus the handling fee. TY/SC add the 5% fee themselves on their
        // side, so the gateway is sent only the base price (the EPay plugin
        // subtracts the fee before sending), but the customer must see the
        // fee-inclusive amount here — otherwise the order page shows 18.88
        // while the gateway charges 19.82. The frontend renders total_amount
        // only and ignores handling_amount, so fold the fee into
        // total_amount for display. This resource is only used by the
        // user-facing order endpoints; admin views and backend logic read
        // the model directly and are unaffected.
        if (!empty($this->handling_amount)) {
            $data['total_amount'] = (int) $this->total_amount + (int) $this->handling_amount;
        }
        return [
            ...$data,
            'period' => PlanService::getLegacyPeriod((string)$this->period),
            'plan' => $this->whenLoaded('plan', fn() => PlanResource::make($this->plan)),
            'payment' => $this->whenLoaded('payment', fn() => $this->payment ? [
                'id' => $this->payment->id,
                'name' => $this->payment->name,
                'payment' => $this->payment->payment,
                'icon' => $this->payment->icon,
            ] : null),
        ];
    }
}
