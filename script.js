// script.js

document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-hidden').forEach(section => {
        observer.observe(section);
    });

    // ============================================================
    //  LIVE GITHUB API - Auto-updates every time you push a commit!
    // ============================================================
    const GITHUB_USERNAME = 'mallikarjun-athani';

    function animateCount(el, targetVal) {
        let current = 0;
        const step = Math.ceil(targetVal / 40) || 1;
        const timer = setInterval(() => {
            current += step;
            if (current >= targetVal) { current = targetVal; clearInterval(timer); }
            el.textContent = current;
        }, 40);
    }

    function animateLangBars() {
        document.querySelectorAll('.lang-fill').forEach(bar => {
            const tw = bar.getAttribute('data-width') || bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = tw; }, 300);
        });
    }

    async function fetchGitHubStats() {
        try {
            const userRes  = await fetch('https://api.github.com/users/' + GITHUB_USERNAME);
            const userData = await userRes.json();
            const reposRes  = await fetch('https://api.github.com/users/' + GITHUB_USERNAME + '/repos?per_page=100');
            const reposData = await reposRes.json();

            if (userData.message === 'Not Found' || !Array.isArray(reposData)) return;

            const totalRepos = userData.public_repos || 0;
            const followers  = userData.followers || 0;
            const following  = userData.following || 0;
            const totalStars = reposData.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

            const statMap = {
                'stat-repos':     totalRepos,
                'stat-followers': followers,
                'stat-following': following,
                'stat-stars':     totalStars
            };
            Object.entries(statMap).forEach(function(entry) {
                const el = document.getElementById(entry[0]);
                if (el) { el.setAttribute('data-count', entry[1]); animateCount(el, entry[1]); }
            });

            const ringMap = {
                'ring-repos':   totalRepos,
                'ring-commits': reposData.length * 5,
                'ring-stars':   totalStars
            };
            Object.entries(ringMap).forEach(function(entry) {
                const el = document.getElementById(entry[0]);
                if (el) { el.setAttribute('data-count', entry[1]); animateCount(el, entry[1]); }
            });

            const langCount = {};
            reposData.forEach(function(repo) {
                if (repo.language) langCount[repo.language] = (langCount[repo.language] || 0) + 1;
            });

            const totalLangRepos = Object.values(langCount).reduce(function(a, b) { return a + b; }, 0);
            const sorted = Object.entries(langCount).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);
            const langColors = ['#3b82f6','#f97316','#10b981','#8b5cf6','#fbbf24'];
            const container = document.querySelector('.lang-bars');

            if (container && sorted.length > 0) {
                container.innerHTML = '';
                sorted.forEach(function(item, i) {
                    const lang = item[0], count = item[1];
                    const pct = Math.round((count / totalLangRepos) * 100);
                    const color = langColors[i] || '#94a3b8';
                    container.innerHTML += '<div class="lang-item"><div class="lang-label"><span>' + lang + '</span><span>' + pct + '%</span></div><div class="lang-bar"><div class="lang-fill" data-width="' + pct + '%" style="width:0%;background:' + color + ';"></div></div></div>';
                });
                setTimeout(animateLangBars, 400);
            } else {
                animateLangBars();
            }

            const badge = document.getElementById('github-live-badge');
            if (badge) badge.style.display = 'inline-flex';

        } catch(err) {
            console.warn('GitHub API unavailable. Showing fallback values.', err);
            document.querySelectorAll('[data-count]').forEach(function(el) {
                animateCount(el, parseInt(el.getAttribute('data-count')));
            });
            animateLangBars();
        }
    }

    const githubSection = document.getElementById('github');
    if (githubSection) {
        const githubObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    fetchGitHubStats();
                    githubObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        githubObserver.observe(githubSection);
    }

    // Auto-refresh GitHub stats every 5 minutes (300000 ms)
    setInterval(fetchGitHubStats, 300000);

    // Manual refresh button listener
    const refreshBtn = document.getElementById('refreshGitHubBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            refreshBtn.style.opacity = '0.6';
            refreshBtn.style.transform = 'rotate(180deg)';
            fetchGitHubStats();
            setTimeout(function() {
                refreshBtn.style.opacity = '1';
                refreshBtn.style.transform = 'rotate(0deg)';
            }, 600);
        });
    }

    // Navbar Background and Scroll Progress Bar
    const navbar = document.querySelector('.navbar');
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', () => {
        // Navbar styling
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.boxShadow = 'none';
        }

        // Scroll progress bar logic
        let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrolled = (winScroll / height) * 100;
        if(progressBar) progressBar.style.width = scrolled + "%";

        // Back to Top button visibility
        if (backToTop) {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Active nav link based on scroll section
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active-link');
            }
        });
    });

    // Back to Top click
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        backToTop.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        backToTop.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    }

    // --- CUSTOM CURSOR LOGIC ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows exactly
            cursorDot.style.transform = `translate(${posX}px, ${posY}px)`;
            
            // Outline follows with slight delay using animate
            cursorOutline.animate({
                transform: `translate(${posX}px, ${posY}px)`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effect for clickable elements
        const clickables = document.querySelectorAll('a, .btn, .hamburger');
        clickables.forEach(clickable => {
            clickable.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            clickable.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // --- TYPING EFFECT ---
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ['Python Developer', 'Full Stack Developer', 'Backend Engineer', 'Problem Solver'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeEffect() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(typeEffect, typeSpeed);
        }
        setTimeout(typeEffect, 1000);
    }

    // --- 3D TILT EFFECT FOR CARDS ---
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // Subtle parallax effect on background shapes
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.bg-shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
            const yOffset = (window.innerHeight / 2 - e.clientY) / speed;
            shape.style.marginLeft = `${xOffset}px`;
            shape.style.marginTop = `${yOffset}px`;
        });
    });

    // --- INTERACTIVE PARTICLE BACKGROUND ANIMATION ---
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Config
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const connectionDistance = 150;
    let mouse = { x: null, y: null, radius: 150 };

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5;
            this.color = Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.5)' : 'rgba(16, 185, 129, 0.5)'; // Blue or Emerald
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x > width || this.x < 0) this.speedX *= -1;
            if (this.y > height || this.y < 0) this.speedY *= -1;

            // Mouse interaction
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    // Push away slightly
                    this.x -= dx * 0.02;
                    this.y -= dy * 0.02;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    let opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(148, 163, 184, ${opacity * 0.2})`; // Slate colored lines
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animate);
    }

    initCanvas();
    initParticles();
    animate();

    // Event Listeners for canvas
    window.addEventListener('resize', () => {
        initCanvas();
        initParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
});
