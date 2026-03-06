const sectors = [
  { color: "#FFD600", text: "#000000", label: "Light" },
  { color: "#212121", text: "#ffffff", label: "Dark" },
];

const rand = (m, M) => Math.random() * (M - m) + m;

const tot = sectors.length;
const spinEl = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext("2d");

const dia = ctx.canvas.width;
const rad = dia / 2;

const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / tot;

const friction = 0.991;

let angVel = 0;
let ang = 0;

let forcedIndex = null;

// teclas para forzar resultado
document.addEventListener("keydown", (e) => {

  if (e.key.toLowerCase() === "l") {
    forcedIndex = 0;
    console.log("Resultado forzado: LIGHT");
  }

  if (e.key.toLowerCase() === "d") {
    forcedIndex = 1;
    console.log("Resultado forzado: DARK");
  }

});

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
  ctx.font = "bold 30px sans-serif";
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

  // cuando la rueda se está deteniendo
  if (angVel < 0.002) {

    if (forcedIndex !== null) {

      const finalAngle =
        TAU - (forcedIndex * arc + arc / 2);

      ang = finalAngle;

      forcedIndex = null;
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

      angVel = rand(0.25, 0.45);

    }

  });
}

init();
