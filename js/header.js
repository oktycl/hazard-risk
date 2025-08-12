/**
 * Header.js - Async Loading Compatible
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
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.background = 'white';
                navMenu.style.padding = '1rem';
                navMenu.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                navMenu.style.borderTop = '1px solid #e5e7eb';
                navMenu.style.zIndex = '1000';
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
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // 2. Menü linklerine tıklayınca menüyü kapat
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
        
        // 3. Menü dışına tıklayınca kapat (Event Delegation)
        document.addEventListener('click', function(e) {
            if (navToggle && navMenu && 
                !navToggle.contains(e.target) && 
                !navMenu.contains(e.target)) {
                closeMenu();
            }
        });
        
        // 4. ESC tuşu ile menüyü kapat
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
        
        // 5. Scroll efekti
        // 5. Scroll efekti - İYİLEŞTİRİLMİŞ VERSİYON
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
        
        // 6. Pencere boyutu değişince menüyü kapat
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMenu();
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
                spans[2].style.transform = 'none';
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
        version: '2.0.0',
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
        }
    `;
    
    if (!document.querySelector('style[data-header-js]')) {
        style.setAttribute('data-header-js', 'true');
        document.head.appendChild(style);
    }
})();