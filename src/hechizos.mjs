// Hechizos inspirados en el sistema de magia de Mushoku Tensei.
// Niveles: Básico = truco/nv1 · Intermedio = nv2-3 · Avanzado = nv4-5
//          Superior = nv6 · Real = nv7 · Imperial = nv8 · Deidad = nv9
import { SOURCE, dmg, act, activities, attackActivity, saveActivity, healActivity, utilityActivity, html } from "../tools/helpers.mjs";

const rango = (r, escuela) =>
  `<p><strong>Hechizo de ${escuela} de nivel ${r}.</strong></p>`;

const chant = texto =>
  `<blockquote><p><em>Encantamiento:</em> «${texto}»</p></blockquote>`;

function spell(name, { level, school, img, range, target, duration = { value: "", units: "inst" }, activation = act(), properties = ["vocal", "somatic"], concentration = false, materials = "", description, acts = [] }) {
  const props = [...properties];
  if (concentration) props.push("concentration");
  return {
    name, type: "spell", img,
    system: {
      description: { value: description, chat: "" },
      source: SOURCE,
      activation, duration, level, school,
      properties: props,
      materials: { value: materials, consumed: false, cost: 0, supply: 0 },
      range: range ?? { value: "", units: "self", special: "" },
      target: target ?? { affects: { count: "1", type: "creature", choice: false, special: "" }, template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "ft" } },
      activities: activities(...acts.map(f => f(name)))
    }
  };
}

const ft = value => ({ value: String(value), units: "ft", special: "" });
const touch = { value: "", units: "touch", special: "" };
const one = (type = "creature") => ({ affects: { count: "1", type, choice: false, special: "" }, template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "ft" } });
const area = (type, size, extra = {}) => ({ affects: { count: "", type: "", choice: false, special: "" }, template: { count: "1", contiguous: false, type, size: String(size), width: extra.width ?? "", height: extra.height ?? "", units: "ft" } });
const noSlot = { targets: [], scaling: { allowed: false, max: "" }, spellSlot: false };
const minutes = (value, units = "minute") => ({ value: String(value), units });

export default [
  // ────────────────────────── TRUCOS (Básico) ──────────────────────────
  spell("Bola de Agua", {
    level: 0, school: "evo", img: "icons/svg/ice-aura.svg", range: ft(60), target: one(),
    description: html(
      rango("Básico", "Agua"),
      chant("Que el agua se reúna en mi palma y golpee como un puño: ¡Bola de Agua!"),
      "Condensas una esfera de agua del tamaño de un melón y la lanzas. Haz un ataque de conjuro a distancia. Si impacta, el objetivo recibe <strong>1d10 de daño contundente</strong> y, si es Grande o menor, es empujado 5 pies en dirección opuesta a ti. Cualquier llama no mágica que toque la esfera se apaga.",
      "<p><strong>Mejora de truco.</strong> El daño aumenta en 1d10 a nivel 5 (2d10), 11 (3d10) y 17 (4d10).</p>"
    ),
    acts: [n => attackActivity(n, { parts: [dmg(1, 10, "bludgeoning")] })]
  }),
  spell("Bala de Piedra", {
    level: 0, school: "evo", img: "icons/svg/statue.svg", range: ft(90), target: one(),
    description: html(
      rango("Básico", "Tierra"),
      chant("Piedra, endurécete y vuela: ¡Bala de Piedra!"),
      "Formas un proyectil de roca compacta con punta y lo disparas a gran velocidad. Haz un ataque de conjuro a distancia. Si impacta, el objetivo recibe <strong>1d10 de daño perforante</strong>.",
      "<p><strong>Mejora de truco.</strong> 2d10 a nivel 5, 3d10 a nivel 11 y 4d10 a nivel 17.</p>",
      "<p><em>Nota de mesa:</em> es la base del famoso <strong>Cañón de Piedra</strong>. Un mago con el rasgo <em>Control Fino del Maná</em> puede darle forma de bala giratoria.</p>"
    ),
    acts: [n => attackActivity(n, { parts: [dmg(1, 10, "piercing")] })]
  }),
  spell("Flecha de Fuego", {
    level: 0, school: "evo", img: "icons/svg/fire.svg", range: ft(120), target: one(),
    description: html(
      rango("Básico", "Fuego"),
      chant("Fuego que arde en lo profundo, toma forma de flecha: ¡Flecha de Fuego!"),
      "Una saeta de llamas sale disparada hacia una criatura u objeto. Haz un ataque de conjuro a distancia. Si impacta, recibe <strong>1d10 de daño de fuego</strong>. Los objetos inflamables que no se lleven puestos ni se transporten se prenden.",
      "<p><strong>Mejora de truco.</strong> 2d10 a nivel 5, 3d10 a nivel 11 y 4d10 a nivel 17.</p>"
    ),
    acts: [n => attackActivity(n, { parts: [dmg(1, 10, "fire")] })]
  }),
  spell("Cuchilla de Viento", {
    level: 0, school: "evo", img: "icons/svg/wing.svg", range: ft(30), target: one(),
    description: html(
      rango("Básico", "Viento"),
      chant("Viento que corta sin ser visto: ¡Cuchilla de Viento!"),
      "Comprimes el aire en una hoja invisible. Una criatura que puedas ver dentro del alcance debe superar una <strong>tirada de salvación de Destreza</strong> o recibir <strong>1d8 de daño cortante</strong>. Como la hoja es casi invisible, el objetivo tiene desventaja en la salvación si no te estaba mirando cuando lanzaste el conjuro.",
      "<p><strong>Mejora de truco.</strong> 2d8 a nivel 5, 3d8 a nivel 11 y 4d8 a nivel 17.</p>"
    ),
    acts: [n => saveActivity(n, { ability: "dex", onSave: "none", parts: [dmg(1, 8, "slashing")] })]
  }),
  spell("Manantial", {
    level: 0, school: "con", img: "icons/svg/aura.svg", range: ft(30), target: one("space"), duration: minutes(1, "hour"),
    description: html(
      rango("Básico", "Agua"),
      "El primer hechizo que aprende cualquier aprendiz de agua. Elige uno de los siguientes efectos:",
      "<ul><li>Creas hasta 10 galones de agua limpia en un recipiente abierto o como lluvia en un cubo de 30 pies, apagando llamas expuestas.</li><li>Calientas o enfrías un recipiente de agua de hasta 1 galón.</li><li>Limpias o empapas un objeto o criatura de tamaño Mediano o menor.</li></ul>"
    ),
    acts: [n => utilityActivity(n)]
  }),

  // ────────────────────────── NIVEL 1 (Básico) ──────────────────────────
  spell("Curación", {
    level: 1, school: "evo", img: "icons/svg/regen.svg", range: touch, target: one(),
    description: html(
      rango("Básico", "Curación"),
      chant("Luz suave que habita en el maná, cierra esta herida y devuelve el aliento: ¡Curación!"),
      "Una criatura que toques recupera <strong>1d8 + tu modificador por característica para lanzar conjuros</strong> puntos de golpe. Cierra cortes y heridas leves, pero no hace crecer extremidades perdidas.",
      "<p><strong>A niveles superiores.</strong> La curación aumenta en 1d8 por cada nivel de espacio por encima del 1.º.</p>"
    ),
    acts: [n => healActivity(n, dmg(1, 8, "healing", { bonus: "@mod", scaling: 1 }))]
  }),
  spell("Desintoxicación", {
    level: 1, school: "abj", img: "icons/svg/poison.svg", range: touch, target: one(), duration: minutes(1, "hour"),
    description: html(
      rango("Básico", "Desintoxicación"),
      "Tocas a una criatura y neutralizas un veneno que la esté afectando; si tenía la condición <em>Envenenado</em>, esta termina. Durante 1 hora tiene ventaja en las tiradas de salvación contra veneno y resistencia al daño de veneno.",
      "<p>Los venenos de monstruos poderosos del Continente Demoníaco pueden requerir el nivel <strong>Intermedio</strong> (espacio de nivel 3 o superior), a criterio del DM.</p>"
    ),
    acts: [n => utilityActivity(n)]
  }),
  spell("Bola de Fuego Menor", {
    level: 1, school: "evo", img: "icons/svg/fire.svg", range: ft(90), target: one(),
    description: html(
      rango("Básico", "Fuego"),
      chant("Espíritu del fuego, reúnete y arde en una esfera: ¡Bola de Fuego!"),
      "Lanzas una esfera de fuego concentrado. Haz un ataque de conjuro a distancia. Si impacta, el objetivo recibe <strong>3d6 de daño de fuego</strong>. Si fallas, la esfera estalla al tocar el suelo y cada criatura a 5 pies del objetivo recibe 1d6 de daño de fuego.",
      "<p><strong>A niveles superiores.</strong> El daño del impacto aumenta en 1d6 por cada nivel de espacio por encima del 1.º.</p>",
      "<p><em>No confundir</em> con la <em>Bola de Fuego</em> de nivel 3 del manual: en este mundo es un hechizo de nivel Básico.</p>"
    ),
    acts: [n => attackActivity(n, { parts: [dmg(3, 6, "fire", { scaling: 1 })] })]
  }),
  spell("Muro de Tierra", {
    level: 1, school: "trs", img: "icons/svg/statue.svg", range: ft(60), target: area("wall", 20, { width: 1, height: 10 }), duration: minutes(10),
    description: html(
      rango("Básico", "Tierra"),
      chant("Tierra, alza tu escudo ante mí: ¡Muro de Tierra!"),
      "Levantas un muro de tierra compactada de hasta 20 pies de largo, 10 de alto y 1 de grosor. El muro proporciona cobertura total, tiene CA 13 y 30 puntos de golpe por cada sección de 10 pies. Si aparece en el espacio de una criatura, esta es empujada a un lado (a su elección).",
      "<p><strong>A niveles superiores.</strong> Por cada nivel de espacio por encima del 1.º, el muro puede medir 10 pies más de largo.</p>"
    ),
    acts: [n => utilityActivity(n)]
  }),
  spell("Barrera Elemental", {
    level: 1, school: "abj", img: "icons/svg/mage-shield.svg", range: { value: "", units: "self", special: "" }, target: one("self"), duration: { value: "1", units: "round" },
    activation: act("reaction", 1, "cuando te impacte un ataque o te alcance un conjuro de daño elemental"),
    properties: ["somatic"],
    description: html(
      rango("Básico", "Barrera"),
      "Una lámina de maná translúcida aparece entre tú y el golpe. Hasta el inicio de tu siguiente turno obtienes un <strong>+5 a la CA</strong> (incluido contra el ataque desencadenante) y resistencia a un tipo de daño entre ácido, frío, fuego o relámpago.",
      "<p>Al no tener componente verbal, los magos sin encantamiento suelen dominarlo primero.</p>"
    ),
    acts: [n => utilityActivity(n)]
  }),

  // ────────────────────────── NIVEL 2 (Intermedio) ──────────────────────────
  spell("Cañón de Piedra", {
    level: 2, school: "evo", img: "icons/svg/statue.svg", range: ft(120), target: one(),
    description: html(
      rango("Intermedio", "Tierra"),
      "La versión perfeccionada de <em>Bala de Piedra</em>: un proyectil de roca densa, afilada y en rotación disparado a una velocidad brutal. Haz un ataque de conjuro a distancia. Si impacta, el objetivo recibe <strong>4d8 de daño contundente</strong> y debe superar una salvación de Fuerza o quedar <em>Derribado</em>.",
      "<p>El conjuro ignora la cobertura media. Un golpe crítico atraviesa armaduras: el objetivo no puede reducir este daño con resistencia no mágica.</p>",
      "<p><strong>A niveles superiores.</strong> +1d8 por cada nivel de espacio por encima del 2.º.</p>"
    ),
    acts: [
      n => attackActivity(n, { parts: [dmg(4, 8, "bludgeoning", { scaling: 1 })] }),
      n => saveActivity(n, { ability: "str", onSave: "none", parts: [], name: "Derribo", consumption: noSlot })
    ]
  }),
  spell("Lanza de Hielo", {
    level: 2, school: "evo", img: "icons/svg/frozen.svg", range: ft(90), target: one(),
    description: html(
      rango("Intermedio", "Agua"),
      chant("Agua, congélate en una lanza de escarcha y atraviesa a mi enemigo: ¡Lanza de Hielo!"),
      "Haz un ataque de conjuro a distancia. Si impacta, el objetivo recibe <strong>2d8 de daño perforante más 2d6 de daño de frío</strong> y su velocidad se reduce en 10 pies hasta el final de su siguiente turno.",
      "<p><strong>A niveles superiores.</strong> El daño de frío aumenta en 1d6 por cada nivel de espacio por encima del 2.º.</p>"
    ),
    acts: [n => attackActivity(n, { parts: [dmg(2, 8, "piercing"), dmg(2, 6, "cold", { scaling: 1 })] })]
  }),
  spell("Niebla Profunda", {
    level: 2, school: "con", img: "icons/svg/aura.svg", range: ft(120), target: area("sphere", 30), duration: minutes(1, "hour"), concentration: true,
    description: html(
      rango("Intermedio", "Agua + Viento (combinado)"),
      "Una niebla espesa llena una esfera de 30 pies de radio centrada en un punto dentro del alcance. El área está <strong>muy oscurecida</strong>. Tú (y hasta seis criaturas que elijas al lanzarlo) podéis ver a través de la niebla hasta 10 pies.",
      "<p>Un viento moderado la dispersa en 1d4 rondas; uno fuerte, de inmediato.</p>"
    ),
    acts: [n => utilityActivity(n)]
  }),
  spell("Campo de Carámbanos", {
    level: 2, school: "con", img: "icons/svg/frozen.svg", range: ft(90), target: area("cube", 20), duration: minutes(1),
    description: html(
      rango("Intermedio", "Agua"),
      "Brotan estacas de hielo del suelo en un cubo de 20 pies. Cada criatura en el área debe hacer una <strong>salvación de Destreza</strong>: recibe <strong>3d6 de daño perforante</strong> si falla, o la mitad si tiene éxito. Durante 1 minuto el área es terreno difícil y quien entre por primera vez en un turno o lo empiece allí recibe 1d6 de daño de frío.",
      "<p><strong>A niveles superiores.</strong> +1d6 de daño perforante por cada nivel por encima del 2.º.</p>"
    ),
    acts: [n => saveActivity(n, { ability: "dex", onSave: "half", parts: [dmg(3, 6, "piercing", { scaling: 1 })] })]
  }),

  // ────────────────────────── NIVEL 3 (Intermedio) ──────────────────────────
  spell("Curación Intermedia", {
    level: 3, school: "evo", img: "icons/svg/regen.svg", range: touch, target: one(),
    description: html(
      rango("Intermedio", "Curación"),
      "Una criatura que toques recupera <strong>4d8 + tu modificador por característica para lanzar conjuros</strong> puntos de golpe. Además, puedes curar una enfermedad o una fractura, o terminar la condición <em>Cegado</em> o <em>Ensordecido</em>.",
      "<p><strong>A niveles superiores.</strong> +2d8 por cada nivel de espacio por encima del 3.º.</p>"
    ),
    acts: [n => healActivity(n, dmg(4, 8, "healing", { bonus: "@mod", scaling: 2 }))]
  }),
  spell("Lodazal", {
    level: 3, school: "trs", img: "icons/svg/net.svg", range: ft(120), target: area("radius", 20), duration: minutes(10), concentration: true,
    description: html(
      rango("Intermedio", "Tierra + Agua"),
      "El suelo en un radio de 20 pies se convierte en barro profundo. El área es terreno difícil. Cada criatura que esté en ella al lanzarlo, o que entre por primera vez en un turno, debe superar una <strong>salvación de Fuerza</strong> o quedar <em>Apresada</em> mientras permanezca hundida. Puede repetir la salvación al final de cada uno de sus turnos.",
      "<p>Al terminar el conjuro, puedes endurecer el barro: las criaturas aún apresadas siguen así hasta que alguien las libere (CD de Atletismo igual a tu CD de conjuros).</p>"
    ),
    acts: [n => saveActivity(n, { ability: "str", onSave: "none", parts: [] })]
  }),
  spell("Descarga Eléctrica", {
    level: 3, school: "evo", img: "icons/svg/lightning.svg", range: ft(60), target: one(),
    description: html(
      rango("Intermedio", "Agua + Viento (combinado, poco conocido)"),
      "Una magia rara, nacida de entender cómo se forma el rayo en las nubes. Un arco eléctrico salta hacia una criatura: debe hacer una <strong>salvación de Constitución</strong> y recibe <strong>6d6 de daño de relámpago</strong> si falla, o la mitad si tiene éxito. Si falla, no puede usar reacciones hasta el inicio de su siguiente turno.",
      "<p>Si el objetivo está mojado o en el agua, tiene desventaja en la salvación.</p>",
      "<p><strong>A niveles superiores.</strong> +1d6 por cada nivel de espacio por encima del 3.º.</p>"
    ),
    acts: [n => saveActivity(n, { ability: "con", onSave: "half", parts: [dmg(6, 6, "lightning", { scaling: 1 })] })]
  }),

  // ────────────────────────── NIVEL 4-5 (Avanzado) ──────────────────────────
  spell("Tornado", {
    level: 4, school: "evo", img: "icons/svg/wing.svg", range: ft(120), target: area("cylinder", 15, { height: 40 }), duration: minutes(1), concentration: true,
    description: html(
      rango("Avanzado", "Viento"),
      "Invocas un torbellino en un cilindro de 15 pies de radio y 40 de alto. Cada criatura que esté dentro al aparecer, o que termine su turno allí, debe hacer una <strong>salvación de Fuerza</strong>: recibe <strong>4d8 de daño contundente</strong> y es arrastrada 10 pies hacia el centro si falla, o la mitad del daño si tiene éxito. Los ataques a distancia con armas que atraviesen el tornado tienen desventaja.",
      "<p>Como acción adicional, puedes mover el tornado hasta 30 pies.</p>",
      "<p><strong>A niveles superiores.</strong> +1d8 por cada nivel de espacio por encima del 4.º.</p>"
    ),
    acts: [n => saveActivity(n, { ability: "str", onSave: "half", parts: [dmg(4, 8, "bludgeoning", { scaling: 1 })] })]
  }),
  spell("Curación Avanzada", {
    level: 5, school: "evo", img: "icons/svg/heal.svg", range: touch, target: one(),
    description: html(
      rango("Avanzado", "Curación"),
      "Una criatura que toques recupera <strong>8d8 + tu modificador por característica para lanzar conjuros</strong> puntos de golpe. Si la criatura perdió una extremidad hace menos de 1 minuto y la parte cortada está presente, la vuelves a unir.",
      "<p><strong>A niveles superiores.</strong> +2d8 por cada nivel de espacio por encima del 5.º.</p>"
    ),
    acts: [n => healActivity(n, dmg(8, 8, "healing", { bonus: "@mod", scaling: 2 }))]
  }),

  // ────────────────────────── NIVEL 6+ (Superior y más allá) ──────────────────────────
  spell("Cumulonimbo", {
    level: 6, school: "evo", img: "icons/svg/lightning.svg", range: { value: "", units: "self", special: "1 milla" }, target: area("radius", 60), duration: minutes(10), concentration: true,
    activation: act("minute", 1),
    description: html(
      rango("Superior", "Agua"),
      "Un hechizo de nivel Superior que transforma el cielo. Tras 1 minuto de encantamiento, una enorme nube de tormenta cubre una milla de radio a tu alrededor y empieza a llover con fuerza (área ligeramente oscurecida, desventaja en Percepción basada en el oído, las llamas expuestas se apagan).",
      "<p>Mientras dure, puedes usar tu acción para hacer caer un <strong>rayo</strong> en un punto que veas: cada criatura a 10 pies debe hacer una <strong>salvación de Destreza</strong>, recibiendo <strong>6d10 de daño de relámpago</strong> si falla, o la mitad si tiene éxito.</p>",
      "<p>Lanzado sobre un campo de batalla, cambia el clima de toda la región durante horas tras terminar.</p>"
    ),
    acts: [n => utilityActivity(n, { name: "Invocar la tormenta" }), n => saveActivity(n, { ability: "dex", onSave: "half", parts: [dmg(6, 10, "lightning")], name: "Rayo", activation: act("action", 1), consumption: noSlot, key: "rayo" })]
  }),
  spell("Cero Absoluto", {
    level: 7, school: "evo", img: "icons/svg/frozen.svg", range: { value: "", units: "self", special: "" }, target: area("cone", 60),
    description: html(
      rango("Real", "Agua"),
      "Una ola de frío que congela el aire mismo surge de ti en un cono de 60 pies. Cada criatura en el área debe hacer una <strong>salvación de Constitución</strong>: recibe <strong>10d8 de daño de frío</strong> y queda <em>Apresada</em> por el hielo hasta el final de su siguiente turno si falla, o la mitad del daño si tiene éxito. El agua del área se congela hasta 1 pie de profundidad.",
      "<p><strong>A niveles superiores.</strong> +1d8 por cada nivel de espacio por encima del 7.º.</p>"
    ),
    acts: [n => saveActivity(n, { ability: "con", onSave: "half", parts: [dmg(10, 8, "cold", { scaling: 1 })] })]
  })
];
