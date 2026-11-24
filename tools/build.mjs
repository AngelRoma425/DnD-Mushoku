// Genera los compendios del módulo a partir de src/*.mjs.
// Uso: npm install && npm run build
import path from "node:path";
import { MODULE_ID } from "./helpers.mjs";
import { buildPacks } from "./build-lib.mjs";

import hechizos from "../src/hechizos.mjs";
import rasgos from "../src/rasgos.mjs";
import razas from "../src/razas.mjs";
import objetos from "../src/objetos.mjs";
import bestiario from "../src/bestiario.mjs";
import guia from "../src/guia.mjs";
import tutorial from "../src/tutorial.mjs";

export const PACKS = [
  { name: "mt-hechizos", collection: "items", docs: hechizos },
  { name: "mt-rasgos", collection: "items", docs: rasgos },
  { name: "mt-razas", collection: "items", docs: razas },
  { name: "mt-objetos", collection: "items", docs: objetos },
  { name: "mt-bestiario", collection: "actors", docs: bestiario },
  { name: "mt-guia", collection: "journal", docs: guia },
  { name: "mt-tutorial", collection: "adventures", docs: tutorial }
];

const root = path.resolve(import.meta.dirname, "..");
await buildPacks({ packs: PACKS, outRoot: root, moduleId: MODULE_ID, workDir: path.join(root, "build", "_source") });
