function loadBusinessData() {
  const businessId = document.getElementById('businessSelect')?.value;
  const content = document.getElementById('businessInfoContent');
  const sections = document.getElementById('businessSections');
  const receiptSections = document.getElementById('receiptSections');
  const isLoggedIn = document.querySelector('meta[name="csrf-token"]');
  
  if (!businessId) {
    if (content) content.style.display = 'none';
    if (sections) sections.style.display = 'none';
    if (receiptSections) receiptSections.style.display = 'none';
    return;
  }
  
  if (content) content.style.display = 'block';
  if (sections) sections.style.display = 'block';
  if (receiptSections) receiptSections.style.display = 'block';
  
  if (isLoggedIn) {
    console.log('Loading business data for:', businessId);
    fetch(`/api/business-data/${businessId}`)
      .then(res => {
        console.log('Response status:', res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Business data received:', data);
        prefillBusinessSettings(data.business);
        prefillProducts(data.products);
        prefillCustomers(data.customers);
        prefillPaymentMethods(data.payment_methods);
        updateReceipt();
      })
      .catch(err => console.error('Error loading business data:', err));
  }
}

function prefillBusinessSettings(business) {
  if (document.getElementById('shopName')) document.getElementById('shopName').value = business.name || '';
  if (document.getElementById('shopLocation')) document.getElementById('shopLocation').value = business.location || '';
  if (document.getElementById('shopPhone')) document.getElementById('shopPhone').value = business.phone || '';
  if (document.getElementById('shopBranch')) document.getElementById('shopBranch').value = business.branch || '';
  if (document.getElementById('footerMessage')) document.getElementById('footerMessage').value = business.footer_message || 'Thank you for your purchase!';
  if (document.getElementById('paperSize')) document.getElementById('paperSize').value = business.paper_size || '80';
  if (document.getElementById('fontFamily')) document.getElementById('fontFamily').value = business.font_family || "'Roboto Mono', monospace";
  if (document.getElementById('taxRate')) document.getElementById('taxRate').value = business.tax_rate || 16;
  if (document.getElementById('refPrefix')) document.getElementById('refPrefix').value = business.receipt_prefix || 'REF';
  if (document.getElementById('qrContent')) document.getElementById('qrContent').value = business.qr_content || '';
  
  if (document.getElementById('paperSize')) updatePaperSize();
  const paper = document.querySelector('.receipt-paper');
  if (document.getElementById('fontFamily') && paper) paper.style.fontFamily = business.font_family || "'Roboto Mono', monospace";
}

function prefillProducts(products) {
  const businessId = document.getElementById('businessSelect')?.value;
  const storageKey = `products_${businessId}`;
  const productList = products.map(p => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    price: p.price,
    stock: p.stock
  }));
  localStorage.setItem(storageKey, JSON.stringify(productList));
}

function prefillCustomers(customers) {
  const select = document.getElementById('customerSelect');
  if (!select) return;
  select.innerHTML = '<option value="">Walk-in Customer</option>';
  customers.forEach(customer => {
    const option = document.createElement('option');
    option.value = customer.id;
    option.textContent = customer.name;
    select.appendChild(option);
  });
  select.addEventListener('change', updateReceipt);
}

function prefillPaymentMethods(methods) {
  const businessId = document.getElementById('businessSelect')?.value;
  const storageKey = `paymentMethods_${businessId}`;
  const methodList = methods.map(m => ({
    id: m.id,
    name: m.name,
    fields: m.fields || []
  }));
  localStorage.setItem(storageKey, JSON.stringify(methodList));
  
  const select = document.getElementById('paymentMethod');
  if (!select) return;
  select.innerHTML = '<option value="">Select payment method</option>';
  methods.forEach(method => {
    const option = document.createElement('option');
    option.value = method.name;
    option.textContent = method.name;
    select.appendChild(option);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const savedBusinessId = localStorage.getItem('selectedBusinessId');
    const select = document.getElementById('businessSelect');
    if (savedBusinessId && select && select.querySelector(`option[value="${savedBusinessId}"]`)) {
      select.value = savedBusinessId;
      loadBusinessData();
    }
  }, 100);
});
