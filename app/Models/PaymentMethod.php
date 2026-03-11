<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $fillable = [
        'business_id',
        'name',
        'fields',
        'is_active'
    ];

    protected $casts = [
        'fields' => 'array',
        'is_active' => 'boolean'
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}
