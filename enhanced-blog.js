// ===================================
// ENHANCED BLOG NAVIGATION SYSTEM
// Dr Pondja Medical Blog
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================
  // MOBILE NAVIGATION
  // ===================================
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('open');
    });

    // Close mobile menu when clicking on a link
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ===================================
  // STICKY HEADER WITH SCROLL EFFECT
  // ===================================
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // ===================================
  // ENHANCED SMOOTH SCROLL
  // ===================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#top') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          // Hide blog grid when viewing article
          const blogGrid = document.querySelector('.blog-grid');
          if (blogGrid && href.startsWith('#') && href !== '#top') {
            blogGrid.closest('.blog-section').style.display = 'none';
          }
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without page reload
          history.pushState(null, null, href);
          
          // Highlight active article in TOC
          updateActiveTOC(href.substring(1));
        }
      } else if (href === '#top') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Show blog grid when returning to top
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
          blogGrid.closest('.blog-section').style.display = 'block';
        }
        
        // Clear URL hash
        history.pushState(null, null, window.location.pathname);
        
        // Clear TOC highlight
        document.querySelectorAll('.toc-link').forEach(link => {
          link.classList.remove('active');
        });
      }
    });
  });

  // ===================================
  // TABLE OF CONTENTS (TOC) SYSTEM
  // ===================================
  const tocLinks = document.querySelectorAll('.toc-link');
  const articles = document.querySelectorAll('.full-article');
  const tocToggle = document.getElementById('tocToggle');
  const articleTOC = document.getElementById('articleTOC');

  // TOC Toggle for Mobile
  if (tocToggle && articleTOC) {
    tocToggle.addEventListener('click', () => {
      articleTOC.classList.toggle('toc-open');
      const isOpen = articleTOC.classList.contains('toc-open');
      tocToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Update active TOC link based on scroll position
  function updateActiveTOC(activeId) {
    tocLinks.forEach(link => {
      const articleId = link.getAttribute('data-article');
      if (articleId === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Intersection Observer for automatic TOC highlighting
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const articleId = entry.target.id;
          updateActiveTOC(articleId);
          
          // Update URL without scroll
          if (articleId && window.pageYOffset > 500) {
            history.replaceState(null, null, `#${articleId}`);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    articles.forEach(article => {
      observer.observe(article);
    });
  }

  // ===================================
  // SCROLL PROGRESS INDICATOR
  // ===================================
  function createScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);

    const progressBarFill = progressBar.querySelector('.scroll-progress-bar');

    // Update progress on scroll
    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.pageYOffset / windowHeight) * 100;
      progressBarFill.style.width = scrolled + '%';
    });
  }

  createScrollProgress();

  // ===================================
  // HIDE/SHOW BLOG GRID BASED ON URL
  // ===================================
  function handleInitialHash() {
    const hash = window.location.hash;
    if (hash && hash !== '#top' && hash !== '#') {
      const target = document.querySelector(hash);
      if (target && target.classList.contains('full-article')) {
        // Hide blog grid if directly accessing an article
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
          blogGrid.closest('.blog-section').style.display = 'none';
        }
        
        // Highlight in TOC
        updateActiveTOC(hash.substring(1));
        
        // Scroll to article after a brief delay
        setTimeout(() => {
          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }

  handleInitialHash();

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    handleInitialHash();
  });

  // ===================================
  // READING TIME PROGRESS
  // ===================================
  function addReadingProgress() {
    articles.forEach(article => {
      const content = article.querySelector('.article-content');
      if (!content) return;

      // Create progress indicator
      const progressIndicator = document.createElement('div');
      progressIndicator.className = 'article-progress';
      progressIndicator.innerHTML = `
        <div class="progress-circle">
          <svg width="60" height="60">
            <circle cx="30" cy="30" r="28" class="progress-circle-bg"></circle>
            <circle cx="30" cy="30" r="28" class="progress-circle-fill"></circle>
          </svg>
          <span class="progress-percent">0%</span>
        </div>
      `;
      
      article.insertBefore(progressIndicator, article.firstChild);

      // Update progress on scroll
      const updateProgress = () => {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const scrollPosition = window.pageYOffset + window.innerHeight;
        const articleBottom = articleTop + articleHeight;

        if (scrollPosition > articleTop && window.pageYOffset < articleBottom) {
          const progress = ((scrollPosition - articleTop) / articleHeight) * 100;
          const clampedProgress = Math.min(Math.max(progress, 0), 100);
          
          const circle = progressIndicator.querySelector('.progress-circle-fill');
          const percent = progressIndicator.querySelector('.progress-percent');
          
          const circumference = 2 * Math.PI * 28;
          const offset = circumference - (clampedProgress / 100) * circumference;
          
          circle.style.strokeDashoffset = offset;
          percent.textContent = Math.round(clampedProgress) + '%';
          
          if (clampedProgress > 10) {
            progressIndicator.classList.add('visible');
          } else {
            progressIndicator.classList.remove('visible');
          }
        } else {
          progressIndicator.classList.remove('visible');
        }
      };

      window.addEventListener('scroll', updateProgress);
      updateProgress();
    });
  }

  addReadingProgress();

  // ===================================
  // COPY ARTICLE LINK BUTTON
  // ===================================
  function addShareButtons() {
    articles.forEach(article => {
      const articleHeader = article.querySelector('.article-header');
      if (!articleHeader) return;

      const shareButton = document.createElement('button');
      shareButton.className = 'btn-share';
      shareButton.innerHTML = `
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
        </svg>
        <span>Partager</span>
      `;
      
      shareButton.addEventListener('click', () => {
        const url = window.location.origin + window.location.pathname + '#' + article.id;
        
        if (navigator.share) {
          navigator.share({
            title: article.querySelector('h2').textContent,
            url: url
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(url).then(() => {
            const originalHTML = shareButton.innerHTML;
            shareButton.innerHTML = `
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
              </svg>
              <span>Copié!</span>
            `;
            setTimeout(() => {
              shareButton.innerHTML = originalHTML;
            }, 2000);
          });
        }
      });

      articleHeader.appendChild(shareButton);
    });
  }

  addShareButtons();

  // ===================================
  // PRINT ARTICLE BUTTON
  // ===================================
  function addPrintButtons() {
    articles.forEach(article => {
      const cta = article.querySelector('.article-cta');
      if (!cta) return;

      const printButton = document.createElement('button');
      printButton.className = 'btn outline';
      printButton.innerHTML = `
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
          <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
        </svg>
        Imprimer
      `;
      
      printButton.addEventListener('click', () => {
        // Hide everything except the article
        document.body.classList.add('print-mode');
        
        // Get article title for print
        const title = article.querySelector('h2').textContent;
        const originalTitle = document.title;
        document.title = title;
        
        window.print();
        
        // Restore after print
        setTimeout(() => {
          document.body.classList.remove('print-mode');
          document.title = originalTitle;
        }, 100);
      });

      cta.insertBefore(printButton, cta.lastElementChild);
    });
  }

  addPrintButtons();

  // ===================================
  // ESTIMATED READ TIME UPDATER
  // ===================================
  function updateReadTimes() {
    articles.forEach(article => {
      const content = article.querySelector('.article-content');
      if (!content) return;

      const text = content.textContent;
      const wordCount = text.trim().split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200); // 200 words per minute

      const metaElement = article.querySelector('.article-meta');
      if (metaElement) {
        const readTimeSpan = metaElement.querySelector('span:last-child');
        if (readTimeSpan) {
          readTimeSpan.textContent = readTime + ' min de lecture';
        }
      }
    });
  }

  updateReadTimes();

  // ===================================
  // KEYBOARD NAVIGATION
  // ===================================
  document.addEventListener('keydown', (e) => {
    // Press 'H' to go home/top
    if (e.key === 'h' || e.key === 'H') {
      if (!e.target.matches('input, textarea')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    
    // Press 'T' to toggle TOC
    if (e.key === 't' || e.key === 'T') {
      if (!e.target.matches('input, textarea') && articleTOC) {
        articleTOC.classList.toggle('toc-open');
      }
    }
  });

  // ===================================
  // PERFORMANCE: LAZY LOAD IMAGES
  // ===================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ===================================
  // DARK MODE TOGGLE (BONUS FEATURE)
  // ===================================
  function initDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.setAttribute('aria-label', 'Activer/Désactiver le mode sombre');
    darkModeToggle.innerHTML = `
      <svg class="sun-icon" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
      </svg>
      <svg class="moon-icon" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style="display: none;">
        <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
      </svg>
    `;

    document.body.appendChild(darkModeToggle);

    // Check for saved preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
      document.body.classList.add('dark-mode');
      toggleDarkModeIcons(true);
    }

    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      
      localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
      toggleDarkModeIcons(isDark);
    });

    function toggleDarkModeIcons(isDark) {
      const sunIcon = darkModeToggle.querySelector('.sun-icon');
      const moonIcon = darkModeToggle.querySelector('.moon-icon');
      
      if (isDark) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  }

  initDarkMode();

  // ===================================
  // CONSOLE LOG FOR DEVELOPERS
  // ===================================
  console.log('%c✨ Enhanced Blog System Loaded', 'color: #7c3aed; font-size: 16px; font-weight: bold;');
  console.log('%cKeyboard Shortcuts:', 'color: #10b981; font-weight: bold;');
  console.log('H - Return to top');
  console.log('T - Toggle table of contents');
  console.log('%c\nFeatures Active:', 'color: #10b981; font-weight: bold;');
  console.log('✓ Smooth scrolling');
  console.log('✓ TOC auto-highlighting');
  console.log('✓ Reading progress indicators');
  console.log('✓ Share & Print buttons');
  console.log('✓ Dark mode toggle');
  console.log('✓ Keyboard navigation');
});