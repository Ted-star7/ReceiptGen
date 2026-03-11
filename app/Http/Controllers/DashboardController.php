<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        return view('dashboard', compact('user'));
    }

    public function getData(Request $request)
    {
        $businessId = $request->get('business_id');
        $business = auth()->user()->businesses()->find($businessId);
        
        if (!$business) {
            return response()->json([
                'totalSales' => 0,
                'productsSold' => 0,
                'lowStock' => 0,
                'customersCount' => 0,
                'paymentMethods' => [],
                'recentTransactions' => []
            ]);
        }

        $orders = Order::where('business_id', $business->id)->get();
        $totalSales = $orders->sum('total');
        
        $productsSold = 0;
        foreach ($orders as $order) {
            $items = json_decode($order->items, true);
            foreach ($items as $item) {
                $productsSold += $item['qty'] ?? 0;
            }
        }

        $customersCount = Customer::where('business_id', $business->id)->count();

        $paymentMethods = [];
        foreach ($orders as $order) {
            $method = $order->payment_method ?: 'Cash';
            $paymentMethods[$method] = ($paymentMethods[$method] ?? 0) + $order->total;
        }

        $recentTransactions = Order::where('business_id', $business->id)
            ->with('customer')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function($order) {
                return [
                    'id' => $order->ref_number,
                    'customer' => $order->customer ? $order->customer->name : 'Walk-in',
                    'amount' => $order->total,
                    'date' => $order->created_at->format('d/m/Y H:i')
                ];
            });

        return response()->json([
            'totalSales' => $totalSales,
            'productsSold' => $productsSold,
            'lowStock' => 0,
            'customersCount' => $customersCount,
            'paymentMethods' => $paymentMethods,
            'recentTransactions' => $recentTransactions
        ]);
    }
}
