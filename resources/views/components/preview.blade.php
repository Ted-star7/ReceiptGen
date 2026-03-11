<div id="preview">
    <div class="receipt-paper" id="receiptContent">
        <div class="logo-container">
            <img id="logoPreview" class="logo" src="" alt="" style="display:none;">
        </div>

        <div class="shop-name" id="shopNameDisplay">O.B Gang Store</div>
        <div class="shop-info" id="shopBranchDisplay"></div>
        <div class="shop-info" id="shopLocationDisplay">Nairobi</div>
        <div class="shop-info" id="shopPhoneDisplay">Tel: +254 712 345 678</div>

        <div class="receipt-header">
            <div class="receipt-meta">
                <div id="refDisplay"></div>
                <div id="dateTimeDisplay"></div>
            </div>
            <div class="receipt-status">
                <div id="statusDisplay"></div>
                <div id="customerDisplay" style="margin-top:2px;"></div>
            </div>
            <div id="paymentMethodDisplay" class="payment-info"></div>
            <div id="paymentDetailsDisplay" class="payment-details"></div>
        </div>

        <table>
            <thead>
                <tr>
                    <th class="item-name">Item</th>
                    <th class="qty">Qty</th>
                    <th class="price">Total</th>
                </tr>
            </thead>
            <tbody id="itemsTableBody"></tbody>
            <tfoot>
                <tr>
                    <td colspan="2">Subtotal</td>
                    <td class="amount" id="subtotal">0.00</td>
                </tr>
                <tr id="globalDiscountRow" style="display:none;">
                    <td colspan="2">Discount</td>
                    <td class="amount discount-line" id="globalDiscount">-0.00</td>
                </tr>
                <tr>
                    <td colspan="2">Tax (<span id="taxRateDisplay">16</span>%)</td>
                    <td class="amount" id="taxAmount">0.00</td>
                </tr>
                <tr>
                    <td colspan="2" class="total">TOTAL</td>
                    <td class="amount total" id="grandTotal">0.00</td>
                </tr>
                <tr id="paidRow" style="display:none;">
                    <td colspan="2">Paid</td>
                    <td class="amount" id="paidAmount">0.00</td>
                </tr>
                <tr id="balanceRow" style="display:none;">
                    <td colspan="2" style="font-weight:600;">Balance Due</td>
                    <td class="amount" style="font-weight:600;" id="balanceAmount">0.00</td>
                </tr>
            </tfoot>
        </table>

        <div class="thanks" id="thanksDisplay">Thank you for your purchase!</div>

        <div class="qr-area">
            <div id="qrcode" style="display:inline-block;"></div>
            <div style="font-size:10px; margin-top:4px;" id="qrLabel"></div>
        </div>

        <div style="text-align:center;margin-top:16px;padding-top:12px;border-top:1px solid #ddd;font-size:9px;color:#999;">
            Powered by: <a href="https://anzar.co.ke" target="_blank" style="color:#999;text-decoration:none;">Anzar KE</a>
        </div>
    </div>
</div>
