// Hearthspace V2 JavaScript

// Smooth scroll to signup
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Handle form submission
const form = document.querySelector('.signup-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Joining...';
    button.disabled = true;
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Success!
        form.innerHTML = `
          <div style="background: white; padding: 3rem; border-radius: 12px; text-align: center;">
            <h3 style="color: #27AE60; font-size: 2rem; margin-bottom: 1rem;">🎉 You're on the list!</h3>
            <p style="color: #2C3E50; font-size: 1.1rem;">Thanks for signing up. We'll email you when Hearthspace launches (Spring 2026).</p>
          </div>
        `;
        
        // Track in console
        console.log('Signup successful:', { email: data.email, wouldPay: data.would_pay });
      } else {
        // Error
        button.textContent = result.error || 'Something went wrong';
        button.style.background = '#E74C3C';
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
          button.disabled = false;
        }, 3000);
      }
    } catch (error) {
      button.textContent = 'Network error, try again';
      button.style.background = '#E74C3C';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        button.disabled = false;
      }, 3000);
    }
  });
}

// Simple page load tracking
console.log('Hearthspace V2 loaded at', new Date().toISOString());

// Add entrance animations on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Animate sections on scroll
document.querySelectorAll('.problem-card, .mockup-row, .how-step, .not-card, .pricing-card, .tweet-card, .faq-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
