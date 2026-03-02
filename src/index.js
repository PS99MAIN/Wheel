const sectors = [
  { color: "#FFD600", text: "#000000", label: "Light" },
  { color: "#212121", text: "#ffffff", label: "Dark" },
];

const events = {
  listeners: {},
  addListener: function (eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
  },
  fire: function (eventName, ...args) {
    if (this.listeners[eventName]) {
      for (let fn of this.listeners[eventName]) {
        fn(...args);
      }
    }
  },
};

const rand = (m, M) => Math.random() * (M - m) + m;
const tot = sectors.length;
const spinEl = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext("2d");
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;

const friction = 0.991;
let angVel = 0;
let ang = 0;

let spinButtonClicked = false;
let forcedIndex = null;

// 🎮 CONTROL POR TECLA
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "l") {
    forcedIndex = 0;
    console.log("⚠ Resultado FORZADO: Light (Modo demo)");
  }
  if (e.key.toLowerCase() === "d") {
    forcedIndex = 1;
    console.log("⚠ Resultado FORZADO: Dark (Modo demo)");
  }
});

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();

  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = sector.text;
  ctx.font = "bold 30px sans-serif";
  ctx.fillText(sector.label, rad - 10, 10);

  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

  spinEl.textContent = !angVel ? "SPIN" : sector.label;
  spinEl.style.background = sector.color;
  spinEl.style.color = sector.text;
}

function frame() {
  if (!angVel && spinButtonClicked) {
    const finalSector = sectors[getIndex()];
    events.fire("spinEnd", finalSector);
    spinButtonClicked = false;
    return;
  }

  angVel *= friction;
  if (angVel < 0.002) angVel = 0;
  ang += angVel;
  ang %= TAU;
  rotate();
}

function engine() {
  frame();
  requestAnimationFrame(engine);
}

function init() {
  sectors.forEach(drawSector);
  rotate();
  engine();

  spinEl.addEventListener("click", () => {
    if (!angVel) {
      if (forcedIndex !== null) {
        // 🎯 Ángulo base del sector
const baseAngle = forcedIndex * arc;

// 🎲 Offset aleatorio dentro del sector (sin salirse)
const randomOffset = Math.random() * (arc * 0.8) + (arc * 0.1);

// 🎯 Ángulo final natural
const targetAngle = TAU - (baseAngle + randomOffset);

// Le agregamos vueltas extra para que no se vea directo
const extraSpins = TAU * (3 + Math.floor(Math.random() * 3));

ang = targetAngle + extraSpins;
angVel = 0.35;
        console.log("⚠ MODO DEMO — Resultado no aleatorio");
        forcedIndex = null;
      } else {
        angVel = rand(0.25, 0.45);
      }
    }
    spinButtonClicked = true;
  });
}

init();

events.addListener("spinEnd", (sector) => {
  console.log(`Resultado final: ${sector.label}`);
});
