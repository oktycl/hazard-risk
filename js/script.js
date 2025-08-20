// Video Carousel with Dynamic Text Content System - COMPLETE FINAL VERSION

class HeroVideoCarousel {
    constructor() {
        this.videos = document.querySelectorAll('.hero-video');
        this.indicators = document.querySelectorAll('.video-indicator');
        this.currentIndex = 0;
        this.interval = null;
        
        // Mobile detection and optimizations
        this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isLowPowerMode = this.detectLowPowerMode();
        
        // Mobile'da daha uzun süre, desktop'ta daha kısa
        this.duration = this.isMobileDevice ? 10000 : 8000;
        
        // Content for each video - VİRGÜLSÜZ FORMAT
        this.contentData = [
            // Video 1 Content - Stats var
            {
                title: "Seismic Risk Predictor",
                subtitle: "",
                description: "Seismic risk prediction in seconds from geographic coordinates — rapid screening for individual structures, and portfolio-scale analysis powering Insurance, Finance, Investment, and Asset Management decisions.",
                ctaText: "Start Assessment",
                stats: [
                    { number: "3000+", label: "Buildings Assessed" },
                    { number: "100+", label: "Countries Covered" },
                    { number: "24/7", label: "API Availability" }
                ]
            },
            // Video 2 Content - Stats boş
            {
                title: "Hazard Maps",
                subtitle: "",
                description: "Seismic hazard maps for buildings and their contents, integrating earthquake hazard data with site-specific soil conditions for use by insurance companies.",
                ctaText: null, // CTA gizli
                stats: [
                    { number: "50+", label: "City Mapped" },
                    { number: "100+", label: "Countries Covered" },
                    { number: "24/7", label: "API Availability" }
                ]
            },
            // Video 3 Content - Stats var
            {
                title: "Regional Risk Maps",
                subtitle: "",
                description: "District-level seismic risk maps from building-by-building assessments, helping public institutions prioritize mitigation, manage inventories, and plan emergency response.",
                ctaText: null,
                stats: [
                    { number: "5000+", label: "Buildings Assessed" },
                    { number: "100+", label: "Countries Covered" },
                    { number: "24/7", label: "API Availability" }
                ]
            },
            // Video 4 Content - Stats boş array
            {
                title: "Financial Loss & Downtime Prediction",
                subtitle: "",
                description: "Quick estimates of financial loss and downtime from minimal inputs — giving insurers, financiers, and asset managers actionable awareness, even without full building data.",
                ctaText: null, // CTA gizli
                stats: null // Stats gizli (boş array)
            },
            // Video 5 Content - Stats var
            {
                title: "New Investments Tool",
                subtitle: "",
                description: "Fast construction cost estimates from available data — using seismic and soil parameters to flag needs like deep excavation and inform early planning for Real Estate & Construction.",
                ctaText: null,
                stats: null
            }
        ];
        
        this.init();
    }

    init() {
        // İLK ÖNCE DOM elementlerini bul
        this.findTextElements();
        
        // İLK YÜKLEMEDEKİ İÇERİĞİ HEMEN AYARLA
        this.setInitialContent();
        
        // Mobile optimizations
        if (this.isMobileDevice) {
            this.optimizeForMobile();
        }
        
        // Sonra event listener'ları ekle
        this.addEventListeners();

        // Auto rotation'ı başlat (biraz gecikme ile)
        setTimeout(() => {
            if (!this.isLowPowerMode) {
                this.startAutoRotation();
            }
        }, 1000);

        // Battery API for mobile optimization
        this.handleBatteryStatus();
    }

    findTextElements() {
        // DOM elements for text updates
        this.textElements = {
            title: document.getElementById('hero-title-main'),
            subtitle: document.getElementById('hero-subtitle'),
            description: document.getElementById('hero-description'),
            ctaText: document.getElementById('hero-cta-text'),
            stat1Number: document.getElementById('stat1-number'),
            stat1Label: document.getElementById('stat1-label'),
            stat2Number: document.getElementById('stat2-number'),
            stat2Label: document.getElementById('stat2-label'),
            stat3Number: document.getElementById('stat3-number'),
            stat3Label: document.getElementById('stat3-label')
        };

        // CTA Button'u bul
        this.ctaButton = document.querySelector('.hero-actions');
    }

    setInitialContent() {
        // İlk video (index 0) içeriğini hemen göster
        const initialContent = this.contentData[0];
        
        console.log('Loading initial content:', initialContent);
        
        // Tüm text elementlerini kontrol et ve güncelle
        if (this.textElements.title) {
            this.textElements.title.textContent = initialContent.title;
        }
        if (this.textElements.subtitle) {
            this.textElements.subtitle.textContent = initialContent.subtitle;
        }
        if (this.textElements.description) {
            this.textElements.description.textContent = initialContent.description;
        }
        
        // İlk CTA durumunu ayarla
        this.updateCTA(initialContent.ctaText);
        
        // Stats'ları güncelle - FORMATLANMIŞ ŞEKİLDE
        this.updateStatsVisibility(initialContent.stats);
        
        // Content yüklendikten sonra loading class'ını kaldır
        setTimeout(() => {
            document.body.classList.add('content-loaded');
        }, 500);
        
        console.log('Initial content loaded for video 0');
    }

    // Stats görünürlüğünü kontrol et
    updateStatsVisibility(stats) {
        const statsContainer = document.querySelector('.hero-stats');
        
        if (!stats || stats.length === 0) {
            // Stats'ları gizle
            if (statsContainer) {
                statsContainer.style.display = 'none';
                statsContainer.classList.add('stats-hidden');
                console.log('Stats hidden');
            }
        } else {
            // Stats'ları göster
            if (statsContainer) {
                statsContainer.style.display = 'grid';
                statsContainer.classList.remove('stats-hidden');
                console.log('Stats visible');
            }
            
            // Stats değerlerini güncelle
            stats.forEach((stat, index) => {
                const numberElement = this.textElements[`stat${index + 1}Number`];
                const labelElement = this.textElements[`stat${index + 1}Label`];
                
                if (numberElement) {
                    // Sayıyı formatla
                    const formattedNumber = this.formatStatNumber(stat.number);
                    console.log(`Formatting stat ${index + 1}: ${stat.number} -> ${formattedNumber}`);
                    numberElement.textContent = formattedNumber;
                }
                if (labelElement) {
                    labelElement.textContent = stat.label;
                }
            });
        }
    }

    // Stat sayılarını formatla - TÜRKÇE FORMAT
    formatStatNumber(statValue) {
        console.log('formatStatNumber input:', statValue);
        
        // Özel durumlar - formatlanmaması gereken değerler
        if (statValue === "24/7" || statValue === "Real-time" || statValue === "Certified" || 
            statValue.includes("/") || statValue.includes("%") || 
            statValue === "Real-time" || statValue === "Certified") {
            console.log('formatStatNumber special case output:', statValue);
            return statValue;
        }
        
        // Virgül ve noktaları temizle
        const cleanValue = statValue.toString().replace(/[,]/g, '');
        const isNumeric = /^\d+/.test(cleanValue);
        
        if (isNumeric) {
            const number = parseInt(cleanValue.replace(/[^\d]/g, ''));
            const suffix = cleanValue.replace(/^\d+/, '');
            
            // Türkçe format kullan - sadece 999'dan büyükse nokta ekle
            const formatted = number >= 1000 ? this.formatNumber(number) : number.toString();
            const result = formatted + suffix;
            console.log('formatStatNumber output:', result);
            return result;
        } else {
            // Sayısal olmayan değerler için olduğu gibi döndür
            console.log('formatStatNumber non-numeric output:', statValue);
            return statValue;
        }
    }

    // Sayı formatlama fonksiyonu - Türkçe format (3.000)
    formatNumber(number) {
        // Sadece 1000 ve üzeri sayılarda nokta ekle
        if (number >= 1000) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return number.toString();
    }

    updateCTA(ctaText) {
        const shouldHide = !ctaText || ctaText === "" || ctaText === "HIDE" || ctaText === null;
        
        if (shouldHide) {
            // CTA'yı gizle
            if (this.ctaButton) {
                this.ctaButton.classList.add('cta-hidden');
                this.ctaButton.classList.remove('cta-visible');
                // Body'ye class ekle (stats margin için)
                document.body.classList.add('no-cta');
            }
        } else {
            // CTA'yı göster
            if (this.textElements.ctaText) {
                this.textElements.ctaText.textContent = ctaText;
            }
            if (this.ctaButton) {
                this.ctaButton.classList.add('cta-visible');
                this.ctaButton.classList.remove('cta-hidden');
                // Body'den class kaldır
                document.body.classList.remove('no-cta');
            }
        }
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

    addEventListeners() {
        // Add click events to indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToVideo(index);
            });
        });

        // Pause on hover (desktop only)
        if (!this.isMobileDevice) {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.addEventListener('mouseenter', () => {
                    this.pauseAutoRotation();
                });

                heroSection.addEventListener('mouseleave', () => {
                    this.startAutoRotation();
                });
            }
        }

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoRotation();
            } else if (!this.isLowPowerMode) {
                this.startAutoRotation();
            }
        });

        // Add touch events for mobile
        if (this.isMobileDevice) {
            this.addTouchEvents();
        }
    }

    addTouchEvents() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
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

    goToVideo(index) {
        if (index === this.currentIndex) return;

        console.log(`Switching from video ${this.currentIndex} to video ${index}`);

        // Start text transition
        this.updateContent(index);

        // Remove active class from current video and indicator
        this.videos[this.currentIndex].classList.remove('active');
        this.indicators[this.currentIndex].classList.remove('active');

        // Update index
        this.currentIndex = index;

        // Add active class to new video and indicator with delay
        setTimeout(() => {
            this.videos[this.currentIndex].classList.add('active');
            this.indicators[this.currentIndex].classList.add('active');
        }, 400);

        // Restart auto rotation
        this.restartAutoRotation();
    }

    updateContent(newIndex) {
        const newContent = this.contentData[newIndex];
        
        if (!newContent) {
            console.error(`No content found for video ${newIndex}`);
            return;
        }
        
        console.log('Updating content for video', newIndex, ':', newContent);
        
        // Phase 1: Fade out current content
        this.fadeOutContent();
        
        // Phase 2: Update content and fade in (after 400ms)
        setTimeout(() => {
            // Update text content
            if (this.textElements.title) {
                this.textElements.title.textContent = newContent.title;
            }
            if (this.textElements.subtitle) {
                this.textElements.subtitle.textContent = newContent.subtitle;
            }
            if (this.textElements.description) {
                this.textElements.description.textContent = newContent.description;
            }
            
            // CTA kontrolü - varsa göster, yoksa gizle
            this.updateCTA(newContent.ctaText);
            
            // Update stats with animation
            this.updateStats(newContent.stats);
            
            // Fade in new content
            this.fadeInContent();
        }, 400);
    }

    fadeOutContent() {
        // Fade out text elements
        if (this.textElements.title) {
            this.textElements.title.classList.add('text-fade-out');
        }
        if (this.textElements.subtitle) {
            this.textElements.subtitle.classList.add('text-slide-out-right');
        }
        if (this.textElements.description) {
            this.textElements.description.classList.add('text-fade-out');
        }
        if (this.textElements.ctaText) {
            this.textElements.ctaText.classList.add('text-scale-out');
        }
        
        // CTA'yı da fade out yap
        if (this.ctaButton) {
            this.ctaButton.classList.add('transitioning');
        }
        
        // Fade out stats
        document.querySelectorAll('.stat').forEach(stat => {
            stat.classList.add('stat-updating');
        });
    }

    fadeInContent() {
        // Remove fade out classes and add fade in
        if (this.textElements.title) {
            this.textElements.title.classList.remove('text-fade-out');
            this.textElements.title.classList.add('text-fade-in');
        }
        
        if (this.textElements.subtitle) {
            this.textElements.subtitle.classList.remove('text-slide-out-right');
            this.textElements.subtitle.classList.add('text-slide-in');
        }
        
        if (this.textElements.description) {
            this.textElements.description.classList.remove('text-fade-out');
            this.textElements.description.classList.add('text-fade-in');
        }
        
        if (this.textElements.ctaText) {
            this.textElements.ctaText.classList.remove('text-scale-out');
            this.textElements.ctaText.classList.add('text-scale-in');
        }
        
        // CTA transition'ı temizle
        setTimeout(() => {
            if (this.ctaButton) {
                this.ctaButton.classList.remove('transitioning');
            }
        }, 500);
        
        // Clean up animation classes after transition
        setTimeout(() => {
            this.cleanupAnimationClasses();
        }, 800);
    }

    updateStats(newStats) {
        console.log('Updating stats:', newStats);
        
        const statsContainer = document.querySelector('.hero-stats');
        
        if (!newStats || newStats.length === 0) {
            // Stats'ları gizle
            if (statsContainer) {
                statsContainer.style.display = 'none';
                statsContainer.classList.add('stats-hidden');
                console.log('Stats hidden during update');
            }
            return;
        }
        
        // Stats'ları göster
        if (statsContainer) {
            statsContainer.style.display = 'grid';
            statsContainer.classList.remove('stats-hidden');
            console.log('Stats visible during update');
        }
        
        // Update stats with counter animation
        newStats.forEach((stat, index) => {
            const numberElement = this.textElements[`stat${index + 1}Number`];
            const labelElement = this.textElements[`stat${index + 1}Label`];
            
            if (labelElement) {
                labelElement.textContent = stat.label;
            }
            
            if (numberElement) {
                console.log(`Animating stat ${index + 1}: ${stat.number}`);
                // Animasyonlu güncelleme - formatlanmış
                this.animateNumber(numberElement, stat.number);
            }
        });
        
        // Remove stat-updating class
        setTimeout(() => {
            document.querySelectorAll('.stat').forEach(stat => {
                stat.classList.remove('stat-updating');
            });
        }, 600);
    }

    animateNumber(element, targetValue) {
        console.log('animateNumber called with:', targetValue);
        
        // Özel durumlar - animasyon yapılmaması gereken değerler
        if (targetValue === "24/7" || targetValue === "Real-time" || targetValue === "Certified" || 
            targetValue.includes("/") || targetValue.includes("%") || 
            typeof targetValue === "string" && !/^\d+/.test(targetValue)) {
            console.log('animateNumber special case, setting directly:', targetValue);
            element.textContent = targetValue;
            return;
        }
        
        // Önce sayıyı temizle - virgül ve noktaları kaldır
        const cleanValue = targetValue.toString().replace(/[,\.]/g, '');
        const isNumeric = /^\d+/.test(cleanValue);
        
        if (isNumeric) {
            const target = parseInt(cleanValue.replace(/[^\d]/g, ''));
            const suffix = targetValue.replace(/^\d+[,\.]?[\d,\.]*/g, ''); // Sayısal kısmı temizle
            let current = 0;
            const increment = target / 20;
            
            console.log(`Animating from 0 to ${target} with suffix "${suffix}"`);
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Türkçe/Avrupa formatında sayı formatla
                const formattedNumber = this.formatNumber(Math.floor(current));
                const result = formattedNumber + suffix;
                element.textContent = result;
                
                if (current >= target) {
                    console.log(`Animation complete: ${result}`);
                }
            }, 30);
        } else {
            // Sayısal değilse olduğu gibi bırak
            console.log('Non-numeric value, setting directly:', targetValue);
            element.textContent = targetValue;
        }
    }

    cleanupAnimationClasses() {
        Object.values(this.textElements).forEach(element => {
            if (element) {
                element.classList.remove(
                    'text-fade-out', 'text-fade-in',
                    'text-slide-out-left', 'text-slide-out-right', 'text-slide-in',
                    'text-scale-out', 'text-scale-in'
                );
            }
        });
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
                        this.duration = this.isMobileDevice ? 10000 : 8000;
                    } else if (battery.level < 0.2) {
                        this.duration = 15000;
                    }
                });
            });
        }
    }
}

// DOM Elements (sadece header ile ilgili olmayanlar)
const emailInput = document.getElementById('email-input');

// Email handling fonksiyonları
function handleGetStarted() {
    const email = emailInput ? emailInput.value.trim() : '';
    
    if (!email) {
        alert('Please enter your email address.');
        if (emailInput) emailInput.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        if (emailInput) emailInput.focus();
        return;
    }
    
    // Here you would typically send the email to your backend
    console.log('Email submitted:', email);
    alert('Thank you for your interest! We\'ll be in touch soon.');
    if (emailInput) emailInput.value = '';
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

// Counter animation for stats - TÜRKÇE FORMAT
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        
        // Özel durumlar - animasyon yapılmaması gereken değerler
        if (target === "24/7" || target === "Real-time" || target === "Certified" || 
            target.includes("/") || target === "Real-time" || target === "Certified") {
            console.log('animateCounters: Special case, skipping animation for:', target);
            return;
        }
        
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        
        let numericValue;
        if (isPercentage) {
            numericValue = parseFloat(target.replace('%', ''));
        } else if (isPlus) {
            numericValue = parseInt(target.replace(/[+,.]/g, '')); // Nokta ve virgülü kaldır
        } else {
            numericValue = parseInt(target.replace(/[,.]/g, '')); // Nokta ve virgülü kaldır
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
                // Türkçe format kullan (nokta ile ayır)
                displayValue = formatNumberTurkish(Math.floor(current)) + '+';
            } else {
                displayValue = formatNumberTurkish(Math.floor(current));
            }
            
            counter.textContent = displayValue;
        }, 50);
    });
}

// Global sayı formatlama fonksiyonu - Türkçe format
function formatNumberTurkish(number) {
    // Sadece 1000 ve üzeri sayılarda nokta ekle
    if (number >= 1000) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return number.toString();
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

// Add hover effects to feature cards
function initFeatureCardEffects() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add parallax effect to hero section
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroVisual = document.querySelector('.hero-visual');
        
        if (heroVisual && scrolled < window.innerHeight) {
            const rate = scrolled * -0.5;
            heroVisual.style.transform = `translateY(${rate}px)`;
        }
    });
}

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

// Add click handlers for CTA buttons with ripple effect
function initRippleEffect() {
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
}

// Mobile-specific initialization
function initMobileOptimizations() {
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
}

// Initialize all observers and effects
function initObservers() {
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .section-header');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Observe hero section for counter animation and video control
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
}

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

// Main initialization function
function initializeApp() {
    console.log('DOM loaded, initializing application...');
    
    // Initialize video carousel
    new HeroVideoCarousel();
    
    // Initialize all other components
    initObservers();
    initFeatureCardEffects();
    initParallaxEffect();
    initRippleEffect();
    initMobileOptimizations();
    
    console.log('Application initialized successfully');
}

// DOM yüklenir yüklenmez hemen başlat
document.addEventListener('DOMContentLoaded', initializeApp);

// Fallback initialization (eğer DOMContentLoaded kaçırılırsa)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}