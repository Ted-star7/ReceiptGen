<div class="section">
    <div class="section-header collapsed" onclick="toggleSection(this)">Appearance</div>
    <div class="section-content collapsed">
        <label>Paper Size</label>
        <select id="paperSize">
            <optgroup label="Thermal Rolls">
                <option value="58">Thermal 58mm</option>
                <option value="76">Thermal 76mm</option>
                <option value="80" selected>Thermal 80mm</option>
                <option value="112">Thermal 112mm</option>
            </optgroup>
            <optgroup label="Standard Paper">
                <option value="a4">A4 (210 x 297mm)</option>
                <option value="a5">A5 (148 x 210mm)</option>
                <option value="a6">A6 (105 x 148mm)</option>
                <option value="letter">Letter (216 x 279mm)</option>
                <option value="legal">Legal (216 x 356mm)</option>
                <option value="half-letter">Half Letter (140 x 216mm)</option>
            </optgroup>
        </select>

        <label>Font Family</label>
        <select id="fontFamily">
            <option value="'Roboto Mono', monospace">Roboto Mono</option>
            <option value="'Inter', system-ui">Inter</option>
            <option value="'Poppins', sans-serif">Poppins</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Roboto', sans-serif">Roboto</option>
        </select>

        <label>Colors</label>
        <div class="color-grid">
            <input type="color" id="colorPrimary" value="#d32f2f" title="Primary">
            <input type="color" id="colorBg" value="#ffffff" title="Background">
            <input type="color" id="colorText" value="#111111" title="Text">
        </div>
    </div>
</div>
