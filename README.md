# redmine-disable-tribute-module

A Tampermonkey userscript to eliminate typing input lag and keyboard freeze caused by Forced Reflows (Forced Synchronous Layout) on Redmine instances.

---

## 📋 Requirements & Compatibility

### 1. Supported Redmine Versions
- **Redmine 6.x**
- **Redmine 5.x** (5.0.0+ where inline `Tribute.js` autocomplete was introduced)
- **Redmine 4.x** (Compatible fallback for legacy jQuery autosize)
- **Supported Themes:** All themes including **Opale**, **PurpleMine2**, **Classic**, and custom corporate skins.

---

### 2. Supported Web Browsers
- Google Chrome / Chromium
- Mozilla Firefox
- Brave Browser
- Microsoft Edge
- Apple Safari

---

### 3. Userscript Manager
- [Tampermonkey for Google Chrome (Chrome Web Store)](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Tampermonkey for Mozilla Firefox (Firefox Add-ons)](https://addons.mozilla.org/firefox/addon/tampermonkey/)
- [Tampermonkey Official Website (Other Browsers)](https://www.tampermonkey.net/)

*(Alternative userscript managers like [Violentmonkey](https://violentmonkey.github.io/) are also fully supported).*

---

## 🔄 Automatic Updates

The script includes standard `@updateURL` and `@downloadURL` headers. Tampermonkey will automatically check for updates and update the script whenever a new `@version` is pushed to GitHub.

---

## 🔍 Root Cause Analysis

On large Redmine issue pages (tickets with extensive history, numerous notes, and large watcher/assignee lists), two main factors cause substantial input latency (up to 2 seconds per keystroke):

1. **Tribute.js (@ and # autocomplete):** Evaluates cursor position, bounding boxes, and regex patterns on every keystroke (`input`/`keydown` events).
2. **Textarea Autosize:** Queries `scrollHeight` and coordinates synchronously on every input to dynamically resize the field.

Reading geometric DOM properties right after modifications forces the browser engine to perform a full-page synchronous layout recalculation (**Forced Reflow**), blocking the main browser thread.

---

## 🛠️ Solution

This userscript:
- Detaches and neutralizes `Tribute.js` on all editable inputs and textareas.
- Blocks future re-attachments triggered by dynamic Redmine scripts.
- Disables jQuery `autosize` listeners on textareas.
- Sets `spellcheck="false"` and `autocomplete="off"` to prevent secondary layout thrashing.
- Uses a `MutationObserver` to automatically sanitize dynamically injected forms (e.g., *Edit*, *Quote*, or *Reply* actions).

---

## 🚀 Step-by-Step Installation Guide (Tampermonkey)

### Method 1: Install from URL in Tampermonkey Dashboard (Recommended)

1. Open **Tampermonkey Dashboard** in your browser.
2. Go to the **Utilities** tab.
3. Under **Install from URL**, paste:
   ```text
   https://raw.githubusercontent.com/loitiSmile/redmine-disable-tribute-module/main/redmine-disable-tribute.user.js
   ```
4. Click **Install**.

---

### Method 2: Manual Installation via Dashboard

1. **Open Dashboard:** Click the Tampermonkey icon in your browser toolbar and select **Dashboard**.
2. **Create New Script:** Click the **`+`** (Add a new script) tab.
3. **Paste Code:** Select all existing template code, delete it, and paste the full contents of [`redmine-disable-tribute.user.js`](./redmine-disable-tribute.user.js).
4. *(Optional)* You can customize the `@match` header to match your specific Redmine domain (e.g., `// @match https://redmine.example.com/*`).
5. **Save:** Press `Ctrl + S` (or `Cmd + S` on macOS), or click **File -> Save**.
6. **Verify:** Navigate to your Redmine instance and verify that the script is enabled in the Tampermonkey extension popup menu.

---

## 🔬 How to Verify

1. Open a large Redmine ticket on your instance.
2. Click **Edit** / **Quote** to open the note textarea.
3. Type rapidly: character input is now instantaneous with zero lag.
4. *(Optional)* Open Chrome/Firefox DevTools (`F12`) -> **Performance** tab -> Record typing for 3 seconds -> Observe that **Forced reflow** warnings and 500ms+ frame drops are completely gone.

---

## 👤 Author

- **loiti**
