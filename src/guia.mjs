// Guía del mundo y reglas de ambientación (JournalEntry), con la terminología de la campaña.
import { uuid } from "../tools/helpers.mjs";

const link = (pack, type, name, label = name) => `@UUID[${uuid(pack, type, name)}]{${label}}`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;

const paginas = [
  ["Bienvenida", `
<h1>Mushoku Tensei para D&amp;D 5e</h1>
<p>Este módulo adapta el <strong>Mundo de las Seis Caras</strong> de <em>Mushoku Tensei</em> al sistema <strong>dnd5e</strong> (reglas de 2014) de Foundry VTT. Es material <strong>homebrew de fans</strong> para mesa privada.</p>
<p>La ambientación se sitúa <strong>varias generaciones después de Rudeus Greyrat</strong>: hoy viven sus tataranietos, la guerra contra los apóstoles del Dios Humano es una leyenda urbana y, tras décadas de paz, cada vez hay menos aventureros.</p>
<h2>Compendios</h2>
<ul>
  <li><strong>MT · Guía del Mundo</strong> (este diario): mundo, magia, estilos de espada, razas, idiomas, gremio y monedas.</li>
  <li><strong>MT · Hechizos</strong>, <strong>MT · Rasgos y Dotes</strong>, <strong>MT · Razas</strong>, <strong>MT · Objetos</strong> y <strong>MT · Bestiario</strong>: contenido general para cualquier campaña.</li>
  <li><strong>MT · Campaña: Anomalía</strong>, <strong>MT · Objetos de Campaña</strong> y <strong>MT · Anomalías</strong>: material del DM para la campaña <em>Anomalía</em> (los jugadores no los ven).</li>
</ul>
<h2>Consejos rápidos</h2>
<ul>
  <li>Los humanos usan las reglas del manual; las razas del módulo son para los demás pueblos.</li>
  <li>Clases sugeridas: <strong>mago</strong> y <strong>hechicero</strong> para magos; <strong>clérigo</strong> para curanderos de Milis; <strong>guerrero</strong>, <strong>pícaro</strong>, <strong>bardo (Colegio de las Espadas)</strong> y <strong>monje</strong> para espadachines con Toki.</li>
  <li>Arrastra cualquier hechizo, dote u objeto del compendio a la hoja. Las razas añaden sus rasgos automáticamente.</li>
</ul>`],

  ["El Mundo", `
<h1>El Mundo de las Seis Caras</h1>
<h2>Continente Central</h2>
<p>Dividido en tres partes por la <strong>Cordillera del Dragón Rojo</strong>: el norte, pobre y en guerra constante; el <strong>Reino de Asura</strong> al oeste, una de las regiones más ricas del mundo; y el sur, donde grandes países luchan siempre por el poder. La raza humana es la mayoría.</p>
${table(["Lugar", "Descripción"], [
  ["<strong>Reino de Asura</strong>", "El país con mayor poder nacional del mundo. Abundante en recursos, tierra fértil sin hambrunas."],
  ["<strong>Región de Fittoa</strong>", "Al noreste de Asura. Productos típicos: la cebada asurana y las flores de Batirusu. Aquí empieza la campaña."],
  ["<strong>Mandíbula Inferior y Superior del Dragón Rojo</strong>", "Los únicos valles transitables de la Cordillera del Dragón Rojo."],
  ["<strong>Reino del Rey Dragón</strong>", "El tercer país del mundo, con un amplio territorio en el sur."],
  ["<strong>Puerto Oeste y Puerto Este</strong>", "Ciudades portuarias que conectan el Continente Central con el de Milis."],
  ["<strong>Reino de Shirone</strong>", "Aliado del Reino del Rey Dragón, en la frontera de la zona de conflicto."],
  ["<strong>Reino de Sanakia</strong>", "Vasallo del Rey Dragón. Especialidad: el arroz."],
  ["<strong>Reino de Kikka</strong>", "Vasallo del Rey Dragón. Especialidad: el aceite."],
  ["<strong>Zona de Conflicto</strong>", "Donde los grandes países no hacen más que escaramuzas."]
])}
<h2>Continente Demoníaco</h2>
<p>Pobre y con monstruos fuertes. Varios <strong>Señores Demonio</strong> gobiernan distintas zonas. La mayoría de la población son razas mágicas.</p>
${table(["Lugar", "Descripción"], [
  ["<strong>Rikarisu</strong>", "Antiguo castillo de la Gran Emperatriz Demonio Kishirika Kishirisu, en el centro de un gran cráter. Lo gobierna el Señor Demonio Badigadi."],
  ["<strong>Kurasuma</strong>", "La única ciudad donde el continente comercia con la Raza del Mar. La gobierna el Señor Demonio Bagurahagura."],
  ["<strong>Puerto del Viento y Puerto Santo</strong>", "Conectan el Continente de Milis con el Demoníaco."]
])}
<h2>Continente de Milis</h2>
<p>Al norte, el <strong>Gran Bosque</strong>; al sur, el <strong>Sagrado Reino de Milis</strong>. Los separa la <strong>Cordillera del Dragón Azul</strong>, atravesada de norte a sur por la <strong>Carretera de la Espada Sagrada</strong>, libre de monstruos. La población es mitad humana y mitad raza feral.</p>
${table(["Lugar", "Descripción"], [
  ["<strong>Gran Bosque</strong>", "Hogar de las razas ferales. Cada año tiene tres meses de temporada de lluvias."],
  ["<strong>Sagrado Reino de Milis</strong>", "El segundo país del mundo. Sede de la Iglesia de Milis y del Gremio de Aventureros. Su capital es Milishion."]
])}
<h2>Otros continentes</h2>
${table(["Continente", "Descripción"], [
  ["<strong>Begaritt</strong>", "Lleno de laberintos y de fenómenos extraños de poder mágico. Sus monstruos son tan fuertes como los del Demoníaco. Viven allí muchas razas, casi todos aventureros o ex aventureros."],
  ["<strong>Continente Celestial</strong>", "Una meseta a 3000 metros sobre el nivel del mar, hogar de la Raza Celestial."]
])}`],

  ["Sistema de Magia", `
<h1>El Sistema de Magia</h1>
<p>Todos tienen <strong>maná</strong>, pero la cantidad varía muchísimo. Lo que marca la diferencia es la <strong>capacidad de maná</strong> (que crece si se entrena de niño) y el dominio del encantamiento.</p>
<h2>Niveles de los hechizos</h2>
<p>Los hechizos se nombran así: <em>«Hechizo de Agua de nivel Básico»</em>. Esta tabla los traduce a 5e:</p>
${table(["Nivel", "Original", "Nivel de conjuro 5e", "Nivel de PJ aprox.", "Ejemplo"], [
  ["Básico", "Elementary", "Truco y 1.º", "1–2", link("mt-hechizos", "Item", "Bola de Agua")],
  ["Intermedio", "Intermediate", "2.º–3.º", "3–6", link("mt-hechizos", "Item", "Cañón de Piedra")],
  ["Avanzado", "Advanced", "4.º–5.º", "7–10", link("mt-hechizos", "Item", "Tornado")],
  ["Superior", "Saint", "6.º", "11–12", link("mt-hechizos", "Item", "Cumulonimbo")],
  ["Real", "King", "7.º", "13–14", link("mt-hechizos", "Item", "Cero Absoluto")],
  ["Imperial", "Emperor", "8.º", "15–16", "—"],
  ["Deidad", "God", "9.º", "17+", "— (legendario)"]
])}
<h2>Escuelas</h2>
<ul>
  <li><strong>Magia de ataque</strong>: Fuego, Agua, Viento y Tierra (y combinaciones como Niebla Profunda o Lodazal).</li>
  <li><strong>Magia sanadora</strong>: Curación, Desintoxicación y Barrera. Asociada a la Iglesia de Milis.</li>
  <li><strong>Magia de invocación</strong>: círculos mágicos y espíritus. Rara y regulada.</li>
  <li><strong>Magia especial</strong>: gravedad, teletransporte, sellado, viaje en el tiempo… casi perdidas.</li>
</ul>
<h2>Encantamientos</h2>
<p>Los hechizos se lanzan recitando un <strong>encantamiento</strong> (componente verbal). Las descripciones incluyen ejemplos para recitar en voz alta. Quien tenga ${link("mt-rasgos", "Item", "Lanzamiento sin Encantamiento")} puede saltárselos.</p>
<h2>Variante opcional: Puntos de Maná</h2>
<p>Para reflejar la «capacidad de maná», usad la variante de <strong>puntos de conjuro</strong> de la Guía del DM (2014): cada nivel de espacio cuesta puntos en lugar de espacios.</p>
${table(["Nivel de espacio", "1.º", "2.º", "3.º", "4.º", "5.º", "6.º", "7.º", "8.º", "9.º"], [
  ["Coste en puntos", "2", "3", "5", "6", "7", "9", "10", "11", "13"]
])}
<p>Un PJ con ${link("mt-rasgos", "Item", "Reserva de Maná Desbordante")} suma su nivel de personaje a su máximo de puntos.</p>`],

  ["Estilos de Espada", `
<h1>Los Tres Grandes Estilos</h1>
<p>Casi todos los espadachines practican uno de estos tres estilos. Se representan con dotes; recomendamos que un PJ marcial pueda escoger una gratis a nivel 1.</p>
${table(["Estilo", "Original", "Filosofía", "Dote"], [
  ["Estilo Filo Celestial", "Sword God Style", "Velocidad absoluta, atacar primero.", link("mt-rasgos", "Item", "Estilo Filo Celestial")],
  ["Estilo Cauce Celestial", "Water God Style", "Defensa perfecta y contraataque.", link("mt-rasgos", "Item", "Estilo Cauce Celestial")],
  ["Estilo Nórdico Celestial", "North God Style", "Pragmático, impredecible, cualquier arma.", link("mt-rasgos", "Item", "Estilo Nórdico Celestial")]
])}
<h2>Niveles de técnica y títulos</h2>
${table(["Nivel de técnica", "Título", "Nivel de PJ sugerido"], [
  ["Básico", "Iniciado", "1–4"],
  ["Intermedio", "Experimentado", "5–8"],
  ["Avanzado", "Experto", "9–12"],
  ["Superior", "Santo / Maestro", "13–16"],
  ["Real", "Rey", "17–18"],
  ["Imperial", "Emperador", "19–20"],
  ["Deidad", "Dios", "PNJ legendarios"]
])}
<p>Así, un espadachín de nivel Superior del Estilo Filo Celestial es un <em>«Santo del Filo Celestial»</em>.</p>
<h2>Toki y aura de batalla</h2>
<p>Los guerreros que no pueden lanzar magia externa envuelven su cuerpo en un aura de maná: el ${link("mt-rasgos", "Item", "Toki (Aura de Combate)")}. Los dracónidos tienen su propia variante, el <em>aura de batalla dracónida</em>.</p>`],

  ["Razas e Idiomas", `
<h1>Razas del Mundo</h1>
${table(["Grupo", "Raza", "Compendio"], [
  ["Humanoides", "Humanos", "Reglas del manual"],
  ["Humanoides", "Orejas Puntiagudas (Elfos)", link("mt-razas", "Item", "Orejas Puntiagudas (Elfo)")],
  ["Humanoides", "Mineros de Carbón (Enanos)", link("mt-razas", "Item", "Mineros de Carbón (Enano)")],
  ["Humanoides", "Cuerpo de Niño (Hobbits)", link("mt-razas", "Item", "Cuerpo de Niño (Hobbit)")],
  ["Razas ferales", "Dedorudia (hombre-gato)", link("mt-razas", "Item", "Dedorudia (Hombre-gato)")],
  ["Razas ferales", "Adorudia (hombre-perro)", link("mt-razas", "Item", "Adorudia (Hombre-perro)")],
  ["Razas ferales", "Mirudetto (hombre-conejo)", link("mt-razas", "Item", "Mirudetto (Hombre-conejo)")],
  ["Razas mágicas", "Tribu de cabello azul (Migurd)", link("mt-razas", "Item", "Migurd (Tribu de Cabello Azul)")],
  ["Razas mágicas", "Tribu de cabello verde (Superd)", link("mt-razas", "Item", "Superd (Tribu de Cabello Verde)")]
])}
<h2>Prejuicios</h2>
<p>El racismo es un tema central de la ambientación. En Milis las razas mágicas son vistas con desconfianza; en el Continente Demoníaco los humanos son una rareza; y los Superd cargan con el miedo de todo el mundo.</p>
<h2>Idiomas</h2>
<p>Cada idioma usa uno de los idiomas de 5e en la hoja de personaje:</p>
${table(["Idioma del mundo", "Dónde se habla", "Idioma en la hoja (5e)"], [
  ["Idioma Humano", "Continente Central", "Común"],
  ["Idioma del Dios Feral", "Continente de Milis", "Silvano"],
  ["Idioma del Dios Celestial", "Continente Celestial", "Celestial"],
  ["Idioma del Dios de la Lucha", "Continente de Begaritt", "Gigante"],
  ["Idioma del Dios Demonio", "Continente Demoníaco", "Dracónico"],
  ["Idioma del Dios Marino", "Habitantes acuáticos", "Abisal"]
])}`],

  ["Gremio y Monedas", `
<h1>El Gremio de Aventureros</h1>
<p>Con sede en Milis y presente en todo el mundo. Cada aventurero tiene una ${link("mt-objetos", "Item", "Tarjeta de Aventurero")} y un rango; los grupos también tienen rango de equipo. Tras décadas de paz, el nivel de los aventureros ha bajado mucho y faltan manos.</p>
${table(["Rango", "Nivel de PJ", "Encargos típicos (VD)"], [
  ["F", "1", "Recados, recolección (VD 0–1/8)"],
  ["E", "1–2", "Coyotes, plagas (VD 1/4–1/2)"],
  ["D", "2–4", "Escoltas, monstruos sueltos (VD 1–2)"],
  ["C", "4–6", "Lobos ácidos, bandidos (VD 2–4)"],
  ["B", "6–9", "Monstruos peligrosos (VD 4–7)"],
  ["A", "9–13", "Amenazas para un pueblo (VD 7–11)"],
  ["S", "13+", "Amenazas para un reino (VD 12+)"]
])}
<h2>Tipos de moneda</h2>
<p>Valor de referencia en dólares. Las monedas están en el compendio de objetos.</p>
${table(["Valor", "Monedas de Asura", "Monedas de Milis", "Monedas Demoníacas"], [
  ["1000 $", link("mt-objetos", "Item", "Asura de Oro"), "—", "—"],
  ["500 $", "—", link("mt-objetos", "Item", "Cheque del Papado"), "—"],
  ["100 $", link("mt-objetos", "Item", "Asura de Plata"), link("mt-objetos", "Item", "Cheque del Ejército"), "—"],
  ["50 $", "—", link("mt-objetos", "Item", "Milis de Oro"), "—"],
  ["10 $", link("mt-objetos", "Item", "Gran Asura de Cobre"), link("mt-objetos", "Item", "Milis de Plata"), link("mt-objetos", "Item", "Moneda de Jade")],
  ["1 $", link("mt-objetos", "Item", "Asura de Cobre"), link("mt-objetos", "Item", "Gran Milis de Cobre"), link("mt-objetos", "Item", "Moneda de Hierro")],
  ["0'10 $", "—", link("mt-objetos", "Item", "Milis de Cobre"), link("mt-objetos", "Item", "Moneda Oxidada")],
  ["0'01 $", "—", "—", link("mt-objetos", "Item", "Moneda de Piedra")]
])}
<p>Los precios de los mercaderes de la campaña se dan en «oro» y se registran en Foundry como piezas de oro (po).</p>`]
];

export default [{
  name: "Guía de Mushoku Tensei",
  pages: paginas.map(([name, content], i) => ({
    name, type: "text", sort: (i + 1) * 100000,
    title: { show: false, level: 1 },
    text: { content: content.trim(), format: 1 }
  }))
}];
