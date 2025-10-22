// --- ASSETS ---

const POEMS = [ /* same 25 poems as before */ ];
const SOUNDCLOUD_URLS = [ /* same 25 SoundCloud URLs as before */ ];
const WAVE_COLORS = [ /* same 6 color palettes as before */ ];

// --- GLOBAL STATE & DOM ELEMENTS ---
let wishes = [];
let currentIframe = null;
let currentWidget = null;
let questionHidden = false;
let questionEl, wavesContainer, formEl, inputEl, audioContainer, bgContainer;

document.addEventListener('DOMContentLoaded', () => {
    questionEl = document.getElementById('main-question');
    wavesContainer = document.getElementById('waves-container');
    formEl = document.getElementById('wish-form');
    inputEl = document.getElementById('wish-input');
    audioContainer = document.getElementById('audio-player-container');
    bgContainer = document.getElementById('bg-particle-container');

    loadWishes();
    renderWaves();
    setupEventListeners();
    new p5(backgroundSketch, bgContainer);
});

// --- EVENT LISTENERS ---
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
    if (!text) return;

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

// ✅ iOS-safe SoundCloud autoplay
function playTrack(index) {
    if (currentIframe) currentIframe.remove();
    currentWidget = null;

    const rawUrl = SOUNDCLOUD_URLS[index];
    const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(rawUrl)}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;

    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "166";
    iframe.frameBorder = "no";
    iframe.allow = "autoplay";
    iframe.scrolling = "no";
    iframe.src = embedUrl;
    audioContainer.appendChild(iframe);
    currentIframe = iframe;

    iframe.addEventListener('load', () => {
        const widget = SC.Widget(iframe);
        widget.bind(SC.Widget.Events.READY, () => {
            widget.play();
        });
        currentWidget = widget;
    });
}

// --- CREATE WAVE ELEMENT ---
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

// --- BACKGROUND PARTICLES ---
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

// --- MULTI-THREAD SINE WAVE SKETCH ---
const createWaveSketch = (wish) => {
    return (p) => {
        let threads = [];
        let particles = [];
        const numThreads = 3;
        const numParticles = 200;
        const palette = WAVE_COLORS[wish.colorIndex];
        let time = 0;

        const getWaveHeight = () => window.innerWidth <= 768 ? 250 : 300;

        class WaveThread {
            constructor(offset) {
                this.offset = offset;
                this.color = palette.particles[Math.floor(Math.random() * palette.particles.length)];
            }
            getY(x) {
                return getWaveHeight()/2 +
                    Math.sin((x*0.02) + time + this.offset)*60 +
                    Math.sin((x*0.01) - time*0.5 + this.offset)*40;
            }
            show() {
                p.noFill();
                p.stroke(this.color[0], this.color[1], this.color[2], 200);
                p.strokeWeight(2);
                p.beginShape();
                for (let i = 0; i < p.width; i+=2) {
                    p.vertex(i, this.getY(i));
                }
                p.endShape();
            }
        }

        class WaveParticle {
            constructor() {
                this.x = p.random(p.width);
                this.y = p.random(getWaveHeight());
                this.vx = p.random(0.2, 1);
                this.color = palette.particles[Math.floor(Math.random() * palette.particles.length)];
                this.size = p.random(1,3);
            }
            update() {
                this.x += this.vx;
                if(this.x>p.width)this.x=0;
            }
            show() {
                p.noStroke();
                p.fill(this.color[0],this.color[1],this.color[2],150);
                p.ellipse(this.x,this.y,this.size);
            }
        }

        p.setup = () => {
            const parentWidth = document.getElementById(`wave-canvas-${wish.timestamp}`).clientWidth;
            p.createCanvas(parentWidth, getWaveHeight());
            for(let i=0;i<numThreads;i++) threads.push(new WaveThread(i*1.5));
            for(let i=0;i<numParticles;i++) particles.push(new WaveParticle());
        }

        p.draw = () => {
            p.background(0);
            for(let t of threads) t.show();
            for(let pt of particles){ pt.update(); pt.show(); }
            time+=0.03;
        }

        p.windowResized = () => {
            const parentWidth = document.getElementById(`wave-canvas-${wish.timestamp}`).clientWidth;
            p.resizeCanvas(parentWidth, getWaveHeight());
        }
    }
};
