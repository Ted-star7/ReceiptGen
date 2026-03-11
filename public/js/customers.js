let customers = [];
let currentBusinessId = null;
let editingCustomerId = null;

function loadCustomers() {
    const businessId = document.getElementById('businessSelect').value;
    if (!businessId) {
        const form = document.getElementById('addCustomerForm');
        const list = document.getElementById('customerListPanel');
        if (form) form.style.display = 'none';
        if (list) list.style.display = 'none';
        return;
    }
    
    currentBusinessId = businessId;
    const form = document.getElementById('addCustomerForm');
    const list = document.getElementById('customerListPanel');
    if (form) form.style.display = 'block';
    if (list) list.style.display = 'block';
    
    fetch(`/api/customers?business_id=${businessId}`)
        .then(res => res.json())
        .then(data => {
            customers = data;
            renderCustomers(data);
        });
}

function renderCustomers(data) {
    const tbody = document.getElementById('customersTable');
    const count = document.getElementById('customerCount');
    if (!tbody || !count) return;
    
    tbody.innerHTML = '';
    count.textContent = data.length;

    if (data.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="5" style="text-align:center;color:#999;padding:20px;">No customers available</td>';
        tbody.appendChild(tr);
        return;
    }

    data.forEach(customer => {
        const orderCount = customer.orders_count !== undefined ? customer.orders_count : 0;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${customer.name}${customer.is_walk_in ? ' <span style="color:#999;font-size:11px;">(Walk-in)</span>' : ''}</td>
            <td>${customer.email || '-'}</td>
            <td>${customer.phone || '-'}</td>
            <td>${orderCount}</td>
            <td>
                <button class="action-btn btn-secondary" onclick="editCustomer(${customer.id})">Edit</button>
                <button class="action-btn btn-secondary" style="background:#e53935;color:white;border:none;" onclick="deleteCustomer(${customer.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function addCustomer() {
    if (!currentBusinessId) {
        showToast('Please select a business first', 'error');
        return;
    }
    
    const nameEl = document.getElementById('customerName');
    const emailEl = document.getElementById('customerEmail');
    const phoneEl = document.getElementById('customerPhone');
    const addressEl = document.getElementById('customerAddress');
    
    if (!nameEl || !emailEl || !phoneEl || !addressEl) return;
    
    const data = {
        business_id: currentBusinessId,
        name: nameEl.value,
        email: emailEl.value,
        phone: phoneEl.value,
        address: addressEl.value
    };

    if (!data.name) {
        showToast('Customer name is required', 'error');
        return;
    }

    const method = editingCustomerId ? 'PUT' : 'POST';
    const url = editingCustomerId ? `/customers/${editingCustomerId}` : '/customers';

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
            showToast(editingCustomerId ? 'Customer updated' : 'Customer added', 'success');
            clearCustomerForm();
            loadCustomers();
        }
    });
}

function editCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerEmail').value = customer.email || '';
    document.getElementById('customerPhone').value = customer.phone || '';
    document.getElementById('customerAddress').value = customer.address || '';
    
    editingCustomerId = id;
    document.querySelector('.btn-primary').textContent = 'Update Customer';
}

function clearCustomerForm() {
    const nameEl = document.getElementById('customerName');
    const emailEl = document.getElementById('customerEmail');
    const phoneEl = document.getElementById('customerPhone');
    const addressEl = document.getElementById('customerAddress');
    const btn = document.querySelector('.btn-primary');
    
    if (nameEl) nameEl.value = '';
    if (emailEl) emailEl.value = '';
    if (phoneEl) phoneEl.value = '';
    if (addressEl) addressEl.value = '';
    
    editingCustomerId = null;
    if (btn) btn.textContent = 'Add Customer';
}

function deleteCustomer(id) {
    if (!confirm('Delete this customer?')) return;

    fetch(`/customers/${id}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        }
    })
    .then(res => res.json())
    .then(result => {
        showToast(result.message, 'success');
        loadCustomers();
    });
}

window.addEventListener('load', () => {
    const searchInput = document.getElementById('searchCustomers');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = customers.filter(c => 
                c.name.toLowerCase().includes(query) ||
                (c.email && c.email.toLowerCase().includes(query)) ||
                (c.phone && c.phone.includes(query))
            );
            renderCustomers(filtered);
        });
    }
    
    const select = document.getElementById('businessSelect');
    if (select && select.options.length > 1) {
        select.value = select.options[1].value;
        loadCustomers();
    }
});
