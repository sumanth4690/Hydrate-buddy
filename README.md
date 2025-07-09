# 💧 HydrateBuddy

> **Stay hydrated, stay healthy!** A simple and elegant Chrome extension that reminds you to drink water at regular intervals.

## 🌟 Features

- **⏰ Customizable Intervals**: Set your own hydration reminder intervals (1 minute to 24 hours)
- **🔔 Desktop Notifications**: Gentle desktop notifications to remind you to drink water
- **⏱️ Real-time Timer**: Visual countdown timer showing time until next reminder
- **💾 Persistent Settings**: Your preferences are saved and restored across browser sessions
- **🎨 Clean Interface**: Simple, intuitive popup interface
- **🔒 Privacy Focused**: No data collection, works entirely offline

---

## 📦 Installation

### Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your toolbar

---

## 🚀 Usage

### Getting Started
1. **Click the HydrateBuddy icon** in your Chrome toolbar
2. **Set your interval** - Enter the number of minutes between reminders (1-1440)
3. **Click "Start"** to begin your hydration journey
4. **Enjoy the reminders!** You'll receive desktop notifications when it's time to drink water

### Controls
- **Start**: Begin the hydration timer with your specified interval
- **Stop**: Pause the timer and stop all reminders
- **Timer Display**: Shows the countdown until your next reminder

### Recommended Intervals
- **30 minutes**: Light activity, office work
- **45 minutes**: Moderate activity
- **60 minutes**: Sedentary work
- **90 minutes**: Very light activity

---

## 🛠️ Technical Details

### Architecture
- **Manifest V3**: Built with the latest Chrome extension standards
- **Service Worker**: Background script handles notifications and alarms
- **Popup Interface**: Clean, accessible UI for user interaction
- **Chrome Storage API**: Syncs settings across devices

### Permissions
- `notifications`: Sends desktop reminders
- `storage`: Saves your preferences
- `alarms`: Manages reminder scheduling

### Files Structure
```
Hydrate-buddy/
├── manifest.json      # Extension configuration
├── popup.html        # Main user interface
├── popup.js          # Frontend logic
├── background.js     # Background service worker
├── styles.css        # Styling
├── icon.png          # Extension icon
└── README.md         # This file
```

---

## 🎯 Why HydrateBuddy?


## 🛠️ Development

This extension is built with:
- **Manifest V3**: Latest Chrome extension standards
- **Vanilla JavaScript**: No external dependencies
- **Chrome APIs**: Notifications, Storage, and Alarms
- **Modern CSS**: Clean and responsive design

### Local Development
```bash
# Clone the repository
git clone https://github.com/sumanth4690/Hydrate-buddy.git

# Navigate to the directory
cd hydrate-buddy

## 🙏 Acknowledgments

- 💧 Inspired by the importance of staying hydrated
- 🎨 Designed for simplicity and user experience
- 🔧 Built with modern web technologies
- 📱 Optimized for Chrome's extension ecosystem

---

<div align="center">

**Stay hydrated, stay healthy! 💧**

*Made with ❤️ for better health habits*

</div>