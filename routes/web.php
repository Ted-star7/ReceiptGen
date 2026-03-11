<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\BusinessDataController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReceiptController;
use Illuminate\Support\Facades\Route;

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/api/dashboard/data', [DashboardController::class, 'getData']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    Route::get('/businesses', [BusinessController::class, 'index'])->name('businesses.index');
    Route::get('/api/businesses', [BusinessController::class, 'list']);
    Route::get('/businesses/create', [BusinessController::class, 'index'])->name('businesses.create');
    Route::post('/businesses', [BusinessController::class, 'store']);
    Route::get('/businesses/{id}', [BusinessController::class, 'show']);
    Route::put('/businesses/{id}', [BusinessController::class, 'update']);
    Route::delete('/businesses/{id}', [BusinessController::class, 'destroy']);
    Route::get('/api/business-data/{businessId}', [BusinessDataController::class, 'show']);
    
    Route::get('/products', function () {
        return view('products');
    })->name('products');
    
    Route::get('/payment-methods', function () {
        return view('payment-methods');
    })->name('payment-methods');
    
    Route::get('/staff', [App\Http\Controllers\StaffController::class, 'index'])->name('staff.index');
    Route::post('/staff', [App\Http\Controllers\StaffController::class, 'store']);
    Route::put('/staff/{id}', [App\Http\Controllers\StaffController::class, 'update']);
    Route::delete('/staff/{businessId}/{userId}', [App\Http\Controllers\StaffController::class, 'destroy']);
    Route::get('/staff/{businessId}', [App\Http\Controllers\StaffController::class, 'getStaff']);
    
    Route::get('/customers', [App\Http\Controllers\CustomerController::class, 'index'])->name('customers.index');
    Route::get('/api/customers', [App\Http\Controllers\CustomerController::class, 'list']);
    Route::post('/customers', [App\Http\Controllers\CustomerController::class, 'store']);
    Route::put('/customers/{customer}', [App\Http\Controllers\CustomerController::class, 'update']);
    Route::delete('/customers/{customer}', [App\Http\Controllers\CustomerController::class, 'destroy']);
    Route::post('/api/receipt-data/customer', [App\Http\Controllers\ReceiptDataController::class, 'saveCustomer']);
    Route::post('/api/receipt-data/products', [App\Http\Controllers\ReceiptDataController::class, 'saveProducts']);
    
    Route::get('/orders', [App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    Route::get('/api/orders', [App\Http\Controllers\OrderController::class, 'list']);
});

// Receipt builder - accessible to both guest and authenticated users
Route::get('/', [ReceiptController::class, 'index'])->name('receipt.builder');
Route::post('/orders', [ReceiptController::class, 'store'])->name('orders.store');
