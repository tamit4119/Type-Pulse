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

function renderQuote(quoteText) {
  quoteDisplayEle.innerHTML = "";
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

  if (typedChars.length < charSpans.length) {
    charSpans[typedChars.length].classList.add("active");
  }
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
    renderQuote(cleanedQuote);
    typingInputEle.value = "";
    typingInputEle.focus();
  }
}

restartButtonEle.addEventListener("click", getNewQuote);
quoteDisplayEle.addEventListener("click", () => {
  typingInputEle.focus();
});
typingInputEle.addEventListener("input", handleTyping);
getNewQuote();
