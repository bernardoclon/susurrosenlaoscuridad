Hooks.on("ready", () => {
    // Insertar animación CSS para el icono de pausa
    const style = document.createElement('style');
    style.innerHTML = `
      #pause img {
        animation: pulse-pause 1.5s infinite;
      }
      @keyframes pulse-pause {
        0%, 100% { filter: drop-shadow(0 0 20px #00ffff); }
        50% { filter: drop-shadow(0 0 40px #00ffea); }
      }
    `;
    document.head.appendChild(style);

    // Configurar un observador para detectar cuando aparece el pause screen
    const observer = new MutationObserver((mutations) => {
        const pauseScreen = document.getElementById("pause");
        if (pauseScreen) {
            const img = pauseScreen.querySelector("img");
            if (img && !img.classList.contains('customized')) {
                img.src = "modules/susurros-en-la-oscuridad-20a/art/logo.png";
                img.classList.add('customized'); // Marcar como modificado
                
                // Opcional: Cambiar el texto
                const caption = pauseScreen.querySelector("figcaption");
                if (caption) caption.textContent = "Juego en Pausa";
            }
        }
    });

    // Observar cambios en el body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});