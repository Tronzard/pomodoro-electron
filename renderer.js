let m = 25;
let s = 0;

const el = document.getElementById("timer");

function update() {
  el.textContent =
    String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

setInterval(() => {
  if (s === 0) {
    if (m === 0) return;
    m--;
    s = 59;
  } else {
    s--;
  }
  update();
}, 1000);

update();

const tomato = document.querySelector(".tomato");
const glassCard = document.querySelector(".glass-card");
const widget = document.querySelector(".widget");

tomato.style.cursor = "grab";

let dragging = false;
let lastX = 0;
let lastY = 0;
let dragMoved = false;

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
  (e) => {
    if (dragMoved) {
      dragMoved = false;
      return;
    }
    glassCard.classList.toggle("collapsed");
  },
  true,
);
