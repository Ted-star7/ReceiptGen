<div id="toastContainer"></div>

<div id="confirmModal" style="display:none;">
    <div class="modal-overlay" onclick="closeModal()"></div>
    <div class="modal-content">
        <h3 id="modalTitle">Confirm</h3>
        <p id="modalMessage"></p>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn-primary" id="modalConfirmBtn">Confirm</button>
        </div>
    </div>
</div>
