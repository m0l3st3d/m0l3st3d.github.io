// script.js

// ===== CONFIGURATION =====
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
    "The void sings back what you send forth—your wish finds its universal worth."
];

const SOUNDCLOUD_TRACKS = [
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848619",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848616",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848613",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848610",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848607",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848604",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848601",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848598",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848595",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848592",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848589",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848586",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848583",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848580",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848577",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848574",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848571",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848568",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848565",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848562",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848559",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848556",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848553",
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1967848550"
];

// Wave color palettes
const WAVE_COLORS = [
    { base: [200, 200, 220], accent: [230, 230, 255] }, // Silver
    { base: [255, 215, 100], accent: [255, 235, 150] }, // Golden
    { base: [100, 255, 200], accent: [150, 255, 230] }, // Neon mint
    { base: [255, 100, 150], accent: [255, 150, 200] }, // Neon pink
    { base: [150, 100, 255], accent: [200, 150, 255] }, // Purple
    { base: [100, 200, 255], accent: [150, 230, 255] }  // Cyan
];

// ===== STATE =====
let wishes = [];
let currentTrackIndex = 0;
let questionHidden = false;
let currentIframe = null;

// ===== P5.JS PARTICLES BACKGROUND =====
let particles = [];

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    
    // Create ambient particles
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    clear();
    
    // Update and display particles
    particles.forEach(p => {
        p.update();
        p.display();
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Particle class for background
class Particle {
    constructor() {
        this.reset();
        this.y = random(height);
    }
    
    reset() {
        this.x = random(width);
        this.y = -10;
        this.size = random(1, 3);
        this.speedY = random(0.2, 0.8);
        this.speedX = random(-0.2, 0.2);
        this.opacity = random(30, 100);
        this.opacityChange = random(0.5, 2);
        this.maxOpacity = random(80, 150);
        this.minOpacity = random(20, 60);
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Pulsing opacity
        this.opacity += this.opacityChange;
        if (this.opacity > this.maxOpacity || this.opacity < this.minOpacity) {
            this.opacityChange *= -1;
        }
        
        // Reset when off screen
        if (this.y > height + 10) {
            this.reset();
        }
        if (this.x > width + 10 || this.x < -10) {
            this.x = random(width);
        }
    }
    
    display() {
        noStroke();
        fill(255, 255, 255, this.opacity);
        circle(this.x, this.y, this.size);
    }
}

// ===== MAIN APPLICATION LOGIC =====

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadWishes();
    setupEventListeners();
    renderWaves();
});

// Setup event listeners
function setupEventListeners() {
    const sendButton = document.getElementById('send-button');
    const wishInput = document.getElementById('wish-input');
    
    sendButton.addEventListener('click', handleSendWish);
    wishInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendWish();
        }
    });
}

// Handle sending a wish
function handleSendWish() {
    const wishInput = document.getElementById('wish-input');
    const wishText = wishInput.value.trim();
    
    if (!wishText) return;
    
    // Hide question on first wish
    if (!questionHidden) {
        hideQuestion();
    }
    
    // Create wish object
    const wish = {
        text: wishText,
        poem: POEMS[wishes.length % POEMS.length],
        trackIndex: wishes.length % SOUNDCLOUD_TRACKS.length,
        colorIndex: wishes.length % WAVE_COLORS.length,
        timestamp: Date.now()
    };
    
    // Add to wishes array
    wishes.push(wish);
    saveWishes();
    
    // Play track
    playTrack(wish.trackIndex);
    
    // Show poem, then animate wave
    showWishSequence(wish);
    
    // Clear input
    wishInput.value = '';
}

// Hide the main question
function hideQuestion() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.classList.add('hidden');
    questionHidden = true;
}

// Show wish sequence: poem appears, then wave animates
function showWishSequence(wish) {
    setTimeout(() => {
        renderWaves();
    }, 5000); // 5 second delay for wave animation
}

// Render all waves
function renderWaves() {
    const wavesContainer = document.getElementById('waves-container');
    wavesContainer.innerHTML = '';
    
    wishes.forEach((wish, index) => {
        const waveItem = createWaveElement(wish, index);
        wavesContainer.appendChild(waveItem);
    });
}

// Create individual wave element
function createWaveElement(wish, index) {
    const waveItem = document.createElement('div');
    waveItem.className = 'wave-item';
    
    // Poem text
    const poemText = document.createElement('div');
    poemText.className = 'poem-text';
    poemText.textContent = wish.poem;
    
    // Wave canvas wrapper
    const canvasWrapper = document.createElement('div');
    canvasWrapper.className = 'wave-canvas-wrapper';
    canvasWrapper.addEventListener('click', () => {
        playTrack(wish.trackIndex);
    });
    
    // Create p5 instance for this wave
    const waveSketch = createWaveSketch(wish);
    const waveP5 = new p5(waveSketch, canvasWrapper);
    
    // Wish text
    const wishText = document.createElement('div');
    wishText.className = 'wish-text';
    wishText.textContent = `"${wish.text}"`;
    
    waveItem.appendChild(poemText);
    waveItem.appendChild(canvasWrapper);
    waveItem.appendChild(wishText);
    
    return waveItem;
}

// Create wave sketch for p5 instance
function createWaveSketch(wish) {
    return function(p) {
        const color = WAVE_COLORS[wish.colorIndex];
        let time = 0;
        
        p.setup = function() {
            const canvas = p.createCanvas(800, 150);
            canvas.parent(this.canvas.parentElement);
        };
        
        p.draw = function() {
            p.clear();
            time += 0.02;
            
            // Draw wave particles
            const numPoints = 100;
            for (let i = 0; i < numPoints; i++) {
                const x = p.map(i, 0, numPoints, 0, p.width);
                const baseY = p.height / 2;
                
                // Multiple wave layers
                const wave1 = p.sin(time + i * 0.1) * 20;
                const wave2 = p.sin(time * 1.5 + i * 0.15) * 15;
                const wave3 = p.cos(time * 0.8 + i * 0.08) * 10;
                
                const y = baseY + wave1 + wave2 + wave3;
                
                // Varying opacity and size
                const opacity = p.map(p.sin(time * 2 + i * 0.1), -1, 1, 50, 150);
                const size = p.map(p.cos(time + i * 0.2), -1, 1, 2, 6);
                
                // Use accent color for some particles
                if (i % 3 === 0) {
                    p.fill(color.accent[0], color.accent[1], color.accent[2], opacity);
                } else {
                    p.fill(color.base[0], color.base[1], color.base[2], opacity);
                }
                
                p.noStroke();
                p.circle(x, y, size);
            }
        };
        
        p.windowResized = function() {
            // Keep responsive
            const container = p.canvas.parentElement;
            if (container) {
                p.resizeCanvas(container.offsetWidth, 150);
            }
        };
    };
}

// Play SoundCloud track
function playTrack(trackIndex) {
    const audioContainer = document.getElementById('audio-container');
    
    // Remove existing iframe if any
    if (currentIframe) {
        currentIframe.remove();
    }
    
    // Create new iframe
    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "166";
    iframe.scrolling = "no";
    iframe.frameborder = "no";
    iframe.allow = "autoplay";
    iframe.src = `${SOUNDCLOUD_TRACKS[trackIndex]}&color=%23000000&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;
    
    audioContainer.appendChild(iframe);
    currentIframe = iframe;
}

// LocalStorage functions
function saveWishes() {
    localStorage.setItem('elina_wishes', JSON.stringify(wishes));
}

function loadWishes() {
    const saved = localStorage.getItem('elina_wishes');
    if (saved) {
        wishes = JSON.parse(saved);
        if (wishes.length > 0) {
            hideQuestion();
        }
    }
}
