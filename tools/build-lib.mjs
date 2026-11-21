// Construye compendios de Foundry a partir de listas de documentos (lo usan el módulo público y el privado).
import fs from "node:fs";
import path from "node:path";
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { id } from "./helpers.mjs";

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

/**
 * @param {object} o
 * @param {Array} o.packs     [{ name, collection, docs }]
 * @param {string} o.outRoot  carpeta del módulo (se escribe en <outRoot>/packs/<name>)
 * @param {string} o.moduleId id del módulo dueño de los compendios
 * @param {string} o.workDir  carpeta temporal para los JSON de origen
 */
export async function buildPacks({ packs: PACKS, outRoot: root, moduleId: MODULE_ID, workDir }) {
const srcRoot = workDir;
fs.rmSync(srcRoot, { recursive: true, force: true });

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
}
