@extends('layouts.app')
@section('title', 'Orders - Receipt Builder')

@section('content')
@include('components.sidebar')

<div style="padding:24px;background:var(--bg-main);overflow:auto;">
    <div class="panel" style="width:100%;max-width:1200px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h2 style="margin:0;">Orders</h2>
            <a href="/" class="btn-secondary" style="width:auto;padding:8px 16px;text-decoration:none;display:inline-block;">← Back to Receipt</a>
        </div>

        <label>Select Business</label>
        <select id="businessSelect" onchange="loadOrders()" style="min-width:200px;padding:8px;margin-bottom:20px;">
            <option value="">Select a business</option>
            @foreach(auth()->user()->businesses as $business)
                <option value="{{ $business->id }}">{{ $business->name }}</option>
            @endforeach
        </select>
    </div>

    <div class="panel" style="width:100%;max-width:1200px;margin:20px auto;display:none;" id="orderListPanel">
        <h2>Orders (<span id="orderCount">0</span>)</h2>
        <div style="display:flex;gap:12px;margin-bottom:16px;">
            <input type="text" id="searchOrders" placeholder="Search by ref, customer..." style="flex:1;">
            <select id="filterStatus" style="width:150px;">
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="due">Due</option>
            </select>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Ref</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody id="ordersTable"></tbody>
        </table>
    </div>
</div>
@endsection

@push('styles')
<style>
    .panel { background: white; padding: 20px; margin: 20px; border: 1px solid var(--border-light); }
    .panel h2 { font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid var(--border-light); font-size: 13px; }
    th { background: #fafafa; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; color: var(--text-secondary); }
    .status-badge { padding: 4px 8px; border-radius: 3px; font-size: 10px; font-weight: 600; text-transform: uppercase; }
    .status-paid { background: #4caf50; color: white; }
    .status-pending { background: #ff9800; color: white; }
    .status-partial { background: #2196f3; color: white; }
    .status-due { background: #f44336; color: white; }
</style>
@endpush

@push('scripts')
<script src="{{ asset('js/app.js') }}"></script>
<script src="{{ asset('js/orders.js') }}"></script>
@endpush
