// Objetos, equipo mágico y monedas.
import { SOURCE, dmg, act, activities, healActivity, utilityActivity, uses, consumeUse, html } from "../tools/helpers.mjs";

function item(name, type, { img, rarity = "", price = 0, denom = "gp", weight = 0, description, attunement = "", magical = false, extra = {}, acts = [] }) {
  return {
    name, type, img,
    system: {
      description: { value: description, chat: "" },
      source: SOURCE,
      quantity: 1,
      weight: { value: weight, units: "lb" },
      price: { value: price, denomination: denom },
      rarity, attunement,
      properties: magical ? ["mgc"] : [],
      identified: true,
      ...extra,
      ...(acts.length ? { activities: activities(...acts.map(f => f(name))) } : {})
    }
  };
}

const coin = (name, value, denom, description) =>
  item(name, "loot", { img: "icons/svg/coins.svg", price: value, denom, weight: 0.02, description: html(description), extra: { type: { value: "treasure", subtype: "" } } });

export default [
  item("Bastón de Aprendiz", "equipment", {
    img: "icons/svg/book.svg", price: 10, weight: 4,
    extra: { type: { value: "trinket", baseItem: "" } },
    description: html("Un bastón de madera sencillo con una pequeña piedra mágica en la punta. Sirve como <strong>foco arcano</strong>. Es el primer regalo típico para un niño con talento para la magia.")
  }),
  item("Aqua Heartia", "equipment", {
    img: "icons/svg/ice-aura.svg", rarity: "rare", price: 5000, weight: 4, attunement: "required", magical: true,
    description: html(
      "Un bastón de madera de tesoro rematado por una gran piedra mágica azul de primera calidad. Se dice que un bastón así es el regalo de toda una vida.",
      "<ul><li>Mientras estés sintonizado, obtienes <strong>+1</strong> a las tiradas de ataque de conjuro y a la CD de tus conjuros.</li><li>Los conjuros de <strong>agua y hielo</strong> que lances con él infligen daño adicional igual a tu bonificador por competencia en una de sus tiradas.</li><li>Una vez al amanecer, puedes lanzar <em>Lanza de Hielo</em> sin gastar espacio.</li></ul>"
    ),
    acts: [n => utilityActivity(n, { name: "Lanza de Hielo gratuita", consumption: consumeUse })],
    extra: { type: { value: "trinket", baseItem: "" }, uses: uses(1, "dawn") }
  }),
  item("Piedra Mágica", "consumable", {
    img: "icons/svg/upgrade.svg", rarity: "uncommon", price: 200, weight: 0.5, magical: true,
    extra: { type: { value: "trinket", subtype: "" }, uses: { spent: 0, max: "1", recovery: [], autoDestroy: true } },
    description: html("Un cristal que acumula maná, extraído normalmente de monstruos poderosos. Como acción, un lanzador de conjuros puede absorber su energía para <strong>recuperar un espacio de conjuro de nivel 1 a 3</strong>, según la calidad de la piedra (a criterio del DM). La piedra se convierte en polvo."),
    acts: [n => utilityActivity(n, { activation: act("action"), consumption: consumeUse })]
  }),
  item("Pergamino de Círculo Mágico", "consumable", {
    img: "icons/svg/book.svg", rarity: "uncommon", price: 150, weight: 0,
    extra: { type: { value: "scroll", subtype: "" }, uses: { spent: 0, max: "1", recovery: [], autoDestroy: true } },
    description: html(
      "Un pergamino con un círculo mágico grabado que contiene un único hechizo. Cualquier criatura, aunque no sepa magia, puede activarlo vertiendo maná en él (acción).",
      "Contiene un conjuro de nivel 1 o 2 elegido al crearlo. Usa CD 13 y +5 al ataque. Los círculos de invocación y teletransporte son muy raros y están prohibidos en varios reinos."
    ),
    acts: [n => utilityActivity(n, { activation: act("action"), consumption: consumeUse })]
  }),
  item("Poción de Curación Menor", "consumable", {
    img: "icons/svg/heal.svg", rarity: "common", price: 50, weight: 0.5, magical: true,
    extra: { type: { value: "potion", subtype: "" }, uses: { spent: 0, max: "1", recovery: [], autoDestroy: true } },
    description: html("Una infusión de hierbas cargada con un encantamiento de curación de rango Principiante. Recuperas <strong>2d4 + 2</strong> puntos de golpe al beberla."),
    acts: [n => healActivity(n, dmg(2, 4, "healing", { bonus: "2" }), { activation: act("bonus"), consumption: consumeUse })]
  }),
  item("Tarjeta de Aventurero", "loot", {
    img: "icons/svg/book.svg", price: 0, weight: 0,
    extra: { type: { value: "gear", subtype: "" } },
    description: html("Una placa metálica emitida por el Gremio de Aventureros con el nombre, la raza, la profesión y el <strong>rango</strong> (F a S) de su portador. Funciona en todas las sucursales del mundo. El grupo también tiene su propio rango de equipo.")
  }),

  // ───────────── Monedas (equivalencias sugeridas en la guía) ─────────────
  coin("Moneda de Oro de Asura", 10, "gp", "Moneda de oro acuñada por el Reino de Asura, la más valiosa del Continente Central. <strong>Equivale a 10 po</strong> (la economía de Asura es mucho más rica que la de otros reinos)."),
  coin("Moneda de Plata de Asura", 1, "gp", "Moneda de plata de Asura. <strong>Equivale a 1 po.</strong> 10 monedas de plata = 1 moneda de oro de Asura."),
  coin("Moneda de Cobre de Asura", 1, "sp", "Moneda de cobre de Asura. <strong>Equivale a 1 pp</strong> (pieza de plata del manual)."),
  coin("Piedra Verde (Continente Demoníaco)", 1, "cp", "En el Continente Demoníaco se comercia con piedras talladas en lugar de monedas. La piedra verde es la de menor valor: <strong>equivale a 1 pc</strong>. Las piedras de hierro (≈1 pp) y las de cristal (≈1 po) son las de mayor valor.")
];
