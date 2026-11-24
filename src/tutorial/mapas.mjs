// Geometría de los mapas del tutorial, en casillas (1 casilla = 100 px = 5 pies).
// La usan tanto src/tutorial.mjs (muros, luces, fichas) como tools/tutorial-mapas.mjs (dibuja las imágenes).

export const GRID = 100;

/** Escena 1: patio exterior + edificio con puertas de todo tipo y una sala a oscuras. */
export const CAMPO = {
  width: 30, height: 20,
  edificio: { x0: 10, y0: 2, x1: 29, y1: 18 },
  salas: [
    { id: "vestibulo", nombre: "Vestíbulo", n: 2, x0: 10, y0: 2, x1: 17, y1: 10 },
    { id: "puertas", nombre: "Sala de las Puertas", n: 3, x0: 17, y0: 2, x1: 24, y1: 10 },
    { id: "almacen", nombre: "Almacén", n: 4, x0: 24, y0: 2, x1: 29, y1: 10 },
    { id: "oscura", nombre: "Sala Oscura", n: 5, x0: 10, y0: 10, x1: 20, y1: 18 },
    { id: "tesoro", nombre: "Cámara del Tesoro", n: 6, x0: 20, y0: 10, x1: 29, y1: 18 }
  ],
  // [x0, y0, x1, y1, tipo]; tipo: wall | door | locked | secret | window
  muros: [
    [10, 2, 29, 2, "wall"], [29, 2, 29, 18, "wall"], [10, 18, 29, 18, "wall"],
    [10, 2, 10, 5, "wall"], [10, 5, 10, 6, "door"], [10, 6, 10, 8, "wall"], [10, 8, 10, 9, "window"], [10, 9, 10, 18, "wall"],
    [17, 2, 17, 5, "wall"], [17, 5, 17, 6, "door"], [17, 6, 17, 10, "wall"],
    [24, 2, 24, 5, "wall"], [24, 5, 24, 6, "locked"], [24, 6, 24, 10, "wall"],
    [10, 10, 13, 10, "wall"], [13, 10, 14, 10, "door"], [14, 10, 26, 10, "wall"], [26, 10, 27, 10, "door"], [27, 10, 29, 10, "wall"],
    [20, 10, 20, 13, "wall"], [20, 13, 20, 14, "secret"], [20, 14, 20, 18, "wall"]
  ],
  // Luces: casilla (puede ser decimal), radio brillante/tenue en pies.
  luces: [
    { x: 5, y: 10, bright: 50, dim: 65, color: "#fff4d6", anim: null },
    { x: 20, y: 0.8, bright: 25, dim: 40, color: "#fff4d6", anim: null },
    { x: 20, y: 19.2, bright: 25, dim: 40, color: "#fff4d6", anim: null },
    { x: 11.5, y: 3.5, bright: 15, dim: 30, color: "#ff9b42", anim: "torch" },
    { x: 15.5, y: 8.5, bright: 15, dim: 30, color: "#ff9b42", anim: "torch" },
    { x: 20.5, y: 6, bright: 20, dim: 35, color: "#ffe2b0", anim: null },
    { x: 26.5, y: 6, bright: 10, dim: 25, color: "#ff9b42", anim: "torch" },
    { x: 24.5, y: 14, bright: 10, dim: 30, color: "#ffd24a", anim: "pulse" }
  ],
  dianas: [{ x: 2.5, y: 2.5 }, { x: 2.5, y: 17.5 }],
  arboles: [[0.8, 6], [1.5, 13.8], [8.4, 1], [8.8, 18.6], [0.7, 19.2], [6.2, 0.6], [28, 0.6], [12, 19.3], [29.5, 19.3], [29.5, 12]],
  estanque: { x: 6.5, y: 15, rx: 1.8, ry: 1.1 },
  cofre: { x: 27.5, y: 16.5 },
  inicio: [[4, 9], [5, 9], [4, 10], [5, 10]]
};

/** Escena 2: arena de combate con pilares que dan cobertura. */
export const ARENA = {
  width: 24, height: 16,
  elipse: { cx: 12, cy: 8, rx: 11, ry: 7, lados: 32 },
  pilares: [[6, 4], [17, 4], [6, 11], [17, 11]],
  munecos: [[8, 7], [12, 6], [15, 8]],
  enemigos: [[10, 2], [13, 2]],
  inicio: [[10, 13], [11, 13], [12, 13], [13, 13]]
};

/** Segmentos del polígono de la arena, en casillas. */
export function arenaMuros() {
  const { cx, cy, rx, ry, lados } = ARENA.elipse;
  const pts = Array.from({ length: lados }, (_, i) => {
    const a = (i / lados) * Math.PI * 2;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
  return pts.map((p, i) => [...p, ...pts[(i + 1) % lados]]);
}
