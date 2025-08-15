/**
 * Header.js - Async Loading Compatible with Dropdown Support
 * Bu dosya header HTML'i dinamik yüklendiğinde de çalışır
 */

(function() {
    'use strict';
    
    let isInitialized = false;
    
    // Header fonksiyonlarını başlat
    function initHeader() {
        if (isInitialized) return; // Tekrar çalışmasını engelle
        
        console.log('Header.js trying to initialize...');
        
        // DOM element'lerini al
        const header = document.getElementById('header');
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const dropdownItems = document.querySelectorAll('.dropdown-item-main');
        
        // Element kontrolü
        if (!header || !navToggle || !navMenu) {
            console.warn('Header element(ler)i henüz yok, bekleniyor...');
            return false; // Başarısız
        }
        
        console.log('✅ Header elementleri bulundu, event listener(lar) ekleniyor...');
        isInitialized = true;
        
        // 1. Mobil menü toggle
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Hamburger menüye tıklandı');
            
            // Menüyü aç/kapat
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // JavaScript ile zorla göster (CSS sorunlarına karşı)
            if (navMenu.classList.contains('active')) {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'fixed';
                navMenu.style.top = '3.5rem';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.background = 'white';
                navMenu.style.padding = '2rem 1.5rem';
                navMenu.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                navMenu.style.borderTop = '1px solid #e5e7eb';
                navMenu.style.zIndex = '1001';
                navMenu.style.minHeight = '70vh';
                navMenu.style.maxHeight = '85vh';
                navMenu.style.overflowY = 'auto';
                console.log('✅ Menü açıldı');
            } else {
                navMenu.style.display = 'none';
                console.log('❌ Menü kapandı');
            }
            
            // Body scroll'u engelle/serbest bırak
            document.body.classList.toggle('menu-open');
            
            // Hamburger animasyonu
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[1].style.transform = 'scale(0)';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[1].style.transform = 'scale(1)';
                spans[2].style.transform = 'none';
            }
        });
        
        // 2. Dropdown menü için mobil desteği - DOĞRU YER
        dropdownItems.forEach(function(item) {
            const link = item.querySelector('.nav-link');
            const dropdown = item.querySelector('.dropdown-menu');
            
            if (dropdown && link) {
                link.addEventListener('click', function(e) {
                    // Mobilde dropdown tıklamasını engelle ve toggle et
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log('Mobil dropdown tıklandı');
                        
                        // Diğer açık dropdown'ları kapat
                        dropdownItems.forEach(function(otherItem) {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                                console.log('Diğer dropdown kapatıldı');
                            }
                        });
                        
                        // Bu dropdown'ı toggle et
                        item.classList.toggle('active');
                        
                        if (item.classList.contains('active')) {
                            console.log('✅ Dropdown açıldı');
                        } else {
                            console.log('❌ Dropdown kapandı');
                        }
                    }
                    // Desktop'ta normal link davranışı (href'e git veya dropdown aç)
                });
            }
        });
        
        // 3. Menü linklerine tıklayınca menüyü kapat
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Dropdown link değilse menüyü kapat
                if (!link.closest('.dropdown-item-main') || window.innerWidth > 768) {
                    closeMenu();
                }
            });
        });
        
        // 4. Menü dışına tıklayınca kapat (Event Delegation)
        document.addEventListener('click', function(e) {
            if (navToggle && navMenu && 
                !navToggle.contains(e.target) && 
                !navMenu.contains(e.target)) {
                closeMenu();
            }
        });
        
        // 5. ESC tuşu ile menüyü kapat
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
        
        // 6. Scroll efekti - İYİLEŞTİRİLMİŞ VERSİYON
        let ticking = false;
        let scrollTimeout;
        let lastScrollY = 0;

        function updateHeader() {
            const currentScrollY = window.scrollY;
            
            if (header) {
                // Scroll yapılıyorsa geçici olarak opak yap
                header.classList.add('scrolled');
                header.classList.remove('scroll-stopped');
                
                // Scroll timeout'u temizle
                clearTimeout(scrollTimeout);
                
                // Scroll durduğunda tekrar şeffaf yap
                scrollTimeout = setTimeout(() => {
                    if (currentScrollY > 50) {
                        // Hala aşağıdaysa az opak kal
                        header.classList.remove('scrolled');
                        header.classList.add('scroll-stopped');
                    } else {
                        // En üstteyse tamamen şeffaf ol
                        header.classList.remove('scrolled');
                        header.classList.remove('scroll-stopped');
                    }
                    console.log('Scroll durdu - şeffaflığa geçiş');
                }, 500); // 500ms sonra şeffaf ol
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });

        // Sayfa yüklendiğinde tamamen şeffaf başla
        window.addEventListener('load', function() {
            if (header) {
                header.classList.remove('scrolled');
                header.classList.remove('scroll-stopped');
            }
        });
        
        // 7. Pencere boyutu değişince menüyü kapat ve dropdown'ları temizle
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMenu();
                // Desktop'ta dropdown'ları temizle
                dropdownItems.forEach(function(item) {
                    item.classList.remove('active');
                });
            }
        });
        
        // Menüyü kapatma fonksiyonu
        function closeMenu() {
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navMenu.style.display = 'none';
                document.body.classList.remove('menu-open');
                
                // Hamburger animasyonunu sıfırla
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[1].style.transform = 'scale(1)';
                spans[2].style.transform = 'none';
                
                // Dropdown'ları kapat
                dropdownItems.forEach(function(item) {
                    item.classList.remove('active');
                });
                
                console.log('Menü ve dropdown\'lar kapatıldı');
            }
        }
        
        console.log('🎉 Header başarıyla başlatıldı');
        return true; // Başarılı
    }
    
    // 1. Sayfa yüklendiğinde dene
    function tryInit() {
        return initHeader();
    }
    
    // 2. DOM değişikliklerini izle (header dinamik yüklendiğinde)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Yeni elementler eklendi, header var mı kontrol et
                const header = document.getElementById('header');
                if (header && !isInitialized) {
                    console.log('🔄 Header DOM\'a eklendi, yeniden deneniyor...');
                    if (initHeader()) {
                        observer.disconnect(); // Başarılıysa gözlemi durdur
                    }
                }
            }
        });
    });
    
    // DOM gözlemine başla
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // DOM yüklenince dene
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }
    
    // Global erişim
    window.HeaderJS = {
        version: '3.0.0',
        init: initHeader,
        isInitialized: function() { return isInitialized; }
    };
    
})();

// CSS stilleri
(function addHeaderStyles() {
    const style = document.createElement('style');
    style.textContent = `
        body.menu-open {
            overflow: hidden;
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                transition: all 0.3s ease;
            }
            
            .nav-toggle span {
                transition: all 0.3s ease;
            }
            
            .dropdown-menu {
                transition: all 0.3s ease;
            }
        }
        
        /* Dropdown hover effects for desktop */
        @media (min-width: 769px) {
            .dropdown-menu {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
        }
    `;
    
    if (!document.querySelector('style[data-header-js]')) {
        style.setAttribute('data-header-js', 'true');
        document.head.appendChild(style);
    }
})();