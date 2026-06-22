const FOCUS_MIN = 1,
  FOCUS_MAX = 60,
  FOCUS_STEP = 1;
const BREAK_MIN = 5,
  BREAK_MAX = 20,
  BREAK_STEP = 1;

// SVG icon
const ICON_PLAY = `<svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L9 5.5L1 9.5V1.5Z" fill="white"/></svg>`;
const ICON_PAUSE = `<svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="3" height="9" rx="1" fill="white"/><rect x="6" y="1" width="3" height="9" rx="1" fill="white"/></svg>`;

//  state
let focusMin = 25;
let breakMin = 5;
let phase = "focus";
let running = false;
let m = 0,
  s = 0;
let intervalId = null;

// --- DOM ---
const timerEl = document.getElementById("timer");
const startBtn = document.querySelector(".start-btn");
const resetBtn = document.querySelector(".reset-btn");
const startIcon = startBtn.querySelector(".icon");
const startLabel = startBtn.querySelector(".start-label");
const titleEl = document.querySelector(".title");
const focusDurEl = document.getElementById("focus-duration");
const breakDurEl = document.getElementById("break-duration");
const glassCard = document.querySelector(".glass-card");
const tomato = document.querySelector(".tomato");
const widget = document.querySelector(".widget");

const alarm = new Audio("./assets/timeout.mp3");
alarm.volume = 1.0;

function renderTimer() {
  timerEl.textContent =
    String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function renderCounters() {
  focusDurEl.textContent = focusMin + " min";
  breakDurEl.textContent = breakMin + " min";
}

function renderPhase() {
  titleEl.textContent = phase === "focus" ? "Focus" : "Break";
  glassCard.classList.toggle("phase-break", phase === "break");
}

//  state transitions
function toStopped() {
  running = false;
  phase = "focus";
  clearInterval(intervalId);
  intervalId = null;
  m = 0;
  s = 0;
  renderTimer();
  renderPhase();
  startIcon.innerHTML = ICON_PLAY;
  startLabel.textContent = "Start";
  glassCard.classList.remove("running");
}

function nextPhase() {
  // flip phase
  phase = phase === "focus" ? "break" : "focus";
  m = phase === "focus" ? focusMin : breakMin;
  s = 0;

  alarm.currentTime = 0;
  alarm.play();
  renderTimer();
  renderPhase();
}

function startInterval() {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (s === 0) {
      if (m === 0) {
        nextPhase();
        return;
      }
      m--;
      s = 59;
    } else {
      s--;
    }
    renderTimer();
  }, 1000);
}

function toRunning() {
  //  start 00:00
  if (m === 0 && s === 0) {
    m = focusMin;
    s = 0;
  }
  running = true;
  renderTimer();
  startIcon.innerHTML = ICON_PAUSE;
  startLabel.textContent = "Pause";
  glassCard.classList.add("running");
  startInterval();
}

function toggleRunning() {
  if (running) {
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    startIcon.innerHTML = ICON_PLAY;
    startLabel.textContent = "Resume";
  } else {
    toRunning();
  }
}

startBtn.addEventListener("click", toggleRunning);
resetBtn.addEventListener("click", toStopped);

document.querySelectorAll(".counter").forEach((counter) => {
  const type = counter.dataset.type;
  counter.querySelectorAll(".increment-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (running) return;
      const dir = parseInt(btn.dataset.dir, 10);
      if (type === "focus") {
        focusMin = Math.min(
          FOCUS_MAX,
          Math.max(FOCUS_MIN, focusMin + dir * FOCUS_STEP),
        );
      } else {
        breakMin = Math.min(
          BREAK_MAX,
          Math.max(BREAK_MIN, breakMin + dir * BREAK_STEP),
        );
      }
      renderCounters();
    });
  });
});

//  drag
let dragging = false;
let lastX = 0,
  lastY = 0;
let dragMoved = false;

tomato.style.cursor = "grab";

widget.addEventListener("mousedown", (e) => {
  if (e.target.closest("button") || e.target.closest("input")) return;
  dragging = true;
  dragMoved = false;
  lastX = e.screenX;
  lastY = e.screenY;
  tomato.style.cursor = "grabbing";
  e.preventDefault();
});

window.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  const dx = e.screenX - lastX;
  const dy = e.screenY - lastY;
  if (dx !== 0 || dy !== 0) {
    dragMoved = true;
    window.api.moveWindow(dx, dy);
    lastX = e.screenX;
    lastY = e.screenY;
  }
});

window.addEventListener("mouseup", () => {
  if (!dragging) return;
  dragging = false;
  tomato.style.cursor = "grab";
});

tomato.addEventListener(
  "click",
  () => {
    if (dragMoved) {
      dragMoved = false;
      return;
    }

    tomato.classList.remove("bounce");
    void tomato.offsetWidth;
    tomato.classList.add("bounce");

    glassCard.classList.toggle("collapsed");
    window.api.resizeWindow();
  },
  true,
);

//  initialize
renderTimer();
renderCounters();
renderPhase();
