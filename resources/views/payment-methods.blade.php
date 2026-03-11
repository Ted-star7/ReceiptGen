@extends('layouts.app')
@section('title', 'Payment Methods - Receipt Builder')

@section('content')
@include('components.sidebar')

<div style="padding:24px;background:var(--bg-main);overflow:auto;">
    <div class="panel" style="width:100%;max-width:1000px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h2 style="margin:0;">Payment Methods</h2>
            <a href="/" class="btn-secondary" style="width:auto;padding:8px 16px;text-decoration:none;display:inline-block;">← Back to Receipt</a>
        </div>

        <label>Select Business</label>
        <select id="businessSelect" onchange="loadPaymentMethods()" style="min-width:200px;padding:8px;margin-bottom:20px;">
            <option value="">Select a business</option>
            @foreach(auth()->user()->businesses as $business)
                <option value="{{ $business->id }}">{{ $business->name }}</option>
            @endforeach
        </select>

        <div id="addMethodForm" style="display:none;margin-top:20px;">
            <h3 style="font-size:14px;margin-bottom:12px;">Add New Payment Method</h3>
            <label>Method Name</label>
            <input id="methodName" placeholder="e.g., PayPal, Crypto" style="margin-bottom:12px;">
            
            <label style="margin-top:12px;">Custom Fields (Optional)</label>
            <div id="fieldsContainer"></div>
            <button class="btn-secondary" onclick="addField()" style="margin-top:8px;font-size:11px;padding:6px;">+ Add Field</button>
            
            <button class="btn-primary" onclick="savePaymentMethod()" style="margin-top:12px;">Save Payment Method</button>
        </div>
    </div>

    <div class="panel" style="width:100%;max-width:1000px;margin:20px auto;display:none;" id="methodListPanel">
        <h2>Payment Methods (<span id="methodCount">0</span>)</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Fields</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="methodsTable"></tbody>
        </table>
    </div>
</div>
@endsection

@push('styles')
<style>
    .panel { background: white; padding: 20px; margin: 20px; border: 1px solid var(--border-light); }
    .panel h2 { font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); margin-bottom: 16px; }
    .field-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
    .field-row input { flex: 1; }
    .field-row button { width: auto; padding: 6px 12px; margin: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid var(--border-light); font-size: 13px; }
    th { background: #fafafa; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; color: var(--text-secondary); }
    .action-btn { padding: 4px 8px; margin: 0 2px; font-size: 11px; cursor: pointer; }
</style>
@endpush

@push('scripts')
<script src="{{ asset('js/app.js') }}"></script>
<script src="{{ asset('js/payment-methods.js') }}"></script>
@endpush
