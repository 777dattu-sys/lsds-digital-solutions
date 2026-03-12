document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS Animation Library
    AOS.init({
        once: true, // whether animation should happen only once - while scrolling down
        offset: 100, // offset (in px) from the original trigger point
        duration: 800, // values from 0 to 3000, with step 50ms
        easing: 'ease-in-out', // default easing for AOS animations
    });

    // Transparent to solid navbar on scroll & Scroll to Top visibility
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        // Navbar
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(6, 11, 25, 0.95)';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(6, 11, 25, 0.8)';
            navbar.style.boxShadow = 'none';
        }

        // Scroll to Top Button
        if (scrollTopBtn) {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }
    });

    // Count Up Animation
    const counters = document.querySelectorAll('.count-up');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

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

    // Scroll to top click event
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
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
            
            // Redirect to WhatsApp Community instantly after briefly showing message
            setTimeout(() => {
                window.location.href = "https://chat.whatsapp.com/JXhXj6n6nQa6kiMvJtf6Cg";
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

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
