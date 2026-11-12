// Mercaderes de la campaña como tiendas de Item Piles.
// Cada actor lleva la configuración de Item Piles en flags["item-piles"].data y su inventario como objetos.
import { readFileSync } from "node:fs";
import { html } from "../../tools/helpers.mjs";
import OBJETOS from "./objetos.mjs";

const SRD = JSON.parse(readFileSync(new URL("./srd-equipo.json", import.meta.url)));

/** Objetos de la campaña que están en una carpeta del compendio de objetos. */
const deCarpeta = folder => OBJETOS.filter(o => o.folder === folder).map(o => {
  const copy = structuredClone(o);
  delete copy.folder;
  return copy;
});

/** Equipo del SRD por su nombre en inglés, renombrado al español. */
const srd = (...names) => names.map(n => {
  const e = SRD[n];
  if (!e) throw new Error(`No existe en srd-equipo.json: ${n}`);
  const copy = structuredClone(e.doc);
  delete copy._id;
  copy.name = e.es;
  copy._stats = { compendiumSource: `Compendium.dnd5e.items.Item.${e.srdId}` };
  return copy;
});

const SIMPLES = ["Club", "Dagger", "Greatclub", "Handaxe", "Javelin", "Light Hammer", "Mace", "Quarterstaff", "Sickle", "Spear", "Light Crossbow", "Dart", "Shortbow", "Sling"];
const MARCIALES = ["Battleaxe", "Flail", "Glaive", "Greataxe", "Greatsword", "Halberd", "Lance", "Longsword", "Maul", "Morningstar", "Pike", "Rapier", "Scimitar", "Shortsword", "Trident", "War Pick", "Warhammer", "Whip", "Blowgun", "Hand Crossbow", "Heavy Crossbow", "Longbow", "Net"];
const LIGERAS = ["Padded Armor", "Leather Armor", "Studded Leather Armor"];
const BASICAS = [...LIGERAS, "Hide Armor", "Chain Shirt", "Scale Mail"];

function mercader(name, { folder, img = "icons/svg/coins.svg", descripcion, items, sell = 0.5 }) {
  return {
    name, type: "npc", img, folder,
    system: {
      abilities: Object.fromEntries(["str", "dex", "con", "int", "wis", "cha"].map(k => [k, { value: 10, proficient: 0 }])),
      attributes: { hp: { value: 10, max: 10, formula: "" }, ac: { calc: "flat", flat: 10 } },
      details: { cr: 0, type: { value: "humanoid", subtype: "", custom: "" }, biography: { value: html(descripcion), public: "" } },
      traits: { size: "med" }
    },
    prototypeToken: { name, actorLink: true, disposition: 0, sight: { enabled: false }, texture: { src: img } },
    flags: {
      "item-piles": {
        data: {
          enabled: true,
          type: "merchant",
          description: html(descripcion),
          infiniteQuantity: true,
          infiniteCurrencies: true,
          buyPriceModifier: 1,
          sellPriceModifier: sell,
          hideItemsWithZeroCost: true,
          displayQuantity: "no"
        }
      }
    },
    items
  };
}

const RIK = "Rikarisu";
const MIG = "Aldea Migurd";

export default [
  mercader("Yor'Zuh (Mercader)", {
    folder: RIK, descripcion: "Mercader del gremio de Rikarisu, especializado en equipo para el desierto y los laberintos. Su hijo Nael desapareció en los barrios bajos.",
    items: deCarpeta(`${RIK}/Yor'Zuh (Mercader)`)
  }),
  mercader("Myrrha (Alquimista)", {
    folder: RIK, descripcion: "Alquimista de Rikarisu. Ofrece un 50 % de descuento si el grupo escolta sus caravanas médicas hasta el laberinto.",
    items: deCarpeta(`${RIK}/Myrrha (Alquimista)`)
  }),
  mercader("Kiri-Kiri (Herrero)", {
    folder: RIK, descripcion: "Herrero de Rikarisu. Vende armas sencillas y marciales, armaduras básicas y algunas piezas especiales de su propia forja.",
    items: [...deCarpeta(`${RIK}/Kiri-Kiri (Herrero)`), ...srd(...SIMPLES, ...MARCIALES, ...BASICAS, "Shield", "Arrow", "Crossbow Bolt")]
  }),
  mercader("Seh'ra (Cartógrafa)", {
    folder: RIK, descripcion: "Cartógrafa de Rikarisu: mapas, rutas comerciales seguras y permisos de paso.",
    items: deCarpeta(`${RIK}/Seh'ra (Cartógrafa)`)
  }),
  mercader("Rakk (Contrabandista)", {
    folder: RIK, descripcion: "Contrabandista de los barrios bajos de Rikarisu. Nada de lo que vende tiene permiso… ni garantía.",
    items: deCarpeta(`${RIK}/Rakk (Contrabandista)`)
  }),
  mercader("Sáqher (Taberna Oculta)", {
    folder: RIK, descripcion: "Comerciante de la taberna oculta entre rocas, al borde de Rikarisu. Armas, armaduras y objetos raros… algunos ligados a la anomalía.",
    items: deCarpeta(`${RIK}/Sáqher (Taberna Oculta)`)
  }),
  mercader("Roka", {
    folder: MIG, descripcion: "Mercader de la aldea Migurd: raciones, ungüentos, equipo de supervivencia, armas básicas, armaduras ligeras y escudos.",
    items: [...deCarpeta(`${MIG}/Roka`), ...srd(...SIMPLES, ...LIGERAS, "Shield", "Arrow", "Crossbow Bolt")]
  }),
  mercader("Dreno", {
    folder: MIG, descripcion: "Herbolario de la aldea Migurd: pociones, esencias y semillas de contención.",
    items: deCarpeta(`${MIG}/Dreno`)
  })
];
