// Section state management
function toggleSection(header) {
  header.classList.toggle('collapsed');
  header.nextElementSibling.classList.toggle('collapsed');
  saveSectionStates();
}

window.toggleBusinessSettings = function() {
  const sections = document.getElementById('businessSections');
  if (sections) {
    const isHidden = sections.style.display === 'none';
    sections.style.display = isHidden ? 'block' : 'none';
    localStorage.setItem('businessSettingsOpen', isHidden);
  }
}

function saveSectionStates() {
  const states = {};
  document.querySelectorAll('.section-header').forEach(header => {
    const sectionName = header.textContent.trim();
    states[sectionName] = header.classList.contains('collapsed');
  });
  localStorage.setItem('sectionStates', JSON.stringify(states));
}

function loadSectionStates() {
  const saved = localStorage.getItem('sectionStates');
  if (!saved) return;
  
  const states = JSON.parse(saved);
  document.querySelectorAll('.section-header').forEach(header => {
    const sectionName = header.textContent.trim();
    if (states[sectionName] !== undefined) {
      const isCollapsed = states[sectionName];
      const content = header.nextElementSibling;
      if (content) {
        if (isCollapsed) {
          header.classList.add('collapsed');
          content.classList.add('collapsed');
        } else {
          header.classList.remove('collapsed');
          content.classList.remove('collapsed');
        }
      }
    }
  });
  
  const businessOpen = localStorage.getItem('businessSettingsOpen') === 'true';
  const sections = document.getElementById('businessSections');
  if (sections && businessOpen) {
    sections.style.display = 'block';
  }
}

// Load appearance settings globally
function loadGlobalAppearance() {
  const saved = localStorage.getItem('receiptSettings');
  if (!saved) return;
  
  const data = JSON.parse(saved);
  if (data.colorPrimary) {
    document.documentElement.style.setProperty('--primary', data.colorPrimary);
  }
  if (data.colorBg) {
    document.documentElement.style.setProperty('--bg', data.colorBg);
  }
  if (data.colorText) {
    document.documentElement.style.setProperty('--text', data.colorText);
  }
}

// Load section states on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSectionStates();
  loadGlobalAppearance();
});
