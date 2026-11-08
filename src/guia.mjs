// Guía del mundo y reglas de ambientación (JournalEntry).
import { uuid } from "../tools/helpers.mjs";

const link = (pack, type, name, label = name) => `@UUID[${uuid(pack, type, name)}]{${label}}`;

const table = (head, rows) =>
  `<table><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;

const paginas = [
  ["Bienvenida", `
<h1>Mushoku Tensei para D&amp;D 5e</h1>
<p>Este módulo adapta la ambientación de <em>Mushoku Tensei</em> al sistema <strong>dnd5e</strong> de Foundry VTT. Es material <strong>homebrew de fans</strong> para uso en mesa privada: las mecánicas son originales y están pensadas para encajar con las reglas de 5e sin romper el equilibrio.</p>
<h2>¿Qué incluye?</h2>
<ul>
  <li><strong>Hechizos de Mushoku</strong>: magia de ataque de Agua, Fuego, Tierra y Viento, Curación, Desintoxicación, Barrera y combinadas, del rango Principiante al Rey.</li>
  <li><strong>Rasgos y Dotes</strong>: Lanzamiento sin Encantamiento, los tres grandes estilos de espada, Toki y Ojos Demoníacos.</li>
  <li><strong>Razas</strong>: Migurd, Superd, Bestia, Elfo y Enano, listas para arrastrar a la hoja de personaje.</li>
  <li><strong>Objetos</strong>: bastones, piedras mágicas, pergaminos de círculo mágico y las monedas de cada región.</li>
  <li><strong>Bestiario</strong>: monstruos y PNJ típicos (gremio, magos, caballeros de Millis, espadachines).</li>
</ul>
<h2>Consejos rápidos</h2>
<ul>
  <li>Los humanos usan las reglas normales del manual; las razas de este módulo son para los demás pueblos.</li>
  <li>Las clases de 5e encajan bien: <strong>mago</strong> y <strong>hechicero</strong> para magos, <strong>clérigo</strong> para curanderos de Millis, <strong>guerrero</strong>, <strong>pícaro</strong> y <strong>monje</strong> para espadachines con Toki.</li>
  <li>Arrastra cualquier hechizo o dote del compendio a la hoja del personaje. Las razas añaden sus rasgos automáticamente.</li>
</ul>`],

  ["El Mundo", `
<h1>El Mundo de los Seis Continentes</h1>
<p>El mundo está dividido por un gran océano y por la cordillera del <strong>Pico del Dragón Rojo</strong>, que corta el Continente Central. Cada región tiene su dios patrón, su idioma y su moneda.</p>
${table(["Región", "Descripción", "Idioma"], [
  ["<strong>Continente Central</strong>", "El corazón de la civilización humana. Al oeste está el rico <strong>Reino de Asura</strong>; al norte, los <strong>Territorios del Norte</strong> (Ranoa, Basherant, Neris), donde se encuentra la Universidad de Magia; al sur, zonas en guerra constante.", "Dios Humano"],
  ["<strong>Continente de Millis</strong>", "Sede de la <strong>Sagrada Iglesia de Millis</strong> y del Gran Bosque de los hombres bestia. Religioso, ordenado y con fuerte influencia política.", "Dios Humano / Dios Bestia"],
  ["<strong>Continente Demoníaco</strong>", "Tierra árida y peligrosa de las razas demoníacas. Los monstruos son mucho más fuertes y no hay monedas: se comercia con piedras.", "Dios Demonio"],
  ["<strong>Continente de Begaritt</strong>", "Un desierto lleno de laberintos con monstruos y tesoros. Solo los aventureros más audaces lo cruzan.", "Dios Lucha"],
  ["<strong>Continente Celestial</strong>", "Una meseta altísima, casi inaccesible, hogar de la Tribu del Cielo.", "Dios del Cielo"],
  ["<strong>Mar del Anillo</strong>", "El océano entre continentes, dominado por la raza del mar. Cruzarlo requiere permisos y barco.", "Dios del Mar"]
])}
<h2>Ganchos de campaña</h2>
<ul>
  <li><strong>Un desastre mágico</strong> teletransporta a toda una región a puntos aleatorios del mundo. Los PJ despiertan en un continente desconocido y deben volver a casa.</li>
  <li><strong>Tutor de magia</strong>: un PJ es contratado para educar al hijo de una familia noble de Asura, y queda atrapado en la intriga de la corte.</li>
  <li><strong>El Gremio</strong>: un grupo de rango F intenta ascender a S mientras viaja entre continentes.</li>
  <li><strong>Laberinto de Begaritt</strong>: una expedición busca un tesoro capaz de curar una maldición.</li>
</ul>`],

  ["Sistema de Magia", `
<h1>El Sistema de Magia</h1>
<p>En este mundo la magia no es un don de unos pocos: todos tienen <strong>maná</strong>, pero la cantidad varía muchísimo. Lo que marca la diferencia es la <strong>capacidad de maná</strong> (que crece si se entrena de niño) y el dominio del encantamiento.</p>
<h2>Rangos de magia</h2>
<p>Cada escuela clasifica sus hechizos en siete rangos. Usa esta tabla para traducirlos a niveles de conjuro de 5e:</p>
${table(["Rango", "Nivel de conjuro 5e", "Nivel de personaje aprox.", "Ejemplo"], [
  ["Principiante", "Truco y 1.º", "1–2", link("mt-hechizos", "Item", "Bola de Agua")],
  ["Intermedio", "2.º–3.º", "3–6", link("mt-hechizos", "Item", "Cañón de Piedra")],
  ["Avanzado", "4.º–5.º", "7–10", link("mt-hechizos", "Item", "Tornado")],
  ["Santo", "6.º", "11–12", link("mt-hechizos", "Item", "Cumulonimbo")],
  ["Rey", "7.º", "13–14", link("mt-hechizos", "Item", "Cero Absoluto")],
  ["Emperador", "8.º", "15–16", "—"],
  ["Dios", "9.º", "17+", "— (legendario)"]
])}
<p>Un mago que domina una escuela a rango Santo se suele llamar <em>«Santo del Agua»</em>, <em>«Santo del Fuego»</em>, etc. Es buena idea darle a los PJ estos títulos cuando lleguen al nivel correspondiente: es parte del sabor del mundo.</p>
<h2>Escuelas</h2>
<ul>
  <li><strong>Magia de ataque</strong>: Fuego, Agua, Viento y Tierra (y combinaciones como Niebla Profunda o Lodazal).</li>
  <li><strong>Magia sanadora</strong>: Curación, Desintoxicación, Barrera. Asociada a la Iglesia de Millis.</li>
  <li><strong>Magia de invocación</strong>: círculos mágicos y espíritus. Rara y regulada.</li>
  <li><strong>Magia especial</strong>: gravedad, teletransporte, sellado... casi perdidas.</li>
</ul>
<h2>Encantamientos</h2>
<p>Los hechizos se lanzan recitando un <strong>encantamiento</strong> (componente verbal). Las descripciones incluyen ejemplos que los jugadores pueden recitar en voz alta. Quien tenga la dote ${link("mt-rasgos", "Item", "Lanzamiento sin Encantamiento")} puede saltárselos.</p>
<h2>Variante opcional: Puntos de Maná</h2>
<p>Si queréis reflejar mejor la idea de «capacidad de maná», usad la variante de <strong>puntos de conjuro</strong> de la Guía del DM: cada nivel de espacio cuesta puntos en lugar de espacios.</p>
${table(["Nivel de espacio", "1.º", "2.º", "3.º", "4.º", "5.º", "6.º", "7.º", "8.º", "9.º"], [
  ["Coste en puntos", "2", "3", "5", "6", "7", "9", "10", "11", "13"]
])}
<p>Un PJ con ${link("mt-rasgos", "Item", "Reserva de Maná Desbordante")} suma su nivel de personaje a su máximo de puntos. Gastar más de la mitad de los puntos en un mismo combate puede causar un nivel de <em>Agotamiento</em> (opcional).</p>`],

  ["Estilos de Espada", `
<h1>Los Tres Grandes Estilos</h1>
<p>Casi todos los espadachines del mundo practican uno de estos tres estilos, cada uno con su propio dojo y jerarquía. Se representan con dotes; recomendamos que un PJ marcial pueda escoger una gratis a nivel 1.</p>
${table(["Estilo", "Filosofía", "Dote"], [
  ["Dios de la Espada", "Velocidad absoluta, atacar primero.", link("mt-rasgos", "Item", "Estilo del Dios de la Espada")],
  ["Dios del Agua", "Defensa perfecta y contraataque.", link("mt-rasgos", "Item", "Estilo del Dios del Agua")],
  ["Dios del Norte", "Pragmático, impredecible, cualquier arma.", link("mt-rasgos", "Item", "Estilo del Dios del Norte")]
])}
<h2>Rangos de espadachín</h2>
<p>Como la magia, la esgrima tiene rangos: <strong>Principiante, Intermedio, Avanzado, Santo, Rey, Emperador y Dios</strong>. Usa la misma correspondencia de nivel de personaje que la tabla de magia. Un Santo de la Espada (nivel 11+) es alguien conocido en todo el reino.</p>
<h2>Toki</h2>
<p>Los guerreros que no pueden lanzar magia externa envuelven su cuerpo en un aura de maná llamada ${link("mt-rasgos", "Item", "Toki (Aura de Combate)")}. Es lo que permite a un espadachín sobrevivir a una caída o a una explosión. Los PNJ marciales de nivel alto lo tienen siempre activo.</p>`],

  ["Razas", `
<h1>Razas del Mundo</h1>
<p>Los humanos son la mayoría y usan las reglas del manual. Estas son las razas incluidas:</p>
<ul>
  <li>${link("mt-razas", "Item", "Migurd")}: demonios pacíficos de pelo azul, telépatas y eternamente jóvenes.</li>
  <li>${link("mt-razas", "Item", "Superd")}: guerreros de pelo verde con una gema en la frente; temidos por una antigua leyenda.</li>
  <li>${link("mt-razas", "Item", "Bestia (Tribu Dedoldia)")}: hombres bestia del Gran Bosque, con sentidos agudos.</li>
  <li>${link("mt-razas", "Item", "Elfo (Orejas Largas)")}: longevos, arqueros y con afinidad al viento.</li>
  <li>${link("mt-razas", "Item", "Enano")}: herreros y magos de tierra.</li>
</ul>
<h2>Prejuicios</h2>
<p>El racismo es un tema central de la ambientación. En Millis, las razas demoníacas son vistas con desconfianza; en el Continente Demoníaco, los humanos son una rareza. Úsalo para dar peso a las decisiones de los PJ, no para castigarlos.</p>
<h2>Idiomas</h2>
${table(["Idioma", "Hablado en"], [
  ["Dios Humano (Común)", "Continente Central y Millis"],
  ["Dios Demonio", "Continente Demoníaco"],
  ["Dios Bestia", "Gran Bosque"],
  ["Dios Lucha", "Begaritt"],
  ["Dios del Mar / Dios del Cielo", "Raza del mar / Tribu del Cielo"]
])}`],

  ["Gremio y Economía", `
<h1>El Gremio de Aventureros</h1>
<p>Una organización presente en todo el mundo. Cada aventurero tiene una ${link("mt-objetos", "Item", "Tarjeta de Aventurero")} y un rango; los grupos también tienen rango de equipo.</p>
${table(["Rango", "Nivel de PJ", "Encargos típicos (VD)", "Recompensa sugerida"], [
  ["F", "1", "Recados, recolección (VD 0–1/8)", "1–5 po"],
  ["E", "1–2", "Coyotes, plagas (VD 1/4–1/2)", "5–15 po"],
  ["D", "2–4", "Escoltas, monstruos sueltos (VD 1–2)", "15–50 po"],
  ["C", "4–6", "Lobos ácidos, bandidos (VD 2–4)", "50–150 po"],
  ["B", "6–9", "Monstruos peligrosos (VD 4–7)", "150–500 po"],
  ["A", "9–13", "Amenazas para un pueblo (VD 7–11)", "500–2.000 po"],
  ["S", "13+", "Amenazas para un reino (VD 12+)", "2.000+ po"]
])}
<p>Un aventurero solo puede aceptar encargos de su rango o uno superior. Para ascender: completar un número de encargos (≈10 del rango actual) o una hazaña notable.</p>
<h2>Monedas por región</h2>
${table(["Moneda", "Equivalencia 5e"], [
  [link("mt-objetos", "Item", "Moneda de Oro de Asura"), "10 po"],
  [link("mt-objetos", "Item", "Moneda de Plata de Asura"), "1 po"],
  [link("mt-objetos", "Item", "Moneda de Cobre de Asura"), "1 pp"],
  ["Moneda de oro de otros reinos", "≈ 1 po (cambio con pérdida del 10–20 %)"],
  [link("mt-objetos", "Item", "Piedra Verde (Continente Demoníaco)"), "1 pc (piedra de hierro ≈ 1 pp, cristal ≈ 1 po)"]
])}
<p>Cambiar dinero entre continentes es caro y lento: un buen pretexto para que los PJ tengan que trabajar al llegar a un sitio nuevo.</p>`]
];

export default [{
  name: "Guía de Mushoku Tensei",
  pages: paginas.map(([name, content], i) => ({
    name, type: "text", sort: (i + 1) * 100000,
    title: { show: false, level: 1 },
    text: { content: content.trim(), format: 1 }
  }))
}];
