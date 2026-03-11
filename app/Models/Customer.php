<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'business_id',
        'name',
        'email',
        'phone',
        'address',
        'is_walk_in'
    ];

    protected $casts = [
        'is_walk_in' => 'boolean'
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
