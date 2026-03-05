/**
 * Piano Virtual — Concert Grand
 * Script principal: áudio, interação e UI
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Referências DOM ── */
    const keys          = document.querySelectorAll('.key');
    const volumeSlider  = document.getElementById('volumeSlider');
    const toggleKeys    = document.getElementById('toggleKeys');
    const noteDisplay   = document.getElementById('noteDisplay');
    const volumeValue   = document.getElementById('volumeValue');

    /* ── Estado ── */
    let volume = 0.5;

    /* ── Mapa de tecla → nome da nota (para exibição) ── */
    const keyNoteNames = {
        'a': 'Dó',
        'w': 'Dó♯',
        's': 'Ré',
        'e': 'Ré♯',
        'd': 'Mi',
        'f': 'Fá',
        't': 'Fá♯',
        'g': 'Sol',
        'y': 'Sol♯',
        'h': 'Lá',
        'u': 'Lá♯',
        'j': 'Si',
        'k': 'Dó²',
        'o': 'Dó²♯',
        'l': 'Ré²',
        'p': 'Ré²♯',
        'cedilha': 'Mi²',
    };

    /* ── Carrega arquivo de áudio ── */
    const loadAudio = (keyValue) => {
        const audio = new Audio(`PianoTeclas/${keyValue}.wav`);
        audio.preload = 'auto';
        return audio;
    };

    /* ── Mapa de instâncias de áudio ── */
    const keyToAudio = {};
    keys.forEach(key => {
        let keyValue = key.dataset.key.toLowerCase();
        if (keyValue === 'ç') keyValue = 'cedilha';
        keyToAudio[keyValue] = loadAudio(keyValue);
    });

    /* ── Atualiza gradiente do slider conforme valor ── */
    const updateSliderGradient = (val) => {
        volumeSlider.style.setProperty('--val', `${val}%`);
    };
    updateSliderGradient(50);

    /* ── Controle de volume ── */
    volumeSlider.addEventListener('input', (e) => {
        volume = e.target.value / 100;
        volumeValue.textContent = `${e.target.value}%`;
        updateSliderGradient(e.target.value);
        Object.values(keyToAudio).forEach(audio => { audio.volume = volume; });
    });

    /* ── Toggle de letras nas teclas ── */
    toggleKeys.addEventListener('change', () => {
        keys.forEach(key => {
            key.classList.toggle('labels-hidden', !toggleKeys.checked);
        });
    });

    /* ── Timer para limpar o display de nota ── */
    let noteDisplayTimer = null;

    /* ── Exibe a nota tocada ── */
    const showNote = (keyValue) => {
        const noteName = keyNoteNames[keyValue];
        if (!noteName) return;

        clearTimeout(noteDisplayTimer);
        noteDisplay.innerHTML = `<span class="note-active">♩ ${noteName}</span>`;

        noteDisplayTimer = setTimeout(() => {
            noteDisplay.innerHTML = `<span class="note-hint">Toque uma tecla ou clique no piano</span>`;
        }, 1800);
    };

    /* ── Toca nota ── */
    const playNote = (keyEl) => {
        let keyValue = keyEl.dataset.key.toLowerCase();
        if (keyValue === 'ç') keyValue = 'cedilha';

        const audio = keyToAudio[keyValue];
        if (!audio) return;

        audio.currentTime = 0;
        audio.volume = volume;
        audio.play().catch(() => {/* Autoplay bloqueado pelo navegador — OK */});

        keyEl.classList.add('active');
        showNote(keyValue);

        setTimeout(() => keyEl.classList.remove('active'), 160);
    };

    /* ── Mouse: clique nas teclas ── */
    keys.forEach(key => {
        key.addEventListener('mousedown', () => playNote(key));
    });

    /* ── Touch: suporte mobile ── */
    keys.forEach(key => {
        key.addEventListener('touchstart', (e) => {
            e.preventDefault();
            playNote(key);
        }, { passive: false });
    });

    /* ── Teclado físico ── */
    document.addEventListener('keydown', (e) => {
        if (e.repeat) return;

        let key = e.key.toUpperCase();

        // Normaliza Ç para diferentes layouts de teclado
        if (e.key === 'ç' || e.key === 'Ç') {
            key = 'Ç';
        }
        if (e.code === 'Semicolon' || e.code === 'IntlBackslash') {
            key = 'Ç';
        }

        const keyElement = document.querySelector(`.key[data-key="${key}"]`);
        if (keyElement) playNote(keyElement);
    });

    /* ── Inicializa rótulos de acordo com o toggle ── */
    if (!toggleKeys.checked) {
        keys.forEach(key => key.classList.add('labels-hidden'));
    }

});