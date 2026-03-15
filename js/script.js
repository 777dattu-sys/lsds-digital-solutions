document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS Animation Library
    AOS.init({
        once: true, // whether animation should happen only once - while scrolling down
        offset: 100, // offset (in px) from the original trigger point
        duration: 800, // values from 0 to 3000, with step 50ms
        easing: 'ease-in-out', // default easing for AOS animations
    });

    // Count Up Animation
    const counters = document.querySelectorAll('.count-up');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                
                // If target is a large number, increment faster
                const inc = target > 1000 ? target / (speed / 2) : target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Use Intersection Observer to start counting when in view
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.disconnect(); // Stop observing once animated
            }
        });
    }, { threshold: 0.5 });

    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        statsObserver.observe(statsGrid);
    }

    // Typing Effect for Hero Subheadline
    const subheadline = document.querySelector('.subheadline');
    if (subheadline) {
        const text = subheadline.innerHTML;
        subheadline.innerHTML = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                subheadline.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        };
        
        // Start typing after a small delay
        setTimeout(typeWriter, 500);
    }

    // Form submission simulation
    const enrollForm = document.getElementById('enrollmentForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');
    const formMessage = document.getElementById('formMessage');

    enrollForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show loading state
        btnText.style.display = 'none';
        loader.style.display = 'block';
        submitBtn.disabled = true;

        // Get form data (ready to send to Google Sheets)
        const formData = new FormData(enrollForm);
        const data = Object.fromEntries(formData.entries());
        data.date = new Date().toLocaleString();
        
        console.log('Lead Data to be submitted:', data);

        // Google Sheets Integration
        const scriptURL = 'https://script.google.com/macros/s/AKfycbz-QL8hKA3E3hf2jG2PIjV7_hcgIbCefdQklMAplDcxatLwHlMdVi3Z4JiXV9sAhyq4/exec';
        
        // Convert to URLSearchParams for Google Apps Script to parse correctly
        const urlEncodedData = new URLSearchParams(data).toString();

        fetch(scriptURL, { 
            method: 'POST', 
            body: urlEncodedData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            mode: 'no-cors' // Prevent CORS errors from Google Script
        })
        .then(() => {
            // Google Apps Script with no-cors will always resolve if the request sends
            console.log('Success!');
            
            // Set user name for greeting
            const userName = data.name ? data.name.split(' ')[0] : 'there';
            const nameDisplay = document.getElementById('userNameDisplay');
            if (nameDisplay) nameDisplay.textContent = userName;
            
            // Reset button
            btnText.style.display = 'block';
            loader.style.display = 'none';
            submitBtn.disabled = false;
            
            // Show success message
            enrollForm.style.display = 'none';
            formMessage.style.display = 'block';
            
            // Redirect to Thank You page instantly after briefly showing message
            setTimeout(() => {
                window.location.href = "thankyou.html";
            }, 1000);
            
            // Reset the form values
            enrollForm.reset();
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert("Something went wrong. Please try again or contact us directly on WhatsApp.");
            
            // Reset button
            btnText.style.display = 'block';
            loader.style.display = 'none';
            submitBtn.disabled = false;
        });
    });

    // Enhanced Interactive Features
    
    // Mouse movement parallax effect for hero
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                particle.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // Add click effects to buttons
    document.querySelectorAll('.btn, .whatsapp-float').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left - 10) + 'px';
            ripple.style.top = (e.clientY - rect.top - 10) + 'px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.pointerEvents = 'none';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .btn, .whatsapp-float {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Enhanced scrolling effects
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.hero'); // Using hero as reference
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add scroll direction class
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            document.body.classList.add('scrolling-down');
        } else {
            document.body.classList.remove('scrolling-down');
        }
        
        lastScrollY = currentScrollY;
        
        // Dynamic particle movement based on scroll
        const particles = document.querySelectorAll('.particle');
        const scrollPercent = currentScrollY / (document.body.scrollHeight - window.innerHeight);
        
        particles.forEach((particle, index) => {
            const offset = scrollPercent * 100 * (index + 1) * 0.1;
            particle.style.transform += ` translateY(${offset}px)`;
        });
    });

    // Typing effect enhancement
    const enhanceTyping = () => {
        const elements = document.querySelectorAll('.jazzy-element');
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.2}s`;
        });
    };
    
    enhanceTyping();

    // Demo Form submission
    const demoForm = document.getElementById('demoForm');
    if (demoForm) {
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const demoData = new FormData(demoForm);
            const data = Object.fromEntries(demoData.entries());
            data.date = new Date().toLocaleString();
            data.type = 'demo_registration';
            
            // Map demo fields to standard fields expected by Google Apps Script
            data.name = data.demoName;
            data.phone = data.demoPhone;
            data.source = "Demo Registration";
            
            console.log('Demo Registration Data:', data);

            // Show loading state
            const submitBtn = demoForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            // Submit to Google Sheets
            const scriptURL = 'https://script.google.com/macros/s/AKfycbz-QL8hKA3E3hf2jG2PIjV7_hcgIbCefdQklMAplDcxatLwHlMdVi3Z4JiXV9sAhyq4/exec';
            const urlEncodedData = new URLSearchParams(data).toString();

            fetch(scriptURL, { 
                method: 'POST', 
                body: urlEncodedData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                mode: 'no-cors'
            })
            .then(() => {
                // Success
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Demo Access Granted!';
                submitBtn.style.background = 'linear-gradient(45deg, #00d4ff, #090979)';
                
                // Reset form after delay
                setTimeout(() => {
                    demoForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
                
                // Format the message for WhatsApp
                const waNumber = '919052040509';
                const waMessage = `*New Demo Registration!*%0A%0A*Name:* ${data.demoName}%0A*Email:* ${data.demoEmail}%0A*Phone:* ${data.demoPhone}`;
                const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;
                
                // Redirect to WhatsApp
                window.location.href = waUrl;
            })
            .catch(error => {
                console.error('Demo registration error:', error);
                submitBtn.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Try Again';
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                }, 2000);
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Adjust this value to increase/decrease the gap above section titles
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Evergreen Countdown Timer for Demo
    const initCountdown = () => {
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minsEl = document.getElementById("minutes");
        const secsEl = document.getElementById("seconds");
        
        if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

        // Set countdown to 1 day, 5 hours, 30 mins from first visit
        let countDownDate = localStorage.getItem('demoCountdownDate');
        if (!countDownDate || countDownDate < new Date().getTime()) {
            countDownDate = new Date().getTime() + (1 * 24 * 60 * 60 * 1000) + (5 * 60 * 60 * 1000) + (30 * 60 * 1000);
            localStorage.setItem('demoCountdownDate', countDownDate);
        }

        setInterval(() => {
            const now = new Date().getTime();
            const distance = countDownDate - now;

            if (distance > 0) {
                daysEl.innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
                hoursEl.innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
                minsEl.innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                secsEl.innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
            }
        }, 1000);
    };
    initCountdown();

    // Ultimate Lead Capture - Exit Intent & Inactivity Modal
    const leadModal = document.getElementById('leadModal');
    const closeLeadModal = document.getElementById('closeLeadModal');
    const modalDemoBtn = document.getElementById('modalDemoBtn');
    let leadModalShown = false;

    if (leadModal) {
        // Trigger 1: Mouse leaves the viewport (Desktop Exit Intent)
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !leadModalShown) {
                leadModal.classList.add('show');
                leadModalShown = true;
            }
        });

        // Trigger 2: Time delay (Shows after 45 seconds to force engagement)
        setTimeout(() => {
            if (!leadModalShown) {
                leadModal.classList.add('show');
                leadModalShown = true;
            }
        }, 45000);

        // Close logic
        if (closeLeadModal) {
            closeLeadModal.addEventListener('click', () => leadModal.classList.remove('show'));
        }
        if (modalDemoBtn) {
            modalDemoBtn.addEventListener('click', () => leadModal.classList.remove('show'));
        }
        window.addEventListener('click', (e) => {
            if (e.target === leadModal) leadModal.classList.remove('show');
        });
    }
});
