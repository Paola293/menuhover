// JavaScript para calcular a distância exata que a barra precisa percorrer
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Função para calcular e aplicar a distância exata para cada palavra
    function calcularDistanciaExata() {
        menuItems.forEach(item => {
            const palavra = item.querySelector('.palavra');
            const barra = item.querySelector('.barra-deslizante');
            const wrapper = item.querySelector('.palavra-wrapper');
            
            if (palavra && barra && wrapper) {
                // Obtém a largura EXATA da palavra
                const larguraPalavra = palavra.offsetWidth;
                
                // A barra tem 4px de largura e começa a -12px da esquerda
                // Distância total = larguraPalavra + 12px (para chegar ao final)
                const distancia = larguraPalavra + 12;
                
                // Aplica a distância calculada diretamente no estilo
                barra.style.setProperty('--distancia', `${distancia}px`);
                
                // Cria uma regra CSS específica para este item
                const itemId = item.getAttribute('data-id') || Math.random().toString(36);
                if (!item.getAttribute('data-id')) {
                    item.setAttribute('data-id', itemId);
                    
                    // Adiciona estilo dinâmico para este item específico
                    const styleId = `barra-style-${itemId}`;
                    let styleTag = document.getElementById(styleId);
                    if (!styleTag) {
                        styleTag = document.createElement('style');
                        styleTag.id = styleId;
                        document.head.appendChild(styleTag);
                    }
                    styleTag.textContent = `
                        .menu-item[data-id="${itemId}"]:hover .barra-deslizante {
                            transform: translateX(${distancia}px) !important;
                        }
                    `;
                } else {
                    // Atualiza o estilo existente
                    const styleId = `barra-style-${item.getAttribute('data-id')}`;
                    let styleTag = document.getElementById(styleId);
                    if (styleTag) {
                        styleTag.textContent = `
                            .menu-item[data-id="${item.getAttribute('data-id')}"]:hover .barra-deslizante {
                                transform: translateX(${distancia}px) !important;
                            }
                        `;
                    }
                }
                
                // Garante que a barra tenha a mesma altura da palavra
                const alturaPalavra = palavra.offsetHeight;
                barra.style.height = `${alturaPalavra}px`;
            }
        });
    }
    
    // Executa o cálculo inicial
    calcularDistanciaExata();
    
    // Recalcula quando a janela for redimensionada
    let timeoutId;
    window.addEventListener('resize', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(calcularDistanciaExata, 100);
    });
    
    // Observa mudanças no tamanho das palavras
    const observer = new ResizeObserver(() => {
        calcularDistanciaExata();
    });
    
    menuItems.forEach(item => {
        const palavra = item.querySelector('.palavra');
        if (palavra) {
            observer.observe(palavra);
        }
    });
    
    // Para dispositivos móveis
    let currentActiveItem = null;
    
    menuItems.forEach((item, index) => {
        // Suporte para toque
        item.addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            if (currentActiveItem === item) {
                item.classList.remove('touch-active');
                currentActiveItem = null;
            } else {
                menuItems.forEach(otherItem => {
                    otherItem.classList.remove('touch-active');
                });
                item.classList.add('touch-active');
                currentActiveItem = item;
            }
        });
    });
    
    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.menu-item') && currentActiveItem) {
            menuItems.forEach(i => i.classList.remove('touch-active'));
            currentActiveItem = null;
        }
    });
    
    // CSS para touch-active dinâmico
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
        .menu-item.touch-active .barra-deslizante {
            transform: translateX(calc(100% + 12px)) !important;
        }
        .menu-item.touch-active .palavra {
            color: #4d9eff !important;
            -webkit-text-stroke: 1px #4d9eff !important;
        }
        @media (max-width: 600px) {
            .menu-item.touch-active .barra-deslizante {
                transform: translateX(calc(100% + 10px)) !important;
            }
        }
    `;
    document.head.appendChild(touchStyle);
    
    console.log('Menu carregado - barra afastada na posição inicial! ✅');
});