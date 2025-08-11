let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapTimes = [];
let lapCount = 0;

// DOM Elements
let timeDisplay, startStopBtn, lapBtn, resetBtn, lapList;

// Initialize the application on DOM load
document.addEventListener('DOMContentLoaded', () => {
    timeDisplay = document.getElementById('timeDisplay');
    startStopBtn = document.getElementById('startStopBtn');
    lapBtn = document.getElementById('lapBtn');
    resetBtn = document.getElementById('resetBtn');
    lapList = document.getElementById('lapList');

    startStopBtn.onclick = toggleStartStop;
    lapBtn.onclick = recordLap;
    resetBtn.onclick = reset;

    updateDisplay();
    updateButtonStates();
    updateLapDisplay();
});

// Toggle between Start and Stop
function toggleStartStop() {
    if (isRunning) {
        stop();
    } else {
        start();
    }
}

//Starting the Stopwatch
function start() {
    if (isRunning) return;
    startTime = Date.now() - elapsedTime;
    isRunning = true;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
    }, 10); // update every 10ms
    updateButtonStates();
}

//Stopping the Stopwatch
function stop() {
    if (!isRunning) return;
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    updateButtonStates();
}

//Resetting Everythingh
function reset() {
    stop();
    startTime = 0;
    elapsedTime = 0;
    lapTimes = [];
    lapCount = 0;
    updateDisplay();
    updateButtonStates();
    updateLapDisplay();
}

// Formatting Time Display: HH:MM:SS:MS
function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return (
        String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0') + ':' +
        String(centiseconds).padStart(2, '0')
    );
}

//Updating the Display
function updateDisplay() {
    timeDisplay.textContent = formatTime(elapsedTime);
}

// Update button states and visuals
function updateButtonStates() {
    if (isRunning) {
        startStopBtn.textContent = 'Stop';
        startStopBtn.classList.add('btn-stop');
        startStopBtn.classList.remove('btn-start');
        lapBtn.disabled = false;
    } else {
        startStopBtn.textContent = 'Start';
        startStopBtn.classList.add('btn-start');
        startStopBtn.classList.remove('btn-stop');
        lapBtn.disabled = true;
    }
}

// Record lap times
function recordLap() {
    if (!isRunning) return;
    lapCount++;
    const currentTime = elapsedTime;
    const previousTime = lapTimes.length > 0 ? lapTimes[lapTimes.length - 1].total : 0;
    const lapTime = currentTime - previousTime;
    lapTimes.push({
        num: lapCount,
        lap: lapTime,
        total: currentTime
    });
    if (lapTimes.length > 10) {
        lapTimes.shift(); // Keep only last 10 laps
    }
    updateLapDisplay();
}

// Update lap display
function updateLapDisplay() {
    if (lapTimes.length === 0) {
        lapList.innerHTML = '<div class="no-laps">No lap times recorded</div>';
        return;
    }
    lapList.innerHTML = '';
    lapTimes.forEach((lap) => {
        const row = document.createElement('div');
        row.className = 'lap-row';
        row.innerHTML = `
            <span class="lap-num">#${lap.num}</span>
            <span class="lap-time">${formatTime(lap.lap)}</span>
            <span class="lap-total">${formatTime(lap.total)}</span>
        `;
        lapList.appendChild(row);
    });
}