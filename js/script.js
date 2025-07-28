// Pomodoro Timer Logic
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroInput = document.getElementById('pomodoro-duration');
const breakInput = document.getElementById('break-duration');
const alarmSelect = document.getElementById('alarm-sound');
const audioDefault = document.getElementById('audio-default');
const audioBeep = document.getElementById('audio-beep');
const audioBell = document.getElementById('audio-bell');

let timer;
let isRunning = false;
let isBreak = false;
let remainingSeconds = 25 * 60;

// Enhance alarm reliability and add visual cue
function playAlarm() {
    audioBell.currentTime = 0;
    const playPromise = audioBell.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            timerDisplay.classList.add('alarm-flash');
            setTimeout(() => timerDisplay.classList.remove('alarm-flash'), 1200);
        });
    }
    timerDisplay.classList.add('alarm-flash');
    setTimeout(() => timerDisplay.classList.remove('alarm-flash'), 1200);
}

// Animate timer digit changes
let lastDisplay = '';
function updateDisplay() {
    const min = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    const sec = String(remainingSeconds % 60).padStart(2, '0');
    const newDisplay = `${min}:${sec}`;
    if (timerDisplay.textContent !== newDisplay) {
        timerDisplay.classList.remove('timer-tick');
        void timerDisplay.offsetWidth; // force reflow
        timerDisplay.classList.add('timer-tick');
    }
    timerDisplay.textContent = newDisplay;
    lastDisplay = newDisplay;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
        } else {
            playAlarm();
            clearInterval(timer);
            isRunning = false;
            // Do NOT auto-switch to break or pomodoro. User must start next session manually.
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isBreak = false;
    remainingSeconds = parseInt(pomodoroInput.value, 10) * 60;
    updateDisplay();
}

pomodoroInput.addEventListener('change', () => {
    if (!isRunning && !isBreak) {
        remainingSeconds = parseInt(pomodoroInput.value, 10) * 60;
        updateDisplay();
    }
});
breakInput.addEventListener('change', () => {
    if (!isRunning && isBreak) {
        remainingSeconds = parseInt(breakInput.value, 10) * 60;
        updateDisplay();
    }
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay();

// Color picker dropdown logic
const colorPickerToggle = document.getElementById('color-picker-toggle');
const colorTablePanel = document.getElementById('color-table-panel');
const musicToggle = document.getElementById('music-toggle');
const backgroundMusic = document.getElementById('background-music');

// Background music toggle logic
let isMusicPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicToggle.classList.remove('active');
        musicToggle.textContent = '🎵';
        isMusicPlaying = false;
    } else {
        backgroundMusic.play();
        musicToggle.classList.add('active');
        musicToggle.textContent = '⏸️';
        isMusicPlaying = true;
    }
});

colorPickerToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    colorTablePanel.classList.toggle('open');
    if (colorTablePanel.classList.contains('open')) {
        colorTablePanel.style.display = 'block';
    } else {
        colorTablePanel.style.display = 'none';
    }
});

document.addEventListener('click', (e) => {
    if (!colorTablePanel.contains(e.target) && e.target !== colorPickerToggle) {
        colorTablePanel.classList.remove('open');
        colorTablePanel.style.display = 'none';
    }
});

// Color table logic
const colorCells = document.querySelectorAll('.color-cell');
colorCells.forEach(cell => {
    cell.addEventListener('click', () => {
        document.body.style.background = cell.getAttribute('data-color');
    });
});

// Idle detection and slideshow functionality
let idleTimer;
let isIdle = false;
let currentImageIndex = 0;
let slideshowInterval;

// Sample images - replace with your own image paths
const slideshowImages = [
    'assets/background/bg1.jpg',
    'assets/background/bg2.jpg', 
    'assets/background/bg3.jpg',
    'assets/background/bg4.jpg',
    'assets/background/bg5.jpg',
    'assets/background/bg6.jpg',
    'assets/background/bg7.jpg'
];

const slideshowContainer = document.getElementById('slideshow-container');
const slideshowImage = document.getElementById('slideshow-image');

function resetIdleTimer() {
    clearTimeout(idleTimer);
    if (isIdle) {
        isIdle = false;
        document.body.classList.remove('idle');
        slideshowContainer.classList.remove('active');
        clearInterval(slideshowInterval);
        console.log('User activity detected - stopping slideshow');
    }
    idleTimer = setTimeout(startIdleMode, 10000); // 10 seconds
    console.log('Idle timer reset - slideshow will start in 10 seconds');
}

function startIdleMode() {
    isIdle = true;
    document.body.classList.add('idle');
    slideshowContainer.classList.add('active');
    console.log('Starting idle mode and slideshow');
    showNextImage();
}

function showNextImage() {
    if (!isIdle) return;
    
    console.log('Showing image:', slideshowImages[currentImageIndex]);
    slideshowImage.style.backgroundImage = `url('${slideshowImages[currentImageIndex]}')`;
    currentImageIndex = (currentImageIndex + 1) % slideshowImages.length;
    
    slideshowInterval = setTimeout(showNextImage, 18000); // Change image every 18 seconds
}

// Track user activity
document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('click', resetIdleTimer);
document.addEventListener('keydown', resetIdleTimer);
document.addEventListener('touchstart', resetIdleTimer);

// Start idle timer
resetIdleTimer();
