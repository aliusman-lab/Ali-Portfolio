// Consolidated and optimized portfolio logic
document.addEventListener("DOMContentLoaded", () => {
    // 1. Core Elements
    const navbar = document.getElementById("navbar");
    const navHamburger = document.getElementById("navHamburger");
    const mobileMenuDrawer = document.getElementById("mobileMenuDrawer");
    const mobileNavItems = document.querySelectorAll(".mobile-nav-item");

    // 2. Navbar Scroll State Toggle (Glassmorphism)
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    // 3. Mobile Hamburger Menu Drawer Toggles
    if (navHamburger && mobileMenuDrawer) {
        navHamburger.addEventListener("click", () => {
            navHamburger.classList.toggle("open");
            mobileMenuDrawer.classList.toggle("open");
        });

        mobileNavItems.forEach(item => {
            item.addEventListener("click", () => {
                navHamburger.classList.remove("open");
                mobileMenuDrawer.classList.remove("open");
            });
        });
    }

    // 4. Contact Form Validation & Submission Handler
    const contactFormEl = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    if (contactFormEl && formStatus) {
        contactFormEl.addEventListener("submit", (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("cf-name");
            const emailInput = document.getElementById("cf-email");
            const subjectInput = document.getElementById("cf-subject");
            const messageInput = document.getElementById("cf-message");
            const submitBtn = contactFormEl.querySelector(".btn-submit");

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (name.length < 2) {
                showStatus("Please enter a valid name (at least 2 characters).", "error");
                nameInput.focus();
                return;
            }

            if (!emailRegex.test(email)) {
                showStatus("Please enter a valid email address.", "error");
                emailInput.focus();
                return;
            }

            if (subject.length < 4) {
                showStatus("Please enter a subject (at least 4 characters).", "error");
                subjectInput.focus();
                return;
            }

            if (message.length < 10) {
                showStatus("Please write a slightly longer message (at least 10 characters).", "error");
                messageInput.focus();
                return;
            }

            showStatus("Sending message... Please wait.", "loading");
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            const accessKey = "YOUR_ACCESS_KEY_HERE"; 

            if (accessKey === "YOUR_ACCESS_KEY_HERE" || accessKey === "4259b19e-e3cf-42be-94d3-dfcfc34d8cc3") {
                showStatus("Demo Mode: Message submitted successfully! (Please replace the Access Key in script.js to receive real emails).", "success");
                contactFormEl.reset();
                submitBtn.textContent = "Message Sent ✓";
                submitBtn.style.backgroundColor = "#2ecc71";
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Send Message ↗";
                    submitBtn.style.backgroundColor = "";
                    formStatus.style.display = "none";
                }, 6000);
                return;
            }

            const formData = {
                access_key: accessKey,
                name: name,
                email: email,
                subject: `Portfolio Contact: ${subject}`,
                message: message
            };

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData)
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200 && json.success) {
                    showStatus("Message sent successfully! I will get back to you shortly.", "success");
                    contactFormEl.reset();
                    submitBtn.textContent = "Message Sent ✓";
                    submitBtn.style.backgroundColor = "#2ecc71";
                    
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = "Send Message ↗";
                        submitBtn.style.backgroundColor = "";
                        formStatus.style.display = "none";
                    }, 5000);
                } else {
                    console.log(response);
                    showStatus(json.message || "Something went wrong. Please check back later.", "error");
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Send Message ↗";
                }
            })
            .catch((error) => {
                console.log(error);
                showStatus("Network error: Could not reach the email server.", "error");
                submitBtn.disabled = false;
                submitBtn.textContent = "Send Message ↗";
            });
        });
    }

    function showStatus(text, type) {
        formStatus.textContent = text;
        formStatus.className = "form-status " + type;
        formStatus.style.display = "flex";
    }

    // 5. GSAP Scroll Animations (Progressive Enhancement)
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
        return; // Reduced motion active, skip GSAP animations
    }

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        console.warn("GSAP ya ScrollTrigger load nahi hui — CDN links check karo.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const revealDefaults = {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out"
    };

    // Section headers animation
    document.querySelectorAll(".section-header").forEach((header) => {
        gsap.from(header.children, {
            ...revealDefaults,
            stagger: 0.15,
            scrollTrigger: {
                trigger: header,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // About section animation
    const aboutImage = document.querySelector(".about-image");
    const aboutDetails = document.querySelector(".about-details");
    if (aboutImage && aboutDetails) {
        gsap.from(aboutImage, {
            opacity: 0,
            x: -60,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: aboutImage,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

        gsap.from(aboutDetails.children, {
            opacity: 0,
            x: 60,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
                trigger: aboutDetails,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }

    // Skills section animation
    const ovalCards = gsap.utils.toArray(".ovalcard");
    if (ovalCards.length) {
        gsap.from(ovalCards, {
            opacity: 0,
            y: 50,
            scale: 0.7,
            duration: 0.9,
            ease: "back.out(1.7)",
            stagger: 0.1,
            scrollTrigger: {
                trigger: ".oval-container",
                start: "top 90%",
                toggleActions: "play none none reverse",
                onComplete: () => {
                    const el = document.querySelector(".oval-container");
                    if (el) el.classList.add("animated");
                },
                onReverseComplete: () => {
                    const el = document.querySelector(".oval-container");
                    if (el) el.classList.remove("animated");
                }
            }
        });
    }

    const detailCards = gsap.utils.toArray(".skill-detail-card");
    if (detailCards.length) {
        gsap.from(detailCards, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
                trigger: ".skills-details-grid",
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    }

    // Projects section animation
    const projectCards = gsap.utils.toArray(".project-card");
    if (projectCards.length) {
        gsap.from(projectCards, {
            opacity: 0,
            y: 60,
            scale: 0.96,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
                trigger: ".projects-grid",
                start: "top 90%",
                toggleActions: "play none none reverse",
                onComplete: () => {
                    const el = document.querySelector(".projects-grid");
                    if (el) el.classList.add("animated");
                },
                onReverseComplete: () => {
                    const el = document.querySelector(".projects-grid");
                    if (el) el.classList.remove("animated");
                }
            }
        });
    }

    // Contact Section animation
    const contactInfo = document.querySelector(".contact-info");
    const contactForm = document.querySelector(".contact-form-box");
    if (contactInfo && contactForm) {
        gsap.from(contactInfo.children, {
            opacity: 0,
            x: -60,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
                trigger: ".contact-body",
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });

        gsap.from(contactForm, {
            opacity: 0,
            x: 60,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".contact-body",
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    }

    // Footer animation
    const footer = document.querySelector(".site-footer");
    if (footer) {
        gsap.from(footer.querySelectorAll(".footer-brand, .footer-links, .footer-contact, .footer-socials"), {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
                trigger: footer,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    }
});