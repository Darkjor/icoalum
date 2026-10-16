// Resolutor mínimo para correr los tests con `node --test` (type stripping nativo, sin
// instalar tsx): resuelve el alias `@/` y los imports TypeScript sin extensión.
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");

function withTs(file) {
  for (const c of [file, `${file}.ts`, path.join(file, "index.ts")]) {
    if (path.extname(c) && existsSync(c)) return pathToFileURL(c).href;
  }
  return undefined;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    let file;
    if (specifier.startsWith("@/")) file = path.join(src, specifier.slice(2));
    else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
      file = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    }
    const url = file && withTs(file);
    return url ? { url, shortCircuit: true } : nextResolve(specifier, context);
  },
});
