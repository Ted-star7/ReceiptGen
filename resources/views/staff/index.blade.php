@extends('layouts.app')
@section('title', 'Staff Management - Receipt Builder')

@section('content')
@include('components.sidebar')

<div id="preview">
    <div class="panel" style="width:100%;max-width:1000px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h2 style="margin:0;">Staff Management</h2>
            <a href="/" class="btn-secondary" style="width:auto;padding:8px 16px;text-decoration:none;display:inline-block;">← Back to Receipt</a>
        </div>

        <label>Select Business</label>
        <select id="businessSelect" onchange="loadStaff()">
            <option value="">Select a business</option>
            @foreach($businesses as $business)
                <option value="{{ $business->id }}">{{ $business->name }}</option>
            @endforeach
        </select>

        <div id="addStaffForm" style="display:none;margin-top:20px;">
            <h3 style="font-size:14px;margin-bottom:12px;">Add New Staff</h3>
            <div class="form-row">
                <div><label>Name</label><input id="staffName" placeholder="Full name"></div>
                <div><label>Email</label><input id="staffEmail" type="email" placeholder="email@example.com"></div>
                <div><label>Password</label><input id="staffPassword" type="password" placeholder="Min 6 characters"></div>
                <div>
                    <label>Role</label>
                    <select id="staffRole">
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                    </select>
                </div>
            </div>
            <button class="btn-primary" onclick="addStaff()">Add Staff</button>
        </div>
    </div>

    <div class="panel" style="width:100%;max-width:1000px;display:none;" id="staffListPanel">
        <h2>Staff Members (<span id="staffCount">0</span>)</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="staffTable"></tbody>
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
    .role-badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .role-owner { background: #4caf50; color: white; }
    .role-manager { background: #2196f3; color: white; }
    .role-staff { background: #9e9e9e; color: white; }
    .action-btn { padding: 4px 8px; margin: 0 2px; font-size: 11px; cursor: pointer; }
    @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
</style>
@endpush

@push('scripts')
<script src="{{ asset('js/app.js') }}"></script>
<script>
let currentBusinessId = null;

function loadStaff() {
    const businessId = document.getElementById('businessSelect').value;
    if (!businessId) {
        document.getElementById('addStaffForm').style.display = 'none';
        document.getElementById('staffListPanel').style.display = 'none';
        return;
    }

    currentBusinessId = businessId;
    document.getElementById('addStaffForm').style.display = 'block';
    document.getElementById('staffListPanel').style.display = 'block';

    fetch(`/staff/${businessId}`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('staffTable');
            tbody.innerHTML = '';
            document.getElementById('staffCount').textContent = data.length;

            if (data.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="4" style="text-align:center;color:#999;padding:20px;">No staff members available</td>';
                tbody.appendChild(tr);
                return;
            }

            data.forEach(staff => {
                const role = staff.pivot.role;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${staff.name}</td>
                    <td>${staff.email}</td>
                    <td><span class="role-badge role-${role}">${role}</span></td>
                    <td>
                        ${role !== 'owner' ? `
                            <select class="action-btn" onchange="updateRole(${staff.id}, this.value)">
                                <option value="">Change Role</option>
                                <option value="staff">Staff</option>
                                <option value="manager">Manager</option>
                            </select>
                            <button class="action-btn btn-secondary" onclick="removeStaff(${staff.id})">Remove</button>
                        ` : '<span style="color:#666;">Owner</span>'}
                    </td>
                `;
                tbody.appendChild(tr);
            });
        });
}

function addStaff() {
    const data = {
        business_id: currentBusinessId,
        name: document.getElementById('staffName').value,
        email: document.getElementById('staffEmail').value,
        password: document.getElementById('staffPassword').value,
        role: document.getElementById('staffRole').value
    };

    fetch('/staff', {
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
            showToast(result.message, 'success');
            document.getElementById('staffName').value = '';
            document.getElementById('staffEmail').value = '';
            document.getElementById('staffPassword').value = '';
            loadStaff();
        } else {
            showToast(result.message || 'Failed to add staff', 'error');
        }
    });
}

function updateRole(userId, role) {
    if (!role) return;

    fetch(`/staff/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ business_id: currentBusinessId, role })
    })
    .then(res => res.json())
    .then(result => {
        showToast(result.message, 'success');
        loadStaff();
    });
}

function removeStaff(userId) {
    if (!confirm('Remove this staff member?')) return;

    fetch(`/staff/${currentBusinessId}/${userId}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        }
    })
    .then(res => res.json())
    .then(result => {
        showToast(result.message, 'success');
        loadStaff();
    });
}
</script>
@endpush
