<div class="section">
    <div class="section-header collapsed" onclick="toggleSection(this)">Additional</div>
    <div class="section-content collapsed">
        @auth
        <label>Reference Prefix</label>
        <input id="refPrefix" value="REF" placeholder="REF" maxlength="10">

        <label>Reference Number (Auto)</label>
        <input id="refNumber" value="" placeholder="001" readonly>

        <label>Date/Time Override</label>
        <input id="manualDateTime" type="datetime-local" placeholder="Leave empty for auto">

        <label>QR Code Content</label>
        <input id="qrContent" value="https://x.com/OBGang_Music" placeholder="URL, phone, UPI ID" maxlength="500">

        <label>Payment Status</label>
        <select id="paymentStatus">
            <option value="paid">Paid</option>
            <option value="due">Due</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
        </select>

        <div id="partialPaymentField" style="display:none;">
            <label>Amount Paid</label>
            <input id="amountPaid" type="number" step="0.01" value="0" min="0" max="9999999">
        </div>

        <label>Payment Method</label>
        <select id="paymentMethod" onchange="updatePaymentFields()">
            <option value="">Select payment method</option>
        </select>
        <a href="/payment-methods" class="btn-secondary" style="display:block;text-align:center;text-decoration:none;margin-top:8px;font-size:11px;padding:6px;">+ Add Payment Method</a>

        <div id="paymentFieldsContainer"></div>
        @endauth
    </div>
</div>
