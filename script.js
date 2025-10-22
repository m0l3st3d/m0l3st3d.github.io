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
    formEl.addEventListener('submit', handleSendWish);
}


// --- CORE LOGIC ---

/**
 * Handles the "Send" button click and Enter key press.
 * CRITICAL: Contains no setTimeout() delays.
 */
function handleSendWish(e) {
    e.preventDefault();
    const text = inputEl.value.trim();

    if (text === '') return;

    // 1. Hide the main question if it's not already hidden
    if (!questionHidden) {
        questionEl.classList.add('hidden');
        questionHidden = true;
    }

    // 2. Determine indices for poem, track, and color
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
        timestamp: Date.now() // Unique ID for the p5.js canvas
    };

    // 4. Add to state and save to localStorage
    wishes.push(newWish);
    saveWishes();

    // 5. Create the DOM element for the wave (prepends to container)
    // This happens *immediately*
    createWaveElement(newWish);

    // 6. Play the track
    // This also happens *immediately*
    playTrack(newWish.trackIndex);

    // 7. Clear the input
    inputEl.value = '';
}

/**
 * Creates and plays a SoundCloud track in a hidden iframe.
 * @param {number} index - The index of the track to play.
 */
function playTrack(index) {
    // Remove the previous iframe if it exists
    if (currentIframe) {
        currentIframe.remove();
    }

    const rawUrl = SOUNDCLOUD_URLS[index];
    // Format the URL for the embed player with autoplay
    const embedUrl = `https://w.soundcloud.com/player/?url=${rawUrl}&color=%23000000&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;

    // Create the new iframe
    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "166"; // Standard height for the player
    iframe.scrolling = "no";
    iframe.frameBorder = "no";
    iframe.allow = "autoplay"; // CRITICAL for autoplay on user interaction
    iframe.src = embedUrl;

    // Add to the hidden container and store reference
    audioContainer.appendChild(iframe);
    currentIframe = iframe;

    // Log for verification as requested
    console.log(`[Elina] Attempting to autoplay track ${index}: ${embedUrl}`);
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

    // Container for the p5.js canvas
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'wave-canvas';
    // Unique ID based on timestamp
    canvasContainer.id = `wave-canvas-${wish.timestamp}`; 

    const poemEl = document.createElement('p');
    poemEl.className = 'wave-poem';
    poemEl.textContent = wish.poem;

    const wishTextEl = document.createElement('p');
    wishTextEl.className = 'wave-wish-text';
    wishTextEl.textContent = `"${wish.text}"`;

    // Assemble the element
    wrapper.appendChild(canvasContainer);
    wrapper.appendChild(poemEl);
    wrapper.appendChild(wishTextEl);

    // Add event listener to replay the song on click
    wrapper.addEventListener('click', () => {
        playTrack(wish.trackIndex);
    });

    // Add to the top of the container (due to flex-direction: column-reverse)
    wavesContainer.prepend(wrapper);

    // CRITICAL: Instantiate a new p5.js sketch for this specific wave
    // We pass the sketch-generating function and the ID of the container
    new p5(createWaveSketch(wish), canvasContainer.id);
}

/**
 * Renders all saved wishes from the `wishes` array on page load.
 */
function renderWaves() {
    wavesContainer.innerHTML = '';
    
    // If wishes exist, hide the question immediately on load
    if (wishes.length > 0) {
        questionEl.classList.add('hidden');
        questionHidden = true;
    }

    // Loop through all wishes and create their elements
    // This will stack them correctly due to `prepend` in createWaveElement
    // and the `column-reverse` layout.
    for (const wish of wishes) {
        createWaveElement(wish);
    }
}


// --- LOCALSTORAGE ---

/**
 * Saves the current `wishes` array to localStorage.
 */
function saveWishes() {
    localStorage.setItem('elinaWishes', JSON.stringify(wishes));
}

/**
 * Loads wishes from localStorage into the `wishes` state array.
 */
function loadWishes() {
    const savedWishes = localStorage.getItem('elinaWishes');
    if (savedWishes) {
        wishes = JSON.parse(savedWishes);
    }
}


// --- p5.js SKETCHES ---

/**
 * p5.js sketch for the ambient background particles.
 * Runs in instance mode.
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
            // Wrap around edges
            if (this.x > p.width) this.x = 0;
            if (this.x < 0) this.x = p.width;
            if (this.y > p.height) this.y = 0;
            if (this.y < 0) this.y = p.height;
        }

        show() {
            // Pulsing opacity
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
        p.clear(); // Use clear() for a transparent background
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
 * A *function factory* that returns a new p5.js sketch (closure) for a wave.
 * This allows each wave to have its own state (particles, time, colors).
 * @param {object} wish - The wish object containing color data.
 */
const createWaveSketch = (wish) => {
    
    // This is the actual p5.js sketch function
    return (p) => {
        let particles = [];
        let time = 0;
        const palette = WAVE_COLORS[wish.colorIndex];
        const baseColor = palette.base;
        const particleColors = palette.particles;
        const numParticles = 150; // 100+ particles

        // Get the correct height based on media query
        const getWaveHeight = () => window.innerWidth <= 768 ? 250 : 300;

        // Particle class *local to this sketch*
        class WaveParticle {
            constructor() {
                this.x = p.random(p.width);
                this.y = p.random(p.height);
                this.vx = p.random(0.5, 1.5); // Flow to the right
                this.color = p.random(particleColors);
                this.size = p.random(1, 4);
                this.offset = p.random(1000);
            }

            update(time) {
                // Main wave logic using sin, cos, and noise
                let mainWave = p.sin(this.x * 0.01 + time + this.offset) * (p.height / 5.5);
                let secondWave = p.cos(this.x * 0.008 - time * 0.8 + this.offset) * (p.height / 6.5);
                let noiseFactor = p.noise(this.x * 0.004, time * 0.3 + this.offset);

                this.y = p.height / 2 + (mainWave + secondWave) * noiseFactor;
                
                // Add horizontal drift
                this.x = (this.x + this.vx) % p.width;

                // Vary alpha and size based on noise/position
                this.alpha = p.map(noiseFactor, 0.2, 0.8, 100, 255, true);
                this.size = p.map(noiseFactor, 0.2, 0.8, 1, 5, true);
            }

            show() {
                p.noStroke();
                p.fill(this.color[0], this.color[1], this.color[2], this.alpha);
                p.ellipse(this.x, this.y, this.size);
            }
        }

        p.setup = () => {
            // Ensure parent container's width is used
            const parentWidth = document.getElementById(`wave-canvas-${wish.timestamp}`).clientWidth;
            p.createCanvas(parentWidth, getWaveHeight());
            p.colorMode(p.RGB);
            
            // Create particles for this wave
            for (let i = 0; i < numParticles; i++) {
                particles.push(new WaveParticle());
            }
        };

        p.draw = () => {
            p.background(0); // Solid black background
            
            // Draw a very faint "base" wave line
            p.noFill();
            p.stroke(baseColor[0], baseColor[1], baseColor[2], 50);
            p.strokeWeight(1);
            p.beginShape();
            for (let x = 0; x <= p.width; x += 10) {
                let noiseFactor = p.noise(x * 0.004, time * 0.3);
                let mainWave = p.sin(x * 0.01 + time) * (p.height / 5.5);
                let y = p.height / 2 + (mainWave) * noiseFactor;
                p.vertex(x, y);
            }
            p.endShape();

            // Update and draw all particles
            for (let particle of particles) {
                particle.update(time);
                particle.show();
            }
            
            time += 0.02; // Animate time
        };

        p.windowResized = () => {
            // Respond to window resize events
            const parentWidth = document.getElementById(`wave-canvas-${wish.timestamp}`).clientWidth;
            p.resizeCanvas(parentWidth, getWaveHeight());
        };
    };
};
