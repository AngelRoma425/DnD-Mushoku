# Mushoku Tensei para D&D 5e (Foundry VTT)

Módulo de Foundry VTT con contenido **homebrew de fans** inspirado en *Mushoku Tensei*, para el sistema **dnd5e** (versión 4.0 o superior; Foundry v12–v13).

## Contenido

| Compendio | Qué trae |
|---|---|
| **MT · Guía del Mundo** | Diario con los continentes, el sistema de magia (rangos → niveles de conjuro, variante de puntos de maná), estilos de espada, razas, Gremio de Aventureros y monedas. |
| **MT · Hechizos** (21) | Bola de Agua, Bala de Piedra, Cañón de Piedra, Curación, Desintoxicación, Lanza de Hielo, Lodazal, Tornado, Cumulonimbo, Cero Absoluto… con ataques, salvaciones y curación automatizados. |
| **MT · Rasgos y Dotes** (22) | Lanzamiento sin Encantamiento, Estilos del Dios de la Espada / del Agua / del Norte, Toki, Ojos Demoníacos y los rasgos raciales. |
| **MT · Razas** (5) | Migurd, Superd, Bestia (Dedoldia), Elfo y Enano. Al arrastrarlas a la hoja añaden sus rasgos automáticamente. |
| **MT · Objetos** (10) | Bastón de Aprendiz, Aqua Heartia, Piedra Mágica, Pergamino de Círculo Mágico, pociones y monedas de Asura / Continente Demoníaco. |
| **MT · Bestiario** (5) | Coyote Pax, Lobo Ácido, Mago de Rango Intermedio, Caballero del Templo de Millis, Espadachín del Dios de la Espada. |

## Instalación

**Opción A: manifiesto** (cuando esta rama esté fusionada en `main`)
En Foundry → *Add-on Modules* → *Install Module* → pega en *Manifest URL*:

```
https://raw.githubusercontent.com/AngelRoma425/DnD-Mushoku/main/module.json
```

**Opción B: manual**
1. Descarga el repositorio como ZIP.
2. Descomprímelo en `Data/modules/` y renombra la carpeta a `mushoku-tensei-dnd`.
3. Reinicia Foundry, abre tu mundo dnd5e y activa el módulo en *Manage Modules*.

## Editar o añadir contenido

Todo el contenido está en `src/*.mjs` (texto en HTML, en español). Después de modificarlo:

```bash
npm install
npm run build
```

Esto regenera las carpetas de `packs/`. **Cierra Foundry (o desactiva el módulo) antes de compilar**, porque Foundry bloquea las bases de datos de los compendios mientras están abiertas.

## Aviso

Proyecto de fans sin ánimo de lucro, para uso en mesa privada. *Mushoku Tensei* pertenece a Rifujin na Magonote y sus editoriales. Las mecánicas y los textos de este módulo son originales.
