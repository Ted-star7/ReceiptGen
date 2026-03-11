<div id="controls">
    @auth
    <div class="section" id="businessSettingsToggle">
        <div class="section-header" onclick="toggleBusinessSettings()" style="background:#e3f2fd;cursor:pointer;">
            <span>⚙ Business Settings</span>
        </div>
    </div>

    <div id="businessSections" style="display:none;">
        @include('components.sections.business-info')
        @include('components.sections.appearance')
        @include('components.sections.pricing')
        @include('components.sections.additional')
    </div>

    <div id="receiptSections" style="display:none;">
    @include('components.sections.items-auth')
    @include('components.sections.customer')
    @include('components.sections.actions')
    </div>
    @else
    @include('components.sections.business-info')
    @include('components.sections.appearance')
    @include('components.sections.items')
    @include('components.sections.pricing')
    @include('components.sections.customer')
    @include('components.sections.additional')
    @include('components.sections.actions')
    @endauth
</div>

<script>
function toggleBusinessSettings() {
  const sections = document.getElementById('businessSections');
  if (sections) {
    const isHidden = sections.style.display === 'none';
    sections.style.display = isHidden ? 'block' : 'none';
    localStorage.setItem('businessSettingsOpen', isHidden);
  }
}
</script>
