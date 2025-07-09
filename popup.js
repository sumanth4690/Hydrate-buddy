// Constants
const STORAGE_KEYS = {
  INTERVAL: 'interval',
  START_TIME: 'startTime'
};

const UI_ELEMENTS = {
  TIMER_DISPLAY: 'timerDisplay',
  INTERVAL_INPUT: 'interval',
  START_BTN: 'startBtn',
  STOP_BTN: 'stopBtn'
};

const MESSAGES = {
  INVALID_INTERVAL: 'Please enter a valid number',
  TIMER_DISPLAY_DEFAULT: '⏱ Timer: --:--'
};

// State management
let countdownInterval = null;

// Utility functions
function formatTime(secondsLeft) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  return {
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0')
  };
}

function calculateTimeRemaining(startTime, intervalMinutes) {
  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000);
  const totalSeconds = intervalMinutes * 60;
  return Math.max(0, totalSeconds - elapsed);
}

function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id '${id}' not found`);
  }
  return element;
}

// UI functions
function updateTimerDisplay(secondsLeft) {
  try {
    const { minutes, seconds } = formatTime(secondsLeft);
    const timerDisplay = getElement(UI_ELEMENTS.TIMER_DISPLAY);
    timerDisplay.textContent = `⏱ Timer: ${minutes}:${seconds}`;
  } catch (error) {
    console.error('Failed to update timer display:', error);
  }
}

function resetTimerDisplay() {
  try {
    const timerDisplay = getElement(UI_ELEMENTS.TIMER_DISPLAY);
    timerDisplay.textContent = MESSAGES.TIMER_DISPLAY_DEFAULT;
  } catch (error) {
    console.error('Failed to reset timer display:', error);
  }
}

function setIntervalInput(value) {
  try {
    const intervalInput = getElement(UI_ELEMENTS.INTERVAL_INPUT);
    intervalInput.value = value;
  } catch (error) {
    console.error('Failed to set interval input:', error);
  }
}

function getIntervalValue() {
  try {
    const intervalInput = getElement(UI_ELEMENTS.INTERVAL_INPUT);
    return parseInt(intervalInput.value);
  } catch (error) {
    console.error('Failed to get interval value:', error);
    return 0;
  }
}

// Timer management
function clearCountdownInterval() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

function startCountdown(startTime, interval) {
  clearCountdownInterval();

  countdownInterval = setInterval(() => {
    const secondsLeft = calculateTimeRemaining(startTime, interval);

    if (secondsLeft <= 0) {
      clearCountdownInterval();
      handleTimerExpiration(interval);
    } else {
      updateTimerDisplay(secondsLeft);
    }
  }, 1000);
}

function handleTimerExpiration(interval) {
  try {
    // Show final notification
    chrome.runtime.sendMessage({ action: "notify" });

    // Restart new cycle
    const newStart = Date.now();
    saveTimerData(interval, newStart);
    chrome.runtime.sendMessage({ action: "start", interval });
    startCountdown(newStart, interval);
  } catch (error) {
    console.error('Failed to handle timer expiration:', error);
  }
}

// Storage functions
function saveTimerData(interval, startTime) {
  try {
    chrome.storage.sync.set({
      [STORAGE_KEYS.INTERVAL]: interval,
      [STORAGE_KEYS.START_TIME]: startTime
    });
  } catch (error) {
    console.error('Failed to save timer data:', error);
  }
}

function clearTimerData() {
  try {
    chrome.storage.sync.remove([STORAGE_KEYS.INTERVAL, STORAGE_KEYS.START_TIME]);
  } catch (error) {
    console.error('Failed to clear timer data:', error);
  }
}

// Timer control functions
function startTimer() {
  const interval = getIntervalValue();
  
  if (!interval || interval < 1) {
    alert(MESSAGES.INVALID_INTERVAL);
    return;
  }

  try {
    const startTime = Date.now();
    saveTimerData(interval, startTime);
    chrome.runtime.sendMessage({ action: "start", interval });
    startCountdown(startTime, interval);
  } catch (error) {
    console.error('Failed to start timer:', error);
  }
}

function stopTimer() {
  try {
    clearCountdownInterval();
    resetTimerDisplay();
    chrome.runtime.sendMessage({ action: "stop" });
    clearTimerData();
  } catch (error) {
    console.error('Failed to stop timer:', error);
  }
}

function checkAndStartTimer() {
  chrome.storage.sync.get([STORAGE_KEYS.INTERVAL, STORAGE_KEYS.START_TIME], (data) => {
    const { interval, startTime } = data;
    
    if (!interval || !startTime) {
      return; // No saved timer data
    }

    const secondsRemaining = calculateTimeRemaining(startTime, interval);

    if (secondsRemaining > 0) {
      // Timer should still be running
      startCountdown(startTime, interval);
      setIntervalInput(interval);
    } else {
      // Timer has expired, restart it
      const newStart = Date.now();
      saveTimerData(interval, newStart);
      chrome.runtime.sendMessage({ action: "start", interval });
      startCountdown(newStart, interval);
      setIntervalInput(interval);
    }
  });
}

// Event listeners
function initializeEventListeners() {
  try {
    const startBtn = getElement(UI_ELEMENTS.START_BTN);
    const stopBtn = getElement(UI_ELEMENTS.STOP_BTN);

    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
  } catch (error) {
    console.error('Failed to initialize event listeners:', error);
  }
}

// Initialize when popup opens
function initialize() {
  initializeEventListeners();
  checkAndStartTimer();
}

// Start initialization
initialize();
