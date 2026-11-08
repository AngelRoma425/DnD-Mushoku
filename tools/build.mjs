// Genera los compendios del módulo a partir de src/*.mjs.
// Uso: npm install && npm run build
import fs from "node:fs";
import path from "node:path";
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { id } from "./helpers.mjs";

import hechizos from "../src/hechizos.mjs";
import rasgos from "../src/rasgos.mjs";
import razas from "../src/razas.mjs";
import objetos from "../src/objetos.mjs";
import bestiario from "../src/bestiario.mjs";
import guia from "../src/guia.mjs";

const PACKS = [
  { name: "mt-hechizos", collection: "items", docs: hechizos },
  { name: "mt-rasgos", collection: "items", docs: rasgos },
  { name: "mt-razas", collection: "items", docs: razas },
  { name: "mt-objetos", collection: "items", docs: objetos },
  { name: "mt-bestiario", collection: "actors", docs: bestiario },
  { name: "mt-guia", collection: "journal", docs: guia }
];

const EMBEDDED = { actors: ["items", "effects"], items: ["effects"], journal: ["pages"] };

function prepare(doc, collection, pack, key = null, parentKey = null) {
  const out = structuredClone(doc);
  out._id = key ?? id(pack, doc.name);
  out._key = parentKey ? `!${parentKey.collection}.${collection}!${parentKey.id}.${out._id}` : `!${collection}!${out._id}`;
  out.flags ??= {};
  out.ownership ??= { default: 0 };
  if (!parentKey) out.folder = null;
  for (const sub of EMBEDDED[collection] ?? []) {
    out[sub] = (out[sub] ?? []).map((child, i) =>
      prepare(child, sub, pack, id(pack, doc.name, sub, child.name, i), { collection, id: out._id }));
    if (sub !== "pages") out[sub].forEach(c => { delete c.ownership; });
  }
  return out;
}

const root = path.resolve(import.meta.dirname, "..");
const srcRoot = path.join(root, "build", "_source");
fs.rmSync(path.join(root, "build"), { recursive: true, force: true });

for (const { name, collection, docs } of PACKS) {
  const dir = path.join(srcRoot, name);
  fs.mkdirSync(dir, { recursive: true });
  const seen = new Set();
  for (const doc of docs) {
    const data = prepare(doc, collection, name);
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
