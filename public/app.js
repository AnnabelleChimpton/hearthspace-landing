// Smooth scroll to signup
function scrollToSignup() {
  document.getElementById('signup').scrollIntoView({ behavior: 'smooth' });
}

// Handle form submission
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  // Hide any previous messages
  document.getElementById('success-message').style.display = 'none';
  document.getElementById('error-message').style.display = 'none';
  
  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // Success!
      form.style.display = 'none';
      document.getElementById('success-message').style.display = 'block';
      
      // Track in console for analytics (could integrate GA/Plausible here)
      console.log('Signup successful:', { email: data.email, wouldPay: data.would_pay });
    } else {
      // Error
      const errorDiv = document.getElementById('error-message');
      errorDiv.textContent = result.error || 'Something went wrong. Please try again.';
      errorDiv.style.display = 'block';
    }
  } catch (error) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = 'Network error. Please check your connection and try again.';
    errorDiv.style.display = 'block';
  }
});

// Simple analytics tracking (page view)
console.log('Hearthspace landing page loaded at', new Date().toISOString());
