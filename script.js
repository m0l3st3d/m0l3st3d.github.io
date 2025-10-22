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

// 25 SoundCloud Track URLs
const SOUNDCLOUD_URLS = [
"https://soundcloud.com/mutantradio/scrying-the-landscape-elina-tapio-and-hannah-pezzack-02042021",
"https://soundcloud.com/mutantradio/scrying-the-landscape-ii-w-elina-tapio-hannah-pezzack-28052021",
"https://soundcloud.com/mutantradio/scrying-the-landscape-iii-w-elina-tapio-and-hannah-pezzack-28072021",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-and-hannah-pezzack-29092021",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-and-hannah-pezzack-11112021",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-and-hannah-pezzack-17032022",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-and-hannah-pezzack-24052022",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-and-hannah-pezzack-26072022",
"https://soundcloud.com/mutantradio/scrying-the-landscape-x-w-loma-doom-23092022",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-and-hannah-pezzack-06122022",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-and-hannah-pezzack-06022023",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-hannah-pezzack-and-alice-rougeaux-06042023",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-hannah-pezzack-02082023",
"https://soundcloud.com/mutantradio/scrying-the-landscape-xv-w-la-serpiente-searching-for-the-sublime-04102023",
"https://soundcloud.com/mutantradio/scrying-the-landscape-xvi-w-haron-04122023",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-hannah-pezzack-08042024",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-hannah-pezzack",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-hannah-pezzack-070924",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-dim-garden-071124",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-hannah-pezzack-080225",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-hannah-pezzack-100425-5",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-alina-valentina-100625-4",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-hannah-pezzack-100425-5",
"https://soundcloud.com/mutantradio/scrying-the-landscape-w-elina-tapio-hannah-pezzack-100425-5"
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
let questionHidden = false;
let questionEl, wavesContainer, formEl, inputEl, audioContainer, bgContainer, audioEl;
let clientId = null;
let trackIds = new Array(SOUNDCLOUD_URLS.length); // Pre-resolved track IDs

document.addEventListener('DOMContentLoaded', async () => {
    questionEl = document.getElementById('main-question');
    wavesContainer = document.getElementById('waves-container');
    formEl = document.getElementById('wish-form');
    inputEl = document.getElementById('wish-input');
    audioContainer = document.getElementById('audio-player-container');
    bgContainer = document.getElementById('bg-particle-container');
    audioEl = document.getElementById('audio-player');

    // Extract client_id dynamically
    clientId = await extractClientId();
    if (!clientId) {
        console.error('Failed to extract SoundCloud client_id');
        // Fallback to widget method or alert user
        return;
    }

    // Pre-resolve all track IDs using client_id
    for (let index = 0; index < SOUNDCLOUD_URLS.length; index++) {
        const url = SOUNDCLOUD_URLS[index];
        const resolveUrl = `https://api.soundcloud.com/resolve?url=${encodeURIComponent(url)}&client_id=${clientId}`;
        try {
            const response = await fetch(resolveUrl);
            const track = await response.json();
            trackIds[index] = track.id;
        } catch (err) {
            console.error(`Failed to resolve track ${index}:`, err);
        }
    }

    loadWishes();
    renderWaves();
    setupEventListeners();
    new p5(backgroundSketch, bgContainer);
});

async function extractClientId() {
    const proxy = 'https://allorigins.win/get?url=';
    const soundcloudUrl = 'https://soundcloud.com/';

    try {
        // Fetch main page
        const pageResponse = await fetch(proxy + encodeURIComponent(soundcloudUrl));
        const pageData = await pageResponse.json();
        const pageHtml = pageData.contents;

        // Find script srcs (reverse to find latest)
        const scriptRegex = /<script[^>]+src="([^"]+)"[^>]*>/g;
        const scripts = [];
        let match;
        while ((match = scriptRegex.exec(pageHtml)) !== null) {
            scripts.push(match[1]);
        }
        scripts.reverse(); // As in youtube-dl

        // Fetch scripts and search for client_id
        for (const src of scripts) {
            if (src.startsWith('https://a-v2.sndcdn.com/')) { // Likely the JS bundles
                const scriptResponse = await fetch(proxy + encodeURIComponent(src));
                const scriptData = await scriptResponse.json();
                const scriptContent = scriptData.contents;

                const idRegex = /client_id\s*:\s*"([0-9a-zA-Z]{32})"/;
                const idMatch = scriptContent.match(idRegex);
                if (idMatch) {
                    return idMatch[1];
                }
            }
        }
    } catch (err) {
        console.error('Error extracting client_id:', err);
    }
    return null;
}

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
    const trackIndex = wishIndex % SOUNDCLOUD_URLS.length;
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
    playTrack(newWish.trackIndex);
    inputEl.value = '';
    inputEl.placeholder = "Weave your words...";
}

function playTrack(index) {
    if (!trackIds[index] || !clientId) {
        console.error(`Track ID or client_id not available for index ${index}`);
        return;
    }

    audioEl.src = `https://api.soundcloud.com/tracks/${trackIds[index]}/stream?client_id=${clientId}`;
    audioEl.play().catch(err => console.error('Playback failed:', err));
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
    wrapper.addEventListener('click', () => playTrack(wish.trackIndex));
    wavesContainer.prepend(wrapper);
    new p5(createWaveSketch(wish), canvasContainer);
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

// --- p5.js sketches ---

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
        let time = 0;
        const palette = WAVE_COLORS[wish.colorIndex];
        const numWaves = 8; // More waves for depth
        const getH = () => window.innerWidth <= 768 ? 250 : 300;

        p.setup = () => {
            const parentW = document.getElementById(`wave-canvas-${wish.timestamp}`).clientWidth;
            p.createCanvas(parentW, getH());
        };
        p.draw = () => {
            p.background(0);
            for (let i = 0; i < numWaves; i++) {
                const color = p.random(palette.particles);
                const alpha = 150 - i * 20; // Fading for layers
                p.stroke(color[0], color[1], color[2], alpha);
                p.strokeWeight(3 + i * 0.3); // Thicker base
                p.fill(color[0], color[1], color[2], alpha / 4); // Semi-transparent fill for glow

                p.beginShape();
                const baseAmp = p.height / 3;
                const pulse = 1 + 0.5 * p.sin(time * 0.15 + i * 0.5); // Stronger pulsing
                const amp = baseAmp * pulse;
                const freq = 0.008 + i * 0.003; // Wider frequency range
                const phase = time * (1.5 + i * 0.3) + i * p.PI / numWaves; // Faster movement
                const noiseScale = amp / 4; // Organic noise

                let prevY = p.height / 2;
                p.vertex(0, p.height); // For fill to bottom
                for (let x = 0; x < p.width; x += 3) { // Finer steps for smoothness
                    const noiseVal = p.noise(x * 0.005, time * 0.2 + i) * 2 - 1; // Perlin for hypnosis
                    const y = p.height / 2 + amp * p.sin(x * freq + phase) + noiseVal * noiseScale;
                    p.vertex(x, y);
                    prevY = y;
                }
                p.vertex(p.width, p.height); // Close fill
                p.endShape(p.CLOSE); // Fill under wave
            }
            time += 0.05; // Faster animation for dynamism
        };
        p.windowResized = () => {
            const parentW = document.getElementById(`wave-canvas-${wish.timestamp}`).clientWidth;
            p.resizeCanvas(parentW, getH());
        };
    };
};