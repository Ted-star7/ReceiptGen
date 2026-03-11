const pageSizes = {
  '58': { width: 58, height: 'auto' },
  '76': { width: 76, height: 'auto' },
  '80': { width: 80, height: 'auto' },
  '112': { width: 112, height: 'auto' },
  'a4': { width: 210, height: 297 },
  'a5': { width: 148, height: 210 },
  'a6': { width: 105, height: 148 },
  'letter': { width: 216, height: 279 },
  'legal': { width: 216, height: 356 },
  'half-letter': { width: 140, height: 216 }
};

let itemCounter = 0;


function saveBusinessData() {
  const businessId = document.getElementById('businessSelect')?.value;
  if (!businessId) return;
  
  const data = {
    name: document.getElementById('shopName').value,
    location: document.getElementById('shopLocation').value,
    phone: document.getElementById('shopPhone').value,
    branch: document.getElementById('shopBranch').value,
    footer_message: document.getElementById('footerMessage').value,
    paper_size: document.getElementById('paperSize')?.value,
    font_family: document.getElementById('fontFamily')?.value,
    tax_rate: document.getElementById('taxRate')?.value,
    receipt_prefix: document.getElementById('refPrefix')?.value,
    qr_content: document.getElementById('qrContent')?.value
  };
  
  fetch(`/businesses/${businessId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      const select = document.getElementById('businessSelect');
      const option = select.querySelector(`option[value="${businessId}"]`);
      if (option) option.textContent = data.name;
      showToast('Business updated successfully', 'success');
      updateReceipt();
    }
  })
  .catch(() => showToast('Failed to update business', 'error'));
}

function addItem(name='', qty=1, price=0, disc=0, discType='fixed') {
  itemCounter++;
  const id = `item-${itemCounter}`;
  const html = `
    <div class="item-row" id="${id}" style="margin-bottom:16px;padding:12px;background:#f9f9f9;border:1px solid var(--border);">
      <label style="margin:0 0 6px;">Item Name</label>
      <input type="text" placeholder="Item name" value="${name}" class="itemDesc" required style="width:100%;margin-bottom:8px;">
      
      <div class="item-fields-grid">
        <div>
          <label style="margin:0 0 4px;font-size:11px;">Qty</label>
          <input type="number" step="1" min="1" value="${qty}" class="qtyInput" required>
        </div>
        <div>
          <label style="margin:0 0 4px;font-size:11px;">Price</label>
          <input type="number" step="0.01" min="0" value="${price}" class="priceInput" required>
        </div>
        <div class="discount-field">
          <label style="margin:0 0 4px;font-size:11px;">Discount</label>
          <div style="display:flex;gap:4px;">
            <input type="number" step="0.01" min="0" value="${disc}" class="discInput" style="flex:1;">
            <select class="discType" style="width:70px;">
              <option value="fixed" ${discType==='fixed'?'selected':''}>KES</option>
              <option value="percent" ${discType==='percent'?'selected':''}>%</option>
            </select>
          </div>
        </div>
      </div>
      
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button onclick="saveItemToProducts('${id}')" class="btn-secondary" style="flex:1;margin:0;padding:6px;font-size:11px;">Save to Products</button>
        <button onclick="removeItem('${id}')" style="flex:1;margin:0;padding:6px;background:#e53935;color:white;border:none;cursor:pointer;font-size:11px;">Remove</button>
      </div>
    </div>
  `;
  document.getElementById('itemsContainer').insertAdjacentHTML('beforeend', html);
  listenItemInputs();
  validateItemInputs();
}

function saveItemToProducts(itemId) {
  const row = document.getElementById(itemId);
  if (!row) return;
  
  const name = row.querySelector('.itemDesc').value.trim();
  const price = parseFloat(row.querySelector('.priceInput').value) || 0;
  const sku = '';
  const stock = 0;
  
  if (!name) {
    showToast('Item name is required', 'error');
    return;
  }
  
  const businessId = document.getElementById('businessSelect')?.value;
  const isLoggedIn = document.querySelector('meta[name="csrf-token"]');
  
  if (isLoggedIn && businessId) {
    fetch('/api/receipt-data/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({
        business_id: businessId,
        products: [{ name, sku, price, stock }]
      })
    })
    .then(res => res.json())
    .then(result => {
      showToast('Item saved to products', 'success');
      const storageKey = `products_${businessId}`;
      const products = JSON.parse(localStorage.getItem(storageKey) || '[]');
      products.push({ id: Date.now(), name, sku, price, stock });
      localStorage.setItem(storageKey, JSON.stringify(products));
    })
    .catch(err => {
      console.error('Error saving product:', err);
      showToast('Failed to save product', 'error');
    });
  } else {
    const storageKey = businessId ? `products_${businessId}` : 'products';
    const products = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const exists = products.find(p => p.name.toLowerCase() === name.toLowerCase());
    
    if (exists) {
      showToast('Product already exists', 'error');
      return;
    }
    
    products.push({ id: Date.now(), name, sku, price, stock });
    localStorage.setItem(storageKey, JSON.stringify(products));
    showToast('Item saved to products', 'success');
  }
}

function getBusinessStorageKey(key) {
  const userMeta = document.querySelector('meta[name="user-id"]');
  const userId = userMeta ? userMeta.content : 'guest';
  return `${key}_${userId}`;
}

function removeItem(id) {
  document.getElementById(id)?.remove();
  updateReceipt();
}

function listenItemInputs() {
  document.querySelectorAll('.item-row input').forEach(el => {
    el.removeEventListener('input', updateReceipt);
    el.addEventListener('input', updateReceipt);
    el.removeEventListener('keyup', validateItemInputs);
    el.addEventListener('keyup', validateItemInputs);
  });
}

function validateItemInputs() {
  document.querySelectorAll('.item-row').forEach(row => {
    const desc = row.querySelector('.itemDesc');
    const qty = row.querySelector('.qtyInput');
    const price = row.querySelector('.priceInput');
    const disc = row.querySelector('.discInput');
    const discType = row.querySelector('.discType');
    
    // Validate item name
    if (desc.value.trim() === '') {
      desc.style.borderColor = '#e53935';
    } else {
      desc.style.borderColor = '';
    }
    
    // Validate quantity
    const qtyVal = parseFloat(qty.value);
    if (isNaN(qtyVal) || qtyVal < 1) {
      qty.style.borderColor = '#e53935';
    } else {
      qty.style.borderColor = '';
    }
    
    // Validate price
    const priceVal = parseFloat(price.value);
    if (isNaN(priceVal) || priceVal < 0) {
      price.style.borderColor = '#e53935';
    } else {
      price.style.borderColor = '';
    }
    
    // Validate discount
    const discVal = parseFloat(disc.value);
    if (discVal < 0) {
      disc.style.borderColor = '#e53935';
    } else if (discType.value === 'percent' && discVal > 100) {
      disc.style.borderColor = '#e53935';
    } else {
      disc.style.borderColor = '';
    }
  });
}

const logoImg = document.getElementById('logoPreview');
const logoSlider = document.getElementById('logoHeightSlider');
const logoValueSpan = document.getElementById('logoHeightValue');

if (document.getElementById('logoUpload')) {
  document.getElementById('logoUpload').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      logoImg.src = ev.target.result;
      logoImg.style.display = 'block';
      applyLogoHeight();
      extractDominantColor(ev.target.result);
      autoSaveSettings();
    };
    reader.readAsDataURL(file);
  });
}

if (logoSlider) {
  logoSlider.addEventListener('input', () => {
    applyLogoHeight();
    autoSaveSettings();
  });
}

function applyLogoHeight() {
  if (!logoSlider || !logoImg || !logoValueSpan) return;
  const heightMm = parseFloat(logoSlider.value);
  logoValueSpan.textContent = heightMm + ' mm';
  logoImg.style.height = heightMm + 'mm';
  logoImg.style.maxHeight = heightMm + 'mm';
}

function extractDominantColor(imageSrc) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorMap = {};
    
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const a = imageData[i + 3];
      
      if (a < 125) continue;
      if (r > 250 && g > 250 && b > 250) continue;
      
      const rgb = `${r},${g},${b}`;
      colorMap[rgb] = (colorMap[rgb] || 0) + 1;
    }
    
    let dominantColor = null;
    let maxCount = 0;
    
    for (const [color, count] of Object.entries(colorMap)) {
      if (count > maxCount) {
        maxCount = count;
        dominantColor = color;
      }
    }
    
    if (dominantColor) {
      const [r, g, b] = dominantColor.split(',');
      const hex = `#${((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1)}`;
      
      if (document.getElementById('colorPrimary')) {
        document.getElementById('colorPrimary').value = hex;
        document.documentElement.style.setProperty('--primary', hex);
        autoSaveSettings();
      }
    }
  };
  img.src = imageSrc;
}

if (document.getElementById('fontFamily')) {
  document.getElementById('fontFamily').addEventListener('change', e => {
    const paper = document.querySelector('.receipt-paper');
    if (paper) paper.style.fontFamily = e.target.value;
    autoSaveSettings();
  });
}

['colorPrimary','colorBg','colorText'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', e => {
      document.documentElement.style.setProperty(`--${id.replace('color','').toLowerCase()}`, e.target.value);
      autoSaveSettings();
    });
  }
});

if (document.getElementById('paperSize')) {
  document.getElementById('paperSize').addEventListener('change', () => {
    updatePaperSize();
    autoSaveSettings();
  });
}

if (document.getElementById('paymentStatus')) {
  document.getElementById('paymentStatus').addEventListener('change', () => {
    const status = document.getElementById('paymentStatus').value;
    const partialField = document.getElementById('partialPaymentField');
    if (partialField) {
      partialField.style.display = status === 'partial' ? 'block' : 'none';
    }
    updateReceipt();
  });
}

function loadPaymentMethods() {
  const select = document.getElementById('paymentMethod');
  if (!select) return;
  
  const businessId = document.getElementById('businessSelect')?.value;
  const isLoggedIn = document.querySelector('meta[name="csrf-token"]');
  
  if (!isLoggedIn || !businessId) {
    const storageKey = businessId ? `paymentMethods_${businessId}` : 'paymentMethods';
    const methods = JSON.parse(localStorage.getItem(storageKey) || '[]');
    select.innerHTML = '<option value="">Select payment method</option>';
    methods.forEach(method => {
      const option = document.createElement('option');
      option.value = method.name;
      option.textContent = method.name;
      select.appendChild(option);
    });
  }
}

function updatePaymentFields() {
  const methodEl = document.getElementById('paymentMethod');
  const container = document.getElementById('paymentFieldsContainer');
  if (!methodEl || !container) return;
  
  const methodName = methodEl.value;
  container.innerHTML = '';
  
  if (!methodName) return;
  
  const methods = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
  const method = methods.find(m => m.name === methodName);
  
  if (method && method.fields.length > 0) {
    method.fields.forEach(fieldName => {
      const fieldId = `paymentField_${fieldName.replace(/\s+/g, '_')}`;
      const html = `
        <label style="margin-top:12px;">${fieldName}</label>
        <input id="${fieldId}" class="payment-field" placeholder="Enter ${fieldName.toLowerCase()}">
      `;
      container.insertAdjacentHTML('beforeend', html);
    });
    
    document.querySelectorAll('.payment-field').forEach(input => {
      input.addEventListener('input', () => {
        updateReceipt();
        autoSaveSettings();
      });
    });
  }
}

loadPaymentMethods();

function loadCustomers() {
  const select = document.getElementById('customerSelect');
  if (!select) return;
  
  const businessId = document.getElementById('businessSelect')?.value;
  const isLoggedIn = document.querySelector('meta[name="csrf-token"]');
  
  if (!isLoggedIn || !businessId) {
    select.innerHTML = '<option value="">Walk-in Customer</option>';
  }
}

if (document.getElementById('businessSelect')) {
  document.getElementById('businessSelect').addEventListener('change', () => {
    loadBusinessData();
    loadPaymentMethods();
  });
}

loadCustomers();

function quickAddCustomer() {
  const nameEl = document.getElementById('quickCustomerName');
  const phoneEl = document.getElementById('quickCustomerPhone');
  
  if (!nameEl || !phoneEl) return;
  
  const name = nameEl.value;
  const phone = phoneEl.value;
  const businessId = document.getElementById('businessSelect')?.value;
  
  if (!name) {
    showToast('Customer name is required', 'error');
    return;
  }
  
  const data = { name, phone, business_id: businessId };
  
  fetch('/api/receipt-data/customer', {
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
      showToast('Customer added successfully', 'success');
      nameEl.value = '';
      phoneEl.value = '';
      loadCustomers();
      const select = document.getElementById('customerSelect');
      if (select) select.value = result.customer.id;
    }
  })
  .catch(() => showToast('Failed to add customer', 'error'));
}

function updatePaperSize() {
  const paperEl = document.getElementById('paperSize');
  const paper = document.getElementById('receiptContent');
  if (!paperEl || !paper) return;
  
  const size = paperEl.value;
  const config = pageSizes[size];

  paper.setAttribute('data-size', size);

  if (['58', '76', '80', '112'].includes(size)) {
    paper.style.width = config.width + 'mm';
    paper.style.minHeight = 'auto';
    paper.style.maxWidth = config.width + 'mm';
  } else {
    paper.style.width = '100%';
    paper.style.maxWidth = config.width + 'mm';
    paper.style.minHeight = config.height + 'mm';
  }
}

function updateReceipt() {
  const saved = localStorage.getItem('receiptSettings');
  const data = saved ? JSON.parse(saved) : {};
  
  const shopName = document.getElementById('shopName')?.value || data.shopName || 'Business Name';
  const branch = document.getElementById('shopBranch')?.value || data.shopBranch || '';
  const location = document.getElementById('shopLocation')?.value || data.shopLocation || '';
  const phone = document.getElementById('shopPhone')?.value || data.shopPhone || '';
  
  const shopNameEl = document.getElementById('shopNameDisplay');
  const shopBranchEl = document.getElementById('shopBranchDisplay');
  const shopLocationEl = document.getElementById('shopLocationDisplay');
  const shopPhoneEl = document.getElementById('shopPhoneDisplay');
  
  if (shopNameEl) shopNameEl.textContent = shopName;
  if (shopBranchEl) shopBranchEl.textContent = branch;
  if (shopLocationEl) shopLocationEl.textContent = location;
  if (shopPhoneEl) shopPhoneEl.textContent = phone ? 'Tel: ' + phone : '';

  const taxRate = parseFloat(document.getElementById('taxRate')?.value || data.taxRate || 16);
  const taxRateEl = document.getElementById('taxRateDisplay');
  if (taxRateEl) taxRateEl.textContent = taxRate;

  const tbody = document.getElementById('itemsTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  let subtotal = 0;

  // Get items from DOM or localStorage
  const itemRows = document.querySelectorAll('.item-row');
  const items = itemRows.length > 0 ? Array.from(itemRows) : (data.items || []);
  
  items.forEach(item => {
    let desc, qty, price, disc, discType;
    
    if (item.querySelector) {
      // From DOM
      desc = item.querySelector('.itemDesc')?.value.trim();
      qty = parseFloat(item.querySelector('.qtyInput')?.value) || 1;
      price = parseFloat(item.querySelector('.priceInput')?.value) || 0;
      disc = parseFloat(item.querySelector('.discInput')?.value) || 0;
      discType = item.querySelector('.discType')?.value || 'fixed';
    } else {
      // From localStorage
      desc = item.desc;
      qty = parseFloat(item.qty) || 1;
      price = parseFloat(item.price) || 0;
      disc = parseFloat(item.disc) || 0;
      discType = item.discType || 'fixed';
    }

    if (!desc) return;

    const itemSubtotal = qty * price;
    const discAmount = discType === 'percent' ? itemSubtotal * (disc/100) : disc;
    const lineTotal = itemSubtotal - discAmount;
    subtotal += lineTotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="item-name">${desc}</td>
      <td class="qty">${qty}</td>
      <td class="amount">${lineTotal.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);

    if (disc > 0) {
      const discTr = document.createElement('tr');
      const discLabel = discType === 'percent' ? `${disc}%` : discAmount.toFixed(2);
      discTr.innerHTML = `<td colspan="3" class="discount-line">  └─ discount ${discLabel}</td>`;
      tbody.appendChild(discTr);
    }
  });

  const gDiscVal = parseFloat(document.getElementById('globalDiscValue')?.value || data.globalDiscValue || 0);
  const gDiscType = document.getElementById('globalDiscType')?.value || data.globalDiscType || 'percent';
  let globalDiscAmount = 0;

  const globalDiscEl = document.getElementById('globalDiscount');
  const globalDiscRowEl = document.getElementById('globalDiscountRow');
  
  if (gDiscVal > 0) {
    globalDiscAmount = gDiscType === 'percent' ? subtotal * (gDiscVal/100) : gDiscVal;
    if (globalDiscEl) globalDiscEl.textContent = '-' + globalDiscAmount.toFixed(2);
    if (globalDiscRowEl) globalDiscRowEl.style.display = 'table-row';
  } else {
    if (globalDiscRowEl) globalDiscRowEl.style.display = 'none';
  }

  const afterDisc = subtotal - globalDiscAmount;
  const taxAmount = afterDisc * (taxRate / 100);
  const grandTotal = afterDisc + taxAmount;

  const subtotalEl = document.getElementById('subtotal');
  const taxAmountEl = document.getElementById('taxAmount');
  const grandTotalEl = document.getElementById('grandTotal');
  
  if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
  if (taxAmountEl) taxAmountEl.textContent = taxAmount.toFixed(2);
  if (grandTotalEl) grandTotalEl.textContent = grandTotal.toFixed(2);

  const refNum = document.getElementById('refNumber')?.value || (data.refPrefix ? `${data.refPrefix}-000` : '');
  const refDisplayEl = document.getElementById('refDisplay');
  if (refDisplayEl) refDisplayEl.textContent = refNum ? `Ref: ${refNum}` : '';

  const footerMsg = document.getElementById('footerMessage')?.value || data.footerMessage || 'Thank you for your purchase!';
  const thanksDisplayEl = document.getElementById('thanksDisplay');
  if (thanksDisplayEl) thanksDisplayEl.textContent = footerMsg;

  // Get customer name
  const customerSelect = document.getElementById('customerSelect');
  let customerName = 'Walk-in';
  if (customerSelect && customerSelect.value) {
    const selectedOption = customerSelect.options[customerSelect.selectedIndex];
    customerName = selectedOption.text;
  }
  const customerDisplayEl = document.getElementById('customerDisplay');
  if (customerDisplayEl) customerDisplayEl.textContent = `Customer: ${customerName}`;

  const status = document.getElementById('paymentStatus')?.value || data.paymentStatus || 'paid';
  const statusDisplay = document.getElementById('statusDisplay');
  const paidRowEl = document.getElementById('paidRow');
  const balanceRowEl = document.getElementById('balanceRow');
  const paidAmountEl = document.getElementById('paidAmount');
  const balanceAmountEl = document.getElementById('balanceAmount');
  
  if (status === 'partial') {
    const amountPaid = parseFloat(document.getElementById('amountPaid')?.value || data.amountPaid || 0);
    const balance = grandTotal - amountPaid;
    
    if (paidRowEl) paidRowEl.style.display = 'table-row';
    if (balanceRowEl) balanceRowEl.style.display = 'table-row';
    if (paidAmountEl) paidAmountEl.textContent = amountPaid.toFixed(2);
    if (balanceAmountEl) balanceAmountEl.textContent = balance.toFixed(2);
    
    if (statusDisplay) statusDisplay.textContent = `Status: PARTIAL`;
  } else {
    if (paidRowEl) paidRowEl.style.display = 'none';
    if (balanceRowEl) balanceRowEl.style.display = 'none';
    if (statusDisplay) statusDisplay.textContent = `Status: ${status.toUpperCase()}`;
  }

  const paymentMethod = document.getElementById('paymentMethod')?.value || data.paymentMethod || '';
  const paymentMethodDisplayEl = document.getElementById('paymentMethodDisplay');
  if (paymentMethodDisplayEl) {
    paymentMethodDisplayEl.textContent = paymentMethod ? `Payment: ${paymentMethod.toUpperCase()}` : '';
  }

  const paymentFields = [];
  document.querySelectorAll('.payment-field').forEach(input => {
    const value = input.value.trim();
    if (value) {
      const label = input.previousElementSibling.textContent;
      paymentFields.push(`${label}: ${value}`);
    }
  });
  
  // Fall back to saved payment field data if no DOM fields
  if (paymentFields.length === 0 && data.paymentFieldData) {
    Object.keys(data.paymentFieldData).forEach(fieldId => {
      const value = data.paymentFieldData[fieldId];
      if (value) {
        const label = fieldId.replace('paymentField_', '').replace(/_/g, ' ');
        paymentFields.push(`${label}: ${value}`);
      }
    });
  }
  
  const paymentDetailsDisplayEl = document.getElementById('paymentDetailsDisplay');
  if (paymentDetailsDisplayEl) {
    paymentDetailsDisplayEl.textContent = paymentFields.length > 0 ? paymentFields.join(' | ') : '';
  }

  if (typeof updateDateTime === 'function') updateDateTime();

  const qrEl = document.getElementById('qrcode');
  if (qrEl) {
    const content = document.getElementById('qrContent')?.value || data.qrContent || '';
    qrEl.innerHTML = '';
    if (content && typeof QRCode !== 'undefined') {
      new QRCode(qrEl, {
        text: content,
        width: 70,
        height: 70,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
      const qrLabelEl = document.getElementById('qrLabel');
      if (qrLabelEl) qrLabelEl.textContent = content.length > 40 ? content.substring(0,37)+'...' : content;
    }
  }
}

['shopName','shopBranch','shopLocation','shopPhone','taxRate','globalDiscValue','globalDiscType','qrContent','refNumber','manualDateTime','footerMessage','paymentStatus','amountPaid','paymentMethod'].forEach(id => {
  const input = document.getElementById(id);
  if (!input) return;
  input.addEventListener('input', () => {
    validateInput(input);
    updateReceipt();
    autoSaveSettings();
  });
  input.addEventListener('blur', () => {
    validateInput(input);
    autoSaveSettings();
  });
});

function validateInput(input) {
  const value = input.value;
  let isValid = true;
  
  // Phone validation
  if (input.id === 'shopPhone') {
    const phonePattern = /^[+]?[0-9\s-]{0,20}$/;
    isValid = phonePattern.test(value);
  }
  
  // Tax rate validation
  if (input.id === 'taxRate') {
    const val = parseFloat(value);
    isValid = !isNaN(val) && val >= 0 && val <= 100;
  }
  
  // Global discount validation
  if (input.id === 'globalDiscValue') {
    const val = parseFloat(value);
    const type = document.getElementById('globalDiscType').value;
    if (type === 'percent') {
      isValid = !isNaN(val) && val >= 0 && val <= 100;
    } else {
      isValid = !isNaN(val) && val >= 0;
    }
  }
  
  // Amount paid validation
  if (input.id === 'amountPaid') {
    const val = parseFloat(value);
    isValid = !isNaN(val) && val >= 0;
  }
  
  input.style.borderColor = isValid ? '' : '#e53935';
}

if (document.getElementById('refPrefix')) {
  document.getElementById('refPrefix').addEventListener('input', () => {
    updateRefNumber();
    updateReceipt();
  });
}

let locationTimeout;
if (document.getElementById('shopLocation')) {
  document.getElementById('shopLocation').addEventListener('input', (e) => {
    clearTimeout(locationTimeout);
    const query = e.target.value.trim();

    if (query.length < 3) {
      const suggestions = document.getElementById('locationSuggestions');
      if (suggestions) suggestions.style.display = 'none';
      return;
    }

    locationTimeout = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
        .then(res => res.json())
        .then(data => {
          const suggestions = document.getElementById('locationSuggestions');
          if (!suggestions) return;
          suggestions.innerHTML = '';

          if (data.length > 0) {
            data.forEach(item => {
              const div = document.createElement('div');
              div.className = 'location-item';
              div.textContent = item.display_name;
              div.onclick = () => {
                document.getElementById('shopLocation').value = item.display_name;
                suggestions.style.display = 'none';
                updateReceipt();
              };
              suggestions.appendChild(div);
            });
            suggestions.style.display = 'block';
          } else {
            suggestions.style.display = 'none';
          }
        })
        .catch(() => {
          const suggestions = document.getElementById('locationSuggestions');
          if (suggestions) suggestions.style.display = 'none';
        });
    }, 300);
  });
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.input-group')) {
    const locationSuggestions = document.getElementById('locationSuggestions');
    const productSuggestions = document.getElementById('productSuggestions');
    if (locationSuggestions) locationSuggestions.style.display = 'none';
    if (productSuggestions) productSuggestions.style.display = 'none';
  }
});

let productTimeout;
if (document.getElementById('productSearch')) {
  document.getElementById('productSearch').addEventListener('input', (e) => {
    clearTimeout(productTimeout);
    const query = e.target.value.trim().toLowerCase();

    if (query.length < 2) {
      const suggestions = document.getElementById('productSuggestions');
      if (suggestions) suggestions.style.display = 'none';
      return;
    }

    productTimeout = setTimeout(() => {
      const businessId = document.getElementById('businessSelect')?.value;
      const isLoggedIn = document.querySelector('meta[name="csrf-token"]');
      const storageKey = businessId ? `products_${businessId}` : 'products';
      const products = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.sku && p.sku.toLowerCase().includes(query))
      ).slice(0, 5);

      const suggestions = document.getElementById('productSuggestions');
      if (!suggestions) return;
      suggestions.innerHTML = '';

      if (filtered.length > 0) {
        filtered.forEach(product => {
          const div = document.createElement('div');
          div.className = 'product-item';
          div.innerHTML = `
            <span class="product-name">${product.name}</span>
            <span class="product-price">${product.price.toFixed(2)}</span>
          `;
          div.onclick = () => {
            addItem(product.name, 1, product.price, 0, 'fixed');
            document.getElementById('productSearch').value = '';
            suggestions.style.display = 'none';
            updateReceipt();
          };
          suggestions.appendChild(div);
        });
        suggestions.style.display = 'block';
      } else {
        suggestions.style.display = 'none';
      }
    }, 200);
  });
}

function showLogin() {
  const user = localStorage.getItem('currentUser');
  if (user) {
    if (confirm('Logout?')) {
      localStorage.removeItem('currentUser');
      alert('Logged out');
    }
  } else {
    const username = prompt('Username:');
    if (username) {
      localStorage.setItem('currentUser', username);
      alert('Logged in as ' + username);
    }
  }
}

function openProductManager() {
  window.open('products.html', '_blank');
}

function openPaymentMethodManager() {
  window.open('payment-methods.html', '_blank');
}

function printReceipt() {
  if (!isLoggedIn()) {
    showLoginPrompt();
    return;
  }
  saveOrder();
  incrementRefNumber();
  window.print();
}

function generatePDF() {
  if (!isLoggedIn()) {
    showLoginPrompt();
    return;
  }
  saveOrder();
  incrementRefNumber();
  const element = document.getElementById('receiptContent');
  const size = document.getElementById('paperSize').value;
  const config = pageSizes[size];

  let format;
  if (['58', '76', '80', '112'].includes(size)) {
    format = [config.width, element.offsetHeight / 3.78 + 2];
  } else {
    format = [config.width, config.height];
  }

  const opt = {
    margin: [1, 0, 1, 0],
    filename: 'receipt.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3, useCORS: true, logging: false, scrollY: 0, scrollX: 0 },
    jsPDF: { unit: 'mm', format: format, orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

function isLoggedIn() {
  return document.querySelector('meta[name="csrf-token"]') !== null;
}

function showLoginPrompt() {
  const message = 'Please login or create an account to save your receipts and track your statements. Your current data is saved locally and won\'t be lost.';
  if (confirm(message + '\n\nGo to login page?')) {
    window.location.href = '/login';
  }
}

function saveOrder() {
  const items = [];
  document.querySelectorAll('.item-row').forEach(row => {
    const desc = row.querySelector('.itemDesc').value.trim();
    if (desc) {
      items.push({
        name: desc,
        qty: parseFloat(row.querySelector('.qtyInput').value) || 1,
        price: parseFloat(row.querySelector('.priceInput').value) || 0,
        discount: parseFloat(row.querySelector('.discInput').value) || 0,
        discountType: row.querySelector('.discType').value
      });
    }
  });

  const subtotal = parseFloat(document.getElementById('subtotal').textContent) || 0;
  const tax = parseFloat(document.getElementById('taxAmount').textContent) || 0;
  const total = parseFloat(document.getElementById('grandTotal').textContent) || 0;
  const globalDisc = parseFloat(document.getElementById('globalDiscount').textContent.replace('-', '')) || 0;
  const businessId = document.getElementById('businessSelect')?.value;
  const customerId = document.getElementById('customerSelect')?.value;

  const orderData = {
    business_id: businessId,
    customer_id: customerId || null,
    ref_number: document.getElementById('refNumber').value,
    items: items,
    subtotal: subtotal,
    discount: globalDisc,
    tax: tax,
    total: total,
    payment_status: document.getElementById('paymentStatus').value,
    payment_method: document.getElementById('paymentMethod').value,
    amount_paid: parseFloat(document.getElementById('amountPaid').value) || null
  };

  fetch('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
    },
    body: JSON.stringify(orderData)
  }).catch(err => console.log('Order save failed:', err));
}

function autoSaveSettings() {
  const itemsContainer = document.getElementById('itemsContainer');
  if (!itemsContainer) return;
  
  const paymentFieldData = {};
  document.querySelectorAll('.payment-field').forEach(input => {
    paymentFieldData[input.id] = input.value;
  });
  
  const items = [];
  document.querySelectorAll('.item-row').forEach(row => {
    items.push({
      desc: row.querySelector('.itemDesc').value,
      qty: row.querySelector('.qtyInput').value,
      price: row.querySelector('.priceInput').value,
      disc: row.querySelector('.discInput').value,
      discType: row.querySelector('.discType').value
    });
  });
  
  const data = {
    shopName: document.getElementById('shopName')?.value || '',
    shopBranch: document.getElementById('shopBranch')?.value || '',
    shopLocation: document.getElementById('shopLocation')?.value || '',
    shopPhone: document.getElementById('shopPhone')?.value || '',
    footerMessage: document.getElementById('footerMessage')?.value || '',
    qrContent: document.getElementById('qrContent')?.value || '',
    paymentStatus: document.getElementById('paymentStatus')?.value || '',
    amountPaid: document.getElementById('amountPaid')?.value || '',
    paymentMethod: document.getElementById('paymentMethod')?.value || '',
    paymentFieldData: paymentFieldData,
    refPrefix: document.getElementById('refPrefix')?.value || '',
    manualDateTime: document.getElementById('manualDateTime')?.value || '',
    taxRate: document.getElementById('taxRate')?.value || '',
    globalDiscValue: document.getElementById('globalDiscValue')?.value || '',
    globalDiscType: document.getElementById('globalDiscType')?.value || '',
    items: items,
    logoSrc: logoImg?.src || '',
    logoHeight: logoSlider?.value || '',
    paperSize: document.getElementById('paperSize')?.value || '',
    fontFamily: document.getElementById('fontFamily')?.value || '',
    colorPrimary: document.getElementById('colorPrimary')?.value || '',
    colorBg: document.getElementById('colorBg')?.value || '',
    colorText: document.getElementById('colorText')?.value || ''
  };
  localStorage.setItem('receiptSettings', JSON.stringify(data));
  
  const businessId = document.getElementById('businessSelect')?.value;
  const isLoggedIn = document.querySelector('meta[name="csrf-token"]');
  
  if (isLoggedIn && businessId) {
    fetch(`/businesses/${businessId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({
        name: data.shopName,
        phone: data.shopPhone,
        location: data.shopLocation,
        branch: data.shopBranch,
        footer_message: data.footerMessage,
        paper_size: data.paperSize,
        font_family: data.fontFamily,
        tax_rate: data.taxRate,
        receipt_prefix: data.refPrefix,
        qr_content: data.qrContent
      })
    }).catch(() => {});
  }
}

function saveAllSettings() {
  autoSaveSettings();
  showToast('Settings saved successfully!', 'success');
}

function saveCompanyDetails() { saveAllSettings(); }
function saveAppearance() { saveAllSettings(); }

function loadCompanyDetails() {
  const businessId = document.getElementById('businessSelect')?.value;
  const isLoggedIn = document.querySelector('meta[name="csrf-token"]');
  
  if (!isLoggedIn || !businessId) {
    loadFromLocalStorage();
  }
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('receiptSettings');
  if (!saved) return;

  const data = JSON.parse(saved);
  
  if (document.getElementById('shopName')) document.getElementById('shopName').value = data.shopName || '';
  if (document.getElementById('shopBranch')) document.getElementById('shopBranch').value = data.shopBranch || '';
  if (document.getElementById('shopLocation')) document.getElementById('shopLocation').value = data.shopLocation || '';
  if (document.getElementById('shopPhone')) document.getElementById('shopPhone').value = data.shopPhone || '';
  if (document.getElementById('footerMessage')) document.getElementById('footerMessage').value = data.footerMessage || 'Thank you for your purchase!';
  if (document.getElementById('qrContent')) document.getElementById('qrContent').value = data.qrContent || '';
  if (document.getElementById('refPrefix')) document.getElementById('refPrefix').value = data.refPrefix || '';
  if (document.getElementById('manualDateTime')) document.getElementById('manualDateTime').value = data.manualDateTime || '';
  if (document.getElementById('taxRate')) document.getElementById('taxRate').value = data.taxRate || '';
  if (document.getElementById('globalDiscValue')) document.getElementById('globalDiscValue').value = data.globalDiscValue || '';
  if (document.getElementById('globalDiscType')) document.getElementById('globalDiscType').value = data.globalDiscType || '';
  
  if (document.getElementById('paymentStatus')) {
    document.getElementById('paymentStatus').value = data.paymentStatus || '';
    const partialField = document.getElementById('partialPaymentField');
    if (partialField) partialField.style.display = data.paymentStatus === 'partial' ? 'block' : 'none';
  }
  if (document.getElementById('amountPaid')) document.getElementById('amountPaid').value = data.amountPaid || '';
  if (document.getElementById('paymentMethod')) {
    document.getElementById('paymentMethod').value = data.paymentMethod || '';
    if (typeof updatePaymentFields === 'function') updatePaymentFields();
    if (data.paymentFieldData) {
      Object.keys(data.paymentFieldData).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = data.paymentFieldData[fieldId];
      });
    }
  }

  if (logoImg && data.logoSrc && data.logoSrc !== '') {
    logoImg.src = data.logoSrc;
    logoImg.style.display = 'block';
    if (data.logoHeight) {
      logoImg.style.height = data.logoHeight + 'mm';
      logoImg.style.maxHeight = data.logoHeight + 'mm';
    }
  }

  if (logoSlider && data.logoHeight) {
    logoSlider.value = data.logoHeight;
    if (typeof applyLogoHeight === 'function') applyLogoHeight();
  }

  if (document.getElementById('paperSize') && data.paperSize) {
    document.getElementById('paperSize').value = data.paperSize;
    if (typeof updatePaperSize === 'function') updatePaperSize();
  }
  if (document.getElementById('fontFamily') && data.fontFamily) {
    document.getElementById('fontFamily').value = data.fontFamily;
    const paper = document.querySelector('.receipt-paper');
    if (paper) paper.style.fontFamily = data.fontFamily;
  }
  if (document.getElementById('colorPrimary') && data.colorPrimary) {
    document.getElementById('colorPrimary').value = data.colorPrimary;
    document.documentElement.style.setProperty('--primary', data.colorPrimary);
  }
  if (document.getElementById('colorBg') && data.colorBg) {
    document.getElementById('colorBg').value = data.colorBg;
    document.documentElement.style.setProperty('--bg', data.colorBg);
  }
  if (document.getElementById('colorText') && data.colorText) {
    document.getElementById('colorText').value = data.colorText;
    document.documentElement.style.setProperty('--text', data.colorText);
  }
  
  const itemsContainer = document.getElementById('itemsContainer');
  if (itemsContainer && data.items && data.items.length > 0) {
    data.items.forEach(item => {
      if (item.desc) addItem(item.desc, item.qty, item.price, item.disc, item.discType);
    });
  }
  
  if (typeof updateReceipt === 'function') updateReceipt();
}

function loadAppearance() { }

function updateDateTime() {
  const dateTimeDisplayEl = document.getElementById('dateTimeDisplay');
  if (!dateTimeDisplayEl) return;
  
  const saved = localStorage.getItem('receiptSettings');
  const data = saved ? JSON.parse(saved) : {};
  const manualInput = document.getElementById('manualDateTime')?.value || data.manualDateTime;

  if (manualInput) {
    const dt = new Date(manualInput);
    const dateStr = dt.toLocaleDateString('en-GB');
    const timeStr = dt.toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
    dateTimeDisplayEl.textContent = `${dateStr} ${timeStr}`;
  } else {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB');
    const timeStr = now.toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
    dateTimeDisplayEl.textContent = `${dateStr} ${timeStr}`;
  }
}

setInterval(updateDateTime, 1000);

function updateRefNumber() {
  const refPrefixEl = document.getElementById('refPrefix');
  const refNumberEl = document.getElementById('refNumber');
  if (!refPrefixEl || !refNumberEl) return;
  
  const prefix = refPrefixEl.value.trim() || 'REF';
  const counter = parseInt(localStorage.getItem('receiptCounter') || '0');
  const refNum = `${prefix}-${counter.toString().padStart(3, '0')}`;
  refNumberEl.value = refNum;
}

function incrementRefNumber() {
  let counter = parseInt(localStorage.getItem('receiptCounter') || '0');
  counter++;
  localStorage.setItem('receiptCounter', counter.toString());
  updateRefNumber();
}

loadCompanyDetails();
loadAppearance();
updateRefNumber();

const savedProducts = localStorage.getItem(getBusinessStorageKey('products'));
if (!savedProducts) {
  localStorage.setItem(getBusinessStorageKey('products'), JSON.stringify([]));
}

const savedSettings = localStorage.getItem('receiptSettings');
if (!savedSettings) {
  const initData = {
    shopName: 'O.B Gang Store',
    shopBranch: '',
    shopLocation: 'Nairobi',
    shopPhone: '+254 712 345 678',
    footerMessage: 'Thank you for your purchase!',
    taxRate: 16,
    items: [
      { desc: 'Item 1', qty: 1, price: 1200, disc: 0, discType: 'fixed' },
      { desc: 'Item 2', qty: 1, price: 1500, disc: 200, discType: 'fixed' },
      { desc: 'Item 3', qty: 1, price: 1800, disc: 0, discType: 'fixed' }
    ]
  };
  localStorage.setItem('receiptSettings', JSON.stringify(initData));
}

if (document.getElementById('itemsContainer')) {
  const container = document.getElementById('itemsContainer');
  if (container.children.length === 0) {
    const data = JSON.parse(localStorage.getItem('receiptSettings'));
    if (data.items && data.items.length > 0) {
      data.items.forEach(item => addItem(item.desc, item.qty, item.price, item.disc, item.discType));
    }
  }
}
updateReceipt();
