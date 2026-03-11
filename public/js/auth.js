// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  
  btn.disabled = true;
  btn.textContent = 'Logging in...';
  
  try {
    const formData = new FormData(form);
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Accept': 'application/json'
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Login successful!', 'success');
      setTimeout(() => window.location.href = data.redirect, 500);
    } else {
      showToast(data.message || 'Invalid credentials', 'error');
      btn.disabled = false;
      btn.textContent = originalText;
    }
  } catch (err) {
    showToast('An error occurred. Please try again.', 'error');
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
}

// Register
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  
  // Validate password confirmation
  const password = form.querySelector('[name="password"]').value;
  const confirmation = form.querySelector('[name="password_confirmation"]').value;
  
  if (password !== confirmation) {
    showToast('Passwords do not match', 'error');
    return;
  }
  
  btn.disabled = true;
  btn.textContent = 'Creating account...';
  
  try {
    const formData = new FormData(form);
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Accept': 'application/json'
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Account created successfully!', 'success');
      setTimeout(() => window.location.href = data.redirect, 500);
    } else {
      const message = data.errors ? Object.values(data.errors).flat().join(', ') : data.message || 'Registration failed';
      showToast(message, 'error');
      btn.disabled = false;
      btn.textContent = originalText;
    }
  } catch (err) {
    showToast('An error occurred. Please try again.', 'error');
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

// Forgot Password
document.getElementById('forgotForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  
  btn.disabled = true;
  btn.textContent = 'Sending...';
  
  try {
    const formData = new FormData(form);
    const response = await fetch('/forgot-password', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Accept': 'application/json'
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast(data.message, 'success');
      form.reset();
      setTimeout(() => window.location.href = '/login', 2000);
    } else {
      showToast(data.message || 'Failed to send reset link', 'error');
    }
    
    btn.disabled = false;
    btn.textContent = originalText;
  } catch (err) {
    showToast('An error occurred. Please try again.', 'error');
    btn.disabled = false;
    btn.textContent = originalText;
  }
});
