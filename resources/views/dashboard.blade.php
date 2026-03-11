@extends('layouts.app')
@section('title', 'Dashboard - Receipt Builder')

@section('content')
@include('components.sidebar')

<div id="preview">
    <div class="panel" style="width:100%;max-width:1200px;margin-top:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <div>
                <h2 style="margin:0;">Dashboard</h2>
                <p style="color:var(--text-secondary);margin:4px 0 0;">{{ $user->name }}</p>
            </div>
            <div>
                <label style="margin:0 0 4px;font-size:12px;">Select Business</label>
                <select id="businessSelect" onchange="loadDashboard()" style="min-width:200px;">
                    <option value="">Select a business</option>
                    @foreach(auth()->user()->businesses as $business)
                        <option value="{{ $business->id }}">{{ $business->name }}</option>
                    @endforeach
                </select>
            </div>
        </div>

        <div id="dashboardContent" style="display:none;">

        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Sales</h3>
                <div class="value" id="totalSales">KES 0</div>
            </div>
            <div class="stat-card">
                <h3>Products Sold</h3>
                <div class="value" id="productsSold">0</div>
            </div>
            <div class="stat-card">
                <h3>Low Stock</h3>
                <div class="value" id="lowStock">0</div>
            </div>
            <div class="stat-card">
                <h3>Customers</h3>
                <div class="value" id="customersCount">0</div>
            </div>
        </div>

        <div class="chart-card">
            <h2>Payment Methods Collection</h2>
            <div id="paymentBreakdown"></div>
        </div>

        <div class="chart-card">
            <h2>Recent Transactions</h2>
            <table class="transactions-table" id="transactionsTable">
                <thead>
                    <tr>
                        <th>Receipt ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        </div>
    </div>
</div>
@endsection

@push('styles')
<style>
    .panel { background: white; padding: 24px; margin: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 4px; }
    .panel h2 { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: var(--text-main); }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 24px; }
    .stat-card { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 20px; border-radius: 4px; color: white; }
    .stat-card h3 { margin: 0 0 8px; font-size: 13px; color: rgba(255,255,255,0.9); text-transform: uppercase; }
    .stat-card .value { font-size: 32px; font-weight: 600; color: white; }
    .chart-card { background: var(--bg-panel); padding: 20px; margin-bottom: 20px; border-radius: 4px; border: 1px solid var(--border-light); }
    .chart-card h2 { margin: 0 0 16px; font-size: 16px; color: var(--text-main); }
    .transactions-table { width: 100%; border-collapse: collapse; }
    .transactions-table th { text-align: left; padding: 12px; border-bottom: 2px solid var(--border); font-size: 13px; color: var(--text-secondary); }
    .transactions-table td { padding: 12px; border-bottom: 1px solid var(--border-light); font-size: 14px; }
</style>
@endpush

@push('scripts')
<script src="{{ asset('js/dashboard.js') }}"></script>
<script src="{{ asset('js/app.js') }}"></script>
@endpush
