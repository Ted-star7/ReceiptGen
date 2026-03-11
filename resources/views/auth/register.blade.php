@extends('layouts.app')
@section('title', 'Register - Receipt Builder')

@section('content')
<div id="controls">
    <div class="auth-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h1 style="margin:0;">Create Your Account</h1>
            <a href="/" style="color:var(--primary);text-decoration:none;font-size:13px;">← Back</a>
        </div>
        <p>Get started with Receipt Builder</p>
        
        <form id="registerForm">
            @csrf
            <div class="form-grid">
                <div>
                    <label>Full Name</label>
                    <input type="text" name="name" id="name" required>
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" id="email" required>
                </div>
            </div>
            
            <div class="form-grid">
                <div>
                    <label>Password</label>
                    <div style="position:relative;">
                        <input type="password" name="password" id="password" minlength="6" required>
                        <span onclick="togglePassword('password')" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;user-select:none;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </span>
                    </div>
                </div>
                <div>
                    <label>Confirm Password</label>
                    <div style="position:relative;">
                        <input type="password" name="password_confirmation" id="password_confirmation" minlength="6" required>
                        <span onclick="togglePassword('password_confirmation')" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;user-select:none;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            
            <label>Shop Name</label>
            <input type="text" name="shop_name" id="shop_name" required>
            
            <div class="form-grid">
                <div>
                    <label>Shop Location</label>
                    <input type="text" name="shop_location" id="shop_location" required>
                </div>
                <div>
                    <label>Shop Phone</label>
                    <input type="tel" name="shop_phone" id="shop_phone" required>
                </div>
            </div>
            
            <label>Business Type</label>
            <select name="business_type" id="business_type" required>
                <option value="">Select business type</option>
                <option value="retail">Retail</option>
                <option value="restaurant">Restaurant</option>
                <option value="service">Service</option>
                <option value="wholesale">Wholesale</option>
                <option value="other">Other</option>
            </select>
            
            <button type="submit" class="btn-primary">Create Account</button>
        </form>
        
        <div class="auth-links">
            Already have an account? <a href="/login">Login</a>
        </div>
    </div>
</div>

@include('components.preview')
@endsection

@push('styles')
<style>
    #controls { overflow-y: auto; }
    .auth-card { background: white; padding: 32px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); max-width: 600px; margin: 20px auto; }
    .auth-card h1 { font-size: 22px; color: var(--text-main); font-weight: 600; }
    .auth-card p { margin: 0 0 24px; color: var(--text-secondary); font-size: 14px; line-height: 1.5; }
    .auth-card label { display: block; margin: 14px 0 6px; font-size: 12px; font-weight: 500; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.3px; }
    .auth-card input, .auth-card select { width: 100%; padding: 10px 12px; border: 1px solid var(--border); font-size: 14px; transition: border-color 0.2s; }
    .auth-card input:focus, .auth-card select:focus { border-color: var(--primary); outline: none; }
    .auth-card button { width: 100%; margin-top: 24px; }
    .auth-links { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-light); font-size: 13px; color: var(--text-secondary); }
    .auth-links a { color: var(--primary); text-decoration: none; font-weight: 500; }
    .auth-links a:hover { text-decoration: underline; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 640px) { 
        .form-grid { grid-template-columns: 1fr; }
        .auth-card { padding: 24px; margin: 16px; }
    }
</style>
@endpush

@push('scripts')
<script src="{{ asset('js/auth.js') }}"></script>
<script src="{{ asset('js/app.js') }}"></script>
@endpush
