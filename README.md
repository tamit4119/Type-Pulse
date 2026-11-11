# ⚡ TypePulse — Typing Speed Test

**TypePulse** is a clean, fast typing test web app built with Vanilla HTML, CSS, and JavaScript. It tracks your typing speed (WPM) and accuracy in real time, saves your personal best score, and supports Dark and Light themes.

---

## ✨ Features

- **Live Character Feedback:** Highlights correct letters in green, mistakes in red, and moves the blinking cursor as you type or backspace.
- **Fast DOM Rendering:** Uses `DocumentFragment` to load all quote characters at once so the page never lags.
- **Random Quotes + Offline Mode:** Fetches new quotes from the DummyJSON API and automatically switches to built-in fallback quotes if you are offline.
- **Clean Text Formatting:** Replaces special curly quotes and long dashes with normal keyboard characters so every symbol is easy to type.
- **Accurate Timer & Stats:** Calculates time using `Date.now()` timestamps so the 60-second countdown stays accurate.
- **Saved High Score & Theme:** Uses `localStorage` to remember your **Best WPM** and **Dark / Light theme** even after you close the browser.
- **Keystroke Sound Effects:** Plays a short mechanical key-click (`click.mp3`) on every key press, with a button to mute/unmute.
- **Quality-of-Life & Anti-Cheat:** Blocks copy-pasting into the input, pauses cursor blinking when you click away, and lets you press `Escape` to quickly load a new quote.

---

## 🧮 How Stats Are Calculated

- **Standard Word Length:** Every $5$ characters (including spaces) counts as $1$ word.
- **Speed (WPM):** Correct words typed divided by the time elapsed in minutes:
  $$\text{WPM} = \text{round}\left(\frac{\text{Correct Characters} / 5}{\text{Elapsed Minutes}}\right)$$
- **Accuracy:** Percentage of correct characters out of everything you typed:
  $$\text{Accuracy} = \text{round}\left(\frac{\text{Correct Characters}}{\text{Total Typed Characters}} \times 100\right)$$

---

## 🛠️ Tech Stack

- **HTML5:** Semantic tags and a hidden `<input>` field to capture keyboard typing cleanly.
- **CSS3:** CSS Variables for Dark/Light themes, Flexbox layout, and `@keyframes` for the blinking cursor.
- **JavaScript (ES6+):** `async/await` with `fetch`, DOM manipulation, `localStorage`, and `Audio` API.

---

## 📂 Project Structure

```text
typepulse/
├── index.html   # Page layout and hidden typing input
├── style.css    # Dark/Light themes, layout, and cursor animation
├── script.js    # Quote fetching, typing logic, timer, and stats
├── click.mp3    # Keystroke click sound
└── README.md    # Project documentation
```

---

## 🚀 How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/tamit4119/Type-Pulse.git
   ```
2. Open the `typepulse` folder and double-click `index.html` to open it in your browser (or run it with the **Live Server** extension in VS Code).
