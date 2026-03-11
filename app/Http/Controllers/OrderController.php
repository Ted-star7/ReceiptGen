<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return view('orders.index');
    }

    public function list(Request $request)
    {
        $businessId = $request->get('business_id');
        $business = auth()->user()->businesses()->find($businessId);
        
        if (!$business) {
            return response()->json([], 403);
        }
        
        $orders = Order::where('business_id', $businessId)
            ->with('customer')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($orders);
    }
}
