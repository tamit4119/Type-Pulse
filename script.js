// 1. DOM Element References & Fallback Quotes
const quoteDisplayEle = document.getElementById("quote-display");
const restartBtnEle = document.getElementById("restart-btn");
const typingInputEle = document.getElementById("typing-input");
const timeLeftEle = document.getElementById("time-left");
const wpmEle = document.getElementById("wpm");
const accuracyEle = document.getElementById("accuracy");
const bestWpmEle = document.getElementById("best-wpm");
const themeBtnEle = document.getElementById("theme-btn");
const soundBtnEle = document.getElementById("sound-btn");

const FALLBACK_QUOTES = [
  "Success is not achieved overnight; it comes from consistent effort, patience, and the courage to keep moving forward.",
  "Every small step you take today brings you closer to the person you want to become tomorrow.",
  "Do not let temporary failures define your future; learn from your mistakes and use them as opportunities to grow.",
  "Discipline is choosing what matters most over what feels comfortable, even when nobody is watching.",
  "Believe in your ability to improve, stay curious, and remember that progress is more important than perfection.",
];

// 2. Application State & localStorage Initialization
const clickSound = new Audio("click.mp3");
let isSoundEnabled = true;

const MAX_TIME = 60;
let timerInterval = null; // Stores setInterval ID to stop the clock cleanly
let startTime = null; // Stores Date.now() timestamp of the first keystroke
let isTestActive = false; // Ensures timer only starts once per test
let currentWpm = 0;

let bestWpm = Number(localStorage.getItem("typepulse_best_wpm")) || 0;
let currentTheme = localStorage.getItem("typepulse_theme") || "dark";

// Apply saved theme and high score on initial load
document.documentElement.setAttribute("data-theme", currentTheme);
themeBtnEle.textContent = `Theme: ${currentTheme === "dark" ? "Dark" : "Light"}`;
bestWpmEle.textContent = bestWpm + " WPM";

function playClickSound() {
  if (!isSoundEnabled) return;
  clickSound.currentTime = 0;
  clickSound.play();
}

// 3. Timer & Stats Engine
function resetTest() {
  clearInterval(timerInterval);
  isTestActive = false;
  startTime = null;
  timeLeftEle.textContent = MAX_TIME + "s";
  wpmEle.textContent = "0 WPM";
  accuracyEle.textContent = "100%";
  typingInputEle.disabled = false;
  currentWpm = 0;
  typingInputEle.focus();
}

function endTest() {
  clearInterval(timerInterval);
  isTestActive = false;
  typingInputEle.disabled = true;
  updateStats();

  // Save new high score to localStorage if current WPM beats previous record
  if (currentWpm > bestWpm) {
    bestWpm = currentWpm;
    localStorage.setItem("typepulse_best_wpm", bestWpm);
    bestWpmEle.textContent = bestWpm + " WPM";
  }
}

function updateStats() {
  if (!startTime) {
    return;
  }

  const correctChars = quoteDisplayEle.querySelectorAll("span.correct").length;
  const totalTyped = typingInputEle.value.length;
  const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;

  // Guard against first-millisecond division spike
  if (elapsedMinutes > 0.008) {
    let wpm = Math.round(correctChars / 5 / elapsedMinutes);
    currentWpm = wpm;
    wpmEle.textContent = wpm + " WPM";
  }

  if (totalTyped > 0) {
    let accuracy = Math.round((correctChars / totalTyped) * 100);
    accuracyEle.textContent = accuracy + "%";
  } else {
    accuracyEle.textContent = 100 + "%";
  }
}

function startTimer() {
  isTestActive = true;
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const timeLeft = MAX_TIME - elapsedSeconds;

    timeLeftEle.textContent = timeLeft + "s";
    updateStats();

    if (timeLeft <= 0) {
      endTest();
      timeLeftEle.textContent = "0s";
    }
  }, 1000);
}

// 4. Quote Cleaning, DOM Rendering & Keystroke Validation
function cleanQuote(text) {
  // Normalize curly apostrophes, quotes, and long dashes into standard keyboard characters
  return text.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, "-");
}

function renderQuote(quoteText) {
  quoteDisplayEle.innerHTML = "";
  // Use DocumentFragment to batch all span insertions into a single DOM reflow
  const fragment = document.createDocumentFragment();

  quoteText.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    if (index === 0) {
      span.classList.add("active");
    }
    fragment.appendChild(span);
  });

  quoteDisplayEle.appendChild(fragment);
}

function handleTyping() {
  playClickSound();
  if (!isTestActive && typingInputEle.value.length > 0) {
    startTimer();
  }

  const charSpans = quoteDisplayEle.querySelectorAll("span");
  const typedChars = typingInputEle.value.split("");

  charSpans.forEach((charSpan, index) => {
    const typedChar = typedChars[index];

    charSpan.classList.remove("active");

    if (typedChar === undefined) {
      charSpan.classList.remove("correct", "incorrect");
    } else if (typedChar === charSpan.textContent) {
      charSpan.classList.add("correct");
      charSpan.classList.remove("incorrect");
    } else {
      charSpan.classList.add("incorrect");
      charSpan.classList.remove("correct");
    }
  });

  updateStats();

  if (typedChars.length >= charSpans.length) {
    endTest();
  }

  if (typedChars.length < charSpans.length) {
    charSpans[typedChars.length].classList.add("active");
  }
}

// 5. Async Quote Fetching & Event Listeners
async function getNewQuote() {
  quoteDisplayEle.textContent = "Loading quote...";
  let rawQuote = "";

  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    if (!response.ok) throw new Error("API failed");
    const data = await response.json();
    rawQuote = data.quote;
  } catch (e) {
    console.warn(e + " - fallback is being used.");
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    rawQuote = FALLBACK_QUOTES[randomIndex];
  } finally {
    const cleanedQuote = cleanQuote(rawQuote);
    renderQuote(cleanedQuote);
    typingInputEle.value = "";
    resetTest();
  }
}

typingInputEle.addEventListener("paste", (e) => {
  e.preventDefault();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    getNewQuote();
  }
});
soundBtnEle.addEventListener("click", () => {
  isSoundEnabled = !isSoundEnabled;
  soundBtnEle.textContent = isSoundEnabled === true ? "Sound: ON" : "Sound: OFF";
  typingInputEle.focus();
});
themeBtnEle.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  localStorage.setItem("typepulse_theme", currentTheme);
  themeBtnEle.textContent = `Theme: ${currentTheme === "dark" ? "Dark" : "Light"}`;
  typingInputEle.focus();
});
restartBtnEle.addEventListener("click", getNewQuote);
quoteDisplayEle.addEventListener("click", () => {
  typingInputEle.focus();
});
typingInputEle.addEventListener("input", handleTyping);

getNewQuote();
