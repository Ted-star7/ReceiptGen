@extends('layouts.app')
@section('title', 'Create Business - Receipt Builder')

@section('content')
@include('components.sidebar')

<div id="preview">
    <div class="panel" style="width:100%;max-width:800px;margin-top:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h2 style="margin:0;">Create New Business</h2>
            <a href="/" class="btn-secondary" style="width:auto;padding:8px 16px;text-decoration:none;display:inline-block;">← Back</a>
        </div>

        <form id="businessForm">
            <div class="form-grid">
                <div>
                    <label>Business Name *</label>
                    <input id="businessName" placeholder="Enter business name" required>
                </div>
                <div>
                    <label>Email</label>
                    <input id="businessEmail" type="email" placeholder="business@example.com">
                </div>
            </div>

            <div class="form-grid">
                <div>
                    <label>Phone Number</label>
                    <input id="businessPhone" type="tel" placeholder="+254 712 345 678">
                </div>
                <div>
                    <label>Branch</label>
                    <input id="businessBranch" placeholder="Branch name">
                </div>
            </div>

            <label>Location</label>
            <input id="businessLocation" placeholder="City or address">

            <label>Footer Message</label>
            <input id="businessFooter" placeholder="Thank you for your purchase!">

            <div class="form-grid">
                <div>
                    <label>Paper Size</label>
                    <select id="businessPaperSize">
                        <option value="58">Thermal 58mm</option>
                        <option value="76">Thermal 76mm</option>
                        <option value="80" selected>Thermal 80mm</option>
                        <option value="112">Thermal 112mm</option>
                        <option value="a4">A4</option>
                        <option value="letter">Letter</option>
                    </select>
                </div>
                <div>
                    <label>Font Family</label>
                    <select id="businessFont">
                        <option value="'Roboto Mono', monospace">Roboto Mono</option>
                        <option value="'Inter', system-ui">Inter</option>
                        <option value="'Poppins', sans-serif">Poppins</option>
                    </select>
                </div>
            </div>

            <div class="form-grid">
                <div>
                    <label>Tax Rate (%)</label>
                    <input id="businessTax" type="number" step="0.1" value="16" min="0" max="100">
                </div>
                <div>
                    <label>Receipt Prefix</label>
                    <input id="businessPrefix" placeholder="REF" value="REF">
                </div>
            </div>

            <div class="form-grid">
                <div>
                    <label>Currency</label>
                    <input id="businessCurrency" placeholder="KES" value="KES">
                </div>
                <div>
                    <label>QR Code Content</label>
                    <input id="businessQR" placeholder="URL or text">
                </div>
            </div>

            <button type="submit" class="btn-primary">Create Business</button>
        </form>
    </div>
</div>
@endsection

@push('styles')
<style>
    .panel { background: white; padding: 24px; margin: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 4px; }
    .panel h2 { font-size: 18px; font-weight: 600; color: var(--text-main); }
    form label { display: block; margin: 16px 0 4px; font-size: 13px; font-weight: 500; }
    form input, form select { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 4px; font-size: 14px; }
    form button { margin-top: 24px; width: 100%; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
</style>
@endpush

@push('scripts')
<script>
document.getElementById('businessForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = {
        name: document.getElementById('businessName').value,
        email: document.getElementById('businessEmail').value,
        location: document.getElementById('businessLocation').value,
        phone: document.getElementById('businessPhone').value,
        branch: document.getElementById('businessBranch').value,
        footer_message: document.getElementById('businessFooter').value,
        paper_size: document.getElementById('businessPaperSize').value,
        font_family: document.getElementById('businessFont').value,
        tax_rate: document.getElementById('businessTax').value,
        receipt_prefix: document.getElementById('businessPrefix').value,
        qr_content: document.getElementById('businessQR').value,
        currency: document.getElementById('businessCurrency').value
    };
    
    fetch('/businesses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            showToast('Business created successfully', 'success');
            setTimeout(() => window.location.href = '/', 1000);
        }
    })
    .catch(() => showToast('Failed to create business', 'error'));
});
</script>
@endpush
