// Tablas aleatorias de la campaña (RollTable), con los rangos del documento de lore.
import { uuid } from "../../tools/helpers.mjs";

const PACK = "mt-campana-objetos";
const texto = (lo, hi, description) => ({ type: "text", range: [lo, hi], weight: hi - lo + 1, drawn: false, img: "icons/svg/d20-black.svg", name: "", description, flags: {} });
const objeto = (lo, hi, name) => ({ type: "document", range: [lo, hi], weight: hi - lo + 1, drawn: false, img: "icons/svg/item-bag.svg", name, documentUuid: uuid(PACK, "Item", name), description: "", flags: {} });

function tabla(name, { folder, formula = "1d20", description = "", results }) {
  return { name, folder, img: "icons/svg/d20-grey.svg", description, formula, replacement: true, displayRoll: true, results, flags: {} };
}

const metro = (jugador, comun, pocoComun) => tabla(`Metro: botín de ${jugador}`, {
  folder: "Laberinto del Metro",
  description: `<p>Tirada de Investigación de ${jugador} en el laberinto del Metro.</p>`,
  results: [
    texto(1, 9, "Nada."),
    objeto(10, 13, comun),
    objeto(14, 17, pocoComun),
    texto(18, 20, "El documento no define este resultado: elige uno de los dos objetos o premia al jugador a tu criterio.")
  ]
});

const TABERNA = [
  "Juguete de Madera Tallado", "Moneda Desconocida", "Llave Maestra Oxidada", "Cuerda de Arena Trenzada", "Daga con Contrapeso", null,
  "Escudo Marcador", "Chaleco de Escamas Recuperadas", "Ballesta Ligera de Carga Rápida", "Hoja con Filo Cansado", "Escudo de Núcleo Triple",
  "Coraza de Placas Mixtas", "Anillo de Estabilidad", "Arco Corto de Tendón Reforzado", "Armadura del Custodio Caído", "Farol de Luz Lunar",
  "Fragmento de Armadura Florecida", "Mapa de Contrabando del Gran Bosque", "Botas del Paso Silente", "Proyectiles Explosivos (x20)"
];

export default [
  metro("Cuyo", "Núcleo Óseo Palpitante", "Implante Ocular de la Percepción de la Muerte"),
  metro("Luka", "Daga de Punta de Medianoche", "Faja del Duelista Solitario"),
  metro("Twister", "Ampolla de Sangre Coagulada", "Guante Escamado del Juramento de Sangre"),
  metro("Nozu", "Semilla del Despertar", "Broche de Savia Dulce"),
  metro("Neon", "Válvula Reguladora de Presión", "Placa de la Marcha Fúnebre"),

  tabla("Taberna Oculta: ¿cuántos objetos?", {
    folder: "Rikarisu",
    description: "<p>Tirada de Investigación en la taberna oculta. Después tira en «Taberna Oculta: botín» tantas veces como objetos.</p>",
    results: [
      texto(1, 1, "Nada, y deben tirar Sigilo para no alertar a los guardias."),
      texto(2, 9, "Nada."),
      texto(10, 14, "1 objeto."),
      texto(15, 19, "2 objetos."),
      texto(20, 20, "3 objetos.")
    ]
  }),
  tabla("Taberna Oculta: botín", {
    folder: "Rikarisu",
    results: TABERNA.map((n, i) => n ? objeto(i + 1, i + 1, n) : texto(i + 1, i + 1, "Nada (casilla vacía en el documento)."))
  }),
  tabla("Caravanas destruidas", {
    folder: "La Muda del Desierto",
    description: "<p>Investigar las caravanas destruidas camino al laberinto.</p>",
    results: [
      texto(1, 1, "Reciben daño."),
      texto(2, 5, "5 a 10 de oro/huesos, o 2 a 5 hojas/flores poco comunes."),
      texto(6, 9, "15 a 30 de oro/huesos, o 10 a 15 hojas/flores poco comunes."),
      texto(10, 14, "10 hojas/flores raras, 30 de oro y 10 huesos anómalos."),
      texto(15, 19, "20 hojas/flores raras, 50 de oro y 20 huesos anómalos."),
      objeto(20, 20, "Núcleo Anómalo Apagado")
    ]
  })
];
