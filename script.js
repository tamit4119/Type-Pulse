const quoteDisplayEle = document.getElementById("quote-display");
const restartButtonEle = document.getElementById("restart-btn");
const typingInputEle = document.getElementById("typing-input");
const FALLBACK_QUOTES = [
  "Success is not achieved overnight; it comes from consistent effort, patience, and the courage to keep moving forward.",
  "Every small step you take today brings you closer to the person you want to become tomorrow.",
  "Do not let temporary failures define your future; learn from your mistakes and use them as opportunities to grow.",
  "Discipline is choosing what matters most over what feels comfortable, even when nobody is watching.",
  "Believe in your ability to improve, stay curious, and remember that progress is more important than perfection.",
];

function cleanQuote(text) {
  return text.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, "-");
}

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
    quoteDisplayEle.textContent = cleanedQuote;
    typingInputEle.value = "";
    typingInputEle.focus();
  }
}

restartButtonEle.addEventListener("click", getNewQuote);
getNewQuote();
