<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Business;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create owner
        $owner = User::create([
            'name' => 'Erique Toon',
            'email' => 'eriquetoon@gmail.com',
            'password' => Hash::make('password123'),
            'shop_name' => 'Toon Enterprises',
            'shop_phone' => '+254 712 345 678',
            'shop_location' => 'Nairobi, Kenya',
            'business_type' => 'retail'
        ]);

        // Create business
        $business = Business::create([
            'name' => 'Toon Enterprises',
            'phone' => '+254 712 345 678',
            'location' => 'Nairobi, Kenya',
            'type' => 'retail'
        ]);

        // Attach owner to business
        $owner->businesses()->attach($business->id, ['role' => 'owner']);

        // Create staff member
        $staff = User::create([
            'name' => 'Jane Doe',
            'email' => 'jane@toonenterprises.com',
            'password' => Hash::make('password123'),
            'shop_name' => 'Toon Enterprises',
            'shop_phone' => '+254 712 345 679',
            'shop_location' => 'Nairobi, Kenya',
            'business_type' => 'retail'
        ]);

        // Attach staff to business
        $staff->businesses()->attach($business->id, ['role' => 'staff']);
    }
}
