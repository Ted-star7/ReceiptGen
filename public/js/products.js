let editingIndex = -1;
let currentBusinessId = null;

function loadProducts() {
  const businessId = document.getElementById('businessSelect').value;
  if (!businessId) {
    const form = document.getElementById('addProductForm');
    const list = document.getElementById('productListPanel');
    if (form) form.style.display = 'none';
    if (list) list.style.display = 'none';
    return;
  }
  
  currentBusinessId = businessId;
  const form = document.getElementById('addProductForm');
  const list = document.getElementById('productListPanel');
  if (form) form.style.display = 'block';
  if (list) list.style.display = 'block';
  
  renderProducts();
}

function renderProducts() {
  const storageKey = `products_${currentBusinessId}`;
  const products = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const tbody = document.getElementById('productsTable');
  const count = document.getElementById('productCount');
  
  if (!tbody || !count) return;
  
  tbody.innerHTML = '';
  count.textContent = products.length;
  
  if (products.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="5" style="text-align:center;color:#999;padding:20px;">No products available</td>';
    tbody.appendChild(tr);
    return;
  }
  
  products.forEach((p, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.sku || '-'}</td>
      <td>${p.price.toFixed(2)}</td>
      <td>${p.stock || 0}</td>
      <td>
        <button onclick="editProduct(${idx})" class="action-btn btn-secondary">Edit</button>
        <button onclick="deleteProduct(${idx})" class="action-btn btn-secondary" style="background:#e53935;color:white;border:none;">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function addProduct() {
  if (!currentBusinessId) {
    showToast('Please select a business first', 'error');
    return;
  }
  
  const nameEl = document.getElementById('productName');
  const skuEl = document.getElementById('productSku');
  const priceEl = document.getElementById('productPrice');
  const stockEl = document.getElementById('productStock');
  
  if (!nameEl || !skuEl || !priceEl || !stockEl) return;
  
  const name = nameEl.value.trim();
  const sku = skuEl.value.trim();
  const price = parseFloat(priceEl.value) || 0;
  const stock = parseInt(stockEl.value) || 0;
  
  if (!name) {
    showToast('Product name is required', 'error');
    return;
  }
  
  const storageKey = `products_${currentBusinessId}`;
  const products = JSON.parse(localStorage.getItem(storageKey) || '[]');
  products.push({ name, sku, price, stock });
  localStorage.setItem(storageKey, JSON.stringify(products));
  
  clearForm();
  renderProducts();
  showToast('Product added successfully', 'success');
}

function editProduct(idx) {
  const storageKey = `products_${currentBusinessId}`;
  const products = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const p = products[idx];
  
  document.getElementById('productName').value = p.name;
  document.getElementById('productSku').value = p.sku || '';
  document.getElementById('productPrice').value = p.price;
  document.getElementById('productStock').value = p.stock || 0;
  
  editingIndex = idx;
  document.getElementById('updateBtn').style.display = 'inline-block';
  document.getElementById('cancelBtn').style.display = 'inline-block';
  document.querySelector('.btn-primary').style.display = 'none';
}

function updateProduct() {
  const nameEl = document.getElementById('productName');
  const skuEl = document.getElementById('productSku');
  const priceEl = document.getElementById('productPrice');
  const stockEl = document.getElementById('productStock');
  
  if (!nameEl || !skuEl || !priceEl || !stockEl) return;
  
  const name = nameEl.value.trim();
  const sku = skuEl.value.trim();
  const price = parseFloat(priceEl.value) || 0;
  const stock = parseInt(stockEl.value) || 0;
  
  if (!name) {
    showToast('Product name is required', 'error');
    return;
  }
  
  const storageKey = `products_${currentBusinessId}`;
  const products = JSON.parse(localStorage.getItem(storageKey) || '[]');
  products[editingIndex] = { name, sku, price, stock };
  localStorage.setItem(storageKey, JSON.stringify(products));
  
  cancelEdit();
  renderProducts();
  showToast('Product updated successfully', 'success');
}

function cancelEdit() {
  editingIndex = -1;
  clearForm();
  document.getElementById('updateBtn').style.display = 'none';
  document.getElementById('cancelBtn').style.display = 'none';
  document.querySelector('.btn-primary').style.display = 'inline-block';
}

function deleteProduct(idx) {
  if (!confirm('Delete this product?')) return;
  
  const storageKey = `products_${currentBusinessId}`;
  const products = JSON.parse(localStorage.getItem(storageKey) || '[]');
  products.splice(idx, 1);
  localStorage.setItem(storageKey, JSON.stringify(products));
  renderProducts();
  showToast('Product deleted', 'success');
}

function clearForm() {
  document.getElementById('productName').value = '';
  document.getElementById('productSku').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productStock').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchProducts');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      if (!currentBusinessId) return;
      
      const query = e.target.value.toLowerCase();
      const storageKey = `products_${currentBusinessId}`;
      const products = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = query ? products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.sku && p.sku.toLowerCase().includes(query))
      ) : products;
      
      const tbody = document.getElementById('productsTable');
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (filtered.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="5" style="text-align:center;color:#999;padding:20px;">No products found</td>';
        tbody.appendChild(tr);
        return;
      }
      
      filtered.forEach((p, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.name}</td>
          <td>${p.sku || '-'}</td>
          <td>${p.price.toFixed(2)}</td>
          <td>${p.stock || 0}</td>
          <td>
            <button onclick="editProduct(${products.indexOf(p)})" class="action-btn btn-secondary">Edit</button>
            <button onclick="deleteProduct(${products.indexOf(p)})" class="action-btn btn-secondary" style="background:#e53935;color:white;border:none;">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
  }
});

window.addEventListener('load', () => {
    const select = document.getElementById('businessSelect');
    if (select && select.options.length > 1) {
        select.value = select.options[1].value;
        loadProducts();
    }
});
