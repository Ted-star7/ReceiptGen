<div class="section">
    <div class="section-header" onclick="toggleSection(this)">Items</div>
    <div class="section-content">
        <label>Search Product</label>
        <div class="input-group">
            <input id="productSearch" placeholder="Search products...">
            <div class="product-suggestions" id="productSuggestions"></div>
        </div>
        
        <label style="margin-top:20px;">Items</label>
        <div id="itemsContainer"></div>
        <button type="button" onclick="addItem()" class="btn-secondary">Add Item</button>
        <a href="/products" class="btn-secondary" style="display:block;text-align:center;text-decoration:none;">Manage Products</a>
    </div>
</div>
