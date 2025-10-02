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
// setInterval(window.nextSlide, 5000); 

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