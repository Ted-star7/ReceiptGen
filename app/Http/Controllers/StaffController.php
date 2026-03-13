<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StaffController extends Controller
{
    public function index()
    {
        $businesses = auth()->user->businesses()->wherePivot('role', 'owner')->get();
        return view('staff.index', compact('businesses'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:staff,manager'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'])
        ]);

        $user->businesses()->attach($validated['business_id'], ['role' => $validated['role']]);

        return response()->json(['success' => true, 'message' => 'Staff added successfully']);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'role' => 'required|in:staff,manager'
        ]);

        $user = User::findOrFail($id);
        $user->businesses()->updateExistingPivot($validated['business_id'], ['role' => $validated['role']]);

        return response()->json(['success' => true, 'message' => 'Role updated successfully']);
    }

    public function destroy($businessId, $userId)
    {
        $user = User::findOrFail($userId);
        $user->businesses()->detach($businessId);

        return response()->json(['success' => true, 'message' => 'Staff removed successfully']);
    }

    public function getStaff($businessId)
    {
        $business = Business::findOrFail($businessId);
        $staff = $business->users()->get();

        return response()->json($staff);
    }
}
