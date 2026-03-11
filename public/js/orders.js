let orders = [];
let currentBusinessId = null;

function loadOrders() {
    const businessId = document.getElementById('businessSelect').value;
    if (!businessId) {
        const list = document.getElementById('orderListPanel');
        if (list) list.style.display = 'none';
        return;
    }
    
    currentBusinessId = businessId;
    const list = document.getElementById('orderListPanel');
    if (list) list.style.display = 'block';
    
    fetch(`/api/orders?business_id=${businessId}`)
        .then(res => res.json())
        .then(data => {
            orders = data;
            renderOrders(data);
        });
}

function renderOrders(data) {
    const tbody = document.getElementById('ordersTable');
    const count = document.getElementById('orderCount');
    if (!tbody || !count) return;
    
    tbody.innerHTML = '';
    count.textContent = data.length;

    if (data.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="6" style="text-align:center;color:#999;padding:20px;">No orders available</td>';
        tbody.appendChild(tr);
        return;
    }

    data.forEach(order => {
        const items = JSON.parse(order.items);
        const itemCount = items.length;
        const date = new Date(order.created_at).toLocaleDateString('en-GB');
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${order.ref_number}</strong></td>
            <td>${order.customer ? order.customer.name : 'Walk-in'}</td>
            <td>${itemCount} item${itemCount > 1 ? 's' : ''}</td>
            <td><strong>KES ${parseFloat(order.total).toFixed(2)}</strong></td>
            <td><span class="status-badge status-${order.payment_status}">${order.payment_status}</span></td>
            <td>${date}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchOrders');
    const filterStatus = document.getElementById('filterStatus');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const status = filterStatus?.value || '';
            filterOrders(query, status);
        });
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', (e) => {
            const query = searchInput?.value.toLowerCase() || '';
            const status = e.target.value;
            filterOrders(query, status);
        });
    }
});

function filterOrders(query, status) {
    const filtered = orders.filter(o => {
        const matchQuery = !query || 
            o.ref_number.toLowerCase().includes(query) ||
            (o.customer && o.customer.name.toLowerCase().includes(query));
        const matchStatus = !status || o.payment_status === status;
        return matchQuery && matchStatus;
    });
    renderOrders(filtered);
}

window.addEventListener('load', () => {
    const select = document.getElementById('businessSelect');
    if (select && select.options.length > 1) {
        select.value = select.options[1].value;
        loadOrders();
    }
});
