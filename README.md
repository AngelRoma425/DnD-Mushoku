# Mushoku Tensei para D&D 5e (Foundry VTT)

Módulo de Foundry VTT con contenido **homebrew de fans** inspirado en *Mushoku Tensei*, para el sistema **dnd5e** (versión 4.0 o superior; Foundry v12–v13).

## Contenido

Pensado para **Foundry v14** y el sistema dnd5e con **reglas de 2014**, usando la terminología de la campaña (*Filo / Cauce / Nórdico Celestial*, niveles *Básico → Deidad*, idiomas y monedas del mundo).

### Contenido general (visible para los jugadores)

| Compendio | Qué trae |
|---|---|
| **MT · Guía del Mundo** | Mapa del mundo (Fittoa, Asura, Rikarisu, Milis…), niveles de magia → niveles de conjuro, estilos de espada y títulos, razas, equivalencias de idiomas con 5e, Gremio y tabla de monedas. |
| **MT · Hechizos** (21) | Bola de Agua, Bala de Piedra, Cañón de Piedra, Curación, Desintoxicación, Lanza de Hielo, Lodazal, Tornado, Cumulonimbo, Cero Absoluto… |
| **MT · Rasgos y Dotes** (30) | Lanzamiento sin Encantamiento, Estilos Filo/Cauce/Nórdico Celestial, Toki, Ojos Demoníacos y rasgos raciales. |
| **MT · Razas** (8) | Migurd, Superd, Dedorudia, Adorudia, Mirudetto, Orejas Puntiagudas, Mineros de Carbón y Cuerpo de Niño. |
| **MT · Objetos** (20) | Bastones, Piedra Mágica, pergaminos y las 14 monedas de Asura, Milis y el Continente Demoníaco. |
| **MT · Bestiario** (5) | Coyote Pax, Lobo Ácido, mago, Caballero del Templo de Milis, espadachín del Filo Celestial. |
| **MT · Tutorial de Foundry** (aventura) | Mundo de práctica para enseñar Foundry a los jugadores: 2 escenas, 4 personajes pregenerados, enemigos de prueba, guía con 7 lecciones y notas del DM. |

### Tutorial de Foundry para jugadores

1. En Foundry crea un **mundo nuevo** con el sistema **dnd5e** (por ejemplo «Tutorial») y activa este módulo.
2. Abre el compendio **MT · Tutorial de Foundry** y la aventura **Tutorial de Foundry** → **Importar aventura**.
3. Abre el diario **Notas del DM · Tutorial**: explica cómo crear los usuarios, asignar personajes y un plan de sesión de 60–90 minutos.

Los jugadores siguen el diario **Guía de Foundry para Jugadores** (también enlazado desde las chinchetas del mapa): pantalla, mover y medir, puertas y visión, hoja de personaje, tiradas y chat, ataques y conjuros, combate por turnos y una chuleta de atajos.

Los mapas se generan con `node tools/tutorial-mapas.mjs` (necesita Playwright) a partir de `src/tutorial/mapas.mjs`, que también define muros, puertas y luces.

El material del DM de la campaña *Anomalía* (diario, objetos, anomalías, mercaderes y tablas) se distribuye aparte, en un módulo privado, para no publicar spoilers.

## Instalación

En Foundry: **Add-on Modules → Install Module**, pega esta URL en *Manifest URL* y pulsa **Install**:

```
https://raw.githubusercontent.com/AngelRoma425/DnD-Mushoku/claude/dreamy-lamport-ws0yfn/module.json
```

Después abre un mundo con el sistema **dnd5e** y activa el módulo en *Game Settings → Manage Modules*. Cuando haya una versión nueva, Foundry la mostrará con el botón **Update**.

**Instalación manual:** descomprime `dist/mushoku-tensei-dnd.zip` en `Data/modules/mushoku-tensei-dnd/` (dentro debe quedar `module.json`).

## Editar o añadir contenido

Todo el contenido está en `src/*.mjs` (texto en HTML, en español). Después de modificarlo:

```bash
npm install
npm run build
```

Esto regenera las carpetas de `packs/`. Para publicar una versión nueva: sube `version` en `module.json` y ejecuta `npm run package` para regenerar el ZIP de `dist/`. **Cierra Foundry (o desactiva el módulo) antes de compilar**, porque Foundry bloquea las bases de datos de los compendios mientras están abiertas.

## Licencias

Las armas, armaduras y munición básicas de las tiendas proceden del **System Reference Document 5.1** de Wizards of the Coast LLC, disponible en https://dnd.wizards.com/resources/systems-reference-document y publicado bajo la licencia Creative Commons Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0/legalcode). Sus nombres se tradujeron al español.

Los personajes pregenerados del tutorial (Randal, Riswynn, Zanna y Akra), sus conjuros, rasgos y equipo, la poción de curación y la antorcha proceden de los compendios SRD 5.1 del sistema **dnd5e** de Foundry VTT (misma licencia CC-BY-4.0), extraídos con `tools/extraer-heroes.py`; se tradujeron y resumieron sus textos. Las imágenes de las fichas son las del propio sistema dnd5e.

## Aviso

Proyecto de fans sin ánimo de lucro, para uso en mesa privada. *Mushoku Tensei* pertenece a Rifujin na Magonote y sus editoriales. Las mecánicas y los textos de este módulo son originales.
