<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    public function index()
    {
        return view('businesses.index');
    }

    public function list()
    {
        $businesses = auth()->user()->businesses()->get();
        return response()->json($businesses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'nullable|email|max:100',
            'location' => 'nullable|string|max:200',
            'phone' => 'nullable|string|max:20',
            'branch' => 'nullable|string|max:100',
            'footer_message' => 'nullable|string|max:200',
            'paper_size' => 'nullable|string|max:20',
            'font_family' => 'nullable|string|max:100',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'receipt_prefix' => 'nullable|string|max:10',
            'qr_content' => 'nullable|string|max:500',
            'currency' => 'nullable|string|max:10',
        ]);

        $business = auth()->user()->businesses()->create($validated);
        
        auth()->user()->businesses()->updateExistingPivot($business->id, ['role' => 'owner']);

        return response()->json(['success' => true, 'business' => $business]);
    }

    public function show($id)
    {
        $business = auth()->user()->businesses()->findOrFail($id);
        return response()->json($business);
    }

    public function update(Request $request, $id)
    {
        $business = auth()->user()->businesses()->findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'nullable|email|max:100',
            'location' => 'nullable|string|max:200',
            'phone' => 'nullable|string|max:20',
            'branch' => 'nullable|string|max:100',
            'footer_message' => 'nullable|string|max:200',
            'paper_size' => 'nullable|string|max:20',
            'font_family' => 'nullable|string|max:100',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'receipt_prefix' => 'nullable|string|max:10',
            'qr_content' => 'nullable|string|max:500',
            'currency' => 'nullable|string|max:10',
            'type' => 'nullable|string|max:100',
        ]);

        $business->update($validated);

        return response()->json(['success' => true, 'business' => $business]);
    }

    public function destroy($id)
    {
        $business = auth()->user()->businesses()->findOrFail($id);
        $business->delete();
        return response()->json(['success' => true, 'message' => 'Business deleted']);
    }
}
