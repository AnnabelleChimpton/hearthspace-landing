// Hearthspace V3 JavaScript

// Track visit source (for analytics)
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('ref') || urlParams.get('source') || 'direct';
  
  // Store in sessionStorage for signup form
  sessionStorage.setItem('signup_source', source);
  
  console.log('Visit source:', source);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Form submission
const form = document.getElementById('signup-form');
const successMsg = document.getElementById('success-msg');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Add source tracking
    data.source = sessionStorage.getItem('signup_source') || 'direct';
    
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'joining...';
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
        form.style.display = 'none';
        successMsg.style.display = 'block';
        console.log('Signup successful:', { email: data.email });
      } else {
        // Error
        button.textContent = result.error || 'oops, try again';
        button.style.background = '#f77062';
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
          button.disabled = false;
        }, 3000);
      }
    } catch (error) {
      button.textContent = 'network error';
      button.style.background = '#f77062';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        button.disabled = false;
      }, 3000);
    }
  });
}

// Simple scroll reveal
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

// Animate elements on scroll
document.querySelectorAll('.problem-box, .demo-row, .price-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Console message
console.log('%chearthspace 🏠', 'font-size: 2rem; color: #ff6b35; font-weight: bold;');
console.log('%cbuilt by a human, for humans', 'font-size: 1rem; color: #004e89;');
console.log('looking at the code? we\'re hiring eventually. hello@hearthspace.app');
