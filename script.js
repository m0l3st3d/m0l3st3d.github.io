// --- ASSETS ---

// 25 Poems
const POEMS = [
    "In the void where sound begins, your wish reverberates through cosmic strings.",
    "Each word a star, each silence a galaxy—here, your longing finds its frequency.",
    "The universe hums with unspoken desires, yours now woven into its ancient choir.",
    "Between breath and echo, between darkness and glow, your intention drifts slow.",
    "Sound is memory crystallized in air—your wish now vibrates everywhere.",
    "In the blackness before light, your voice becomes a constellation burning bright.",
    "What you call into the void calls back, threefold—a resonance worth more than gold.",
    "The cosmos keeps no secrets, only songs—your wish belongs where it belongs.",
    "Frequencies fold into themselves like prayers, carrying your hope through stellar layers.",
    "Every utterance shapes the dark—your words are phosphorescent, a living spark.",
    "The void is not empty but listening, collecting wishes like dew glistening.",
    "Your desire ripples outward, touching edges where silence and sound blur their pledges.",
    "In the architecture of nothingness, your voice builds chambers of luminous bliss.",
    "Sound waves are time made visible—your wish inscribes itself, indelible.",
    "The universe breathes your name in wavelengths unknown, making distant futures your own.",
    "Between void and voice, a sacred tension—your wish exists in every dimension.",
    "Resonance is the universe remembering—your words, now part of its eternal shimmering.",
    "In the hollow where echoes are born, your yearning takes a cosmic form.",
    "Each wish a thread in infinity's weave—the void receives what you believe.",
    "Sound cannot die, only transform—your hope rides every coming storm.",
    "The darkness listens with a thousand ears—your voice dissolves all ancient fears.",
    "Where silence meets intent, magic flows—your wish becomes what the cosmos knows.",
    "In the space between heartbeats, between stars—your desire travels near and far.",
    "The void sings back what you send forth—your wish finds its universal worth.",
    "All that was spoken shall return as light—your whisper becomes the infinite night."
];

// 5 Local Audio Files
const AUDIO_FILES = [
    "./1.mp3",
    "./2.mp3",
    "./3.mp3",
    "./4.mp3",
    "./5.mp3"
];

// 6 Color Palettes for Waves
const WAVE_COLORS = [
    { base: [192, 192, 192], particles: [[220, 220, 220], [160, 160, 160], [255, 255, 255]] },
    { base: [255, 215, 0], particles: [[255, 223, 70], [230, 190, 0], [255, 248, 220]] },
    { base: [57, 255, 20], particles: [[150, 255, 130], [200, 255, 180], [230, 255, 230]] },
    { base: [255, 105, 180], particles: [[255, 182, 217], [255, 20, 147], [255, 200, 220]] },
    { base: [138, 43, 226], particles: [[180, 100, 255], [100, 20, 200], [200, 160, 255]] },
    { base: [0, 255, 255], particles: [[150, 255, 255], [0, 200, 200], [220, 255, 255]] }
];

// --- GLOBAL STATE & DOM ELEMENTS ---
let wishes = [];
let currentAudio = null; // Replaces iframe/widget
let questionHidden = false;
let questionEl, wavesContainer, formEl, inputEl, audioContainer, bgContainer;

document.addEventListener('DOMContentLoaded', () => {
    questionEl = document.getElementById('main-question');
    wavesContainer = document.getElementById('waves-container');
    formEl = document.getElementById('wish-form');
    inputEl = document.getElementById('wish-input');
    audioContainer = document.getElementById('audio-player-container'); // We still use this container
    bgContainer = document.getElementById('bg-particle-container');

    loadWishes();
    renderWaves();
    setupEventListeners();
    new p5(backgroundSketch, bgContainer);
});

function setupEventListeners() {
    formEl.addEventListener('submit', handleSendWish);
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputEl.value = "";
            inputEl.placeholder = "Please click 'Send' to begin...";
        }
    });
    inputEl.addEventListener('focus', () => {
        inputEl.placeholder = "Weave your words...";
    });
}

// --- CORE LOGIC ---

function handleSendWish(e) {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (text === '') return;

    if (!questionHidden) {
        questionEl.classList.add('hidden');
        questionHidden = true;
    }

    const wishIndex = wishes.length;
    const trackIndex = wishIndex % AUDIO_FILES.length; // Use new array
    const poemIndex = wishIndex % POEMS.length;
    const colorIndex = wishIndex % WAVE_COLORS.length;

    const newWish = {
        text,
        poem: POEMS[poemIndex],
        trackIndex,
        colorIndex,
        timestamp: Date.now()
    };

    wishes.push(newWish);
    saveWishes();
    createWaveElement(newWish);
    playTrack(newWish.trackIndex); // This is a user-initiated action
    inputEl.value = '';
    inputEl.placeholder = "Weave your words...";
}

// ✅ NEW native <audio> version that works on mobile
function playTrack(index) {
    // 1. Stop and remove any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        audioContainer.innerHTML = '';
        currentAudio = null;
    }

    // 2. Get the path to the new track
    const trackPath = AUDIO_FILES[index];

    // 3. Create a new <audio> element
    const audio = document.createElement('audio');
    audio.src = trackPath;
    audio.controls = true; // Show the browser's default controls
    audio.style.width = "100%"; // Make it fit the container
    
    // 4. Append it to the container and play it
    audioContainer.appendChild(audio);
    
    // 5. Store reference
    currentAudio = audio; 

    // 6. Play the audio. This is allowed because it was triggered by a user click.
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Autoplay was prevented even though it was user-initiated (rare)
            console.error("Audio playback failed:", error);
        });
    }
}

function createWaveElement(wish) {
    const wrapper = document.createElement('div');
    wrapper.className = 'wave-wrapper';
    wrapper.dataset.trackIndex = wish.trackIndex;

    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'wave-canvas';
    canvasContainer.id = `wave-canvas-${wish.timestamp}`;

    const poemEl = document.createElement('p');
    poemEl.className = 'wave-poem';
    poemEl.textContent = wish.poem;

    const wishTextEl = document.createElement('p');
    wishTextEl.className = 'wave-wish-text';
    wishTextEl.textContent = `"${wish.text}"`;

    wrapper.appendChild(canvasContainer);
    wrapper.appendChild(poemEl);
    wrapper.appendChild(wishTextEl);
    
    // Clicking a wave will also now play the correct local track
    wrapper.addEventListener('click', () => playTrack(wish.trackIndex));
    
    wavesContainer.prepend(wrapper);
    new p5(createWaveSketch(wish), canvasContainer.id);
}

function renderWaves() {
    wavesContainer.innerHTML = '';
    if (wishes.length > 0) {
        questionEl.classList.add('hidden');
        questionHidden = true;
    }
    for (const wish of wishes) createWaveElement(wish);
}

function saveWishes() {
    localStorage.setItem('elinaWishes', JSON.stringify(wishes));
}

function loadWishes() {
    const saved = localStorage.getItem('elinaWishes');
    if (saved) wishes = JSON.parse(saved);
}

// --- p5.js sketches below (unchanged) ---

const backgroundSketch = (p) => {
    let particles = [];
    const num = 80;
    class Particle {
        constructor() {
            this.x = p.random(p.width);
            this.y = p.random(p.height);
            this.vx = p.random(-0.3, 0.3);
            this.vy = p.random(-0.3, 0.3);
            this.size = p.random(1, 3);
            this.offset = p.random(1000);
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x > p.width) this.x = 0;
            if (this.x < 0) this.x = p.width;
            if (this.y > p.height) this.y = 0;
            if (this.y < 0) this.y = p.height;
        }
        show() {
            let alpha = p.map(p.sin(p.frameCount * 0.01 + this.offset), -1, 1, 10, 70);
            p.noStroke(); p.fill(255, 255, 255, alpha);
            p.ellipse(this.x, this.y, this.size);
        }
    }
    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        for (let i = 0; i < num; i++) particles.push(new Particle());
    };
    p.draw = () => {
        p.clear();
        for (let part of particles) { part.update(); part.show(); }
    };
    p.windowResized = () => p.resizeCanvas(window.innerWidth, window.innerHeight);
};

const createWaveSketch = (wish) => {
    return (p) => {
        let particles = [];
        let time = 0;
        const palette = WAVE_COLORS[wish.colorIndex];
        const colors = palette.particles;
        const num = 300;
        const getH = () => window.innerWidth <= 768 ? 250 : 300;

        class WaveParticle {
            constructor() {
                this.x = p.random(p.width);
                this.yOffset = p.random(-1, 1);
                this.vx = p.random(0.5, 1.5);
                this.color = p.random(colors);
                this.offset = p.random(1000);
                this.proximity = 1 - p.abs(this.yOffset);
                this.size = p.map(this.proximity, 0, 1, 1, 4);
                this.alpha = p.map(this.proximity, 0, 1, 100, 255);
            }
            update(t) {
                let amp1 = p.sin(this.x * 0.01 + t + this.offset) * (p.height / 7);
                let amp2 = p.cos(this.x * 0.008 - t * 0.8 + this.offset) * (p.height / 9);
                let n = p.noise(this.x * 0.005, t * 0.3 + this.offset);
                this.y = p.height / 2 + this.yOffset * (amp1 + amp2) * n;
                this.x = (this.x + this.vx) % p.width;
            }
            show() {
                p.noStroke();
                p.fill(this.color[0], this.color[1], this.color[2], this.alpha);
                p.ellipse(this.x, this.y, this.size);
            }
        }

        p.setup = () => {
            const parentW = document.getElementById(`wave-canvas-${wish.timestamp}`).clientWidth;
            p.createCanvas(parentW, getH());
            for (let i = 0; i < num; i++) particles.push(new WaveParticle());
        };
        p.draw = () => {
            p.background(0);
            for (let part of particles) { part.update(time); part.show(); }
            time += 0.02;
        };
        p.windowResized = () => {
            const parentW = document.getElementById(`wave-canvas-${wish.timestamp}`).clientWidth;
            p.resizeCanvas(parentW, getH());
        };
    };
};
