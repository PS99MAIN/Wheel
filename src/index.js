const sectors = [
  { color: "#FFD600", text: "#000000", label: "Light" },
  { color: "#212121", text: "#ffffff", label: "Dark" },
];

const spinEl = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext("2d");

const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;

const tot = sectors.length;
const arc = TAU / tot;

let ang = 0;
let angVel = 0;

const friction = 0.991;

let forcedMode = null; // "light" o "dark"
let targetAngle = null;

document.addEventListener("keydown", (e) => {

  if (e.key.toLowerCase() === "l") {
    forcedMode = "light";
    console.log("Modo forzado: LIGHT");
  }

  if (e.key.toLowerCase() === "d") {
    forcedMode = "dark";
    console.log("Modo forzado: DARK");
  }

});

const rand = (m, M) => Math.random() * (M - m) + m;

const getIndex = () =>
  Math.floor(tot - (ang / TAU) * tot) % tot;

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
  ctx.font = "bold 32px sans-serif";
  ctx.fillText(sector.label, rad - 10, 10);

  ctx.restore();
}

function rotate() {

  const sector = sectors[getIndex()];

  ctx.canvas.style.transform =
    `rotate(${ang - PI / 2}rad)`;

  spinEl.textContent =
    !angVel ? "SPIN" : sector.label;

  spinEl.style.background = sector.color;
  spinEl.style.color = sector.text;
}

function frame() {

  angVel *= friction;

  if (angVel < 0.002) {

    if (targetAngle !== null) {
      ang = targetAngle;
      targetAngle = null;
    }

    angVel = 0;
  }

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

      if (forcedMode !== null) {

        const forcedIndex =
          forcedMode === "light" ? 0 : 1;

        const baseAngle = forcedIndex * arc;

        const randomOffset =
          arc * 0.2 + Math.random() * arc * 0.6;

        const finalAngle =
          TAU - (baseAngle + randomOffset);

        const extraSpins =
          TAU * (4 + Math.floor(Math.random() * 3));

        targetAngle = finalAngle + extraSpins;

      }

      angVel = rand(0.25, 0.45);

    }

  });
}

init();
