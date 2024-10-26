document.addEventListener('DOMContentLoaded', () => {
  const keys = document.querySelectorAll('.key');
  const volumeSlider = document.querySelector('.volume-slider');
  const toggleKeys = document.getElementById('toggleKeys');
  let volume = 0.5;

  // Função para carregar os arquivos de áudio da pasta PianoTeclas
  const loadAudio = (key) => {
      // Tratamento especial para a tecla Ç
      const audioKey = key === 'ç' ? 'cedilha' : key;
      const audio = new Audio(`PianoTeclas/${audioKey}.wav`);
      return audio;
  };

  // Mapear as teclas com seus arquivos de áudio
  const keyToAudio = {};
  keys.forEach(key => {
      let keyValue = key.dataset.key.toLowerCase();
      // Tratamento especial para a tecla Ç
      if (keyValue === 'ç') {
          keyValue = 'cedilha';
      }
      keyToAudio[keyValue] = loadAudio(keyValue);
  });

  // Atualizar volume
  volumeSlider.addEventListener('input', (e) => {
      volume = e.target.value / 100;
      Object.values(keyToAudio).forEach(audio => {
          audio.volume = volume;
      });
  });

  // Toggle para mostrar/esconder letras
  toggleKeys.addEventListener('change', () => {
      keys.forEach(key => {
          key.style.color = toggleKeys.checked ? '' : 'transparent';
      });
  });

  // Função para tocar nota
  function playNote(key) {
      let keyValue = key.dataset.key.toLowerCase();
      // Tratamento especial para a tecla Ç
      if (keyValue === 'ç') {
          keyValue = 'cedilha';
      }
      const audio = keyToAudio[keyValue];

      if (audio) {
          audio.currentTime = 0;
          audio.volume = volume;
          audio.play();
          key.classList.add('active');
          
          setTimeout(() => {
              key.classList.remove('active');
          }, 150);
      }
  }

  // Event listeners para mouse
  keys.forEach(key => {
      key.addEventListener('mousedown', () => playNote(key));
  });

  // Event listeners para teclado
  document.addEventListener('keydown', (e) => {
      let key = e.key.toUpperCase();
      
      // Tratamento especial para a tecla Ç
      if (e.key === 'ç' || e.key === 'Ç') {
          key = 'Ç';
      }
      
      // Tratamento para diferentes códigos de tecla que podem representar Ç
      if (e.code === 'Semicolon' || e.code === 'IntlBackslash') {
          key = 'Ç';
      }
      
      const keyElement = document.querySelector(`.key[data-key="${key}"]`);
      if (keyElement && !e.repeat) {
          playNote(keyElement);
      }
  });
});