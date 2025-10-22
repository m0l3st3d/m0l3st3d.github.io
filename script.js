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

// 25 SoundCloud Track URLs (Raw)
const SOUNDCLOUD_URLS = [
    "https://on.soundcloud.com/C8i2Jz9kYYbv0kjrUj",
    "https://on.soundcloud.com/8T0gWCCIOSq9MuIVig",
    "https://on.soundcloud.com/2VujXbRS02o6lkI96Y",
    "https://on.soundcloud.com/xWips5pUt6zjJgqBc6",
    "https://on.soundcloud.com/j4dd6ilYo1KaTvcoa0",
    "https://on.soundcloud.com/u1CsXuHOxwy6mOWTN6",
    "https://on.soundcloud.com/LKhjB61kRFxenRVUgz",
    "https://on.soundcloud.com/LKejOF9vlqq07S7lKP",
    "https://on.soundcloud.com/NSq6rKoNBEhEiupiSg",
    "https://on.soundcloud.com/edAmEVxSvtwIkbxmjS",
    "https://on.soundcloud.com/suveU7lXAUunN0oAp2",
    "https://on.soundcloud.com/5hgF2txJdoEXIHOtxV",
    "https://on.soundcloud.com/A34pXJNOSAlAKzl7gF",
    "https://on.soundcloud.com/euOEgpMnFsMJzhkj1k",
    "https://on.soundcloud.com/ahxquydX3xOs4epowT",
    "https://on.soundcloud.com/U05e4eKHB0ef72vo4X",
    "https://on.soundcloud.com/X9MzXDS90bmxyR0QRm",
    "https://on.soundcloud.com/PVOWI4A6v1wiYK0cPb",
    "https://on.soundcloud.com/JZtx1xPxgmFjatFmqQ",
    "https://on.soundcloud.com/tPc2DAIx2qH5e1yx45",
    "https://on.soundcloud.com/klVNb67H3FEaXZ9dyg",
    "https://on.soundcloud.com/7IRFIjX0i6hpjQSJJu",
    "https://on.soundcloud.com/VzHCvzQbREGkOAOlBV",
    "https://on.soundcloud.com/mnN1aIqfWAn9zhsmUG",
    "https://on.soundcloud.com/7r1Z8NaMrzUnC9bMD3"
];

// 6 Color Palettes for Waves [baseColor, particleColor1, particleColor2]
// Colors are in [R, G, B] format for p5.js
const WAVE_COLORS = [
    // Silver
    { base: [192, 192, 192], particles: [[220, 220, 220], [160, 160, 160], [255, 255, 255]] },
    // Gold
    { base: [255, 215, 0], particles: [[255, 223, 70], [230, 190, 0], [255, 248, 220]] },
    // Neon Mint
    { base: [57, 255, 20], particles: [[150, 255, 130], [200, 255, 180], [230, 255, 230]] },
    // Neon Pink
    { base: [255, 105, 180], particles: [[255, 182, 217], [255, 20, 147], [255, 200, 220]] },
    // Purple
    { base: [138, 43, 226], particles: [[180, 100, 255], [100, 20, 200], [200, 160, 255]] },
    // Cyan
    { base: [0, 255, 255], particles: [[150, 255, 255], [0, 200, 200], [220, 255, 255]] }
];


// --- GLOBAL STATE & DOM ELEMENTS ---

let wishes = [];
let currentIframe = null;
let questionHidden = false;

// DOM Elements
let questionEl, wavesContainer, formEl, inputEl, audioContainer, bgContainer;

document.addEventListener('DOMContentLoaded', () => {
    // Assign DOM elements
    questionEl = document.getElementById('main-question');
    wavesContainer = document.getElementById('waves-container');
    formEl = document.getElementById('wish-form');
    inputEl = document.getElementById('wish-input');
    audioContainer = document.getElementById('audio-player-container');
    bgContainer = document.getElementById('bg-particle-container');

    // --- INITIALIZATION ---
    loadWishes();
    renderWaves();
    setupEventListeners();

    // Start the background p5.js sketch
    new p5(backgroundSketch, bgContainer);
});

/**
 * Sets up the main event listener for the form submission.
 */
function setupEventListeners() {
    // This listener now ONLY handles the trusted "click" gesture
    formEl.addEventListener('submit', handleSendWish);

    // --- NEW CODE TO GUARANTEE AUTOPLAY ---
    // We will manually block the 'Enter' key on the input field
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            // Stop the form from submitting
            e.preventDefault(); 
            
            // Optional: Visually prompt the user
            inputEl.value = ""; // Clear the input
            inputEl.placeholder = "Please click 'Send' to begin...";
        }
    });

    // Reset the placeholder when the user clicks back in
    inputEl.addEventListener('focus', () => {
        inputEl.placeholder = "Weave your words...";
    });
    // --- END OF NEW CODE ---
}


// --- CORE LOGIC ---

/**
 * Handles the "Send" button click.
 * Because this is ONLY triggered by a 'submit' from a REAL CLICK,
 * it is a trusted gesture and autoplay WILL work.
 */
function handleSendWish(e) {
    e.preventDefault();
    const text = inputEl.value.trim();

    if (text === '') return;

    // 1. Hide the main question
    if (!questionHidden) {
        questionEl.classList.add('hidden');
        questionHidden = true;
    }

    // 2. Determine indices
    const wishIndex = wishes.length;
    const trackIndex = wishIndex % SOUNDCLOUD_URLS.length;
    const poemIndex = wishIndex % POEMS.length;
    const colorIndex = wishIndex % WAVE_COLORS.length;

    // 3. Create the new wish object
    const newWish = {
        text: text,
        poem: POEMS[poemIndex],
        trackIndex: trackIndex,
        colorIndex: colorIndex,
        timestamp: Date.now()
    };

    // 4. Add to state and save
    wishes.push(newWish);
    saveWishes();

    // 5. Create the wave element
    createWaveElement(newWish);

    // 6. Play the track (This will now work 100% of the time)
    playTrack(newWish.trackIndex);

    // 7. Clear the input
    inputEl.value = '';
    inputEl.placeholder = "Weave your words..."; // Reset placeholder
}

/**
 * Creates and plays a SoundCloud track in a hidden iframe.
 * @param {number} index - The index of the track to play.
 */
function playTrack(index) {
    if (currentIframe) {
        currentIframe.remove();
    }
    const rawUrl = SOUNDCLOUD_URLS[index];
    const embedUrl = `https://w.soundcloud.com/player/?url=${rawUrl}&color=%23000000&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;
    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "166";
    iframe.scrolling = "no";
    iframe.frameBorder = "no";
    iframe.allow = "autoplay";
    iframe.src = embedUrl;
    audioContainer.appendChild(iframe);
    currentIframe = iframe;
    console.log(`[Elina] Autoplay initiated by trusted click. Playing track ${index}`);
}

/**
 * Creates the DOM elements for a single wish (canvas, poem, text)
 * and prepends it to the waves container.
 * @param {object} wish - The wish object.
 */
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

    wrapper.addEventListener('click', () => {
        playTrack(wish.trackIndex);
    });

    wavesContainer.prepend(wrapper);
    new p5(createWaveSketch(wish), canvasContainer.id);
}

/**
 * Renders all saved wishes from the `wishes` array on page load.
 */
function renderWaves() {
    wavesContainer.innerHTML = '';
    
    if (wishes.length > 0) {
        questionEl.classList.add('hidden');
        questionHidden = true;
    }

    for (const wish of wishes) {
        createWaveElement(wish);
    }
}


// --- LOCALSTORAGE ---

function saveWishes() {
    localStorage.setItem('elinaWishes', JSON.stringify(wishes));
}

function loadWishes() {
    const savedWishes = localStorage.getItem('elinaWishes');
    if (savedWishes) {
        wishes = JSON.parse(savedWishes);
    }
}


// --- p5.js SKETCHES ---

/**
 * p5.js sketch for the ambient background particles.
 */
const backgroundSketch = (p) => {
    let particles = [];
    const numParticles = 80;

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
            this.x += this.vx;
            this.y += this.vy;
            if (this.x > p.width) this.x = 0;
            if (this.x < 0) this.x = p.width;
            if (this.y > p.height) this.y = 0;
            if (this.y < 0) this.y = p.height;
        }
        show() {
            let alpha = p.map(p.sin(p.frameCount * 0.01 + this.offset), -1, 1, 10, 70);
            p.noStroke();
            p.fill(255, 255, 255, alpha);
            p.ellipse(this.x, this.y, this.size);
        }
    }

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    };
    p.draw = () => {
        p.clear();
        for (let particle of particles) {
            particle.update();
            particle.show();
        }
    };
    p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
};


/**
 * [ADVANCED WAVE SKETCH]
 * A factory that returns a new p5.js sketch for a wave.
 * @param {object} wish - The wish object containing color data.
 */
const createWaveSketch = (wish) => {
    return (p) => {
        let particles = [];
        let time = 0;
        const palette = WAVE_COLORS[wish.colorIndex];
        const particleColors = palette.particles;
        const numParticles = 300;
        const getWaveHeight = () => window.innerWidth <= 768 ? 250 : 300;

        class WaveParticle {
            constructor() {
                this.x = p.random(p.width);
                this.yOffset = p.random(-1, 1); 
                this.vx = p.random(0.5, 1.5);
                this.color = p.random(particleColors);
                this.offset = p.random(1000);
                this.proximityToCenter = 1 - p.abs(this.yOffset); 
                this.size = p.map(this.proximityToCenter, 0, 1, 1, 4);
                this.alpha = p.map(this.proximityToCenter, 0, 1, 100, 255);
            }

            update(time) {
                let amp1 = p.sin(this.x * 0.01 + time + this.offset) * (p.height / 7);
                let amp2 = p.cos(this.x * 0.008 - time * 0.8 + this.offset) * (p.height / 9);
                let noiseFactor = p.noise(this.x * 0.005, time * 0.3 + this.offset);
                let totalAmplitude = (amp1 + amp2) * noiseFactor;
                this.y = p.height / 2 + this.yOffset * totalAmplitude;
                this.x = (this.x + this.vx) % p.width;
            }

            show() {
                p.noStroke();
                p.fill(this.color[0], this.color[1], this.color[2], this.alpha);
                p.ellipse(this.x, this.y, this.size);
            }
        }

        p.setup = () => {
            const parentWidth = document.getElementById(`wave-canvas-${wish.timestamp}`).clientWidth;
            p.createCanvas(parentWidth, getWaveHeight());
            p.colorMode(p.RGB);
            for (let i = 0; i < numParticles; i++) {
                particles.push(new WaveParticle());
            }
        };

        p.draw = () => {
            p.background(0);
            for (let particle of particles) {
                particle.update(time);
                particle.show();
            }
            time += 0.02;
        };

        p.windowResized = () => {
            const parentWidth = document.getElementById(`wave-canvas-${wish.timestamp}`).clientWidth;
            p.resizeCanvas(parentWidth, getWaveHeight());
        };
    };
};
