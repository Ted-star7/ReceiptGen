let fieldCounter = 0;
let currentBusinessId = null;

function addField() {
  fieldCounter++;
  const html = `
    <div class="field-row" id="field-${fieldCounter}">
      <input type="text" placeholder="Field name (e.g., Transaction ID)" class="fieldName">
      <button onclick="removeField('field-${fieldCounter}')" style="background:#e53935;color:white;">Remove</button>
    </div>
  `;
  document.getElementById('fieldsContainer').insertAdjacentHTML('beforeend', html);
}

function removeField(id) {
  document.getElementById(id)?.remove();
}

function loadPaymentMethods() {
  const businessId = document.getElementById('businessSelect').value;
  if (!businessId) {
    const form = document.getElementById('addMethodForm');
    const list = document.getElementById('methodListPanel');
    if (form) form.style.display = 'none';
    if (list) list.style.display = 'none';
    return;
  }
  
  currentBusinessId = businessId;
  const form = document.getElementById('addMethodForm');
  const list = document.getElementById('methodListPanel');
  if (form) form.style.display = 'block';
  if (list) list.style.display = 'block';
  loadMethods();
}

function savePaymentMethod() {
  if (!currentBusinessId) {
    showToast('Please select a business first', 'error');
    return;
  }
  
  const nameEl = document.getElementById('methodName');
  if (!nameEl) return;
  
  const name = nameEl.value.trim();
  if (!name) {
    showToast('Please enter a method name', 'error');
    return;
  }
  
  const fields = [];
  document.querySelectorAll('.fieldName').forEach(input => {
    const fieldName = input.value.trim();
    if (fieldName) fields.push(fieldName);
  });
  
  const storageKey = `paymentMethods_${currentBusinessId}`;
  const methods = JSON.parse(localStorage.getItem(storageKey) || '[]');
  methods.push({ name, fields });
  localStorage.setItem(storageKey, JSON.stringify(methods));
  
  nameEl.value = '';
  document.getElementById('fieldsContainer').innerHTML = '';
  fieldCounter = 0;
  loadMethods();
  showToast('Payment method saved!', 'success');
}

function deleteMethod(index) {
  if (!confirm('Delete this payment method?')) return;
  
  const storageKey = `paymentMethods_${currentBusinessId}`;
  const methods = JSON.parse(localStorage.getItem(storageKey) || '[]');
  methods.splice(index, 1);
  localStorage.setItem(storageKey, JSON.stringify(methods));
  loadMethods();
  showToast('Payment method deleted', 'success');
}

function loadMethods() {
  if (!currentBusinessId) return;
  
  const storageKey = `paymentMethods_${currentBusinessId}`;
  const methods = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const tbody = document.getElementById('methodsTable');
  const count = document.getElementById('methodCount');
  
  if (!tbody || !count) return;
  
  tbody.innerHTML = '';
  count.textContent = methods.length;
  
  if (methods.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="3" style="text-align:center;color:#999;padding:20px;">No payment methods available</td>';
    tbody.appendChild(tr);
    return;
  }
  
  methods.forEach((method, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${method.name}</td>
      <td>${method.fields.length > 0 ? method.fields.join(', ') : 'None'}</td>
      <td>
        <button onclick="deleteMethod(${idx})" class="action-btn btn-secondary" style="background:#e53935;color:white;border:none;">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.addEventListener('load', () => {
    const select = document.getElementById('businessSelect');
    if (select && select.options.length > 1) {
        select.value = select.options[1].value;
        loadPaymentMethods();
    }
});
