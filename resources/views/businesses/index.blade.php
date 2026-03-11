@extends('layouts.app')
@section('title', 'Businesses - Receipt Builder')

@section('content')
@include('components.sidebar')

<div style="padding:24px;background:var(--bg-main);overflow:auto;">
    <div class="panel" style="width:100%;max-width:1200px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h2 style="margin:0;">Businesses</h2>
            <a href="/" class="btn-secondary" style="width:auto;padding:8px 16px;text-decoration:none;display:inline-block;">← Back to Receipt</a>
        </div>

        <div id="addBusinessForm" style="margin-top:20px;">
            <h3 style="font-size:14px;margin-bottom:12px;">Add New Business</h3>
            <div class="form-row">
                <div><label>Business Name</label><input id="businessName" placeholder="Business name"></div>
                <div><label>Phone</label><input id="businessPhone" placeholder="Phone number"></div>
                <div><label>Location</label><input id="businessLocation" placeholder="Location"></div>
                <div><label>Type</label><input id="businessType" placeholder="Business type"></div>
            </div>
            <button class="btn-primary" onclick="addBusiness()">Add Business</button>
            <button class="btn-secondary" id="updateBtn" style="display:none;" onclick="updateBusiness()">Update Business</button>
            <button class="btn-secondary" id="cancelBtn" style="display:none;" onclick="cancelEdit()">Cancel</button>
        </div>
    </div>

    <div class="panel" style="width:100%;max-width:1200px;margin:20px auto;">
        <h2>My Businesses (<span id="businessCount">0</span>)</h2>
        <input type="text" id="searchBusinesses" placeholder="Search businesses..." style="margin-bottom:12px;">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="businessesTable"></tbody>
        </table>
    </div>
</div>
@endsection

@push('styles')
<style>
    .panel { background: white; padding: 20px; margin: 20px; border: 1px solid var(--border-light); }
    .panel h2 { font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); margin-bottom: 16px; }
    .form-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid var(--border-light); font-size: 13px; }
    th { background: #fafafa; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; color: var(--text-secondary); }
    .action-btn { padding: 4px 8px; margin: 0 2px; font-size: 11px; cursor: pointer; }
    @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
</style>
@endpush

@push('scripts')
<script src="{{ asset('js/app.js') }}"></script>
<script src="{{ asset('js/businesses.js') }}"></script>
@endpush
