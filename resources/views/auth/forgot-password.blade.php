@extends('layouts.app')
@section('title', 'Forgot Password - Receipt Builder')

@section('content')
<div id="controls">
    <div class="auth-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h1 style="margin:0;">Reset Password</h1>
            <a href="/" style="color:var(--primary);text-decoration:none;font-size:13px;">← Back</a>
        </div>
        <p>Enter your email to receive reset instructions</p>
        
        <form id="forgotForm">
            @csrf
            <label>Email</label>
            <input type="email" name="email" id="email" required>
            
            <button type="submit" class="btn-primary">Send Reset Link</button>
        </form>
        
        <div class="auth-links">
            <a href="/login">Back to Login</a>
        </div>
    </div>
</div>

@include('components.preview')
@endsection

@push('styles')
<style>
    .auth-card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 400px; margin: 40px auto; }
    .auth-card h1 { font-size: 24px; color: var(--text-main); }
    .auth-card p { margin: 0 0 24px; color: var(--text-secondary); font-size: 14px; }
    .auth-card label { display: block; margin: 16px 0 6px; font-size: 13px; font-weight: 500; color: var(--text-secondary); }
    .auth-card input { width: 100%; padding: 10px 12px; border: 1px solid var(--border); font-size: 14px; }
    .auth-card button { width: 100%; margin-top: 20px; }
    .auth-links { text-align: center; margin-top: 16px; font-size: 13px; }
    .auth-links a { color: var(--primary); text-decoration: none; }
</style>
@endpush

@push('scripts')
<script src="{{ asset('js/auth.js') }}"></script>
<script src="{{ asset('js/app.js') }}"></script>
@endpush
