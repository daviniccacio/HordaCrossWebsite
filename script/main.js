// main.js

document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // I. CARROSSEL (SLIDESHOW) - INCLUINDO CORREÇÃO MOBILE/SWIPE
    // =======================================================
    const carousel = document.getElementById('horda-carousel');
    const carouselSlides = document.getElementById('carousel-slides');
    // Verifica se os elementos existem antes de prosseguir
    const slides = carouselSlides ? carouselSlides.querySelectorAll('img') : [];
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');

    if (carousel && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        const AUTOPLAY_DELAY = 5000; // 5 segundos
        const SWIPE_THRESHOLD = 50; // Mínimo de pixels para ser considerado um swipe
        
        let autoplayInterval;
        let resetAutoplayTimeout;
        
        let touchStartX = 0;
        let touchCurrentX = 0;
        let isSwiping = false; 

        // 1. Função principal para atualizar a posição
        function updateCarousel() {
            const offset = -currentIndex * 100;
            carouselSlides.style.transform = `translateX(${offset}%)`;
            carouselSlides.style.transition = 'transform 0.5s ease-in-out';
        }

        // 2. Lógica de navegação
        function goToNextSlide() {
            currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        }

        function goToPrevSlide() {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
            updateCarousel();
        }

        // 3. Controle de Autoplay
        function startAutoplay() {
            clearInterval(autoplayInterval);
            autoplayInterval = setInterval(goToNextSlide, AUTOPLAY_DELAY);
        }

        // 4. Funcao de Interacao Manual (Controle de Parada/Reinício)
        function handleManualInteraction(action) {
            // Para o autoplay e o timer de reinício
            clearInterval(autoplayInterval);
            clearTimeout(resetAutoplayTimeout); 
            action(); 
            // Cria um NOVO timer para reiniciar o autoplay após o delay
            resetAutoplayTimeout = setTimeout(startAutoplay, AUTOPLAY_DELAY);
        }

        // --- Eventos de Clique (Setas) ---
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                handleManualInteraction(goToPrevSlide);
            });
            nextButton.addEventListener('click', () => {
                handleManualInteraction(goToNextSlide);
            });
        }

        // --- Eventos de Swipe (Mobile/Touch) ---
        
        // touchstart: Marca o início do movimento
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchCurrentX = touchStartX;
            isSwiping = false;
            carouselSlides.style.transition = 'none'; // Desliga transição
        }, {passive: true});

        // touchmove: Move o slide e previne a rolagem vertical
        carousel.addEventListener('touchmove', (e) => {
            touchCurrentX = e.changedTouches[0].screenX;
            const deltaX = touchCurrentX - touchStartX;
            const deltaY = e.changedTouches[0].screenY - e.changedTouches[0].screenY; 
            
            // Verifica se o movimento é predominantemente horizontal
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                e.preventDefault(); 
                isSwiping = true;
                const offset = -currentIndex * carousel.offsetWidth + deltaX;
                carouselSlides.style.transform = `translateX(${offset}px)`;
            }
        }, {passive: false});

        // touchend: Decisão de navegação
        carousel.addEventListener('touchend', () => {
            const deltaX = touchCurrentX - touchStartX;
            
            if (isSwiping) {
                if (deltaX < -SWIPE_THRESHOLD) { 
                    handleManualInteraction(goToNextSlide);
                } else if (deltaX > SWIPE_THRESHOLD) { 
                    handleManualInteraction(goToPrevSlide);
                } else {
                    updateCarousel();
                }
            } else {
                updateCarousel(); 
            }
            
            touchStartX = 0;
            touchCurrentX = 0;
            isSwiping = false;
        }, false);

        // Inicialização do Carrossel
        updateCarousel();
        startAutoplay();
    }


    // =======================================================
    // II. MENU MOBILE (HAMBURGUER)
    // =======================================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }


    // =======================================================
    // III. NAV BAR (HEADER FIXO: ESCONDER/MOSTRAR)
    // =======================================================
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 75) {
            header.classList.add('-translate-y-full'); // Esconde
        }
        else if (currentScrollY < lastScrollY || currentScrollY === 0) {
            header.classList.remove('-translate-y-full'); // Mostra
        }

        lastScrollY = currentScrollY;
    });


    // =======================================================
    // IV. ROLAGEM SUAVE (TODOS OS LINKS #)
    // =======================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); 
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // =======================================================
    // V. SCROLLSPY (DESTAQUE NA NAVEGAÇÃO)
    // =======================================================
    const navLinks = document.querySelectorAll('header nav a');
    const sections = document.querySelectorAll('section[id]');
    const offset = 100; // Margem de segurança

    function removeActiveClass() {
        navLinks.forEach(link => {
            link.classList.remove('underline', 'underline-offset-2', 'font-bold', 'text-[#00d86d]', 'scale-125');
            link.classList.add('font-light');
        });
    }

    function scrollSpy() {
        const currentScroll = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                removeActiveClass();
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('underline', 'underline-offset-2', 'font-bold', 'text-[#00d86d]', 'scale-125');
                        link.classList.remove('font-light');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    window.addEventListener('load', scrollSpy);


    // =======================================================
    // VI. LOADING NOS BOTÕES
    // =======================================================
    function addLoadingToButtons() {
        const actionButtons = document.querySelectorAll('a button'); 

        actionButtons.forEach(button => {
            button.classList.add('relative');

            button.addEventListener('click', function (e) {
                e.preventDefault();
                const buttonElement = this;
                const parentLink = buttonElement.closest('a');

                if (buttonElement.classList.contains('loading')) return;

                buttonElement.classList.add('loading');
                buttonElement.disabled = true;

                const originalText = buttonElement.innerHTML;
                buttonElement.innerHTML = `<span class="opacity-0">${originalText}</span>`;

                const spinner = document.createElement('i');
                spinner.className = 'bi bi-arrow-clockwise animate-spin text-2xl absolute inset-0 flex items-center justify-center';
                buttonElement.appendChild(spinner);

                if (parentLink && parentLink.href) {
                    const isInternalLink = parentLink.getAttribute('href').startsWith('#') && parentLink.hash.length > 0;

                    setTimeout(() => {
                        if (isInternalLink) {
                            window.location.href = parentLink.href; 
                            // Restaura o botão
                            buttonElement.classList.remove('loading');
                            buttonElement.innerHTML = originalText;
                            buttonElement.disabled = false;
                        } else {
                            window.location.href = parentLink.href;
                        }
                    }, 250); 
                }
            });
        });
    }

    window.addEventListener('load', addLoadingToButtons);
});