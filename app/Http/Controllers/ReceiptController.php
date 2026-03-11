<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReceiptController extends Controller
{
    public function index()
    {
        return view('receipt-builder');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ref_number' => 'required|string',
            'items' => 'required|array',
            'subtotal' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'tax' => 'required|numeric',
            'total' => 'required|numeric',
            'payment_status' => 'required|string',
            'payment_method' => 'nullable|string',
            'amount_paid' => 'nullable|numeric',
            'customer_id' => 'nullable|exists:customers,id'
        ]);

        // Get or create business from user's shop details
        $user = auth()->user();
        $business = \App\Models\Business::firstOrCreate(
            ['name' => $user->shop_name],
            [
                'phone' => $user->shop_phone,
                'location' => $user->shop_location,
                'type' => $user->business_type
            ]
        );

        // Attach business to user if not already attached
        if (!$user->businesses()->where('business_id', $business->id)->exists()) {
            $user->businesses()->attach($business->id, ['role' => 'owner']);
        }

        // Create walk-in customer if no customer selected
        $customerId = $validated['customer_id'];
        if (!$customerId) {
            $walkIn = \App\Models\Customer::firstOrCreate(
                ['business_id' => $business->id, 'is_walk_in' => true],
                ['name' => 'Walk-in Customer']
            );
            $customerId = $walkIn->id;
        }

        $order = \App\Models\Order::create([
            'user_id' => $user->id,
            'business_id' => $business->id,
            'customer_id' => $customerId,
            'ref_number' => $validated['ref_number'],
            'items' => $validated['items'],
            'subtotal' => $validated['subtotal'],
            'discount' => $validated['discount'] ?? 0,
            'tax' => $validated['tax'],
            'total' => $validated['total'],
            'payment_status' => $validated['payment_status'],
            'payment_method' => $validated['payment_method'],
            'amount_paid' => $validated['amount_paid']
        ]);

        return response()->json(['success' => true, 'order_id' => $order->id]);
    }
}
