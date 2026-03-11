<div class="section">
    <div class="section-header" onclick="toggleSection(this)">Customer</div>
    <div class="section-content">
        @auth
        <label>Select Customer</label>
        <select id="customerSelect">
            <option value="">Walk-in Customer</option>
        </select>
        
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border-light);">
            <label>Quick Add Customer</label>
            <input id="quickCustomerName" placeholder="Customer name">
            <input id="quickCustomerPhone" placeholder="Phone (optional)" style="margin-top:8px;">
            <button class="btn-secondary" onclick="quickAddCustomer()" style="margin-top:8px;font-size:11px;padding:6px;">Add Customer</button>
        </div>
        
        <a href="/customers" class="btn-secondary" style="display:block;text-align:center;text-decoration:none;margin-top:8px;font-size:11px;padding:6px;">Manage Customers</a>
        @else
        <p style="font-size:12px;color:var(--text-secondary);margin:0;">Login to add customers</p>
        <a href="/login" class="btn-primary" style="display:block;text-align:center;text-decoration:none;margin-top:8px;">Login</a>
        @endauth
    </div>
</div>
