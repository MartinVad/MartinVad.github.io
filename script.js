// Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
  
  // Mobile menu functionality
  function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
    
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
      });

      // Close mobile menu when clicking on links
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
        });
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
          mobileMenu.classList.remove('active');
        }
      });
    }
  }

  // Theme switching functionality
  function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const iconLight = document.getElementById('theme-toggle-light');
    const iconDark = document.getElementById('theme-toggle-dark');

    function updateIcons() {
      const darkMode = html.classList.contains('dark');
      if (iconDark && iconLight) {
        iconDark.style.display = darkMode ? 'none' : 'block';
        iconLight.style.display = darkMode ? 'block' : 'none';
      }
    }

    // Initialize icons
    updateIcons();

    if (btn) {
      btn.addEventListener('click', () => {
        html.classList.toggle('dark');
        localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
        updateIcons();
      });
    }
  }

  // Image lazy loading with intersection observer
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('img-loading');
            img.classList.add('img-loaded');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });

      images.forEach(img => {
        img.classList.add('img-loading');
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  // Smooth scrolling for anchor links (fallback for older browsers)
  function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          // Use native smooth scrolling if available
          if ('scrollBehavior' in document.documentElement.style) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            // Fallback smooth scrolling
            const targetPosition = targetElement.offsetTop - 80; // Account for sticky header
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // Performance monitoring
  function initPerformanceMonitoring() {
    // Log page load time
    window.addEventListener('load', () => {
      if (performance && performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
      }
    });

    // Log Largest Contentful Paint (LCP) if supported
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log(`LCP: ${lastEntry.startTime}ms`);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Silently fail if not supported
      }
    }
  }

  // Add loading states to images
  function initImageLoadingStates() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      if (!img.complete) {
        img.classList.add('image-loading');
        
        img.addEventListener('load', () => {
          img.classList.remove('image-loading');
        });
        
        img.addEventListener('error', () => {
          img.classList.remove('image-loading');
          console.warn(`Failed to load image: ${img.src}`);
        });
      }
    });
  }

  // Initialize all functionality
  initMobileMenu();
  initThemeToggle();
  initLazyLoading();
  initSmoothScrolling();
  initImageLoadingStates();
  
  // Only initialize performance monitoring in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    initPerformanceMonitoring();
  }
});
