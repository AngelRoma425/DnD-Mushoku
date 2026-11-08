# Mushoku Tensei para D&D 5e (Foundry VTT)

Módulo de Foundry VTT con contenido **homebrew de fans** inspirado en *Mushoku Tensei*, para el sistema **dnd5e** (versión 4.0 o superior; Foundry v12–v13).

## Contenido

Pensado para el sistema dnd5e con **reglas de 2014**, usando la terminología de la campaña (*Filo / Cauce / Nórdico Celestial*, niveles *Básico → Deidad*, idiomas y monedas del mundo).

### Contenido general (visible para los jugadores)

| Compendio | Qué trae |
|---|---|
| **MT · Guía del Mundo** | Mapa del mundo (Fittoa, Asura, Rikarisu, Milis…), niveles de magia → niveles de conjuro, estilos de espada y títulos, razas, equivalencias de idiomas con 5e, Gremio y tabla de monedas. |
| **MT · Hechizos** (21) | Bola de Agua, Bala de Piedra, Cañón de Piedra, Curación, Desintoxicación, Lanza de Hielo, Lodazal, Tornado, Cumulonimbo, Cero Absoluto… |
| **MT · Rasgos y Dotes** (30) | Lanzamiento sin Encantamiento, Estilos Filo/Cauce/Nórdico Celestial, Toki, Ojos Demoníacos y rasgos raciales. |
| **MT · Razas** (8) | Migurd, Superd, Dedorudia, Adorudia, Mirudetto, Orejas Puntiagudas, Mineros de Carbón y Cuerpo de Niño. |
| **MT · Objetos** (20) | Bastones, Piedra Mágica, pergaminos y las 14 monedas de Asura, Milis y el Continente Demoníaco. |
| **MT · Bestiario** (5) | Coyote Pax, Lobo Ácido, mago, Caballero del Templo de Milis, espadachín del Filo Celestial. |

### Campaña «Anomalía» (solo DM)

| Compendio | Qué trae |
|---|---|
| **MT · Campaña: Anomalía** | Premisa, origen de las anomalías, tramas de los PJ, visiones, PNJ, Metro, Rikarisu, La Muda del Desierto, Aldea Migurd, diario de sesiones, secretos de objetos y música. |
| **MT · Objetos de Campaña** (132) | Todo el botín y los mercaderes del documento de lore, organizados en carpetas (Metro por jugador, mercaderes de Rikarisu, Sáqher, investigación d20, botín del Jardinero, materiales, Roka y Dreno). Incluye bonificadores, resistencias y curaciones automáticas. |
| **MT · Anomalías** (6) | Lobo Siamés, Monstruo Mudado, Lagarto Florido, Guerrero Mantis, Greenkeeper y El Jardinero (con las 10 habilidades copiadas). Las estadísticas son una propuesta: ajústalas a tu mesa. |

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

## Aviso

Proyecto de fans sin ánimo de lucro, para uso en mesa privada. *Mushoku Tensei* pertenece a Rifujin na Magonote y sus editoriales. Las mecánicas y los textos de este módulo son originales.
