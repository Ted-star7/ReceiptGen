// Load dashboard data from API
let currentBusinessId = null;

function loadDashboard() {
  const businessId = document.getElementById('businessSelect').value;
  if (!businessId) {
    document.getElementById('dashboardContent').style.display = 'none';
    return;
  }
  
  currentBusinessId = businessId;
  document.getElementById('dashboardContent').style.display = 'block';
  loadDashboardData();
}

async function loadDashboardData() {
  if (!currentBusinessId) return;
  
  try {
    const response = await fetch(`/api/dashboard/data?business_id=${currentBusinessId}`, {
      headers: {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load dashboard data');
    }
    
    const data = await response.json();
    
    // Update stats
    document.getElementById('totalSales').textContent = `KES ${data.totalSales.toLocaleString()}`;
    document.getElementById('productsSold').textContent = data.productsSold;
    document.getElementById('lowStock').textContent = data.lowStock;
    document.getElementById('customersCount').textContent = data.customersCount;
    
    // Display payment methods breakdown
    const paymentBreakdown = document.getElementById('paymentBreakdown');
    paymentBreakdown.innerHTML = '';
    Object.entries(data.paymentMethods).forEach(([method, amount]) => {
      const div = document.createElement('div');
      div.style.cssText = 'display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);';
      div.innerHTML = `<span>${method}</span><strong>KES ${amount.toLocaleString()}</strong>`;
      paymentBreakdown.appendChild(div);
    });
    
    // Display recent transactions
    const tbody = document.querySelector('#transactionsTable tbody');
    tbody.innerHTML = '';
    data.recentTransactions.forEach(tx => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${tx.id}</td>
        <td>${tx.customer}</td>
        <td>KES ${tx.amount.toLocaleString()}</td>
        <td>${tx.date}</td>
      `;
    });
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showToast('Failed to load dashboard data', 'error');
  }
}

window.addEventListener('load', () => {
    const select = document.getElementById('businessSelect');
    if (select && select.options.length > 1) {
        select.value = select.options[1].value;
        loadDashboard();
    }
});
