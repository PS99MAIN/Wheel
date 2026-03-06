const sectors = [
  { color: "#FFD600", text: "#000000", label: "Light" },
  { color: "#212121", text: "#ffffff", label: "Dark" }
];

const spinEl = document.querySelector("#spin");
const wheel = document.querySelector("#wheel");
const ctx = wheel.getContext("2d");

const PI = Math.PI;
const TAU = PI * 2;

const size = wheel.width;
const radius = size / 2;

const total = sectors.length;
const arc = TAU / total;

let angle = 0;
let spinning = false;

let forcedResult = null;

// DETECTAR TECLAS
document.addEventListener("keydown", (e) => {

  const key = e.key.toLowerCase();

  if (key === "l") {
    forcedResult = "Light";
    console.log('TECLA PRESIONADA: "L" RESULTADO = LIGHT');
  }

  if (key === "d") {
    forcedResult = "Dark";
    console.log('TECLA PRESIONADA: "D" RESULTADO = DARK');
  }

});

function drawWheel() {

  sectors.forEach((sector, i) => {

    const ang = arc * i;

    ctx.beginPath();
    ctx.fillStyle = sector.color;

    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, ang, ang + arc);
    ctx.lineTo(radius, radius);
    ctx.fill();

    ctx.save();

    ctx.translate(radius, radius);
    ctx.rotate(ang + arc / 2);

    ctx.textAlign = "right";
    ctx.fillStyle = sector.text;
    ctx.font = "bold 32px sans-serif";

    ctx.fillText(sector.label, radius - 15, 10);

    ctx.restore();

  });

}

function getIndex() {

  const normalized = ((angle % TAU) + TAU) % TAU;

  return Math.floor(total - normalized / TAU * total) % total;

}

function updateUI() {

  const sector = sectors[getIndex()];

  spinEl.textContent =
    spinning ? sector.label : "SPIN";

  spinEl.style.background = sector.color;
  spinEl.style.color = sector.text;

}

function rotateWheel() {

  wheel.style.transform =
    `rotate(${angle - PI / 2}rad)`;

  updateUI();

}

function spinTo(target) {

  spinning = true;

  const start = angle;
  const duration = 3000;

  const startTime = performance.now();

  function animate(time) {

    const progress =
      Math.min((time - startTime) / duration, 1);

    const ease =
      1 - Math.pow(1 - progress, 3);

    angle =
      start + (target - start) * ease;

    rotateWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {

      angle = target % TAU;
      spinning = false;

      rotateWheel();

    }

  }

  requestAnimationFrame(animate);

}

spinEl.addEventListener("click", () => {

  if (spinning) return;

  let resultIndex;

  if (forcedResult) {
    resultIndex = sectors.findIndex(
      s => s.label === forcedResult
    );
  } else {
    resultIndex =
      Math.floor(Math.random() * sectors.length);
  }

  const finalAngle =
    TAU - (resultIndex * arc + arc / 2);

  const extraSpins =
    TAU * (4 + Math.floor(Math.random() * 3));

  const target =
    angle + extraSpins + finalAngle;

  spinTo(target);

  forcedResult = null;

});

drawWheel();
rotateWheel();
