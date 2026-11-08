import { createHash } from "node:crypto";

export const MODULE_ID = "mushoku-tensei-dnd";
export const SOURCE = { custom: "Mushoku Tensei (homebrew)", book: "Mushoku Tensei", page: "", license: "" };

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** ID determinista de 16 caracteres (los IDs no cambian entre compilaciones). */
export function id(...parts) {
  const hash = createHash("sha256").update(parts.join("|")).digest();
  let out = "";
  for (let i = 0; i < 16; i++) out += ALPHABET[hash[i] % ALPHABET.length];
  return out;
}

export function uuid(pack, type, name) {
  return `Compendium.${MODULE_ID}.${pack}.${type}.${id(pack, name)}`;
}

/** Parte de daño o curación de dnd5e 4.x/5.x. */
export function dmg(number, denomination, types, { bonus = "", scaling = null, custom = null } = {}) {
  return {
    number, denomination, bonus,
    types: Array.isArray(types) ? types : [types],
    custom: custom ? { enabled: true, formula: custom } : { enabled: false, formula: "" },
    scaling: scaling ? { mode: "whole", number: scaling, formula: "" } : { mode: "", number: null, formula: "" }
  };
}

const activation = (type = "action", value = 1, condition = "") => ({ type, value, condition, override: false });

function base(owner, key, type, extra) {
  const _id = id(owner, "activity", extra.key ?? key);
  return {
    _id, type, name: extra.name ?? "", img: extra.img ?? "",
    activation: extra.activation ?? { override: false },
    consumption: extra.consumption ?? { targets: [], scaling: { allowed: false, max: "" }, spellSlot: true },
    description: { chatFlavor: extra.flavor ?? "" },
    duration: { override: false }, range: { override: false },
    target: { override: false, prompt: true },
    uses: { spent: 0, max: "", recovery: [] },
    sort: 0
  };
}

/** Ataque (de conjuro o de arma). */
export function attackActivity(owner, { kind = "ranged", classification = "spell", parts = [], includeBase = false, ability = "", bonus = "", ...extra } = {}) {
  return {
    ...base(owner, "attack", "attack", extra),
    attack: { ability, bonus, critical: { threshold: null }, flat: false, type: { value: kind, classification } },
    damage: { critical: { bonus: "" }, includeBase, parts }
  };
}

/** Tirada de salvación. */
export function saveActivity(owner, { ability = "dex", onSave = "half", parts = [], dc = null, ...extra } = {}) {
  return {
    ...base(owner, "save", "save", extra),
    damage: { onSave, parts },
    save: {
      ability: Array.isArray(ability) ? ability : [ability],
      dc: dc ? { calculation: "", formula: String(dc) } : { calculation: "spellcasting", formula: "" }
    }
  };
}

/** Curación o puntos de golpe temporales. */
export function healActivity(owner, part, extra = {}) {
  return { ...base(owner, "heal", "heal", extra), healing: part };
}

/** Actividad genérica (efectos descritos en texto). */
export function utilityActivity(owner, extra = {}) {
  return { ...base(owner, "utility", "utility", extra), roll: { formula: extra.formula ?? "", name: extra.rollName ?? "", prompt: false, visible: false } };
}

export const act = activation;

export function activities(...list) {
  return Object.fromEntries(list.map(a => [a._id, a]));
}

/** Usos limitados por descanso. */
export function uses(max, period = "lr") {
  return { spent: 0, max: String(max), recovery: [{ period, type: "recoverAll" }] };
}

/** Consumo de los usos del propio objeto. */
export const consumeUse = { targets: [{ type: "itemUses", target: "", value: "1", scaling: { mode: "", formula: "" } }], scaling: { allowed: false, max: "" }, spellSlot: false };

export const html = (...paras) => paras.map(p => (p.startsWith("<") ? p : `<p>${p}</p>`)).join("\n");
