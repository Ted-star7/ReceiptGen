let businesses = [];
let editingBusinessId = null;

function loadBusinesses() {
    fetch('/api/businesses')
        .then(res => res.json())
        .then(data => {
            businesses = data;
            renderBusinesses(data);
        });
}

function renderBusinesses(data) {
    const tbody = document.getElementById('businessesTable');
    const count = document.getElementById('businessCount');
    if (!tbody || !count) return;
    
    tbody.innerHTML = '';
    count.textContent = data.length;

    if (data.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="5" style="text-align:center;color:#999;padding:20px;">No businesses available</td>';
        tbody.appendChild(tr);
        return;
    }

    data.forEach(business => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${business.name}</strong></td>
            <td>${business.phone || '-'}</td>
            <td>${business.location || '-'}</td>
            <td>${business.type || '-'}</td>
            <td>
                <button class="action-btn btn-secondary" onclick="editBusiness(${business.id})">Edit</button>
                <button class="action-btn btn-secondary" style="background:#e53935;color:white;border:none;" onclick="deleteBusiness(${business.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function addBusiness() {
    const nameEl = document.getElementById('businessName');
    const phoneEl = document.getElementById('businessPhone');
    const locationEl = document.getElementById('businessLocation');
    const typeEl = document.getElementById('businessType');
    
    if (!nameEl || !phoneEl || !locationEl || !typeEl) return;
    
    const data = {
        name: nameEl.value,
        phone: phoneEl.value,
        location: locationEl.value,
        type: typeEl.value
    };

    if (!data.name) {
        showToast('Business name is required', 'error');
        return;
    }

    const method = editingBusinessId ? 'PUT' : 'POST';
    const url = editingBusinessId ? `/businesses/${editingBusinessId}` : '/businesses';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            showToast(editingBusinessId ? 'Business updated' : 'Business added', 'success');
            clearForm();
            loadBusinesses();
        }
    });
}

function editBusiness(id) {
    const business = businesses.find(b => b.id === id);
    if (!business) return;
    
    document.getElementById('businessName').value = business.name;
    document.getElementById('businessPhone').value = business.phone || '';
    document.getElementById('businessLocation').value = business.location || '';
    document.getElementById('businessType').value = business.type || '';
    
    editingBusinessId = id;
    document.getElementById('updateBtn').style.display = 'inline-block';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    document.querySelector('.btn-primary').style.display = 'none';
}

function updateBusiness() {
    addBusiness();
}

function cancelEdit() {
    editingBusinessId = null;
    clearForm();
    document.getElementById('updateBtn').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'none';
    document.querySelector('.btn-primary').style.display = 'inline-block';
}

function clearForm() {
    document.getElementById('businessName').value = '';
    document.getElementById('businessPhone').value = '';
    document.getElementById('businessLocation').value = '';
    document.getElementById('businessType').value = '';
}

function deleteBusiness(id) {
    if (!confirm('Delete this business?')) return;

    fetch(`/businesses/${id}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        }
    })
    .then(res => res.json())
    .then(result => {
        showToast(result.message || 'Business deleted', 'success');
        loadBusinesses();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchBusinesses');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = businesses.filter(b => 
                b.name.toLowerCase().includes(query) ||
                (b.phone && b.phone.includes(query)) ||
                (b.location && b.location.toLowerCase().includes(query))
            );
            renderBusinesses(filtered);
        });
    }
    
    loadBusinesses();
});
