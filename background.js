// Constants
const ALARM_NAME = "drinkWater";
const STORAGE_KEYS = {
  INTERVAL: 'interval',
  START_TIME: 'startTime'
};

// Notification configuration
const NOTIFICATION_CONFIG = {
  type: "basic",
  iconUrl: "icon.png",
  title: "HydrateBuddy",
  message: "Time to drink water! 💧",
  priority: 2
};

// Utility functions
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return {
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(remainingSeconds).padStart(2, '0')
  };
}

function calculateTimeRemaining(startTime, intervalMinutes) {
  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000);
  const totalSeconds = intervalMinutes * 60;
  return Math.max(0, totalSeconds - elapsed);
}

// Core functionality
function showNotification() {
  try {
    chrome.notifications.create('hydration-reminder', NOTIFICATION_CONFIG);
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}

function createAlarm(intervalMinutes) {
  try {
    chrome.alarms.create(ALARM_NAME, {
      periodInMinutes: intervalMinutes
    });
  } catch (error) {
    console.error('Failed to create alarm:', error);
  }
}

function clearAlarm() {
  try {
    chrome.alarms.clear(ALARM_NAME);
  } catch (error) {
    console.error('Failed to clear alarm:', error);
  }
}

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

// Timer management
function handleTimerExpiration(interval) {
  showNotification();
  const newStart = Date.now();
  saveTimerData(interval, newStart);
  createAlarm(interval);
}

function initializeTimer() {
  chrome.storage.sync.get([STORAGE_KEYS.INTERVAL, STORAGE_KEYS.START_TIME], (data) => {
    const { interval, startTime } = data;
    
    if (!interval || !startTime) {
      return; // No saved timer data
    }

    const secondsRemaining = calculateTimeRemaining(startTime, interval);
    
    if (secondsRemaining > 0) {
      // Timer should still be running, restart the alarm
      createAlarm(interval);
    } else {
      // Timer has expired, restart the alarm without showing notification on startup
      const newStart = Date.now();
      saveTimerData(interval, newStart);
      createAlarm(interval);
    }
  });
}

// Message handling
function handleMessage(message) {
  switch (message.action) {
    case "start":
      createAlarm(message.interval);
      break;
    case "stop":
      clearAlarm();
      break;
    case "notify":
      showNotification();
      break;
    default:
      console.warn('Unknown message action:', message.action);
  }
}

// Event listeners
chrome.runtime.onMessage.addListener(handleMessage);

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    showNotification();
  }
});

// Initialize when service worker starts
initializeTimer();
