// Carrossel: 

const slidesContainer = document.getElementById('carousel-slides');
const slides = slidesContainer.querySelectorAll('img');
const totalSlides = slides.length;
let currentSlide = 0;

function updateCarousel() {
    // Calcula o deslocamento horizontal (em porcentagem) para a imagem correta
    const offset = currentSlide * 100;
    slidesContainer.style.transform = `translateX(-${offset}%)`;
}

// Função para o botão PRÓXIMO
window.nextSlide = function () {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

// Função para o botão ANTERIOR
window.prevSlide = function () {
    // Adiciona totalSlides para garantir que o resultado da operação de módulo seja positivo
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

// Opcional: Adicionar Autoplay (se quiser que troque automaticamente a cada 5 segundos)
setInterval(window.nextSlide, 5000); 

// Navegação:
const header = document.querySelector('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Se a rolagem for para baixo E já tiver passado da altura do topo (evita esconder no primeiro scroll)
    if (currentScrollY > lastScrollY && currentScrollY > 75) {
        // ROLAGEM PARA BAIXO: Esconde o header
        header.classList.add('-translate-y-full'); 
    } 
    // Se a rolagem for para cima OU se estiver no topo da página
    else if (currentScrollY < lastScrollY || currentScrollY === 0) {
        // ROLAGEM PARA CIMA / TOPO: Mostra o header
        header.classList.remove('-translate-y-full');
    }
    
    lastScrollY = currentScrollY;
});


// Rolagem Suave: 
// Adicione este bloco de código ao seu main.js

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Impede o salto instantâneo padrão

        // Pega o destino (o ID da seção)
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Usa o método scrollIntoView para a rolagem suave
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Menu Hamburguer: 

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

// Abre/Fecha o menu ao clicar no botão
menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Fecha o menu ao clicar em qualquer link (para rolagem suave)
const mobileLinks = mobileMenu.querySelectorAll('a');

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// ScrollSpy: 
// 1. Seleciona todos os links de navegação no header
const navLinks = document.querySelectorAll('header nav a');

// 2. Seleciona todas as seções do corpo da página com IDs
// Usaremos as seções com IDs para mapear a posição
const sections = document.querySelectorAll('section[id]');

// 3. Função para remover o destaque de todos os links
function removeActiveClass() {
    navLinks.forEach(link => {
        // Remove as classes de destaque do Tailwind
        link.classList.remove('underline', 'underline-offset-2', 'font-bold', 'text-[#00d86d]', 'scale-125');
        // Adiciona as classes padrão que estavam no seu HTML
        link.classList.add('font-light');
    });
}

// 4. Função principal que checa a posição de rolagem
function scrollSpy() {
    // Pega a posição atual de rolagem do topo da janela
    const currentScroll = window.scrollY; 
    
    // Define uma margem de segurança (offset) para compensar a altura do header fixo (75px)
    // Se você usou p-20 (80px), um offset de 100px é seguro
    const offset = 100;

    // Itera sobre cada seção para verificar se está visível
    sections.forEach(section => {
        const sectionTop = section.offsetTop - offset;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');

        // Verifica se a posição atual de rolagem está dentro dos limites da seção
        if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
            
            // Se encontrou a seção ativa, remove o destaque de tudo...
            removeActiveClass();
            
            // ...e aplica o destaque apenas ao link correspondente
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${sectionId}`) {
                    // Adiciona as classes de destaque
                    link.classList.add('underline', 'underline-offset-2', 'font-bold', 'text-[#00d86d]', 'scale-125');
                    // Remove as classes padrão
                    link.classList.remove('font-light');
                }
            });
        }
    });
}

// 5. Adiciona o ouvinte de evento para executar a função sempre que o usuário rolar
window.addEventListener('scroll', scrollSpy);

// 6. Executa a função uma vez no carregamento para checar o estado inicial (caso a página recarregue na metade)
window.addEventListener('load', scrollSpy);

// Loading nos botões:
function addLoadingToButtons() {
    const actionButtons = document.querySelectorAll('a button');
    
    actionButtons.forEach(button => {
        // Garante que o botão tenha posição relativa para o spinner
        button.classList.add('relative'); 
        
        button.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            const buttonElement = this;
            const parentLink = buttonElement.closest('a');

            // Se já está carregando, ignora
            if (buttonElement.classList.contains('loading')) return; 

            // Adiciona a classe de loading e desabilita
            buttonElement.classList.add('loading');
            buttonElement.disabled = true;
            
            const originalText = buttonElement.innerHTML;
            
            // 1. Esconde o texto original
            buttonElement.innerHTML = `<span class="opacity-0">${originalText}</span>`;
            
            // 2. Cria e adiciona o spinner
            const spinner = document.createElement('i');
            spinner.className = 'bi bi-arrow-clockwise animate-spin text-2xl absolute inset-0 flex items-center justify-center';
            buttonElement.appendChild(spinner);

            // 3. Lógica para LINKS INTERNOS (Começam com #) e LINKS EXTERNOS
            if (parentLink && parentLink.href) {
                // Checa se o link é interno (apenas um hash ou começa com #nome-secao)
                const isInternalLink = parentLink.getAttribute('href').startsWith('#') && parentLink.hash.length > 0;

                setTimeout(() => {
                    if (isInternalLink) {
                        // Se for link interno (ex: #sobre), navegamos (rolamos)
                        window.location.href = parentLink.href;
                        
                        // E restauramos o botão imediatamente, pois o site não saiu da página.
                        buttonElement.classList.remove('loading');
                        buttonElement.innerHTML = originalText;
                        buttonElement.disabled = false;
                        
                    } else {
                        // Se for link externo (WhatsApp/Agendamento), navegamos e o browser fecha o spinner.
                        window.location.href = parentLink.href;
                        // Não restauramos, pois a página irá recarregar ou mudar.
                    }
                }, 250); // Tempo de feedback rápido
            }
        });
    });
}

window.addEventListener('load', addLoadingToButtons);