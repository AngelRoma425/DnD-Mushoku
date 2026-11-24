// Dibuja las imágenes de los mapas del tutorial (tutorial/assets/*.jpg) a partir de src/tutorial/mapas.mjs.
// Uso: node tools/tutorial-mapas.mjs   (necesita Playwright con Chromium; solo hace falta al cambiar los mapas)
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { GRID as G, CAMPO, ARENA, arenaMuros } from "../src/tutorial/mapas.mjs";

const out = path.resolve(import.meta.dirname, "..", "tutorial", "assets");
fs.mkdirSync(out, { recursive: true });

const defs = `
<defs>
  <filter id="ruido" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="7"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="grano" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="sombra" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="6" dy="8" stdDeviation="7" flood-color="#000" flood-opacity="0.55"/>
  </filter>
  <pattern id="losas" width="${G}" height="${G}" patternUnits="userSpaceOnUse">
    <rect width="${G}" height="${G}" fill="#8a8273"/>
    <path d="M0 50H100M50 0V50M25 50V100M75 50V100" stroke="#6b6458" stroke-width="3"/>
    <rect x="3" y="3" width="44" height="44" fill="#958d7d" opacity="0.6"/>
    <rect x="53" y="53" width="19" height="44" fill="#7d7668" opacity="0.5"/>
  </pattern>
  <pattern id="madera" width="${G}" height="${G / 4}" patternUnits="userSpaceOnUse">
    <rect width="${G}" height="${G / 4}" fill="#7a5532"/>
    <path d="M0 ${G / 4 - 1}H${G}M60 0V${G / 4}" stroke="#4e341d" stroke-width="2"/>
  </pattern>
  <radialGradient id="arena" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#e3c690"/><stop offset="0.8" stop-color="#cfab6c"/><stop offset="1" stop-color="#a98446"/>
  </radialGradient>
  <radialGradient id="brillo" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#ffe9a0" stop-opacity="0.8"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/>
  </radialGradient>
</defs>`;

const texto = (x, y, t, size = 42, fill = "#f4e9cf") =>
  `<text x="${x}" y="${y}" font-family="Georgia, 'DejaVu Serif', serif" font-size="${size}" font-weight="bold" fill="${fill}" stroke="#1d150c" stroke-width="${size / 7}" paint-order="stroke" text-anchor="middle">${t}</text>`;
const marcador = (x, y, n) =>
  `<g filter="url(#sombra)"><circle cx="${x}" cy="${y}" r="30" fill="#7b1f1f" stroke="#f4e9cf" stroke-width="5"/>${texto(x, y + 13, n, 38)}</g>`;
const arbol = (x, y, r = 70) => `<g filter="url(#sombra)">
  <circle cx="${x}" cy="${y}" r="${r}" fill="#2f5a24"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.25}" r="${r * 0.6}" fill="#3d7230"/>
  <circle cx="${x + r * 0.3}" cy="${y + r * 0.2}" r="${r * 0.5}" fill="#376a2b"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.25}" fill="#4f8a3c"/></g>`;
const diana = (x, y) => `<g filter="url(#sombra)">${[45, 34, 23, 12].map((r, i) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? "#f1e6d0" : "#a12a22"}"/>`).join("")}</g>`;

function campo() {
  const { width: W, height: H, edificio: e, salas, muros, dianas, arboles, estanque: est, cofre } = CAMPO;
  const px = v => v * G;
  let s = `<rect width="${px(W)}" height="${px(H)}" fill="#557a3a"/>
  <rect width="${px(W)}" height="${px(H)}" fill="#2c4a1c" filter="url(#ruido)"/>
  <path d="M0 ${px(9.5)} C ${px(3)} ${px(9.2)}, ${px(6)} ${px(5.8)}, ${px(10)} ${px(5.5)}" stroke="#a48b62" stroke-width="${G * 1.3}" fill="none" stroke-linecap="round" opacity="0.85"/>
  <ellipse cx="${px(est.x)}" cy="${px(est.y)}" rx="${px(est.rx)}" ry="${px(est.ry)}" fill="#2e5f7d" stroke="#6b5a3a" stroke-width="14"/>
  <ellipse cx="${px(est.x) - 40}" cy="${px(est.y) - 25}" rx="${px(est.rx) * 0.5}" ry="${px(est.ry) * 0.3}" fill="#5d93b3" opacity="0.5"/>`;
  s += dianas.map(d => diana(px(d.x), px(d.y))).join("");
  s += `<rect x="${px(e.x0)}" y="${px(e.y0)}" width="${px(e.x1 - e.x0)}" height="${px(e.y1 - e.y0)}" fill="url(#losas)" filter="url(#sombra)"/>`;
  // Sala oscura: suelo más sucio; tesoro: madera y brillo.
  const osc = salas.find(r => r.id === "oscura"), tes = salas.find(r => r.id === "tesoro"), alm = salas.find(r => r.id === "almacen");
  s += `<rect x="${px(osc.x0)}" y="${px(osc.y0)}" width="${px(osc.x1 - osc.x0)}" height="${px(osc.y1 - osc.y0)}" fill="#3a352c" opacity="0.45"/>`;
  s += `<rect x="${px(alm.x0)}" y="${px(alm.y0)}" width="${px(alm.x1 - alm.x0)}" height="${px(alm.y1 - alm.y0)}" fill="url(#madera)"/>`;
  s += `<rect x="${px(tes.x0)}" y="${px(tes.y0)}" width="${px(tes.x1 - tes.x0)}" height="${px(tes.y1 - tes.y0)}" fill="#6d5b7a" opacity="0.35"/>`;
  s += `<rect x="${px(e.x0)}" y="${px(e.y0)}" width="${px(e.x1 - e.x0)}" height="${px(e.y1 - e.y0)}" fill="#000" filter="url(#grano)" opacity="0.6"/>`;
  // Cajas del almacén
  for (const [x, y] of [[25.2, 2.3], [26.4, 2.3], [25.2, 3.5], [28, 8.6], [28, 7.4]])
    s += `<g filter="url(#sombra)"><rect x="${px(x)}" y="${px(y)}" width="${G * 0.9}" height="${G * 0.9}" fill="#9b6b3c" stroke="#4e341d" stroke-width="6"/><path d="M${px(x)} ${px(y)}l${G * 0.9} ${G * 0.9}M${px(x) + G * 0.9} ${px(y)}l${-G * 0.9} ${G * 0.9}" stroke="#4e341d" stroke-width="5"/></g>`;
  // Mesa y bancos del vestíbulo
  s += `<g filter="url(#sombra)"><rect x="${px(12.5)}" y="${px(5.2)}" width="${G * 2}" height="${G * 1.6}" rx="10" fill="#7a5532" stroke="#3e2a16" stroke-width="6"/></g>`;
  // Columnas de la sala de las puertas
  for (const [x, y] of [[18.5, 3.5], [22.5, 3.5], [18.5, 8.5], [22.5, 8.5]])
    s += `<circle cx="${px(x)}" cy="${px(y)}" r="28" fill="#b3aa98" stroke="#4a443a" stroke-width="6" filter="url(#sombra)"/>`;
  // Cofre y brillo del tesoro
  s += `<circle cx="${px(cofre.x)}" cy="${px(cofre.y)}" r="150" fill="url(#brillo)"/>
  <g filter="url(#sombra)"><rect x="${px(cofre.x) - 45}" y="${px(cofre.y) - 32}" width="90" height="64" rx="8" fill="#8a5a22" stroke="#3b2208" stroke-width="6"/>
  <rect x="${px(cofre.x) - 45}" y="${px(cofre.y) - 8}" width="90" height="10" fill="#e0b13c"/><rect x="${px(cofre.x) - 8}" y="${px(cofre.y) - 14}" width="16" height="20" fill="#e0b13c"/></g>`;
  // Huesos y telarañas en la sala oscura
  s += `<path d="M${px(11)} ${px(17.9)} q 60 -90 150 -100 M${px(11)} ${px(17.9)} q 30 -40 90 -150" stroke="#ddd" stroke-width="2" fill="none" opacity="0.5"/>
  <g stroke="#d9d2c0" stroke-width="10" stroke-linecap="round"><path d="M${px(16)} ${px(15)}l70 30"/><path d="M${px(16.2)} ${px(15.6)}l40 -45"/></g>`;
  // Muros, puertas y ventanas
  for (const [x0, y0, x1, y1, t] of muros) {
    const a = `x1="${px(x0)}" y1="${px(y0)}" x2="${px(x1)}" y2="${px(y1)}"`;
    if (t === "wall" || t === "secret") s += `<line ${a} stroke="#2a2621" stroke-width="22" stroke-linecap="square"/><line ${a} stroke="#4d463c" stroke-width="10" stroke-linecap="square"/>`;
    if (t === "secret") s += `<line ${a} stroke="#3a342c" stroke-width="4" stroke-dasharray="6 18"/>`;
    if (t === "window") s += `<line ${a} stroke="#2a2621" stroke-width="22"/><line ${a} stroke="#9fd2e8" stroke-width="10"/>`;
    if (t === "door" || t === "locked") {
      s += `<line ${a} stroke="#2a2621" stroke-width="26"/><line ${a} stroke="${t === "locked" ? "#5a3a1e" : "#8b5e34"}" stroke-width="16"/>`;
      if (t === "locked") s += `<line ${a} stroke="#7d7d7d" stroke-width="16" stroke-dasharray="8 22"/><circle cx="${px((x0 + x1) / 2)}" cy="${px((y0 + y1) / 2)}" r="9" fill="#d4b13c" stroke="#222" stroke-width="3"/>`;
    }
  }
  s += arboles.map(([x, y]) => arbol(px(x), px(y))).join("");
  // Rótulos
  for (const r of salas) s += texto(px((r.x0 + r.x1) / 2), px(r.y0) + 70, r.nombre, 36);
  s += texto(px(5), px(0.9) + 40, "Patio de Entrenamiento", 46);
  s += marcador(px(6.5), px(11.8), 1);
  for (const r of salas) s += marcador(px(r.x0) + 55, px(r.y1) - 55, r.n);
  return { w: px(W), h: px(H), svg: s };
}

function arena() {
  const { width: W, height: H, elipse: e, pilares } = ARENA;
  const px = v => v * G;
  let s = `<rect width="${px(W)}" height="${px(H)}" fill="url(#losas)"/>
  <rect width="${px(W)}" height="${px(H)}" fill="#000" filter="url(#grano)" opacity="0.7"/>
  <rect width="${px(W)}" height="${px(H)}" fill="#1b1712" opacity="0.35"/>
  <ellipse cx="${px(e.cx)}" cy="${px(e.cy)}" rx="${px(e.rx) + 25}" ry="${px(e.ry) + 25}" fill="#3a3229" filter="url(#sombra)"/>
  <ellipse cx="${px(e.cx)}" cy="${px(e.cy)}" rx="${px(e.rx)}" ry="${px(e.ry)}" fill="url(#arena)"/>
  <ellipse cx="${px(e.cx)}" cy="${px(e.cy)}" rx="${px(e.rx)}" ry="${px(e.ry)}" fill="#6b4a1c" filter="url(#ruido)" opacity="0.6"/>
  <circle cx="${px(e.cx)}" cy="${px(e.cy)}" r="120" fill="none" stroke="#8d6a36" stroke-width="10" stroke-dasharray="30 20" opacity="0.7"/>`;
  const pts = arenaMuros().map(([x, y]) => `${px(x)},${px(y)}`).join(" ");
  s += `<polygon points="${pts}" fill="none" stroke="#2a2621" stroke-width="24"/><polygon points="${pts}" fill="none" stroke="#5c5346" stroke-width="12"/>`;
  for (const [x, y] of pilares)
    s += `<g filter="url(#sombra)"><rect x="${px(x)}" y="${px(y)}" width="${G}" height="${G}" fill="#9a917f" stroke="#2a2621" stroke-width="10"/><rect x="${px(x) + 18}" y="${px(y) + 18}" width="${G - 36}" height="${G - 36}" fill="#b6ad9a"/></g>`;
  // Banderas en las esquinas
  for (const [x, y, c] of [[1.2, 1.2, "#7b1f1f"], [22.8, 1.2, "#1f4e79"], [1.2, 14.8, "#1f4e79"], [22.8, 14.8, "#7b1f1f"]])
    s += `<g filter="url(#sombra)"><circle cx="${px(x)}" cy="${px(y)}" r="40" fill="${c}" stroke="#d4b13c" stroke-width="6"/></g>`;
  s += texto(px(W / 2), px(0.55) + 10, "Arena de Combate", 48);
  return { w: px(W), h: px(H), svg: s };
}

function portada() {
  const c = campo();
  return { w: 1280, h: 720, svg: `<svg x="0" y="0" width="1280" height="720" viewBox="600 0 ${c.w - 600} ${c.h * 0.9}" preserveAspectRatio="xMidYMid slice">${c.svg}</svg>
    <rect width="1280" height="720" fill="#120d08" opacity="0.55"/>
    ${texto(640, 330, "Tutorial de Foundry", 92)}
    ${texto(640, 430, "Aprende a jugar en la mesa virtual", 48, "#e6c77a")}` };
}

const { chromium } = createRequire(import.meta.url)("playwright");
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, { w, h, svg }] of Object.entries({ campo: campo(), arena: arena(), portada: portada() })) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${defs}${svg}</svg></body></html>`);
  await page.screenshot({ path: path.join(out, `${name}.jpg`), type: "jpeg", quality: 82 });
  console.log(`✔ tutorial/assets/${name}.jpg (${w}×${h})`);
}
await browser.close();
