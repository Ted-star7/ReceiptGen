@extends('layouts.app')
@section('title', 'Products - Receipt Builder')

@section('content')
@include('components.sidebar')

<div style="padding:24px;background:var(--bg-main);overflow:auto;">
    <div class="panel" style="width:100%;max-width:1000px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h2 style="margin:0;">Products</h2>
            <a href="/" class="btn-secondary" style="width:auto;padding:8px 16px;text-decoration:none;display:inline-block;">← Back to Receipt</a>
        </div>

        <label>Select Business</label>
        <select id="businessSelect" onchange="loadProducts()" style="min-width:200px;padding:8px;margin-bottom:20px;">
            <option value="">Select a business</option>
            @foreach(auth()->user()->businesses as $business)
                <option value="{{ $business->id }}">{{ $business->name }}</option>
            @endforeach
        </select>

        <div id="addProductForm" style="display:none;margin-top:20px;">
            <h3 style="font-size:14px;margin-bottom:12px;">Add New Product</h3>
            <div class="form-row">
                <div><label>Product Name</label><input id="productName" placeholder="Product name"></div>
                <div><label>SKU</label><input id="productSku" placeholder="SKU"></div>
                <div><label>Price</label><input id="productPrice" type="number" step="0.01" placeholder="0.00"></div>
                <div><label>Stock</label><input id="productStock" type="number" placeholder="0"></div>
            </div>
            <button class="btn-primary" onclick="addProduct()">Add Product</button>
            <button class="btn-secondary" id="updateBtn" style="display:none;" onclick="updateProduct()">Update Product</button>
            <button class="btn-secondary" id="cancelBtn" style="display:none;" onclick="cancelEdit()">Cancel</button>
        </div>
    </div>

    <div class="panel" style="width:100%;max-width:1000px;margin:20px auto;display:none;" id="productListPanel">
        <h2>Products (<span id="productCount">0</span>)</h2>
        <input type="text" id="searchProducts" placeholder="Search products..." style="margin-bottom:12px;">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="productsTable"></tbody>
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
<script src="{{ asset('js/products.js') }}"></script>
@endpush
