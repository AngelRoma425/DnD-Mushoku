# Roll20 → JSON

Extensión de navegador (Chrome, Edge, Brave, Opera y Firefox 128+) que exporta las fichas de personaje de una partida de Roll20 a archivos JSON.

## Instalación

**Chrome / Edge / Brave / Opera**
1. Abre `chrome://extensions` (o `edge://extensions`).
2. Activa **Modo de desarrollador**.
3. Pulsa **Cargar descomprimida** y elige esta carpeta (`roll20-exporter`).

**Firefox**
1. Abre `about:debugging#/runtime/this-firefox`.
2. Pulsa **Cargar complemento temporal…** y elige `manifest.json` de esta carpeta.
   (Firefox lo quita al cerrarse; para dejarlo fijo habría que firmarlo en addons.mozilla.org.)

## Uso

1. Entra en tu partida (`https://app.roll20.net/editor/`) y espera a que cargue.
   Si ya la tenías abierta antes de instalar la extensión, recarga la página.
2. Pulsa el icono de la extensión, marca los personajes y pulsa **Exportar**.

Opciones:
- **Todo en un único archivo**: un JSON con todos los personajes en vez de uno por personaje.
- **Incluir biografía y notas del DM**: las notas del DM solo salen si eres DM.
- **Añadir resumen legible**: además de la lista cruda, agrupa los atributos y las secciones repetibles (hechizos, ataques, inventario…).
- **Mostrar personajes archivados**.

Solo puedes exportar los personajes que tu cuenta puede ver en el diario.

## Formato

```jsonc
{
  "schema_version": 2,
  "type": "character",
  "character": {
    "oldId": "-N…", "name": "…", "avatar": "https://…",
    "bio": "<p>…</p>", "gmnotes": "…", "defaulttoken": "{…}",   // token como texto JSON
    "tags": "", "controlledby": "", "inplayerjournals": "", "archived": false,
    "attribs":   [{ "name": "strength", "current": "10", "max": "", "id": "…" }],
    "abilities": [{ "name": "Ataque", "action": "/r 1d20", "istokenaction": true, "order": 0, "description": "", "id": "…" }]
  },
  "parsed": {                       // solo con «resumen legible»
    "sheet": "ogl5e",
    "attributes": { "strength": "10", "hp": { "current": "12", "max": "20" } },
    "repeating":  { "spell-1": [{ "_rowId": "-M…", "spellname": "Bola de Agua", "spelllevel": "1" }] }
  }
}
```

El bloque `character` sigue el mismo esquema (`schema_version: 2`) que usan otras herramientas de exportación de Roll20.

## Problemas comunes

- **«Abre una partida en app.roll20.net/editor…»** estando ya en la partida: recarga la página de Roll20 y vuelve a pulsar el icono. Si la extensión se recargó o actualizó, también hay que recargar la pestaña.
- **Un personaje sale sin atributos**: Roll20 a veces no los descarga hasta que se abre la ficha. Ábrela una vez y vuelve a exportar.
- Los nombres de archivo se guardan sin tildes (por compatibilidad con los navegadores); dentro del JSON los nombres quedan intactos.

## Cómo funciona

`page.js` se ejecuta dentro de la página de Roll20 y lee el objeto `Campaign` del editor (personajes, atributos, habilidades y los blobs de bio, notas y token). `bridge.js` pasa los mensajes entre la página y el popup. No envía nada a ningún servidor: todo se descarga en tu equipo.
