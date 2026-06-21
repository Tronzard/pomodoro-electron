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
