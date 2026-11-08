// Objetos de la campaña «Historias del Mundo de las Seis Caras: Anomalía».
// Transcritos del documento de lore del DM y adaptados a dnd5e.
import { SOURCE, id, dmg, act, activities, attackActivity, saveActivity, damageActivity, healActivity, utilityActivity, uses, consumeUse, html } from "../../tools/helpers.mjs";

const SRC = { ...SOURCE, custom: "Anomalía (campaña)" };
const RAR = { comun: "common", poco: "uncommon", raro: "rare", muy: "veryRare", leg: "legendary", "": "" };

// ─────────────────────────── utilidades ───────────────────────────
const ADD = 2;
const fx = (owner, name, changes) => ({
  _id: id(owner, "effect", name), name, img: "icons/svg/aura.svg", disabled: false, transfer: true,
  changes: changes.map(([key, value, mode = ADD]) => ({ key, mode, value: String(value), priority: null })),
  duration: {}, flags: {}, origin: null, description: "", statuses: []
});
const ac = n => ["system.attributes.ac.bonus", `+${n}`];
const dr = t => ["system.traits.dr.value", t];
const speed = n => ["system.attributes.movement.walk", n];

function desc({ flavor, effect, owner, note }) {
  const parts = [];
  if (flavor) parts.push(`<blockquote><p><em>“${flavor}”</em></p></blockquote>`);
  if (effect) parts.push(html(...[].concat(effect)));
  if (note) parts.push(`<p><em>${note}</em></p>`);
  if (owner) parts.push(`<p><strong>Lo obtuvo:</strong> ${owner}</p>`);
  return parts.join("\n");
}

function base(name, type, o, system = {}) {
  const magical = o.magic ?? ["poco", "raro", "muy", "leg"].includes(o.rarity);
  const doc = {
    name, type, folder: o.folder, img: o.img ?? IMG[type],
    system: {
      description: { value: desc(o), chat: "" },
      source: SRC, quantity: o.qty ?? 1,
      weight: { value: o.weight ?? 0, units: "lb" },
      price: { value: o.price ?? 0, denomination: "gp" },
      rarity: RAR[o.rarity ?? ""], identified: true,
      attunement: o.attune ? "required" : "",
      ...system
    },
    effects: (o.fx ?? []).length ? [fx(name, o.fxName ?? name, o.fx)] : []
  };
  const props = new Set(system.properties ?? []);
  if (magical) props.add("mgc");
  doc.system.properties = [...props];
  if (o.uses) doc.system.uses = o.uses;
  if (o.acts?.length) doc.system.activities = activities(...o.acts.map(f => f(name)));
  return doc;
}

const IMG = { weapon: "icons/svg/sword.svg", equipment: "icons/svg/shield.svg", consumable: "icons/svg/pill.svg", loot: "icons/svg/item-bag.svg", tool: "icons/svg/item-bag.svg" };

const WEAPONS = {
  daga: { type: "simpleM", baseItem: "dagger", dtype: "piercing", props: ["fin", "lgt", "thr"], range: [20, 60] },
  lanza: { type: "simpleM", baseItem: "spear", dtype: "piercing", props: ["thr", "ver"], range: [20, 60] },
  machete: { type: "martialM", baseItem: "scimitar", dtype: "slashing", props: ["fin", "lgt"] },
  espada: { type: "martialM", baseItem: "longsword", dtype: "slashing", props: ["ver"] },
  espadon: { type: "martialM", baseItem: "greatsword", dtype: "slashing", props: ["hvy", "two"] },
  hoz: { type: "simpleM", baseItem: "sickle", dtype: "slashing", props: ["lgt"] },
  tijeras: { type: "martialM", baseItem: "", dtype: "slashing", props: ["fin"] },
  baston: { type: "simpleM", baseItem: "quarterstaff", dtype: "bludgeoning", props: ["ver", "foc"] },
  arcoCorto: { type: "simpleR", baseItem: "shortbow", dtype: "piercing", props: ["amm", "two"], range: [80, 320], ranged: true },
  arcoLargo: { type: "martialR", baseItem: "longbow", dtype: "piercing", props: ["amm", "hvy", "two"], range: [150, 600], ranged: true },
  ballesta: { type: "simpleR", baseItem: "lightcrossbow", dtype: "piercing", props: ["amm", "lod", "two"], range: [80, 320], ranged: true }
};

/** Arma: dice = [número, caras], bonus = bonificador mágico. */
function W(name, o) {
  const w = WEAPONS[o.base];
  const [n, d] = o.dice;
  const dtype = o.dtype ?? w.dtype;
  const range = w.range ? { value: w.range[0] + (o.rangeBonus ?? 0), long: w.range[1] + (o.rangeBonus ?? 0), reach: null, units: "ft" } : { value: null, long: null, reach: 5, units: "ft" };
  return base(name, "weapon", { weight: 2, ...o, magic: o.magic ?? Boolean(o.bonus) }, {
    type: { value: w.type, baseItem: w.baseItem },
    properties: o.props ?? w.props,
    magicalBonus: o.bonus ?? null,
    range, equipped: false,
    damage: { base: dmg(n, d, dtype), versatile: dmg(null, null, []) },
    activities: activities(attackActivity(name, { kind: w.ranged ? "ranged" : "melee", classification: "weapon", includeBase: true, activation: act(), parts: (o.extra ?? []).map(([n2, d2, t]) => dmg(n2, d2, t)) }))
  });
}

/** Armadura o escudo: kind = light | medium | heavy | shield. */
function A(name, o) {
  const dex = { light: null, medium: 2, heavy: 0, shield: null }[o.kind];
  const props = o.stealth ? ["stealthDisadvantage"] : [];
  return base(name, "equipment", { weight: o.kind === "shield" ? 6 : 15, ...o }, {
    type: { value: o.kind, baseItem: "" },
    armor: { value: o.ac, dex: o.dexCap ?? dex, magicalBonus: null },
    properties: props, equipped: false
  });
}

/** Objeto maravilloso o baratija (equipable). */
const T = (name, o) => base(name, "equipment", { weight: 0.5, ...o }, { type: { value: "trinket", baseItem: "" }, equipped: false });

/** Consumible. sub = potion | food | poison | scroll | trinket | ammo | rod... */
function C(name, o) {
  const max = o.charges ?? 1;
  return base(name, "consumable", {
    weight: 0.5, ...o,
    uses: o.uses ?? { spent: 0, max: String(max), recovery: o.recover ? [{ period: o.recover, type: "recoverAll" }] : [], autoDestroy: !o.recover }
  }, { type: { value: o.sub ?? "potion", subtype: "" } });
}

/** Botín, materiales y objetos sin mecánica. */
const L = (name, o) => base(name, "loot", o, { type: { value: o.sub ?? "gear", subtype: "" } });

// atajos de actividades (activation: "action" | "bonus" | "reaction" | "special")
const opt = ({ activation = "action", consumption, ...rest } = {}) => ({ ...rest, consumption: consumption ?? consumeUse, activation: act(activation) });
const heal = (n, d, bonus = "", extra = {}) => owner => healActivity(owner, dmg(n, d, "healing", { bonus }), opt(extra));
const healF = (formula, extra = {}) => owner => healActivity(owner, dmg(null, null, "healing", { custom: formula }), opt(extra));
const save = (ability, dc, parts = [], onSave = "half", extra = {}) => owner => saveActivity(owner, { ability, dc, onSave, parts: parts.map(([n, d, t]) => dmg(n, d, t)), ...opt(extra) });
const util = (extra = {}) => owner => utilityActivity(owner, opt(extra));
const NO_COST = { targets: [], scaling: { allowed: false, max: "" }, spellSlot: false };
const DC_FUE_DES = "8 + @prof + @abilities.str.mod + @abilities.dex.mod";

// ─────────────────────────── carpetas ───────────────────────────
const METRO = "Laberinto del Metro";
const RIK = "Rikarisu";
const MUDA = "La Muda del Desierto";
const MIG = "Aldea Migurd";
const TRAMA = "Objetos de Trama";

export default [
  // ═════════════ LABERINTO DEL METRO (tiradas de investigación por jugador) ═════════════
  T("Núcleo Óseo Palpitante", {
    folder: `${METRO}/Cuyo`, rarity: "comun", magic: true,
    flavor: "Un pequeño núcleo de hueso que se puede usar como colgante, parece forjado a partir de restos humanos. Posee una luz tenue a su alrededor que aumenta y disminuye como si se tratase de latidos humanos.",
    effect: "<p><strong>Eco Palpitante.</strong> Cuando lances un conjuro de la escuela de nigromancia, puedes gastar la carga para agregar <strong>+2</strong> a la tirada de ataque y a la CD de salvación del conjuro. Cuando lo hagas, el núcleo se apaga.</p><p>Tiene 1 carga y se recupera tras un descanso largo.</p>",
    note: "Tirada de investigación 10–13 en el Metro (Cuyo).",
    uses: uses(1, "lr"), acts: [util({ activation: "special", name: "Eco Palpitante" })]
  }),
  T("Implante Ocular de la Percepción de la Muerte", {
    folder: `${METRO}/Cuyo`, rarity: "poco",
    flavor: "Un implante de alta tecnología, no parece algo concebido en este mundo, se puede colocar de forma interna en uno de los ojos, lo que permite vislumbrar por breves segundos las almas alejarse de este plano.",
    effect: "<p>Mientras lo lleves equipado:</p><ul><li><strong>Un Último Vistazo.</strong> +2 a las tiradas de salvación de Constitución para mantener la concentración de un conjuro.</li><li><strong>Festín de Almas.</strong> Cuando una criatura que puedas ver a 30 pies de ti muere, puedes usar tu reacción para devorar su alma y ganar <strong>1d6 puntos de golpe temporales</strong>.</li></ul>",
    note: "Tirada de investigación 14–17 en el Metro (Cuyo).",
    fx: [["system.attributes.concentration.bonuses.save", "+2"]],
    acts: [owner => healActivity(owner, dmg(1, 6, "temphp"), { activation: act("reaction", 1, "cuando muere una criatura a 30 pies"), name: "Festín de Almas" })]
  }),
  W("Daga de Punta de Medianoche", {
    folder: `${METRO}/Luka`, rarity: "comun", base: "daga", dice: [1, 4], bonus: 1,
    flavor: "Forjada con acero mundano, pero con una técnica única de martillado que la dota de una curvatura ligera, provocando que se sienta ligera al manejarla. Su filo refleja la luz como si de un espejo se tratase. Parece responder muy bien a las vibraciones.",
    effect: "<ul><li><strong>Hoja Curvada.</strong> +1 al ataque y al daño.</li><li><strong>Acechador de Medianoche.</strong> Cuando comienzas tu turno, si te mueves antes de realizar un ataque, puedes desenvainar o guardar esta daga sin gastar tu acción. Además, una vez por turno, puedes añadir +2 al daño del arma si te moviste al menos 10 pies en ese turno.</li></ul>",
    note: "Tirada de investigación 10–13 en el Metro (Luka)."
  }),
  T("Faja del Duelista Solitario", {
    folder: `${METRO}/Luka`, rarity: "poco",
    flavor: "Alguna vez perteneció a alguien que anhelaba ser el más fuerte. Hoy en día solo es un montón de tela que deja por momentos entrever la antigua grandeza que demostraba. Su sujeción sigue siendo de calidad, lo que mejora ampliamente el movimiento de su portador.",
    effect: "<p>Mientras la lleves equipada:</p><ul><li><strong>Correas Ajustadas.</strong> Tu CA aumenta en +2 contra el primer ataque que te hagan en cada turno.</li><li><strong>Danza Solitaria.</strong> Si no llevas armadura pesada: cuando gastas un dado de Inspiración Bárdica en una Floritura de Espada, el daño de tu siguiente ataque aumenta en 1d6.</li></ul>",
    note: "Tirada de investigación 14–17 en el Metro (Luka)."
  }),
  C("Ampolla de Sangre Coagulada", {
    folder: `${METRO}/Twister`, rarity: "comun", magic: true, charges: 3, recover: "sr",
    flavor: "Un pequeño vial de sangre viejo, la sangre ya se encuentra coagulada y diversas manchas negras se pueden apreciar. Nadie sabe de dónde proviene, pero se cree que pertenecía a una criatura antigua cuya sangre dotaba de habilidades sorprendentes a quien bebiese de ella.",
    effect: "<p><strong>Trago Amargo.</strong> Como acción adicional, puedes beber del vial:</p><ul><li>Pierdes 1d4 puntos de golpe.</li><li>Tu siguiente ataque añade 1d4 de daño del tipo de tu aliento dracónico.</li></ul><p>Puedes usarlo 3 veces por descanso corto.</p>",
    note: "Tirada de investigación 10–13 en el Metro (Twister).",
    acts: [util({ activation: "bonus", name: "Trago Amargo", formula: "1d4", rollName: "Daño extra (tipo de aliento)" })]
  }),
  T("Guante Escamado del Juramento de Sangre", {
    folder: `${METRO}/Twister`, rarity: "poco",
    flavor: "Un único guante escamado de una armadura completa que actualmente se encuentra perdida. Se dice que aquel que la portó en su tiempo fue uno de los 5 Generales Dragón, mas solo se cree que fueron leyendas.",
    effect: "<p>Mientras lo lleves equipado:</p><ul><li><strong>Coraza Improvisada.</strong> Tu CA aumenta en +1.</li><li><strong>Despertar de Escamas.</strong> Cuando recibas daño y quedes con menos del 50 % de tus puntos de golpe, puedes usar tu reacción para ganar resistencia al tipo de daño del ataque que recibiste hasta el final del siguiente turno de tu atacante.</li></ul>",
    note: "Tirada de investigación 14–17 en el Metro (Twister).",
    fx: [ac(1)], acts: [util({ activation: "reaction", name: "Despertar de Escamas", consumption: NO_COST })]
  }),
  C("Semilla del Despertar", {
    folder: `${METRO}/Nozu`, rarity: "comun", magic: true, sub: "trinket", charges: 1, recover: "lr",
    flavor: "Un pequeño amuleto de metal oxidado cubierto de musgo cuya forma se asemeja a una semilla, pareciera como si un mecanismo ya atascado yaciera en su interior.",
    effect: "<p><strong>Sembrando Esperanza.</strong> Como acción, planta la semilla en un punto a 5 pies o menos. Germina y produce césped mágico en un radio de 5 pies; el césped brilla y emite luz tenue en un radio de 10 pies. Los aliados que inicien o terminen su turno en el césped recuperan <strong>1d6 puntos de golpe</strong>.</p><p>Un solo uso; se recupera tras un descanso largo.</p>",
    note: "Tirada de investigación 10–13 en el Metro (Nozu).",
    acts: [util({ name: "Plantar la semilla" }), heal(1, 6, "", { name: "Curación del césped", activation: "special", consumption: { targets: [], scaling: { allowed: false, max: "" }, spellSlot: false }, key: "heal" })]
  }),
  T("Broche de Savia Dulce", {
    folder: `${METRO}/Nozu`, rarity: "poco", uses: uses(1, "lr"),
    flavor: "Un pequeño broche de plata con piedras incrustadas que dan la ilusión de una pequeña flor abierta con gotas de savia a su alrededor. Al olerlo desprende un ligero aroma dulce.",
    effect: "<ul><li><strong>Tan Dulce como la Plata.</strong> Cada vez que lances un conjuro que restaure puntos de golpe, el objetivo recupera puntos de golpe adicionales iguales a tu bonificador por competencia + tu nivel de druida.</li><li><strong>Savia Nutritiva.</strong> Una vez por descanso largo puedes lanzar <em>Buenas Bayas</em>; cada baya cura 4 puntos de golpe adicionales + tu modificador por Sabiduría.</li></ul>",
    note: "Tirada de investigación 14–17 en el Metro (Nozu).",
    acts: [util({ name: "Savia Nutritiva (Buenas Bayas)" })]
  }),
  T("Válvula Reguladora de Presión", {
    folder: `${METRO}/Neon`, rarity: "comun", magic: true, uses: uses(1, "lr"),
    flavor: "Una válvula de presión en sorprendente buen estado que servía para mantener las tuberías del sitio extraño. Es retrocompatible con otros modelos; gracias a su diseño simple y efectivo, proporciona una presión estable prolongada incluso después de dejar de recibir energía, pues seguirá funcionando por un par de minutos.",
    effect: "<p>Mientras la lleves equipada:</p><ul><li><strong>Regulador Térmico.</strong> Ganas resistencia al daño de fuego y de frío.</li><li><strong>Protocolo de Emergencia.</strong> Al quedar con 0 puntos de golpe no caes inconsciente y puedes actuar en tu siguiente turno; al finalizarlo, caes inconsciente de forma normal.</li></ul>",
    note: "Tirada de investigación 10–13 en el Metro (Neon). El documento no indica límite de usos para el Protocolo; aquí se sugiere 1 por descanso largo.",
    fx: [dr("fire"), dr("cold")], acts: [util({ activation: "special", name: "Protocolo de Emergencia" })]
  }),
  T("Placa de la Marcha Fúnebre", {
    folder: `${METRO}/Neon`, rarity: "poco", uses: uses(1, "lr"),
    flavor: "Una pesada placa de acero reforzado con grabados de un antiguo ejército desconocido. Presenta múltiples abolladuras y rasgaduras, por lo que ya no es tan efectiva como antes. En la parte interior se alcanza a leer un mensaje grabado con lo que parece ser un cuchillo: «Hasta que mi marcha no cese, mi camino seguirá siendo trazado; si Dios me encomienda esta tarea, mi alma no descansará hasta cumplirla.»",
    effect: "<p>Mientras la lleves puesta:</p><ul><li><strong>Acero Inoxidable.</strong> +2 a un tipo de tirada de salvación a tu elección.</li><li><strong>Marcha Fúnebre.</strong> Una vez por descanso largo, como acción adicional, entras en Marcha Fúnebre durante 1 turno: no puedes ser ralentizado, ignoras el terreno difícil y tus ataques cuerpo a cuerpo hacen <strong>+1d6 de daño necrótico</strong>.</li></ul>",
    note: "Tirada de investigación 14–17 en el Metro (Neon).",
    acts: [util({ activation: "bonus", name: "Marcha Fúnebre", formula: "1d6", rollName: "Daño necrótico" })]
  }),

  // ═════════════ RIKARISU · Yor'Zuh (Mercader) ═════════════
  C("Raciones Desérticas Mejoradas", { folder: `${RIK}/Yor'Zuh (Mercader)`, rarity: "comun", magic: false, price: 10, sub: "food", effect: "Cada ración dura 3 días." }),
  L("Cantimplora Sellada", { folder: `${RIK}/Yor'Zuh (Mercader)`, rarity: "comun", price: 15, effect: "Mantiene el agua fresca y protege del calor." }),
  L("Cuerda de Fibra", { folder: `${RIK}/Yor'Zuh (Mercader)`, rarity: "comun", price: 10, weight: 5, effect: "30 pies de cuerda resistente al calor." }),
  T("Manta Térmica Ligera", { folder: `${RIK}/Yor'Zuh (Mercader)`, rarity: "comun", price: 15, magic: true, effect: "Mientras te cubre, tienes resistencia al daño de fuego.", fx: [dr("fire")] }),
  C("Vendajes de Arena Viva", {
    folder: `${RIK}/Yor'Zuh (Mercader)`, rarity: "poco", price: 30, sub: "trinket", charges: 1, recover: "day",
    flavor: "Rara vez se ve a una víbora de arena rosa mudar de piel, pero si logras presenciarlo, su muda se vuelve un objeto muy valioso en la medicina, ya que proporciona un vendaje excelente y autorrenovable.",
    effect: "<strong>Muda Express.</strong> 1/día cura 2d6 + 2 puntos de golpe; el efecto aumenta a 3d6 + 2 si se usa en terreno árido.",
    acts: [heal(2, 6, "2", { name: "Muda Express" })]
  }),
  T("Lámpara de Cristal Negro", {
    folder: `${RIK}/Yor'Zuh (Mercader)`, rarity: "poco", price: 40, uses: uses(3, "day"),
    flavor: "Pese a que su opaco color ébano pueda indicar lo contrario, esta lámpara está tallada con una dedicación poco vista entre los artesanos; su cristal tan particular la vuelve idónea para explorar laberintos.",
    effect: "<strong>Visión de Obsidiana.</strong> 3 usos al día. Encendida dura 3 horas e ilumina hasta 40 pies en la oscuridad; además revela a los enemigos invisibles durante 1 minuto.",
    acts: [util({ name: "Visión de Obsidiana" })]
  }),
  L("Brújula Rota", { folder: `${RIK}/Yor'Zuh (Mercader)`, price: 10, flavor: "Parece una simple brújula rota; sin embargo, puede que algún experto te dé una segunda opinión de ella.", effect: "No hace nada… de momento." }),
  T("Botas de Expedicionario", { folder: `${RIK}/Yor'Zuh (Mercader)`, rarity: "poco", price: 35, weight: 1, effect: "Ignoras el terreno difícil." }),

  // ═════════════ RIKARISU · Myrrha (Alquimista) ═════════════
  C("Poción de Curación", { folder: `${RIK}/Myrrha (Alquimista)`, rarity: "comun", magic: true, price: 15, effect: "Recuperas 2d4 + 2 puntos de golpe.", acts: [heal(2, 4, "2")] }),
  C("Bálsamo Revitalizante", { folder: `${RIK}/Myrrha (Alquimista)`, rarity: "comun", price: 30, charges: 2, effect: "Como acción, estabiliza automáticamente a una criatura con 0 puntos de golpe. 2 usos.", acts: [util()] }),
  C("Ungüento Rehidratante", { folder: `${RIK}/Myrrha (Alquimista)`, rarity: "comun", price: 20, charges: 3, effect: "Elimina 1 nivel de agotamiento causado por el calor. 3 usos.", acts: [util()] }),
  C("Antídoto Simple", { folder: `${RIK}/Myrrha (Alquimista)`, rarity: "comun", price: 15, effect: "Durante 1 hora tienes ventaja en las tiradas de salvación para no ser envenenado.", acts: [util()] }),
  C("Sal Inflamable", {
    folder: `${RIK}/Myrrha (Alquimista)`, rarity: "comun", price: 20, sub: "trinket",
    effect: "Como acción, puede dejarse en el terreno o sobre una criatura. Reacciona al fuego provocando una explosión de 5 pies de radio que causa <strong>2d8 de daño de fuego</strong>. Si impacta a una criatura, esta se vuelve vulnerable al daño de fuego durante 10 minutos.",
    acts: [owner => utilityActivity(owner, { consumption: consumeUse, activation: act("action") }), owner => damageActivity(owner, [dmg(2, 8, "fire")], { name: "Explosión", activation: act("special") })]
  }),
  C("Poción de Resistencia Elemental Menor", { folder: `${RIK}/Myrrha (Alquimista)`, rarity: "poco", price: 25, effect: "Durante 10 minutos ganas resistencia al daño de fuego, frío y veneno.", acts: [util()] }),
  C("Extracto de Maná Concentrado", { folder: `${RIK}/Myrrha (Alquimista)`, rarity: "poco", price: 30, effect: "Durante 1 minuto tienes ventaja en las salvaciones de Constitución para mantener la concentración y puedes concentrarte en un conjuro adicional mientras dure el efecto.", acts: [util()] }),
  C("Brebaje de Vigor de Brea", { folder: `${RIK}/Myrrha (Alquimista)`, rarity: "poco", price: 50, effect: "Puedes beberlo 1/día. Cuando caigas a 0 puntos de golpe, quedas con 1 en su lugar.", acts: [util()] }),

  // ═════════════ RIKARISU · Kiri-Kiri (Herrero) ═════════════
  L("Munición Variada (x10)", { folder: `${RIK}/Kiri-Kiri (Herrero)`, price: 15, qty: 10, sub: "gear", effect: "Flechas, virotes o balas, a elegir." }),
  A("Escudo Centinela", { folder: `${RIK}/Kiri-Kiri (Herrero)`, rarity: "comun", magic: true, price: 30, kind: "shield", ac: 2, effect: "+2 CA. Mientras lo portes, tienes ventaja en las tiradas de iniciativa y de Percepción." }),
  W("Espada Bastarda", {
    folder: `${RIK}/Kiri-Kiri (Herrero)`, rarity: "poco", price: 30, base: "espada", dice: [1, 8], bonus: 1,
    effect: "+1 al ataque y al daño. 1d8 de daño. Una vez por turno puedes hacer un <strong>corte bastardo</strong> y repetir una tirada de daño."
  }),
  A("Escudo de Reacción", { folder: `${RIK}/Kiri-Kiri (Herrero)`, rarity: "poco", price: 35, kind: "shield", ac: 2, effect: "+2 CA, y te permite realizar un segundo ataque en tu turno." }),
  T("Empuñadura Aislante", { folder: `${RIK}/Kiri-Kiri (Herrero)`, rarity: "poco", price: 30, effect: "Ignoras 2 niveles de agotamiento causados por el clima o la temperatura." }),
  L("Munición Perforante (x10)", { folder: `${RIK}/Kiri-Kiri (Herrero)`, rarity: "poco", price: 25, qty: 10, effect: "Ignora las resistencias al impactar." }),

  // ═════════════ RIKARISU · Seh'ra (Cartógrafa) ═════════════
  L("Mapas Regionales Básicos", { folder: `${RIK}/Seh'ra (Cartógrafa)`, price: 5 }),
  L("Rutas Comerciales Seguras", { folder: `${RIK}/Seh'ra (Cartógrafa)`, price: 10 }),
  L("Mapas de Ruinas Conocidas", { folder: `${RIK}/Seh'ra (Cartógrafa)`, price: 25 }),
  L("Permisos de Paso", { folder: `${RIK}/Seh'ra (Cartógrafa)`, price: 10, effect: "Reduce la hostilidad en zonas cercanas." }),
  C("Pergamino de Guardia Nocturna", { folder: `${RIK}/Seh'ra (Cartógrafa)`, rarity: "poco", price: 25, sub: "scroll", effect: "Reduce la posibilidad de emboscadas nocturnas.", acts: [util()] }),
  T("Marcadores de Rutas", { folder: `${RIK}/Seh'ra (Cartógrafa)`, rarity: "poco", price: 15, uses: uses(3, "day"), effect: "3 usos al día. Otorga ventaja en una tirada de Supervivencia.", acts: [util({ activation: "special" })] }),

  // ═════════════ RIKARISU · Rakk (Contrabandista) ═════════════
  C("Frascos de Aceite (x3)", { folder: `${RIK}/Rakk (Contrabandista)`, price: 5, qty: 3, sub: "trinket" }),
  L("Ganzúas (x5)", { folder: `${RIK}/Rakk (Contrabandista)`, price: 5, qty: 5 }),
  C("Llave Universal", { folder: `${RIK}/Rakk (Contrabandista)`, rarity: "comun", magic: true, price: 20, sub: "trinket", effect: "1 uso: abre cualquier cerradura.", acts: [util()] }),
  T("Capucha Negra", { folder: `${RIK}/Rakk (Contrabandista)`, rarity: "comun", price: 15, effect: "Ventaja en las pruebas de Sigilo en zonas urbanas." }),
  C("Tizas de Distracción (x5)", { folder: `${RIK}/Rakk (Contrabandista)`, price: 2, qty: 5, sub: "trinket" }),
  C("Poción de Curación Turbia", { folder: `${RIK}/Rakk (Contrabandista)`, rarity: "poco", price: 10, effect: "Cura 2d6 + 2 puntos de golpe, pero tira 1d20: te deja asqueado durante 1 minuto (desventaja en las salvaciones de Constitución).", acts: [heal(2, 6, "2")] }),
  C("Estimulante de Dudosa Procedencia", { folder: `${RIK}/Rakk (Contrabandista)`, rarity: "poco", price: 15, effect: "Ignoras los niveles de agotamiento por calor durante 1 hora; después obtienes 1 nivel de agotamiento durante 1 hora.", acts: [util()] }),
  C("Bomba de Humo", { folder: `${RIK}/Rakk (Contrabandista)`, rarity: "poco", price: 15, sub: "trinket", effect: "Crea una zona de 10 pies de radio donde no pueden verte.", acts: [util()] }),
  T("Gancho Retráctil", { folder: `${RIK}/Rakk (Contrabandista)`, rarity: "poco", price: 25, weight: 2, effect: "Puedes gastar tu acción para escalar muros o escapar sin hacer prueba de habilidad." }),
  C("Pergamino de Desaparición", { folder: `${RIK}/Rakk (Contrabandista)`, rarity: "poco", price: 30, sub: "scroll", effect: "1 uso: otorga invisibilidad durante 1 hora.", acts: [util()] }),

  // ═════════════ RIKARISU · Sáqher (taberna oculta, sesión 5) ═════════════
  C("Fragmento de Maná Cristalizado", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "poco", price: 60, sub: "trinket", charges: 5, effect: "5 usos. Durante 1 hora eres incapaz de perder la concentración en un conjuro.", acts: [util()] }),
  C("Pergamino de Huida", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "muy", price: 140, sub: "scroll", effect: "1 uso. Si el equipo está al borde de un TPK, se consume y todos son teletransportados a una zona segura; toda criatura aliada con 0 puntos de golpe se estabiliza de inmediato.", acts: [util()] }),
  C("Aceite del Filo Imposible", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "raro", price: 80, charges: 1, recover: "day", sub: "trinket", effect: "1 uso/día. Imbuyes un arma: arde durante 1 hora, duplica sus tiradas de daño y causa 1d8 de daño de fuego adicional.", acts: [util()] }),
  C("Polvo de Revitalización", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "poco", price: 60, charges: 5, sub: "trinket", effect: "5 usos. Durante 1 hora tu velocidad aumenta 15 pies y tienes 1 acción adicional extra en tu turno.", acts: [util({ activation: "bonus" })] }),
  W("Daga Divergente", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "raro", price: 100, base: "daga", dice: [2, 4], bonus: 1, effect: "2d4 de daño, +1 al ataque y al daño. Si impactas, el enemigo recibe una <strong>marca de retardo</strong> durante 1 minuto: al inicio de cada uno de sus turnos recibe 1d6 de daño psíquico." }),
  W("Lanza del Juramento Roto", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "raro", price: 100, base: "lanza", dice: [1, 6], bonus: 1, effect: "1d6 de daño, +1 al ataque y al daño. Si atacas a una criatura que ya está herida, haces 1d6 de daño adicional; aumenta a 2d6 si está por debajo de la mitad de sus puntos de golpe." }),
  W("Machete Oxidado Devoracarne", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "muy", price: 150, base: "machete", dice: [2, 8], bonus: 2, effect: "2d8 de daño, +2 al ataque y al daño. Cuando atacas a una criatura con esta arma, le impides curarse durante 1 turno. Si atacas a una criatura que ya atacaste antes con esta arma, recibe 1d4 de daño necrótico adicional." }),
  W("Arco Horizonte Roto", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "poco", price: 80, base: "arcoLargo", dice: [1, 8], bonus: 1, rangeBonus: 30, effect: "1d8 de daño, +1 al ataque y al daño. Su alcance aumenta en 30 pies e ignora la cobertura media y tres cuartos." }),
  W("Ballesta con Pulso Retenido", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "raro", price: 100, base: "ballesta", dice: [1, 10], bonus: 1, effect: "1d10 de daño, +1 al ataque y al daño. Ignora la cobertura media y su daño se considera mágico. Como acción puedes <strong>cargar</strong> la ballesta (no atacas ese turno); al comienzo de tu siguiente turno liberas el disparo sin gastar acción: si acierta, hace el doble de daño; si falla, recibes 1d4 de daño de fuerza." }),
  A("Piel del Caminante Sombrío", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "poco", price: 90, kind: "light", ac: 12, effect: "CA 12 + Des. Ventaja en las pruebas de Sigilo en zonas abiertas u oscuras. En esas zonas tu velocidad aumenta 10 pies y tus pasos no hacen ruido." }),
  A("Coraza del Mercado Cerrado", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "poco", price: 90, kind: "medium", ac: 15, effect: "CA 15 + Des (máx. 2). Una vez por turno puedes usar tu reacción para reducir a la mitad el daño recibido.", uses: undefined, acts: [util({ activation: "reaction", consumption: { targets: [], scaling: { allowed: false, max: "" }, spellSlot: false } })] }),
  A("Bastión del Superviviente", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "poco", price: 100, kind: "heavy", ac: 17, effect: "CA 17. Cuando estás por debajo de la mitad de tus puntos de golpe, tienes ventaja en las salvaciones de Fuerza y Constitución." }),
  A("Escudo del Rechazo Instintivo", {
    folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "raro", price: 120, kind: "shield", ac: 3,
    effect: "+3 CA. Si un enemigo te ataca y falla, puedes usar tu reacción para empujarlo 15 pies; debe superar una salvación de Fuerza (CD = 8 + competencia + Fuerza + Destreza).",
    acts: [save("str", DC_FUE_DES, [], "none", { activation: "reaction", name: "Rechazo Instintivo", consumption: { targets: [], scaling: { allowed: false, max: "" }, spellSlot: false } })]
  }),
  T("Anillo de Pulsaciones Estables", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "poco", price: 80, effect: "+2 a Constitución y ventaja en las salvaciones contra efectos negativos.", fx: [["system.abilities.con.value", 2]] }),
  T("Relicario del Recuerdo", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "raro", price: 100, uses: uses(3, "day"), effect: "3 veces al día puedes repetir una tirada de salvación fallida, pero debes quedarte con el nuevo resultado.", acts: [util({ activation: "special" })] }),
  T("Broche de Flor de Arena Viviente", {
    folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "muy", price: 60,
    effect: "Mientras lo portes y tengas más de la mitad de tus puntos de golpe ganas +2 CA. Cuando caes por debajo de la mitad, la flor se abre y obtienes regeneración (2d6 + 2 por turno) hasta que recuperes más de la mitad de tus puntos de golpe.",
    note: "El broche se marchita poco a poco… (ver «Secretos de Objetos» en el diario de campaña).",
    acts: [heal(2, 6, "2", { activation: "special", name: "Regeneración", consumption: { targets: [], scaling: { allowed: false, max: "" }, spellSlot: false } })]
  }),
  T("Collar de la Umbra Eterna", { folder: `${RIK}/Sáqher (Taberna Oculta)`, rarity: "muy", price: 60, uses: uses(1, "day"), effect: "1 vez al día, al caer a 0 puntos de golpe quedas con 1 punto de golpe en su lugar.", note: "Ver «Secretos de Objetos» en el diario de campaña.", acts: [util({ activation: "special" })] }),

  // ═════════════ RIKARISU · Botín de investigación (taberna, d20) ═════════════
  L("Juguete de Madera Tallado", { folder: `${RIK}/Botín de Investigación`, effect: "Representa una flor creciendo en la arena.", note: "Ver «Secretos de Objetos»." }),
  L("Moneda Desconocida", { folder: `${RIK}/Botín de Investigación`, effect: "Una moneda que nadie reconoce.", note: "Ver «Secretos de Objetos»." }),
  C("Llave Maestra Oxidada", { folder: `${RIK}/Botín de Investigación`, sub: "trinket", effect: "Abre cualquier cerradura; después se rompe.", acts: [util()] }),
  T("Cuerda de Arena Trenzada", { folder: `${RIK}/Botín de Investigación`, weight: 5, effect: "Ventaja para trepar arena o rocas." }),
  W("Daga con Contrapeso", { folder: `${RIK}/Botín de Investigación`, rarity: "raro", base: "daga", dice: [3, 4], bonus: 3, effect: "3d4 de daño, +3 al ataque y al daño. Repite el daño en un crítico. Se rompe si sacas un 1." }),
  A("Escudo Marcador", { folder: `${RIK}/Botín de Investigación`, rarity: "comun", kind: "shield", ac: 2, effect: "+2 CA y ventaja contra empujones." }),
  A("Chaleco de Escamas Recuperadas", { folder: `${RIK}/Botín de Investigación`, rarity: "poco", kind: "light", ac: 12, effect: "CA 12 + Des, resistencia al daño cortante y perforante y +1 a Atletismo.", fx: [dr("slashing"), dr("piercing"), ["system.skills.ath.bonuses.check", "+1"]] }),
  W("Ballesta Ligera de Carga Rápida", { folder: `${RIK}/Botín de Investigación`, rarity: "poco", base: "ballesta", dice: [1, 8], bonus: 1, props: ["amm", "two"], effect: "1d8 de daño, +1 al ataque y al daño. Puede dispararse como acción adicional." }),
  W("Hoja con Filo Cansado", { folder: `${RIK}/Botín de Investigación`, rarity: "poco", base: "espada", dice: [1, 8], bonus: 2, effect: "1d8 de daño, +2 al ataque y al daño. Hace daño mágico. Cada vez que fallas, tu siguiente tirada de ataque tiene +1 adicional (máximo +5)." }),
  A("Escudo de Núcleo Triple", { folder: `${RIK}/Botín de Investigación`, rarity: "raro", kind: "shield", ac: 2, effect: "+2 CA y resistencia al daño de fuego, frío y relámpago.", fx: [dr("fire"), dr("cold"), dr("lightning")] }),
  A("Coraza de Placas Mixtas", { folder: `${RIK}/Botín de Investigación`, rarity: "poco", kind: "medium", ac: 14, stealth: true, effect: "CA 14 + Des (máx. 2). Desventaja en Sigilo, pero no puedes ser empujado, derribado ni ralentizado contra tu voluntad." }),
  T("Anillo de Estabilidad", { folder: `${RIK}/Botín de Investigación`, rarity: "poco", uses: uses(1, "day"), effect: "1 vez al día puedes ignorar un efecto de estado.", acts: [util({ activation: "special" })] }),
  W("Arco Corto de Tendón Reforzado", { folder: `${RIK}/Botín de Investigación`, rarity: "raro", base: "arcoCorto", dice: [1, 6], bonus: 1, effect: "1d6 de daño, +1 al ataque y al daño. Te permite disparar 3 veces por turno." }),
  A("Armadura del Custodio Caído", { folder: `${RIK}/Botín de Investigación`, rarity: "raro", kind: "heavy", ac: 18, stealth: true, effect: "CA 18 y resistencia al daño contundente, cortante y perforante, pero tienes desventaja en Sigilo y tu velocidad se reduce 10 pies.", fx: [dr("bludgeoning"), dr("slashing"), dr("piercing"), speed(-10)] }),
  T("Farol de Luz Lunar", { folder: `${RIK}/Botín de Investigación`, rarity: "poco", weight: 2, effect: "Ilumina y revela rastros mágicos en un radio de 60 pies." }),
  T("Fragmento de Armadura Florecida", { folder: `${RIK}/Botín de Investigación`, rarity: "poco", effect: "Puede incrustarse en una armadura o un escudo. Al comienzo de cada uno de tus turnos tira 1d20: con 10 o más recuperas 1d6 puntos de golpe; con menos de 10 recibes 1d6 de daño necrótico.", acts: [util({ activation: "special", formula: "1d20", rollName: "Floración", consumption: { targets: [], scaling: { allowed: false, max: "" }, spellSlot: false } })] }),
  L("Mapa de Contrabando del Gran Bosque", { folder: `${RIK}/Botín de Investigación`, effect: "Desbloquea una misión secundaria larga." }),
  T("Botas del Paso Silente", { folder: `${RIK}/Botín de Investigación`, rarity: "poco", weight: 1, effect: "+10 pies de velocidad y ventaja en las pruebas de Sigilo.", fx: [speed(10)] }),
  C("Proyectiles Explosivos (x20)", {
    folder: `${RIK}/Botín de Investigación`, rarity: "raro", sub: "ammo", charges: 20, qty: 1,
    effect: "Munición. Añade 1d6 al daño y todas las criaturas en un radio de 10 pies deben hacer una salvación de Destreza (CD = 8 + competencia + Fuerza + Destreza) o recibir <strong>2d6 de daño de fuego</strong>; la mitad si la superan.",
    acts: [save("dex", DC_FUE_DES, [[2, 6, "fire"]], "half", { activation: "special", name: "Explosión" })]
  }),

  // ═════════════ OBJETOS DE TRAMA Y REGALOS ═════════════
  L("Amuleto de Kasten", { folder: TRAMA, magic: true, flavor: "Tiene una inscripción extraña grabada en él, y emite una tenue luz al mirarlo de cerca. Según Kasten, es un pase de entrada a Rikarisu." }),
  C("Brebaje de Flores", {
    folder: TRAMA, rarity: "raro", charges: 5, owner: "Wynna (regalo de Myrrha)",
    flavor: "Una gran jarra llena de un líquido rosado vibrante; pequeños pétalos y hojas flotan en la superficie y otros reposan en el fondo. Con un sabor medianamente amargo, resulta en un destilado bastante nutritivo para ayudar a recuperar fuerzas.",
    effect: "<strong>Pasión de Rosas.</strong> 5 usos. Recupera 4d8 + tu modificador por Sabiduría puntos de golpe. Además, elige un efecto: eliminar una condición entre envenenado, paralizado o enfermo; o recuperar 1 dado de golpe gastado.",
    acts: [healF("4d8 + @abilities.wis.mod", { name: "Pasión de Rosas" })]
  }),
  T("Lanzador de Cadenas", {
    folder: TRAMA, rarity: "poco", uses: uses(3, "sr"), weight: 3, owner: "Erwin (mejora de Kiri-Kiri)",
    flavor: "Un prototipo de un gancho con cuerda, pero mejorado utilizando los colmillos de un Lobo Siamés; proporciona un mejor agarre y puede ser lanzado con un simple movimiento.",
    effect: "<strong>Cadena de Acero Inoxidable.</strong> Como acción adicional, disparas una cadena de hasta 50 pies: te mueves esa distancia, o impactas a un enemigo causándole 1d4 de daño perforante; el objetivo debe superar una salvación de Destreza CD 14: si falla queda apresado una ronda; si tiene éxito, por dos. <em>(Así figura en el documento; quizá querías decir que con éxito no queda apresado.)</em> 3 cargas; se recuperan tras un descanso corto.",
    acts: [save("dex", 14, [[1, 4, "piercing"]], "full", { activation: "bonus", name: "Cadena" })]
  }),

  // ═════════════ LA MUDA DEL DESIERTO · Botín del Jardinero ═════════════
  W("Tijeras Anómalas", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", base: "tijeras", dice: [2, 8], bonus: 2, owner: "Kaida", effect: "2d8 de daño cortante mágico, +2 al ataque y al daño. Causa el mismo efecto que el <em>Podar</em> del Jardinero: recuperas la mitad del daño infligido. Como acción, en lugar de atacar, puedes «podar» el espacio para disipar un efecto mágico en un radio de 3 pies." }),
  T("Corona de Pétalos Marchitos", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", owner: "Wynna", effect: "Resistencia al daño necrótico e inmunidad a los estados producidos por esporas.", fx: [dr("necrotic")] }),
  C("Esencia Destilada de Anomalía", { folder: `${MUDA}/Botín del Jardinero`, rarity: "muy", qty: 5, sub: "trinket", owner: "Erwin (x5)", effect: "Uso desconocido.", note: "Ver «Secretos de Objetos» en el diario de campaña.", acts: [util()] }),
  W("Hoz de Cultivo Carnívoro", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", base: "hoz", dice: [1, 8], bonus: 1, owner: "Lymon", effect: "1d8 de daño, +1 al ataque y al daño. Al atacar a un enemigo lo marcas: hasta el comienzo de tu siguiente turno, el próximo ataque que reciba de otro jugador hace 1d6 de daño necrótico extra. Si reduces a una criatura a 0 puntos de golpe, recuperas 5 puntos de golpe." }),
  W("Arco de Esporas", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", base: "arcoCorto", dice: [1, 6], dtype: "poison", bonus: 1, effect: "1d6 de daño de veneno, +1 al ataque y al daño. Si aciertas dos golpes consecutivos al mismo objetivo, debe superar una salvación de Destreza CD 14 o quedar apresado por raíces." }),
  W("Bastón de Madera Viviente", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", base: "baston", dice: [1, 6], bonus: 2, owner: "Amaris", uses: uses(1, "lr"), effect: "1d6 de daño, +2 al ataque y al daño. Usado como foco arcano: cuando fallas un conjuro o superan tu salvación de conjuro, puedes forzar a repetir la tirada una vez por descanso largo. Además, recuperas un espacio de conjuro de nivel 1 al matar a un enemigo con un conjuro." }),
  W("Lanza de Raíz Impaciente", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", base: "lanza", dice: [1, 8], bonus: 1, owner: "Erwin", effect: "1d8 de daño, +1 al ataque y al daño. Una vez por turno, si aciertas, puedes intentar enraizar al objetivo: debe superar una salvación de Destreza CD 14 o quedar apresado y recibir 1d4 de daño perforante en cada turno que no se libere." }),
  W("Dagas Gemelas «Siembra y Cosecha»", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", base: "daga", dice: [1, 4], bonus: 2, qty: 2, owner: "Edmund", effect: "1d4 de daño, +2 al ataque y al daño. Si impactas con ambas en el mismo turno, la primera resta 1d4 a la siguiente tirada del oponente y la segunda te cura la mitad del daño total infligido." }),
  W("Espadón del Jardín Marchito", {
    folder: `${MUDA}/Botín del Jardinero`, rarity: "muy", base: "espadon", dice: [2, 6], bonus: 3, owner: "Basil", uses: uses(1, "sr"),
    effect: "2d6 de daño, +3 al ataque y al daño. Una vez por descanso corto puedes hacer un <strong>ataque en arco</strong> (3 pies): las criaturas en el área deben superar una salvación de Destreza CD 16 o recibir 2d6 de daño cortante y 2d6 de daño necrótico."
  }),
  A("Manto de Hojas Fotosintéticas", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", kind: "light", ac: 12, effect: "Armadura ligera (CA 12 + Des). Si comienzas tu turno en luz natural, recuperas 1d4 puntos de golpe. Ventaja en Sigilo en terreno natural." }),
  A("Coraza de Corteza Viviente", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", kind: "medium", ac: 14, owner: "Edmund", uses: uses(1, "sr"), effect: "Armadura media (CA 14 + Des, máx. 2). Resistencia al veneno. Una vez por descanso corto, cuando recibes daño, puedes reducirlo en 1d10 + tu nivel. Si caes por debajo de la mitad de tus puntos de golpe, tu CA aumenta en 1.", fx: [dr("poison")] }),
  A("Placas de Roca de Lluvia", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", kind: "heavy", ac: 16, owner: "Clow", uses: uses(1, "lr"), effect: "Armadura pesada (CA 16). En terreno natural no puedes ser movido contra tu voluntad. Una vez por descanso largo puedes convertir un crítico que recibas en un golpe normal." }),
  T("Velo de Pétalos Errantes", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", attune: true, owner: "Amaris", uses: uses(2, "lr"), effect: "+1 CA. Dos veces por descanso largo puedes generar una corriente de pétalos a tu alrededor para imponer desventaja a un ataque que vayas a recibir.", fx: [ac(1)], acts: [util({ activation: "reaction" })] }),
  A("Placas de Simbiosis Incompleta", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", kind: "medium", ac: 14, attune: true, effect: "Armadura media (CA 14 + Des, máx. 2). Al empezar un combate eliges el modo: <strong>Seguro</strong> (+1 CA) o <strong>Adaptativo</strong> (cuando recibes un tipo de daño por primera vez, ganas resistencia a ese tipo un turno después, hasta el final del combate). Si el combate termina en Modo Adaptativo, debes superar una salvación de Constitución CD 14 o recibir 2d6 de daño necrótico.", acts: [save("con", 14, [[2, 6, "necrotic"]], "none", { activation: "special", name: "Fin del Modo Adaptativo", consumption: { targets: [], scaling: { allowed: false, max: "" }, spellSlot: false } })] }),
  A("Armadura del Jardín Marchito", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", kind: "light", ac: 13, attune: true, owner: "Kaida", effect: "Armadura ligera (CA 13 + Des). Cuando reduces a una criatura a 0 puntos de golpe, recuperas 1d6 puntos de golpe. Si matas a una anomalía con esta armadura puesta, recuperas un uso de una habilidad al azar, pero tienes un 50 % de probabilidad de quedar hechizado." }),
  C("Pétalos Silenciosos", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", charges: 3, owner: "Basil", effect: "Un frasco con pétalos rosados. Al consumirlo recuperas 2d8 + 4 puntos de golpe y te recuperas del envenenamiento. 3 usos.", acts: [heal(2, 8, "4")] }),
  T("Reliquia del Jardinero Marchito", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", attune: true, owner: "Erwin", uses: uses(1, "lr"), effect: "Ventaja en las pruebas de Naturaleza y Supervivencia y resistencia al daño de veneno. Una vez por descanso largo puedes lanzar <em>Enredar</em> sin gastar espacio de conjuro.", fx: [dr("poison")], acts: [save("str", null, [], "none", { name: "Enredar" })] }),
  T("Amuleto de la Floración Eterna", { folder: `${MUDA}/Botín del Jardinero`, rarity: "raro", owner: "Koda", uses: uses(1, "lr"), effect: "Cuando te curan con magia recuperas 1d4 puntos de golpe adicionales. Una vez por descanso largo, cuando caigas a 0 puntos de golpe, en lugar de caer inconsciente te quedas con 1 punto de golpe, pero te brotan flores en el cuerpo de forma permanente.", acts: [util({ activation: "special" })] }),
  T("Reliquia · Cascarón de la Primera Evolución", { folder: `${MUDA}/Botín del Jardinero`, rarity: "leg", owner: "Clow", effect: "+2 CA e inmunidad a enfermedades mágicas. Cuando una anomalía intente atacarte por primera vez, debe superar una salvación de Sabiduría CD 14 o cambiar de objetivo. En terreno anómalo puedes comunicarte con la anomalía para obtener pistas (ayuda del DM). Pero, si mueres, te conviertes en una anomalía.", fx: [ac(2)] }),

  // ═════════════ LA MUDA DEL DESIERTO · Materiales y botín de caravanas ═════════════
  L("Hojas y Flores Anómalas (poco comunes)", { folder: `${MUDA}/Materiales`, rarity: "poco", sub: "material", effect: "Material de alquimia hallado alrededor de la anomalía." }),
  L("Hojas y Flores Anómalas (raras)", { folder: `${MUDA}/Materiales`, rarity: "raro", sub: "material", effect: "Material de alquimia de gran calidad." }),
  L("Huesos Anómalos", { folder: `${MUDA}/Materiales`, sub: "material", effect: "Restos de criaturas mudadas." }),
  L("Núcleo Anómalo Apagado", { folder: `${MUDA}/Materiales`, rarity: "muy", sub: "material", effect: "Resultado 20 al investigar las caravanas destruidas." }),
  L("Flor Cristalizada", { folder: `${MUDA}/Materiales`, price: 50, sub: "material", effect: "Se vende por 40–60 de oro." }),
  L("Savia Endurecida", { folder: `${MUDA}/Materiales`, price: 25, sub: "material" }),
  L("Pétalos Anómalos", { folder: `${MUDA}/Materiales`, price: 10, sub: "material", effect: "10 de oro cada uno." }),
  L("Semilla Anómala", { folder: `${MUDA}/Materiales`, price: 85, sub: "material", owner: "Lymon", effect: "Se vende por 75–100 de oro." }),
  L("Fragmento de Raíz Viva", { folder: `${MUDA}/Materiales`, price: 50, sub: "material" }),
  L("Núcleo Fragmentado del Jardín", { folder: `${MUDA}/Materiales`, price: 160, sub: "material", owner: "Basil", effect: "Se vende por 120–200 de oro." }),
  L("Agua del Jardín", { folder: `${MUDA}/Materiales`, price: 30, sub: "material" }),
  L("Corteza Mutada", { folder: `${MUDA}/Materiales`, price: 15, sub: "material" }),
  L("Semilla Latente del Jardín", { folder: `${MUDA}/Materiales`, price: 250, sub: "material", owner: "Erwin", effect: "Se vende por 200–300 de oro." }),
  L("Fragmento del Corazón del Jardinero", { folder: `${MUDA}/Materiales`, price: 250, sub: "material", note: "Gancho a futuro." }),

  // ═════════════ ALDEA MIGURD · Roka ═════════════
  C("Raciones Migurd", { folder: `${MIG}/Roka`, price: 10, sub: "food", effect: "Duran 3 días y, fuera de combate, recuperan 2d6 puntos de golpe.", acts: [heal(2, 6)] }),
  C("Ungüento Antitoxinas", { folder: `${MIG}/Roka`, rarity: "comun", price: 20, effect: "Ventaja contra veneno durante 1 hora, o elimina la condición envenenado.", acts: [util()] }),
  T("Kit de Supervivencia Experto", { folder: `${MIG}/Roka`, price: 30, weight: 5, uses: { spent: 0, max: "1", recovery: [] }, effect: "Da ventaja en Supervivencia durante 1 día.", acts: [util()] }),
  T("Antorcha de Llama Verde", { folder: `${MIG}/Roka`, rarity: "comun", price: 15, weight: 1, effect: "No se apaga y disipa ilusiones menores." }),
  T("Botas de Paso Ligero", { folder: `${MIG}/Roka`, rarity: "poco", price: 25, weight: 1, uses: { spent: 0, max: "1", recovery: [{ period: "lr", type: "recoverAll" }] }, effect: "Durante 1 minuto no activas trampas y tienes ventaja en Sigilo en terreno natural.", note: "El documento no indica usos; aquí se sugiere 1 por descanso largo.", acts: [util({ activation: "bonus" })] }),
  T("Talismán de Resistencia", { folder: `${MIG}/Roka`, rarity: "poco", price: 60, uses: uses(1, "sr"), effect: "Como reacción, reduces el daño recibido en 1d8 + tu modificador de Constitución.", note: "El documento no indica usos; aquí se sugiere 1 por descanso corto.", acts: [util({ activation: "reaction", formula: "1d8 + @abilities.con.mod", rollName: "Daño reducido" })] }),

  // ═════════════ ALDEA MIGURD · Dreno ═════════════
  C("Poción de Curación (Dreno)", { folder: `${MIG}/Dreno`, rarity: "comun", magic: true, price: 15, effect: "Cura 2d4 + 2 puntos de golpe.", acts: [heal(2, 4, "2")] }),
  C("Poción de Curación Mayor", { folder: `${MIG}/Dreno`, rarity: "poco", price: 25, effect: "Cura 4d4 + 4 puntos de golpe.", acts: [heal(4, 4, "4")] }),
  C("Esencia de Vitalidad", { folder: `${MIG}/Dreno`, rarity: "poco", price: 30, effect: "Durante 3 turnos, cura 2d4 puntos de golpe al inicio de cada turno.", note: "Precio: 50 de oro en la sesión 12, 30 en la sesión 14.", acts: [heal(2, 4, "", { activation: "special", consumption: { targets: [], scaling: { allowed: false, max: "" }, spellSlot: false } })] }),
  C("Semilla de Contención", { folder: `${MIG}/Dreno`, rarity: "poco", price: 30, sub: "trinket", effect: "Arrojadiza. Crea raíces en un radio de 10 pies: salvación de Fuerza CD 13 o apresado.", acts: [save("str", 13, [], "none")] }),
  C("Fragancia de Claridad", { folder: `${MIG}/Dreno`, rarity: "poco", price: 35, effect: "Elimina las condiciones hechizado y asustado, y otorga ventaja contra ambas durante 1 minuto.", acts: [util()] }),
  C("Extracto de Reflejos Natural", { folder: `${MIG}/Dreno`, rarity: "poco", price: 50, charges: 2, effect: "Ventaja en las salvaciones de Destreza durante 1 minuto. 2 usos.", acts: [util()] })
];
