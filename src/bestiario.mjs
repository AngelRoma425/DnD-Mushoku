// Bestiario: monstruos y PNJ del mundo de Mushoku Tensei.
import { SOURCE, dmg, act, activities, attackActivity, saveActivity, healActivity, utilityActivity, uses, consumeUse, html } from "../tools/helpers.mjs";
import HECHIZOS from "./hechizos.mjs";
import RASGOS from "./rasgos.mjs";

const abil = (str, dex, con, int, wis, cha) =>
  Object.fromEntries(Object.entries({ str, dex, con, int, wis, cha }).map(([k, v]) => [k, { value: v, proficient: 0 }]));

function weapon(owner, name, { kind = "melee", type = "natural", number, denomination, types, extraParts = [], properties = [], reach = 5, range = null, ability = "", description = "" }) {
  return {
    name, type: "weapon", img: kind === "melee" ? "icons/svg/sword.svg" : "icons/svg/target.svg",
    system: {
      description: { value: html(description), chat: "" },
      source: SOURCE,
      type: { value: type, baseItem: "" },
      equipped: true, proficient: 1, quantity: 1,
      properties,
      range: range ?? { value: null, long: null, reach, units: "ft" },
      damage: { base: dmg(number, denomination, types), versatile: dmg(null, null, []) },
      activities: activities(attackActivity(`${owner}.${name}`, { kind, classification: "weapon", includeBase: true, ability, parts: extraParts }))
    }
  };
}

function trait(owner, name, description, { activation, usesData, acts = [] } = {}) {
  return {
    name, type: "feat", img: "icons/svg/upgrade.svg",
    system: {
      description: { value: html(description), chat: "" },
      source: SOURCE,
      type: { value: "monster", subtype: "" },
      activation: activation ?? { type: "", value: null, condition: "" },
      uses: usesData ?? { spent: 0, max: "", recovery: [] },
      activities: activities(...acts.map(f => f(`${owner}.${name}`)))
    }
  };
}

const copy = (list, names) => names.map(n => {
  const found = list.find(i => i.name === n);
  if (!found) throw new Error(`No existe: ${n}`);
  return structuredClone(found);
});

function npc(name, { img = "icons/svg/mystery-man.svg", cr, xp, size = "med", type = "beast", ac, hp, hpFormula, walk = 30, abilities, skills = {}, darkvision = 0, languages = [], spellcasting = "", spellLevel = 0, biography, items = [] }) {
  return {
    name, type: "npc", img,
    system: {
      abilities,
      attributes: {
        ac: { calc: "flat", flat: ac },
        hp: { value: hp, max: hp, formula: hpFormula, temp: 0, tempmax: 0 },
        movement: { walk, burrow: null, climb: null, fly: null, swim: null, units: "ft", hover: false },
        senses: { darkvision, blindsight: null, tremorsense: null, truesight: null, units: "ft", special: "" },
        spellcasting
      },
      details: {
        cr, type: { value: type, subtype: "", custom: "", swarm: "" },
        alignment: "", spellLevel,
        biography: { value: biography, public: "" }, source: SOURCE
      },
      traits: { size, languages: { value: languages, custom: "" } },
      skills: Object.fromEntries(Object.entries(skills).map(([k, v]) => [k, { value: v, ability: undefined }]))
    },
    prototypeToken: { name, actorLink: false, disposition: type === "humanoid" ? 0 : -1, sight: { enabled: true }, texture: { src: img } },
    items
  };
}

export default [
  npc("Coyote Pax", {
    cr: 0.25, ac: 12, hp: 9, hpFormula: "2d8", walk: 40, abilities: abil(12, 15, 11, 3, 12, 6), skills: { per: 1, ste: 1 },
    biography: html("Coyotes de pelaje pardo que cazan en manadas de seis a doce en las praderas del Continente Central. Son la presa típica de los aventureros de rango F y E, y su piel se vende barata en el gremio."),
    items: [
      weapon("Coyote Pax", "Mordisco", { number: 1, denomination: 6, types: ["piercing"] }),
      trait("Coyote Pax", "Táctica de Manada", "El coyote tiene ventaja en las tiradas de ataque contra una criatura si al menos uno de sus aliados está a 5 pies de ella y no está incapacitado.")
    ]
  }),
  npc("Lobo Ácido", {
    cr: 1, ac: 13, hp: 26, hpFormula: "4d8+8", walk: 40, abilities: abil(15, 15, 14, 3, 12, 6), skills: { per: 1, ste: 1 }, darkvision: 60,
    biography: html("Un lobo de pelaje verdoso del Continente Demoníaco cuya saliva corroe metal y carne. Caza en grupos de tres a cinco. Su glándula de ácido es un material muy cotizado por los alquimistas."),
    items: [
      weapon("Lobo Ácido", "Mordisco Ácido", { number: 1, denomination: 8, types: ["piercing"], extraParts: [dmg(1, 6, "acid")], description: "Si el objetivo lleva armadura metálica no mágica y el ataque impacta con un crítico, la armadura sufre un −1 permanente a la CA." }),
      trait("Lobo Ácido", "Escupitajo Ácido (Recarga 5–6)", "El lobo escupe ácido en una línea de 15 pies y 5 de ancho. Cada criatura en la línea debe hacer una salvación de Destreza CD 12, recibiendo 3d6 de daño de ácido si falla, o la mitad si tiene éxito.", {
        activation: act("action"),
        acts: [n => saveActivity(n, { ability: "dex", onSave: "half", dc: 12, parts: [dmg(3, 6, "acid")] })]
      }),
      trait("Lobo Ácido", "Táctica de Manada", "El lobo tiene ventaja en las tiradas de ataque contra una criatura si al menos uno de sus aliados está a 5 pies de ella y no está incapacitado.")
    ]
  }),
  npc("Mago de Rango Intermedio", {
    cr: 2, type: "humanoid", ac: 12, hp: 33, hpFormula: "6d8+6", abilities: abil(9, 14, 12, 17, 13, 11), skills: { arc: 1, his: 1 },
    languages: ["common"], spellcasting: "int", spellLevel: 5,
    biography: html("Un mago formado en la Universidad de Magia de Ranoa o como tutor de una casa noble. Domina dos o tres escuelas a rango Intermedio. Suele trabajar como apoyo en grupos de aventureros de rango C o B."),
    items: [
      weapon("Mago de Rango Intermedio", "Bastón", { type: "simpleM", number: 1, denomination: 6, types: ["bludgeoning"] }),
      ...copy(HECHIZOS, ["Bola de Agua", "Bala de Piedra", "Manantial", "Curación", "Barrera Elemental", "Cañón de Piedra", "Lanza de Hielo", "Lodazal"])
    ]
  }),
  npc("Caballero del Templo de Millis", {
    cr: 3, type: "humanoid", ac: 18, hp: 52, hpFormula: "8d8+16", abilities: abil(16, 11, 14, 10, 14, 13), skills: { rel: 1, ath: 1 },
    languages: ["common"], spellcasting: "wis", spellLevel: 3,
    biography: html("Un caballero de la Orden del Templo de la Sagrada Iglesia de Millis. Viste armadura pesada blanca, combate con espada y escudo, y domina la magia de curación y de barrera. Algunas facciones de la orden son abiertamente hostiles a las razas demoníacas."),
    items: [
      weapon("Caballero del Templo de Millis", "Espada Larga", { type: "martialM", number: 1, denomination: 8, types: ["slashing"], properties: ["ver"] }),
      trait("Caballero del Templo de Millis", "Ataque Múltiple", "El caballero hace dos ataques con su espada larga."),
      trait("Caballero del Templo de Millis", "Fe Inquebrantable", "El caballero tiene ventaja en las salvaciones contra quedar Asustado o Hechizado."),
      ...copy(HECHIZOS, ["Curación", "Desintoxicación", "Barrera Elemental", "Curación Intermedia"])
    ]
  }),
  npc("Espadachín del Dios de la Espada (Avanzado)", {
    cr: 5, type: "humanoid", ac: 16, hp: 82, hpFormula: "11d8+33", walk: 35, abilities: abil(16, 18, 16, 11, 13, 10), skills: { acr: 1, ath: 1, per: 1 },
    languages: ["common"],
    biography: html("Un espadachín de rango Avanzado del Estilo del Dios de la Espada, formado en el Santuario de la Espada del norte. Ataca siempre primero y busca terminar el combate de un único corte."),
    items: [
      weapon("Espadachín del Dios de la Espada (Avanzado)", "Espada Larga", { type: "martialM", number: 1, denomination: 8, types: ["slashing"], properties: ["ver", "fin"], ability: "dex" }),
      trait("Espadachín del Dios de la Espada (Avanzado)", "Ataque Múltiple", "El espadachín hace tres ataques con su espada larga."),
      trait("Espadachín del Dios de la Espada (Avanzado)", "Toki", "El espadachín suma +2 a las salvaciones de Fuerza y Constitución, y su velocidad ya incluye el aumento del aura de combate."),
      ...copy(RASGOS, ["Estilo del Dios de la Espada"])
    ]
  })
];
