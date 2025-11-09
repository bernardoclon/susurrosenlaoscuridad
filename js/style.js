// js/observador.js
// Funcionalidad: Icono central visible para todos, manipulable solo por el GM

Hooks.on('ready', async function() {
  // Verificar si la funcionalidad está habilitada en la configuración
  const enabled = game.settings.get('susurros-en-la-oscuridad-20a', 'observadorEnabled');
  if (!enabled) return; // Si está desactivado, no mostrar nada

  // Cargar fuente de Google Fonts
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Goudy+Bookletter+1911&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  // Agregar animación CSS para el palpitar SOLO del observador
  const style = document.createElement('style');
  style.innerHTML = `
    #observador-central img {
      /* Solo el icono del observador usa esta animación */
      animation: pulse-observador 1.5s infinite;
    }
    @keyframes pulse-observador {
      0%, 100% { filter: drop-shadow(0 0 10px transparent); }
      50% { filter: drop-shadow(0 0 20px #fbff00ff); }
    }
  `;
  document.head.appendChild(style);

  // Solo una vez por sesión
  if (document.getElementById('observador-central')) return;

  // Recuperar estado desde settings
  const active = game.settings.get('susurros-en-la-oscuridad-20a', 'observadorActive') ?? false;
  const iconType = game.settings.get('susurros-en-la-oscuridad-20a', 'observadorIconType') ?? 'icon1.png';
  const customIcon = game.settings.get('susurros-en-la-oscuridad-20a', 'observadorIconCustom') ?? '';
  const selectedIcon = iconType === 'custom' ? customIcon : `modules/susurros-en-la-oscuridad-20a/art/icons/${iconType}`;
  const observadorText = game.settings.get('susurros-en-la-oscuridad-20a', 'observadorText') ?? 'Mortales Observando';
  const fontSize = game.settings.get('susurros-en-la-oscuridad-20a', 'observadorFontSize') ?? 'medium';

  // Crear contenedor
  const container = document.createElement('div');
  container.id = 'observador-central';
  container.style.position = 'fixed';
  container.style.top = '3%';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'flex-start';
  container.style.zIndex = '70';
  container.style.pointerEvents = 'none';

  // Icono
  const icon = document.createElement('img');
  icon.src = selectedIcon;
  icon.style.width = '100px';
  icon.style.height = '100px';
  icon.style.transition = 'filter 0.3s, opacity 0.3s';
  icon.style.opacity = active ? '1' : '0.25';
  icon.style.filter = active ? 'drop-shadow(0 0 20px transparent)' : 'none';
  icon.style.animation = active ? 'pulse-observador 1.5s infinite' : 'none';
  icon.style.cursor = game.user.isGM ? 'pointer' : 'default';
  icon.title = 'Observador';
  icon.style.pointerEvents = 'auto';

  // Texto
  const text = document.createElement('div');
  text.id = 'observador-text';
  text.style.marginTop = '8px';
  text.style.color = 'white';
  text.style.fontWeight = 'bold';
  text.style.textShadow = '0 0 8px black';
  text.style.fontFamily = "'Goudy Bookletter 1911', serif";
  text.style.opacity = active ? '1' : '0.25';
  text.style.fontSize = fontSize === 'small' ? '12px' : fontSize === 'large' ? '20px' : '16px';
  text.innerText = observadorText;

  // Solo GM puede editar
  if (game.user.isGM) {
    // Toggle activo/desactivo
    icon.addEventListener('click', async () => {
      const newActive = !game.settings.get('susurros-en-la-oscuridad-20a', 'observadorActive');
      await game.settings.set('susurros-en-la-oscuridad-20a', 'observadorActive', newActive);
      icon.style.opacity = newActive ? '1' : '0.25';
      text.style.opacity = newActive ? '1' : '0.25';
      if (newActive) {
        icon.style.filter = 'drop-shadow(0 0 20px transparent)';
        icon.style.animation = 'pulse-observador 1.5s infinite';
      } else {
        icon.style.filter = 'none';
        icon.style.animation = 'none';
      }
    });
  }

  container.appendChild(icon);
  // Actualizar icono y texto automáticamente si cambian los settings
  Hooks.on('updateSetting', (setting) => {
    if (setting.key === 'susurros-en-la-oscuridad-20a.observadorActive') {
      const newActive = setting.value;
      icon.style.opacity = newActive ? '1' : '0.25';
      text.style.opacity = newActive ? '1' : '0.25';
      if (newActive) {
        icon.style.filter = 'drop-shadow(0 0 20px transparent)';
        icon.style.animation = 'pulse-observador 1.5s infinite';
      } else {
        icon.style.filter = 'none';
        icon.style.animation = 'none';
      }
    }
    if (setting.key === 'susurros-en-la-oscuridad-20a.observadorIconType' || setting.key === 'susurros-en-la-oscuridad-20a.observadorIconCustom') {
      const newType = game.settings.get('susurros-en-la-oscuridad-20a', 'observadorIconType');
      const newCustom = game.settings.get('susurros-en-la-oscuridad-20a', 'observadorIconCustom');
      const newSrc = newType === 'custom' ? newCustom : `modules/susurros-en-la-oscuridad-20a/art/icons/${newType}`;
      if (newSrc && newSrc !== '') icon.src = newSrc;
    }
    if (setting.key === 'susurros-en-la-oscuridad-20a.observadorText') {
      text.innerText = setting.value;
    }
    if (setting.key === 'susurros-en-la-oscuridad-20a.observadorFontSize') {
      console.log('Font size changed to:', setting.value);
      text.style.fontSize = setting.value === 'small' ? '12px' : setting.value === 'large' ? '20px' : '16px';
    }
  });
  container.appendChild(text);
  document.body.appendChild(container);
});

// Registrar settings para persistencia
Hooks.once('init', () => {
  // Lista de iconos preestablecidos (actualiza con los nombres reales)
  const presetIcons = {
    'icon1.png': 'Icono 1',
    'icon2.png': 'Icono 2',
    'icon3.png': 'Icono 3'
  };
  const iconChoices = { ...presetIcons, 'custom': 'Personalizado' };

  game.settings.register('susurros-en-la-oscuridad-20a', 'observadorActive', {
    name: 'Observador Activo',
    scope: 'world',
    config: false,
    type: Boolean,
    default: false
  });
  game.settings.register('susurros-en-la-oscuridad-20a', 'observadorIconType', {
    name: 'Tipo de Icono',
    hint: 'Selecciona un icono preestablecido o personalizado.',
    scope: 'world',
    config: true,
    type: String,
    choices: iconChoices,
    default: 'icon1.png'
  });
  game.settings.register('susurros-en-la-oscuridad-20a', 'observadorIconCustom', {
    name: 'Icono Personalizado',
    hint: 'Sube tu propio icono personalizado.',
    scope: 'world',
    config: true,
    type: String,
    filePicker: true,
    default: ''
  });
  game.settings.register('susurros-en-la-oscuridad-20a', 'observadorText', {
    name: 'Texto Observador',
    hint: 'Texto que aparecerá debajo del icono.',
    scope: 'world',
    config: true,
    type: String,
    default: 'Mortales Observando'
  });
  game.settings.register('susurros-en-la-oscuridad-20a', 'observadorFontSize', {
    name: 'Tamaño de Letra',
    hint: 'Selecciona el tamaño de la letra del texto.',
    scope: 'world',
    config: true,
    type: String,
    choices: {
      'small': 'Pequeño',
      'medium': 'Mediano',
      'large': 'Grande'
    },
    default: 'medium'
  });

  // NUEVO: Opción visible para activar/desactivar el observador desde la configuración del módulo
  game.settings.register('susurros-en-la-oscuridad-20a', 'observadorEnabled', {
    name: 'Activar Observador Central',
    hint: 'Muestra el icono central de observador para todos los jugadores.',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });
});

// Recargar Foundry si se cambia la opción 'Activar Observador Central'
Hooks.on('updateSetting', (setting) => {
  if (setting.key === 'susurros-en-la-oscuridad-20a.observadorEnabled') {
    location.reload();
  }
});
