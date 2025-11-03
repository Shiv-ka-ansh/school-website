// Main JavaScript file for SMPS Jhansi website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initContactForm();
    initNewsletterForm();
    initScrollAnimations();
    initSmoothScrolling();
    initStatsAnimation();
});

// Navigation functionality
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            
            // Animate hamburger
            const hamburger = mobileMenuBtn.querySelector('.hamburger');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                const hamburger = mobileMenuBtn.querySelector('.hamburger');
                hamburger.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                const hamburger = mobileMenuBtn.querySelector('.hamburger');
                hamburger.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                document.querySelectorAll(`a[href="#${sectionId}"]`).forEach(link => {
                    link.classList.add('active');
                });
            }
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                showMessage('Message sent successfully! We will get back to you soon.', 'success');
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });

        // Form validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

// Newsletter form functionality
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate subscription (replace with actual API call)
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Show success message
                showMessage('Successfully subscribed to newsletter!', 'success');
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

// Form field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Show error if validation fails
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.color = 'var(--school-coral)';
        errorDiv.style.fontSize = 'var(--font-size-sm)';
        errorDiv.style.marginTop = 'var(--spacing-1)';
        field.parentNode.appendChild(errorDiv);
    }

    return isValid;
}

// Show success/error messages
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '100px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '1000';
    messageDiv.style.padding = 'var(--spacing-4)';
    messageDiv.style.borderRadius = 'var(--radius-lg)';
    messageDiv.style.color = 'white';
    messageDiv.style.fontWeight = '500';
    messageDiv.style.boxShadow = 'var(--shadow-lg)';
    messageDiv.style.transform = 'translateX(100%)';
    messageDiv.style.transition = 'transform 0.3s ease';

    if (type === 'success') {
        messageDiv.style.backgroundColor = '#10b981';
    } else {
        messageDiv.style.backgroundColor = 'var(--school-coral)';
    }

    document.body.appendChild(messageDiv);

    // Animate in
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.subject-card, .gallery-item, .notice-card, .value-item, .contact-item'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Animated statistics counter
function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateValue(element, start, end, duration) {
        const startTimestamp = performance.now();
        const step = (timestamp) => {
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current + (element.dataset.suffix || '');
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                let endValue = parseInt(text.match(/\d+/)[0]);
                let suffix = text.replace(/\d+/, '').replace(/^\+/, '');
                
                element.dataset.suffix = suffix;
                animateValue(element, 0, endValue, 2000);
                
                statsObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Gallery functionality (for preview section)
function initGalleryPreview() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Redirect to full gallery page
            window.location.href = 'gallery.html';
        });
    });
}

// Search functionality (for future use)
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            // Implement search functionality
            console.log('Searching for:', query);
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization
const debouncedScroll = debounce(function() {
    // Handle scroll events
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Add CSS for hamburger animation
const style = document.createElement('style');
style.textContent = `
    .hamburger.active {
        background-color: transparent;
    }
    
    .hamburger.active::before {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active::after {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .nav-link.active {
        color: var(--school-cream);
        font-weight: 600;
    }
    
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: var(--school-coral);
        box-shadow: 0 0 0 3px rgba(240, 84, 97, 0.1);
    }
`;
document.head.appendChild(style);

// Export functions for use in other scripts
window.SMPSWebsite = {
    showMessage,
    validateField,
    debounce,
    throttle
};