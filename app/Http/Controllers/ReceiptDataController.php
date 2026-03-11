<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;

class ReceiptDataController extends Controller
{
    public function saveProducts(Request $request)
    {
        try {
            $businessId = $request->get('business_id');
            $business = auth()->user()->businesses()->find($businessId);
            
            if (!$business) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $products = $request->get('products', []);
            
            foreach ($products as $product) {
                Product::create([
                    'business_id' => $businessId,
                    'name' => $product['name'],
                    'sku' => $product['sku'] ?? null,
                    'price' => $product['price'] ?? 0,
                    'stock' => $product['stock'] ?? 0
                ]);
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function saveCustomer(Request $request)
    {
        $businessId = $request->get('business_id');
        $business = auth()->user()->businesses()->find($businessId);
        
        if (!$business) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string',
            'email' => 'nullable|email'
        ]);

        $customer = Customer::firstOrCreate(
            ['business_id' => $businessId, 'name' => $validated['name']],
            [
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'is_walk_in' => false
            ]
        );

        return response()->json(['success' => true, 'customer' => $customer]);
    }
}
