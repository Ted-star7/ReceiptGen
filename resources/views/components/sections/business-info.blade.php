<div class="section">
    <div class="section-header" onclick="toggleSection(this)">Business Info</div>
    <div class="section-content">
        @auth
        <div style="display:flex;gap:8px;margin-bottom:12px;">
            <select id="businessSelect" onchange="loadBusinessData()" style="flex:1;">
                <option value="">Select a business</option>
                @foreach(auth()->user()->businesses as $business)
                    <option value="{{ $business->id }}">{{ $business->name }}</option>
                @endforeach
            </select>
            <a href="/businesses/create" class="btn-secondary" style="width:auto;padding:8px 16px;margin:0;text-decoration:none;display:inline-block;">+ New</a>
        </div>
        
        <div id="businessInfoContent" style="display:none;">
        @endauth
        
        <label>Business Name</label>
        <input id="shopName" value="O.B Gang Store" placeholder="Your business name" maxlength="100" required>

        <label>Location</label>
        <div class="input-group">
            <input id="shopLocation" value="Nairobi" placeholder="City or address" maxlength="200">
            <div class="location-suggestions" id="locationSuggestions"></div>
        </div>

        <label>Phone Number</label>
        <input id="shopPhone" type="tel" value="+254 712 345 678" placeholder="+254 712 345 678" maxlength="20" pattern="[+]?[0-9\s-]+" title="Phone number can only contain numbers, spaces, hyphens and + sign (max 20 characters)">

        <label>Branch</label>
        <input id="shopBranch" placeholder="Branch name (optional)" maxlength="100">

        <label>Logo Upload</label>
        <input type="file" id="logoUpload" accept="image/*">

        <label>Logo Height (mm)</label>
        <div class="slider-row">
            <input type="range" id="logoHeightSlider" min="4" max="30" step="0.5" value="12">
            <span class="slider-value" id="logoHeightValue">12 mm</span>
        </div>

        <label>Footer Message</label>
        <input id="footerMessage" value="Thank you for your purchase!" placeholder="Footer message" maxlength="200">
        
        @auth
        <button onclick="saveBusinessData()" class="btn-primary" style="margin-top:12px;">Save Business</button>
        </div>
        @endauth
    </div>
</div>
