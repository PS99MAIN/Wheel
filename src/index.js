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


// TECLAS
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


// DIBUJAR RULETA
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


// ROTAR RULETA
function rotateWheel() {

  wheel.style.transform = `rotate(${angle}rad)`;

}


// ANIMACIÓN DE GIRO
function spinTo(targetAngle) {

  spinning = true;

  const start = angle;
  const duration = 3000;
  const startTime = performance.now();

  function animate(time) {

    const progress = Math.min((time - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    angle = start + (targetAngle - start) * ease;

    rotateWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      angle = targetAngle % TAU;
      spinning = false;
    }

  }

  requestAnimationFrame(animate);

}


// CLICK SPIN
spinEl.addEventListener("click", () => {

  if (spinning) return;

  let index;

  if (forcedResult) {

    index = sectors.findIndex(
      s => s.label === forcedResult
    );

  } else {

    index = Math.floor(Math.random() * sectors.length);

  }

  const sectorCenter = index * arc + arc / 2;

  const spins = TAU * (4 + Math.floor(Math.random() * 3));

  const targetAngle = spins + (TAU - sectorCenter);

  spinTo(targetAngle);

  forcedResult = null;

});


drawWheel();
rotateWheel();
