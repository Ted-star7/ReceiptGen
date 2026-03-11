<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BusinessDataController extends Controller
{
    public function show($businessId)
    {
        try {
            $business = auth()->user()->businesses()->findOrFail($businessId);
            $products = $business->products()->get();
            $customers = $business->customers()->get();
            $paymentMethods = $business->paymentMethods()->where('is_active', true)->get();

            return response()->json([
                'business' => $business,
                'products' => $products,
                'customers' => $customers,
                'payment_methods' => $paymentMethods
            ]);
        } catch (\Exception $e) {
            \Log::error('BusinessDataController error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
