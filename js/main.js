// Hotel Meghauli Safari - Main JavaScript

// Configuration
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
    });

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.remove('hidden');
        } else {
            scrollTopBtn.classList.add('hidden');
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => img.classList.add('loaded'));
    }

    // Initialize Flatpickr for date pickers
    initializeDatePickers();

    // Booking form handler
    initializeBookingForm();
});

// Initialize date pickers
function initializeDatePickers() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkInPicker = flatpickr('#check-in', {
        minDate: 'today',
        dateFormat: 'Y-m-d',
        onChange: function(selectedDates, dateStr, instance) {
            // Update check-out minimum date
            const nextDay = new Date(selectedDates[0]);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutPicker.set('minDate', nextDay);

            // Calculate nights if both dates are selected
            if (checkOutPicker.selectedDates.length > 0) {
                calculateNights();
            }
        }
    });

    const checkOutPicker = flatpickr('#check-out', {
        minDate: tomorrow,
        dateFormat: 'Y-m-d',
        onChange: function() {
            calculateNights();
        }
    });
}

// Calculate number of nights
function calculateNights() {
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;

    if (checkIn && checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        if (nights > 0) {
            console.log(`Booking for ${nights} night(s)`);
        }
    }
}

// Initialize booking form
function initializeBookingForm() {
    const form = document.getElementById('booking-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Check honeypot (spam protection)
        const honeypot = document.getElementById('website').value;
        if (honeypot) {
            console.log('Spam detected');
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        btnText.textContent = 'Submitting...';
        btnSpinner.classList.remove('hidden');

        // Get form data
        const formData = new FormData(form);
        const data = {
            timestamp: new Date().toISOString(),
            bookingId: generateBookingId(),
            status: 'New',
            guestName: formData.get('guest-name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            roomType: formData.get('room-type'),
            guests: formData.get('guests'),
            checkIn: formData.get('check-in'),
            checkOut: formData.get('check-out'),
            nights: calculateNightsValue(formData.get('check-in'), formData.get('check-out')),
            specialRequests: formData.get('special-requests'),
            arrivalTime: formData.get('arrival-time'),
            airportPickup: formData.get('airport-pickup') ? 'Yes' : 'No',
            sourcePage: window.location.href,
            userAgent: navigator.userAgent
        };

        try {
            // Submit to Google Sheets
            const response = await fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Show success message
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Optional: Track conversion in analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'booking_submitted', {
                    'booking_id': data.bookingId,
                    'room_type': data.roomType
                });
            }

        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('There was an error submitting your booking. Please try again or contact us directly at meghaulisafari@gmail.com');

            // Re-enable submit button
            submitBtn.disabled = false;
            btnText.textContent = 'Submit Booking Request';
            btnSpinner.classList.add('hidden');
        }
    });
}

// Generate unique booking ID
function generateBookingId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `MS-${timestamp}-${random}`.toUpperCase();
}

// Calculate nights value
function calculateNightsValue(checkIn, checkOut) {
    if (checkIn && checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : 0;
    }
    return 0;
}

// Animation on scroll (optional enhancement)
function animateOnScroll() {
    const elements = document.querySelectorAll('.card-hover');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Call animation function when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
    animateOnScroll();
}