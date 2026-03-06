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
let spinning = false;

let targetAngle = 0;
let nextResult = null;

// teclas
document.addEventListener("keydown", (e) => {

  if (e.key.toLowerCase() === "l") {
    nextResult = "light";
    console.log("Siguiente giro: LIGHT");
  }

  if (e.key.toLowerCase() === "d") {
    nextResult = "dark";
    console.log("Siguiente giro: DARK");
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
    spinning ? sector.label : "SPIN";

  spinEl.style.background = sector.color;
  spinEl.style.color = sector.text;
}

function frame() {

  if (spinning) {

    const diff = targetAngle - ang;

    if (Math.abs(diff) < 0.002) {
      ang = targetAngle;
      spinning = false;
    } else {
      ang += diff * 0.08;
    }

  }

  rotate();
  requestAnimationFrame(frame);
}

function init() {

  sectors.forEach(drawSector);
  rotate();
  frame();

  spinEl.addEventListener("click", () => {

    if (!spinning) {

      let resultIndex;

      if (nextResult === "light") resultIndex = 0;
      else if (nextResult === "dark") resultIndex = 1;
      else resultIndex = Math.floor(Math.random() * sectors.length);

      const finalAngle =
        TAU - (resultIndex * arc + arc / 2);

      const extraSpins =
        TAU * (4 + Math.floor(Math.random() * 3));

      targetAngle = finalAngle + extraSpins;

      spinning = true;

      nextResult = null;

    }

  });

}

init();
