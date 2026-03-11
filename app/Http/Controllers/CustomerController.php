<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    public function index()
    {
        return view('customers.index');
    }

    public function list(Request $request)
    {
        $businessId = $request->input('business_id');
        $business = Auth::user()->businesses()->find($businessId);
        
        if (!$business) {
            return response()->json([], 403);
        }
        
        $customers = Customer::where('business_id', $businessId)
            ->withCount('orders')
            ->get();
        return response()->json($customers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'is_walk_in' => 'boolean'
        ]);

        $business = Auth::user()->businesses()->find($validated['business_id']);
        if (!$business) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $customer = Customer::create([
            'business_id' => $validated['business_id'],
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'is_walk_in' => $validated['is_walk_in'] ?? false
        ]);

        return response()->json(['success' => true, 'customer' => $customer]);
    }

    public function update(Request $request, Customer $customer)
    {
        $business = Auth::user()->businesses()->find($customer->business_id);
        if (!$business) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string'
        ]);

        $customer->update($validated);
        return response()->json(['success' => true, 'customer' => $customer]);
    }

    public function destroy(Customer $customer)
    {
        $business = Auth::user()->businesses()->find($customer->business_id);
        if (!$business) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $customer->delete();
        return response()->json(['success' => true, 'message' => 'Customer deleted']);
    }
}
