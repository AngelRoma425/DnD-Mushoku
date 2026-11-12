// Genera los compendios del módulo a partir de src/*.mjs.
// Uso: npm install && npm run build
import fs from "node:fs";
import path from "node:path";
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { id, MODULE_ID } from "./helpers.mjs";

import hechizos from "../src/hechizos.mjs";
import rasgos from "../src/rasgos.mjs";
import razas from "../src/razas.mjs";
import objetos from "../src/objetos.mjs";
import bestiario from "../src/bestiario.mjs";
import guia from "../src/guia.mjs";
import campanaDiario from "../src/campana/diario.mjs";
import campanaObjetos from "../src/campana/objetos.mjs";
import anomalias from "../src/campana/anomalias.mjs";
import mercaderes from "../src/campana/mercaderes.mjs";
import tablas from "../src/campana/tablas.mjs";

const PACKS = [
  { name: "mt-hechizos", collection: "items", docs: hechizos },
  { name: "mt-rasgos", collection: "items", docs: rasgos },
  { name: "mt-razas", collection: "items", docs: razas },
  { name: "mt-objetos", collection: "items", docs: objetos },
  { name: "mt-bestiario", collection: "actors", docs: bestiario },
  { name: "mt-guia", collection: "journal", docs: guia },
  { name: "mt-campana", collection: "journal", docs: campanaDiario },
  { name: "mt-campana-objetos", collection: "items", docs: campanaObjetos },
  { name: "mt-anomalias", collection: "actors", docs: anomalias },
  { name: "mt-mercaderes", collection: "actors", docs: mercaderes },
  { name: "mt-tablas", collection: "tables", docs: tablas }
];

const EMBEDDED = { actors: ["items", "effects"], items: ["effects"], journal: ["pages"], tables: ["results"] };

const FOLDER_TYPE = { items: "Item", actors: "Actor", journal: "JournalEntry", tables: "RollTable" };

/** Crea las carpetas (rutas "A/B") que usan los documentos de un compendio. */
function folders(docs, collection, pack) {
  const out = new Map();
  for (const doc of docs) {
    if (!doc.folder) continue;
    const parts = doc.folder.split("/");
    parts.forEach((name, i) => {
      const path = parts.slice(0, i + 1).join("/");
      if (out.has(path)) return;
      const parent = i ? out.get(parts.slice(0, i).join("/"))._id : null;
      const _id = id(pack, "folder", path);
      out.set(path, { _id, _key: `!folders!${_id}`, name, type: FOLDER_TYPE[collection], folder: parent, sorting: "m", sort: out.size * 1000, color: null, description: "", flags: {} });
    });
  }
  return out;
}

function prepare(doc, collection, pack, key = null, parentKey = null, folderMap = null) {
  const out = structuredClone(doc);
  out._id = key ?? id(pack, doc.name);
  // parentKey = { collections: ["actors", "items"], ids: [actorId, itemId] } para documentos anidados.
  out._key = parentKey
    ? `!${[...parentKey.collections, collection].join(".")}!${[...parentKey.ids, out._id].join(".")}`
    : `!${collection}!${out._id}`;
  out.flags ??= {};
  out.ownership ??= { default: 0 };
  if (!parentKey) out.folder = doc.folder ? folderMap.get(doc.folder)._id : null;
  for (const sub of EMBEDDED[collection] ?? []) {
    out[sub] = (out[sub] ?? []).map((child, i) =>
      prepare(child, sub, pack, id(pack, out._id, sub, child.name, i), {
        collections: [...(parentKey?.collections ?? []), collection],
        ids: [...(parentKey?.ids ?? []), out._id]
      }));
    if (sub !== "pages") out[sub].forEach(c => { delete c.ownership; });
  }
  return out;
}

const root = path.resolve(import.meta.dirname, "..");
const srcRoot = path.join(root, "build", "_source");
fs.rmSync(path.join(root, "build"), { recursive: true, force: true });

// Comprobar que cada @UUID y cada ItemGrant apunta a un documento existente.
const known = new Set(PACKS.flatMap(({ name, collection, docs }) =>
  docs.map(d => `Compendium.${MODULE_ID}.${name}.${FOLDER_TYPE[collection]}.${id(name, d.name)}`)));
const refs = (JSON.stringify(PACKS.map(p => p.docs)).match(/Compendium\.[\w-]+\.[\w-]+\.\w+\.\w{16}/g) ?? [])
  .filter(r => r.startsWith(`Compendium.${MODULE_ID}.`));
const broken = [...new Set(refs)].filter(r => !known.has(r));
if (broken.length) throw new Error(`Enlaces rotos:\n${broken.join("\n")}`);

for (const { name, collection, docs } of PACKS) {
  const dir = path.join(srcRoot, name);
  fs.mkdirSync(dir, { recursive: true });
  const seen = new Set();
  const folderMap = folders(docs, collection, name);
  for (const f of folderMap.values()) fs.writeFileSync(path.join(dir, `_folder_${f._id}.json`), JSON.stringify(f, null, 2));
  for (const doc of docs) {
    const data = prepare(doc, collection, name, null, null, folderMap);
    if (seen.has(data._id)) throw new Error(`ID duplicado en ${name}: ${doc.name}`);
    seen.add(data._id);
    const file = `${doc.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w]+/g, "_")}_${data._id}.json`;
    fs.writeFileSync(path.join(dir, file), JSON.stringify(data, null, 2));
  }
  const dest = path.join(root, "packs", name);
  fs.rmSync(dest, { recursive: true, force: true });
  await compilePack(dir, dest, { log: false });
  console.log(`✔ ${name}: ${docs.length} documentos`);
}
