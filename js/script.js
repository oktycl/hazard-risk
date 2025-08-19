// Video Carousel Functionality
class HeroVideoCarousel {
    constructor() {
        this.videos = document.querySelectorAll('.hero-video');
        this.indicators = document.querySelectorAll('.video-indicator');
        this.currentIndex = 0;
        this.interval = null;
        
        // Mobile detection
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isLowPowerMode = this.detectLowPowerMode();
        
        // Mobile'da daha uzun süre, desktop'ta daha kısa
        this.duration = this.isMobile ? 10000 : 8000; // 10 saniye mobile, 8 saniye desktop
        
        this.init();
    }

    init() {
        // Mobile optimizations
        if (this.isMobile) {
            this.optimizeForMobile();
        }

        // Add click events to indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToVideo(index);
            });
        });

        // Start auto rotation (sadece low power mode değilse)
        if (!this.isLowPowerMode) {
            this.startAutoRotation();
        }

        // Mobile'da touch events ekle
        if (this.isMobile) {
            this.addTouchEvents();
        }

        // Desktop hover events (sadece mobile değilse)
        if (!this.isMobile) {
            const heroSection = document.querySelector('.hero');
            heroSection.addEventListener('mouseenter', () => {
                this.pauseAutoRotation();
            });

            heroSection.addEventListener('mouseleave', () => {
                this.startAutoRotation();
            });
        }

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoRotation();
            } else if (!this.isLowPowerMode) {
                this.startAutoRotation();
            }
        });

        // Battery API for mobile optimization
        this.handleBatteryStatus();
    }

    optimizeForMobile() {
        // Video kalitesini mobile için optimize et
        this.videos.forEach(video => {
            // Preload sadece metadata
            video.preload = 'metadata';
            
            // Mobile'da daha düşük playback rate
            video.playbackRate = 0.9;
            
            // Touch cihazlarda controls'u gizle
            video.controls = false;
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('playsinline', 'true');
        });
    }

    addTouchEvents() {
        const heroSection = document.querySelector('.hero');
        let touchStartX = 0;
        let touchEndX = 0;

        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        heroSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Sola swipe - sonraki video
                this.nextVideo();
            } else {
                // Sağa swipe - önceki video
                this.previousVideo();
            }
        }
    }

    previousVideo() {
        const prevIndex = (this.currentIndex - 1 + this.videos.length) % this.videos.length;
        this.goToVideo(prevIndex);
    }

    detectLowPowerMode() {
        // iOS Low Power Mode detection
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            return true;
        }
        
        // Connection speed check
        if (navigator.connection && navigator.connection.effectiveType === 'slow-2g') {
            return true;
        }
        
        return false;
    }

    handleBatteryStatus() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then((battery) => {
                // Batarya %20'nin altındaysa video süresini uzat
                if (battery.level < 0.2) {
                    this.duration = 15000; // 15 saniye
                }
                
                // Şarj oluyorsa normal süre
                battery.addEventListener('chargingchange', () => {
                    if (battery.charging) {
                        this.duration = this.isMobile ? 10000 : 8000;
                    } else if (battery.level < 0.2) {
                        this.duration = 15000;
                    }
                });
            });
        }
    }

    // Diğer metodlar aynı kalır...
    goToVideo(index) {
        this.videos[this.currentIndex].classList.remove('active');
        this.indicators[this.currentIndex].classList.remove('active');

        this.currentIndex = index;

        this.videos[this.currentIndex].classList.add('active');
        this.indicators[this.currentIndex].classList.add('active');

        this.restartAutoRotation();
    }

    nextVideo() {
        const nextIndex = (this.currentIndex + 1) % this.videos.length;
        this.goToVideo(nextIndex);
    }

    startAutoRotation() {
        if (!this.isLowPowerMode) {
            this.interval = setInterval(() => {
                this.nextVideo();
            }, this.duration);
        }
    }

    pauseAutoRotation() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    restartAutoRotation() {
        this.pauseAutoRotation();
        this.startAutoRotation();
    }
}

// DOM Elements (sadece header ile ilgili olmayanlar)
const emailInput = document.getElementById('email-input');

// Email handling fonksiyonları
function handleGetStarted() {
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Please enter your email address.');
        emailInput.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
    }
    
    // Here you would typically send the email to your backend
    console.log('Email submitted:', email);
    alert('Thank you for your interest! We\'ll be in touch soon.');
    emailInput.value = '';
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function for smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Handle Enter key in email input
if (emailInput) {
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGetStarted();
        }
    });
}

// Intersection Observer for animations
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

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const isSlash = target.includes('/');
        
        let numericValue;
        if (isPercentage) {
            numericValue = parseFloat(target.replace('%', ''));
        } else if (isPlus) {
            numericValue = parseInt(target.replace(/[+,]/g, ''));
        } else if (isSlash) {
            // For "24/7", just return as is
            return;
        } else {
            numericValue = parseInt(target.replace(/[,]/g, ''));
        }
        
        if (isNaN(numericValue)) return;
        
        let current = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let displayValue;
            if (isPercentage) {
                displayValue = current.toFixed(1) + '%';
            } else if (isPlus) {
                displayValue = Math.floor(current).toLocaleString() + '+';
            } else {
                displayValue = Math.floor(current).toLocaleString();
            }
            
            counter.textContent = displayValue;
        }, 50);
    });
}

// Intersection Observer for performance (video play/pause)
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const videos = entry.target.querySelectorAll('video');
        if (entry.isIntersecting) {
            videos.forEach(video => {
                // Mobile'da video oynatmadan önce user interaction bekle
                if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                    video.muted = true;
                }
                video.play().catch(e => {
                    console.log('Video autoplay blocked:', e);
                });
            });
        } else {
            videos.forEach(video => {
                video.pause();
            });
        }
    });
}, { 
    threshold: window.innerWidth < 768 ? 0.3 : 0.1 // Mobile'da daha yüksek threshold
});

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Smooth reveal animation for code block
const codeBlockObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const codeBlock = entry.target;
            const lines = codeBlock.querySelectorAll('code');
            
            lines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.opacity = '1';
                    line.style.transform = 'translateX(0)';
                }, index * 100);
            });
            
            codeBlockObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

// Touch device detection için utility
function isTouchDevice() {
    return (('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0));
}

// Mobile-specific initialization
document.addEventListener('DOMContentLoaded', () => {
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
        
        // Mobile'da click delay'i kaldır
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize video carousel
    new HeroVideoCarousel();
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .section-header');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Observe hero section for counter animation
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
        videoObserver.observe(heroSection);
    }
    
    // Initialize code block animations
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach(block => {
        const lines = block.querySelectorAll('code');
        lines.forEach(line => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-20px)';
            line.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        codeBlockObserver.observe(block);
    });
});

// Add hover effects to feature cards
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual && scrolled < window.innerHeight) {
        const rate = scrolled * -0.5;
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading state to buttons
function addLoadingState(button, duration = 2000) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    button.style.opacity = '0.7';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    }, duration);
}

// Add click handlers for CTA buttons
document.addEventListener('DOMContentLoaded', () => {
    const ctaButtons = document.querySelectorAll('.btn-primary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Debounce function
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