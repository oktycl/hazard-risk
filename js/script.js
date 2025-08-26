// Video Carousel with Performance Optimizations - LOADING SKELETON'LARI KALDIRILDI

class HeroVideoCarousel {
    constructor() {
        this.videos = document.querySelectorAll('.hero-video');
        this.indicators = document.querySelectorAll('.video-indicator');
        this.currentIndex = 0;
        this.interval = null;
        this.isTransitioning = false;
        
        // Mobile detection and optimizations
        this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isLowPowerMode = this.detectLowPowerMode();
        
        this.duration = this.isMobileDevice ? 10000 : 12000;
        
        // Content for each video - 5 video için restore edildi
        this.contentData = [
            {
                title: "Seismic Risk Predictor",
                subtitle: "",
                description: "Seismic risk prediction <strong>in seconds</strong> from geographic coordinates — rapid screening for individual structures, and portfolio-scale analysis powering Insurance, Finance, Investment, and Asset Management decisions.",
                ctaText: "Start Assessment",
                stats: [
                    { number: "3000+", label: "Buildings Assessed" },
                    { number: "100+", label: "Countries Covered" },
                    { number: "24/7", label: "API Availability" }
                ]
            },
            {
                title: "Hazard Maps",
                subtitle: "",
                description: "Seismic hazard maps for buildings and their contents, integrating earthquake hazard data with site-specific soil conditions for use by insurance companies.",
                ctaText: null,
                stats: [
                    { number: "50+", label: "City Mapped" },
                    { number: "100+", label: "Countries Covered" },
                    { number: "24/7", label: "API Availability" }
                ]
            },
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
            {
                title: "Financial Loss & Downtime Prediction",
                subtitle: "",
                description: "Quick estimates of financial loss and downtime from minimal inputs — giving insurers, financiers, and asset managers actionable awareness, even without full building data.",
                ctaText: null,
                stats: null
            },
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
        this.findTextElements();
        
        // HEMEN İÇERİK YÜKLENİR - Loading state yok
        this.setInitialContent();
        
        // Video preload ve optimizasyon
        this.preloadAndOptimizeVideos();
        
        // Mobile optimizations
        if (this.isMobileDevice) {
            this.optimizeForMobile();
        }
        
        this.addEventListeners();

        // Auto rotation başlat
        setTimeout(() => {
            if (!this.isLowPowerMode) {
                this.startAutoRotation();
            }
        }, 2000);

        this.handleBatteryStatus();
    }

    preloadAndOptimizeVideos() {
        this.videos.forEach((video, index) => {
            video.addEventListener('canplay', () => {
                // Video 3 (index 2) için özel ayarlar
                if (index === 1) { // Video3 (3. video, index 2)
                    video.playbackRate = 0.6; // %50 yavaş oynat
                    video.loop = false; // Loop'u kapat
                    
                    // Video bittiğinde ne yapılacağını belirle
                    video.addEventListener('ended', () => {
                        console.log('Video3 ended, staying on same frame');
                        // Video bittikten sonra son frame'de kal
                        video.currentTime = video.duration - 0.1;
                    });
                } else {
                    // Diğer videolar için normal ayarlar
                    video.playbackRate = 0.8;
                }
            });
        });
    }

    // Bu metodları kaldır - gereksiz karmaşıklık
    // handleVideoError ve handleVideoStall metodları kaldırıldı

    findTextElements() {
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

        this.ctaButton = document.querySelector('.hero-actions');
    }

    setInitialContent() {
        // İlk video içeriğini HEMEN yükle - Loading state yok
        const initialContent = this.contentData[0];
        
        console.log('Loading initial content:', initialContent);
        
        // Direkt olarak content'i yükle
        if (this.textElements.title) {
            this.textElements.title.textContent = initialContent.title;
        }
        if (this.textElements.subtitle) {
            this.textElements.subtitle.textContent = initialContent.subtitle;
        }
        setSafeHTML(this.textElements.description, initialContent.description);

        
        // CTA'yı ayarla
        this.updateCTA(initialContent.ctaText);
        
        // Stats'ları ayarla
        this.updateStatsVisibility(initialContent.stats);
        
        console.log('Initial content loaded for video 0');
    }

    updateStatsVisibility(stats) {
        const statsContainer = document.querySelector('.hero-stats');
        
        if (!stats || stats.length === 0) {
            if (statsContainer) {
                statsContainer.style.display = 'none';
                statsContainer.classList.add('stats-hidden');
            }
        } else {
            if (statsContainer) {
                statsContainer.style.display = 'grid';
                statsContainer.classList.remove('stats-hidden');
            }
            
            // Stats değerlerini direkt ayarla - animasyon yok
            stats.forEach((stat, index) => {
                const numberElement = this.textElements[`stat${index + 1}Number`];
                const labelElement = this.textElements[`stat${index + 1}Label`];
                
                if (numberElement) {
                    const formattedNumber = this.formatStatNumber(stat.number);
                    numberElement.textContent = formattedNumber;
                }
                if (labelElement) {
                    labelElement.textContent = stat.label;
                }
            });
        }
    }

    formatStatNumber(statValue) {
        if (statValue === "24/7" || statValue === "Real-time" || statValue === "Certified" || 
            statValue.includes("/") || statValue.includes("%")) {
            return statValue;
        }
        
        const cleanValue = statValue.toString().replace(/[,]/g, '');
        const isNumeric = /^\d+/.test(cleanValue);
        
        if (isNumeric) {
            const number = parseInt(cleanValue.replace(/[^\d]/g, ''));
            const suffix = cleanValue.replace(/^\d+/, '');
            const formatted = number >= 1000 ? this.formatNumber(number) : number.toString();
            return formatted + suffix;
        } else {
            return statValue;
        }
    }

    formatNumber(number) {
        if (number >= 1000) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return number.toString();
    }

    updateCTA(ctaText) {
        const shouldHide = !ctaText || ctaText === "" || ctaText === null;
        
        if (shouldHide) {
            if (this.ctaButton) {
                this.ctaButton.classList.add('cta-hidden');
                this.ctaButton.classList.remove('cta-visible');
                document.body.classList.add('no-cta');
            }
        } else {
            if (this.textElements.ctaText) {
                this.textElements.ctaText.textContent = ctaText;
            }
            if (this.ctaButton) {
                this.ctaButton.classList.add('cta-visible');
                this.ctaButton.classList.remove('cta-hidden');
                document.body.classList.remove('no-cta');
            }
        }
    }

    optimizeForMobile() {
        // SADECE PLAYBACK RATE AYARLA - Başka hiçbir şeyi değiştirme
        this.videos.forEach(video => {
            video.playbackRate = 0.9;
        });
    }

    addEventListeners() {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (!this.isTransitioning) {
                    this.goToVideo(index);
                }
            });
        });

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

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoRotation();
                this.pauseAllVideos();
            } else if (!this.isLowPowerMode) {
                this.startAutoRotation();
                this.resumeCurrentVideo();
            }
        });

        if (this.isMobileDevice) {
            this.addTouchEvents();
        }
    }

    pauseAllVideos() {
        this.videos.forEach(video => {
            if (!video.paused) {
                video.pause();
            }
        });
    }

    resumeCurrentVideo() {
        const currentVideo = this.videos[this.currentIndex];
        if (currentVideo && currentVideo.paused) {
            currentVideo.play().catch(e => {
                console.error('Failed to resume video:', e);
            });
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
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const difference = startX - endX;

        if (Math.abs(difference) > swipeThreshold && !this.isTransitioning) {
            if (difference > 0) {
                this.nextVideo();
            } else {
                this.previousVideo();
            }
        }
    }

    previousVideo() {
        const prevIndex = (this.currentIndex - 1 + this.videos.length) % this.videos.length;
        this.goToVideo(prevIndex);
    }

    goToVideo(index) {
        if (index === this.currentIndex || this.isTransitioning) return;

        this.isTransitioning = true;
        
        console.log(`Switching from video ${this.currentIndex} to video ${index}`);

        this.updateContent(index);

        const currentVideo = this.videos[this.currentIndex];
        const nextVideo = this.videos[index];
        
        if (currentVideo) {
            currentVideo.classList.remove('active');
        }
        
        this.indicators[this.currentIndex].classList.remove('active');
        this.currentIndex = index;

        setTimeout(() => {
            if (nextVideo) {
                nextVideo.classList.add('active');
                // Video3 için özel ayarlar
                if (index === 1) {
                    nextVideo.currentTime = 0; // Baştan başlat
                    nextVideo.playbackRate = 0.08; // Yavaş oynat
                    nextVideo.loop = false; // Loop kapalı
                }
                nextVideo.play().catch(e => {
                    console.error('Failed to play new video:', e);
                });
            }
            this.indicators[this.currentIndex].classList.add('active');
            
            setTimeout(() => {
                this.isTransitioning = false;
            }, 500);
        }, 400);

        this.restartAutoRotation();
    }

    updateContent(newIndex) {
        const newContent = this.contentData[newIndex];
        
        if (!newContent) {
            console.error(`No content found for video ${newIndex}`);
            return;
        }
        
        this.fadeOutContent();
        
        setTimeout(() => {
            if (this.textElements.title) {
                this.textElements.title.textContent = newContent.title;
            }
            if (this.textElements.subtitle) {
                this.textElements.subtitle.textContent = newContent.subtitle;
            }
            setSafeHTML(this.textElements.description, newContent.description);

            this.updateCTA(newContent.ctaText);
            this.updateStats(newContent.stats);
            this.fadeInContent();
        }, 400);
    }

    fadeOutContent() {
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
        
        if (this.ctaButton) {
            this.ctaButton.classList.add('transitioning');
        }
        
        document.querySelectorAll('.stat').forEach(stat => {
            stat.classList.add('stat-updating');
        });
    }

    fadeInContent() {
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
        
        setTimeout(() => {
            if (this.ctaButton) {
                this.ctaButton.classList.remove('transitioning');
            }
        }, 500);
        
        setTimeout(() => {
            this.cleanupAnimationClasses();
        }, 800);
    }

    updateStats(newStats) {
        const statsContainer = document.querySelector('.hero-stats');
        
        if (!newStats || newStats.length === 0) {
            if (statsContainer) {
                statsContainer.style.display = 'none';
                statsContainer.classList.add('stats-hidden');
            }
            return;
        }
        
        if (statsContainer) {
            statsContainer.style.display = 'grid';
            statsContainer.classList.remove('stats-hidden');
        }
        
        // Stats değerlerini animasyonlu güncelle
        newStats.forEach((stat, index) => {
            const numberElement = this.textElements[`stat${index + 1}Number`];
            const labelElement = this.textElements[`stat${index + 1}Label`];
            
            if (labelElement) {
                labelElement.textContent = stat.label;
            }
            
            if (numberElement) {
                this.animateNumber(numberElement, stat.number);
            }
        });
        
        setTimeout(() => {
            document.querySelectorAll('.stat').forEach(stat => {
                stat.classList.remove('stat-updating');
            });
        }, 600);
    }

    animateNumber(element, targetValue) {
        if (targetValue === "24/7" || targetValue === "Real-time" || targetValue === "Certified" || 
            targetValue.includes("/") || targetValue.includes("%") || 
            typeof targetValue === "string" && !/^\d+/.test(targetValue)) {
            element.textContent = targetValue;
            return;
        }
        
        const cleanValue = targetValue.toString().replace(/[,\.]/g, '');
        const isNumeric = /^\d+/.test(cleanValue);
        
        if (isNumeric) {
            const target = parseInt(cleanValue.replace(/[^\d]/g, ''));
            const suffix = targetValue.replace(/^\d+[,\.]?[\d,\.]*/g, '');
            let current = 0;
            const increment = target / 20;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                const formattedNumber = this.formatNumber(Math.floor(current));
                const result = formattedNumber + suffix;
                element.textContent = result;
            }, 30);
        } else {
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
        if (!this.isLowPowerMode && !this.interval) {
            this.interval = setInterval(() => {
                if (!this.isTransitioning) {
                    this.nextVideo();
                }
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
        setTimeout(() => {
            this.startAutoRotation();
        }, 1000);
    }

    detectLowPowerMode() {
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            return true;
        }
        
        if (navigator.connection && navigator.connection.effectiveType === 'slow-2g') {
            return true;
        }
        
        return false;
    }

    handleBatteryStatus() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then((battery) => {
                if (battery.level < 0.2) {
                    this.duration = 15000;
                }
                
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

// Utility functions
const emailInput = document.getElementById('email-input');

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
    
    console.log('Email submitted:', email);
    alert('Thank you for your interest! We\'ll be in touch soon.');
    if (emailInput) emailInput.value = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

if (emailInput) {
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGetStarted();
        }
    });
}

function setSafeHTML(element, htmlString) {
    if (!element) return;

    // İzin verilen HTML etiketleri
    const allowedTags = ['strong', 'em', 'p', 'ul', 'ol', 'li', 'br'];
    
    // HTML tag'lerini temizle - sadece izin verilenleri bırak
    let cleanHTML = htmlString;
    
    // Önce tüm HTML tag'lerini bul
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^<>]*>/gi;
    
    cleanHTML = cleanHTML.replace(tagRegex, (match, tagName) => {
        // Tag adını küçük harfe çevir ve kontrol et
        if (allowedTags.includes(tagName.toLowerCase())) {
            return match; // İzin verilen tag'i koru
        } else {
            return ''; // İzin verilmeyen tag'i kaldır
        }
    });
    
    // Sonucu element'e ata
    element.innerHTML = cleanHTML;
}



// Performance optimized initialization
function initializeApp() {
    console.log('DOM loaded, initializing application...');
    
    // Video carousel'ı hemen başlat - Loading delay yok
    new HeroVideoCarousel();
    
    console.log('Application initialized successfully');
}


// DOM hazır olduğunda hemen başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}