// Genera el compendio del módulo aparte «Tutorial de Foundry» (carpeta tutorial/) a partir de src/tutorial.mjs.
// Uso: npm run build:tutorial
import path from "node:path";
import { buildPacks } from "./build-lib.mjs";
import tutorial from "../src/tutorial.mjs";

export const TUTORIAL_ID = "mushoku-tutorial-foundry";
const root = path.resolve(import.meta.dirname, "..");
await buildPacks({
  packs: [{ name: "tutorial-foundry", collection: "adventures", docs: tutorial }],
  outRoot: path.join(root, "tutorial"), moduleId: TUTORIAL_ID, workDir: path.join(root, "build", "_source_tutorial")
});
