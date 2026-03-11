<div class="section">
    <div class="section-header collapsed" onclick="toggleSection(this)">Pricing</div>
    <div class="section-content collapsed">
        <label>Global Discount</label>
        <div class="flex-row">
            <input id="globalDiscValue" type="number" step="0.01" value="0" min="0" max="999999">
            <select id="globalDiscType">
                <option value="percent">%</option>
                <option value="fixed">KES</option>
            </select>
        </div>

        <label>Tax / VAT (%)</label>
        <input id="taxRate" type="number" step="0.1" value="16" min="0" max="100">
    </div>
</div>
