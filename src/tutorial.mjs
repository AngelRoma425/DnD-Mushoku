// Aventura «Tutorial de Foundry»: un mundo de práctica para enseñar a los jugadores a usar Foundry VTT.
// Al importarla en un mundo vacío crea dos escenas, cuatro personajes, enemigos de prueba, un diario-guía y las notas del DM.
import fs from "node:fs";
import { id, html } from "../tools/helpers.mjs";
import { GRID, CAMPO, ARENA, arenaMuros } from "./tutorial/mapas.mjs";
import { OBJETOS, CONJUROS_CLERIGO } from "./tutorial/textos.mjs";
import { npc, abil, trait } from "./bestiario.mjs";
import BESTIARIO from "./bestiario.mjs";

const PACK = "mt-tutorial";
const ASSETS = "modules/mushoku-tensei-dnd/assets/tutorial";
const SRD = JSON.parse(fs.readFileSync(new URL("./tutorial/srd-heroes.json", import.meta.url), "utf8"));
const STATS = { coreVersion: "13.351", systemId: "dnd5e", systemVersion: "4.4.4" };
const tid = (...p) => id(PACK, ...p);
const table = (head, rows) =>
  `<table><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
const k = (...keys) => keys.map(x => `<kbd>${x}</kbd>`).join(" + ");

/* ------------------------------------------------------------------ */
/*  Carpetas                                                           */
/* ------------------------------------------------------------------ */
const FOLDER = Object.fromEntries(["Actor", "Item", "JournalEntry", "Scene", "Macro"].map(t => [t, tid("folder", t)]));
const folders = Object.entries(FOLDER).map(([type, _id]) => ({
  _id, name: "Tutorial de Foundry", type, folder: null, sorting: "m", sort: 0, color: "#1f4e79", description: "", flags: {}
}));

/* ------------------------------------------------------------------ */
/*  Diario: guía para jugadores                                        */
/* ------------------------------------------------------------------ */
const GUIA = tid("journal", "guia");
const DM = tid("journal", "dm");
const pid = name => tid("page", name);
const enlace = (name, label = name) => `@UUID[JournalEntry.${GUIA}.JournalEntryPage.${pid(name)}]{${label}}`;

const PAGINAS = [
  ["Bienvenida", `
<h1>¡Bienvenidos a Foundry!</h1>
<p>Este mundo es un <strong>campo de entrenamiento</strong>. Aquí no hay partida de verdad: puedes pulsar todos los botones, equivocarte, morir y volver a empezar. El objetivo es que el día de la sesión ya sepas moverte, tirar dados y usar tu hoja sin pensarlo.</p>
<h2>Cómo usar esta guía</h2>
<ol>
  <li>Cada página es una <strong>lección corta</strong>. Al final de cada una hay un <strong>✔ Reto</strong> para practicar en el mapa.</li>
  <li>En el mapa verás <strong>chinchetas</strong> (notas del mapa) con un número. Haz <strong>doble clic</strong> en una para abrir la lección de esa sala.</li>
  <li>Si te pierdes, abre la ${enlace("Chuleta de atajos", "Chuleta de atajos")}.</li>
</ol>
<h2>Itinerario</h2>
${table(["#", "Lugar", "Qué aprendes"], [
  ["1", "Patio de Entrenamiento", enlace("1 · La pantalla", "La pantalla") + " y " + enlace("2 · Mover tu ficha", "mover tu ficha y medir distancias")],
  ["2", "Vestíbulo", enlace("3 · Puertas, ventanas y visión", "Puertas y ventanas")],
  ["3–4", "Sala de las Puertas y Almacén", "Puertas cerradas con llave y pedir cosas al DM"],
  ["5", "Sala Oscura", "Visión en la oscuridad y luz de tu ficha"],
  ["6", "Cámara del Tesoro", "Puertas secretas e inventario"],
  ["—", "Arena de Combate", enlace("6 · Atacar y lanzar conjuros", "Atacar, conjuros") + " y " + enlace("7 · El combate por turnos", "combate por turnos")]
])}
<p>Las lecciones sobre la hoja y los dados (${enlace("4 · Tu hoja de personaje", "hoja")} y ${enlace("5 · Tiradas y chat", "tiradas")}) se pueden hacer en cualquier momento.</p>
<blockquote><p><strong>Nota sobre el idioma:</strong> según cómo esté configurado Foundry, algunos botones aparecerán en inglés. En esta guía ponemos el nombre en español y, cuando ayuda, el inglés entre paréntesis.</p></blockquote>`],

  ["1 · La pantalla", `
<h1>Lección 1 · La pantalla</h1>
<p>La pantalla de Foundry tiene cinco zonas. Tómate un minuto para localizarlas todas:</p>
${table(["Zona", "Dónde", "Para qué sirve"], [
  ["<strong>El mapa</strong> (canvas)", "En el centro", "Donde están las fichas (tokens). Rueda del ratón: zoom. Arrastrar con el <strong>botón derecho</strong> pulsado: mover la cámara."],
  ["<strong>Controles</strong>", "Columna de iconos a la izquierda", "Herramientas: seleccionar fichas, <strong>regla</strong> para medir, plantillas de área, notas del mapa… Para jugar casi siempre basta con la primera (la mano/ficha)."],
  ["<strong>Barra lateral</strong>", "A la derecha", "Pestañas: <strong>Chat</strong>, <strong>Combate</strong>, <strong>Actores</strong> (personajes), <strong>Objetos</strong>, <strong>Diarios</strong>, <strong>Compendios</strong> y <strong>Ajustes</strong>. Se puede plegar."],
  ["<strong>Jugadores</strong>", "Abajo a la izquierda", "Quién está conectado y de qué color es cada uno."],
  ["<strong>Barra de macros</strong>", "Abajo en el centro", "Casillas 1–0 donde puedes arrastrar conjuros, ataques u objetos para usarlos con un clic."]
])}
<h2>Tu usuario</h2>
<ul>
  <li>Haz <strong>clic derecho en tu nombre</strong> (abajo a la izquierda) → <em>Configuración de usuario</em>. Ahí eliges tu <strong>color</strong> y tu <strong>personaje</strong>.</li>
  <li>En <strong>Ajustes</strong> (la rueda dentada de la barra lateral) → <em>Configurar controles</em> puedes ver y cambiar todos los atajos de teclado.</li>
</ul>
<h2>✔ Reto</h2>
<ol>
  <li>Haz zoom hacia dentro y hacia fuera con la rueda.</li>
  <li>Mueve la cámara arrastrando con el botón derecho.</li>
  <li>Abre cada pestaña de la barra lateral y vuelve al <strong>Chat</strong>.</li>
  <li><strong>Haz un «ping»:</strong> mantén pulsado el botón izquierdo sobre un punto vacío del mapa. Todos verán una señal ahí: así se dice «¡mirad aquí!».</li>
</ol>`],

  ["2 · Mover tu ficha", `
<h1>Lección 2 · Mover tu ficha y medir</h1>
<h2>Seleccionar y mover</h2>
<ul>
  <li><strong>Clic izquierdo</strong> en tu ficha para seleccionarla (aparece un recuadro naranja).</li>
  <li><strong>Arrástrala</strong> para moverla. Mientras arrastras, Foundry te dice cuántos pies recorres. Suelta para confirmar.</li>
  <li>También puedes moverla una casilla cada vez con las <strong>flechas</strong> o con ${k("W")} ${k("A")} ${k("S")} ${k("D")}. Pulsa dos a la vez para ir en diagonal.</li>
  <li><strong>Doble clic</strong> en la ficha abre tu <strong>hoja de personaje</strong>.</li>
  <li>${k("Esc")} deselecciona todo (y cierra ventanas).</li>
</ul>
<p>Cada casilla son <strong>5 pies</strong>. Casi todos los personajes tienen <strong>30 pies</strong> de velocidad: 6 casillas por turno.</p>
<h2>Medir distancias</h2>
<ul>
  <li>Mantén ${k("Ctrl")} y <strong>arrastra</strong> desde un punto del mapa: aparece la <strong>regla</strong> con la distancia. Los demás jugadores también la ven.</li>
  <li>También puedes elegir la <strong>herramienta Regla</strong> en los controles de la izquierda.</li>
</ul>
<h2>El menú de la ficha (HUD)</h2>
<p>Haz <strong>clic derecho</strong> sobre tu ficha. Aparecen iconos alrededor: <strong>estados</strong> (derribado, envenenado…), <strong>objetivo</strong>, <strong>elevación</strong> (para volar o subir) y las <strong>barras</strong> de vida. Haz clic fuera para cerrarlo.</p>
<h2>✔ Reto</h2>
<ol>
  <li>Selecciona tu ficha y llévala junto a la <strong>diana</strong> de arriba a la izquierda.</li>
  <li>Con ${k("Ctrl")} + arrastrar, mide la distancia de una diana a la otra. (Respuesta: 75 pies).</li>
  <li>Abre el HUD con clic derecho y ponte el estado <em>Derribado</em> (Prone). Luego quítatelo.</li>
  <li>Entra al edificio por la puerta del camino (sala 2).</li>
</ol>`],

  ["3 · Puertas, ventanas y visión", `
<h1>Lección 3 · Puertas, ventanas y visión</h1>
<h2>Lo que ve tu ficha</h2>
<p>Tu pantalla muestra <strong>solo lo que ve tu personaje</strong>. Las paredes bloquean la vista; lo que ya has explorado se queda en gris (es la «niebla de guerra»). Si seleccionas una ficha, ves por sus ojos; si no seleccionas ninguna, ves lo de todas las tuyas a la vez.</p>
<h2>Puertas</h2>
<ul>
  <li>Las puertas muestran un <strong>icono de puerta</strong> cuando tu ficha está cerca y la ve. <strong>Clic izquierdo</strong> en el icono para abrirla o cerrarla.</li>
  <li>Si la puerta está <strong>cerrada con llave</strong> 🔒, no se abre: oirás un ruido de cerradura. Dile al DM qué haces (forzarla, abrirla con herramientas de ladrón…); él decide si tirar y la abre.</li>
  <li>Algunas puertas son <strong>secretas</strong>: parecen pared y no tienen icono hasta que el DM las revela.</li>
</ul>
<h2>Ventanas</h2>
<p>La línea azul junto a esta sala es una <strong>ventana</strong>: se puede ver a través de ella, pero no pasar.</p>
<h2>✔ Reto</h2>
<ol>
  <li>Cierra la puerta por la que has entrado y vuelve a abrirla.</li>
  <li>Acércate a la ventana y mira el patio a través de ella.</li>
  <li>Cruza a la <strong>Sala de las Puertas</strong> (3) e intenta abrir la puerta del <strong>Almacén</strong> (4). ¿Qué pasa?</li>
  <li>Usa tus <em>Herramientas de Ladrón</em> (si eres Riswynn) o una prueba de <em>Atletismo</em> para convencer al DM de que la abra.</li>
</ol>`],

  ["Sala Oscura", `
<h1>Sala 5 · La Sala Oscura</h1>
<p>Aquí no hay ninguna luz. Lo que veas depende de tu personaje:</p>
<ul>
  <li><strong>Riswynn</strong> (enana) y <strong>Zanna</strong> (gnoma) tienen <strong>visión en la oscuridad</strong>: ven en blanco y negro hasta 60 pies.</li>
  <li><strong>Randal</strong> y <strong>Akra</strong> no ven nada… salvo que alguien lleve luz.</li>
</ul>
<h2>Dar luz a tu ficha</h2>
<ol>
  <li>Clic derecho en tu ficha → icono de <strong>engranaje</strong> (Configurar ficha).</li>
  <li>Pestaña <strong>Luz</strong>: pon <em>Luz brillante</em> 20 y <em>Luz tenue</em> 40. (Eso es una antorcha).</li>
  <li>Opcional: en <em>Animación</em> elige <em>Antorcha</em> para que parpadee.</li>
  <li>Guarda. ¡Ya iluminas la sala para todo el grupo!</li>
</ol>
<p>Zanna conoce el truco <em>Luz</em>: puede lanzarlo y luego configurar la luz igual que arriba.</p>
<h2>✔ Reto</h2>
<ol>
  <li>Entra a la sala con dos personajes distintos y compara lo que ve cada uno.</li>
  <li>Enciende una «antorcha» en una ficha.</li>
  <li>Haz una prueba de <strong>Percepción</strong> desde tu hoja para buscar algo raro en la pared este. Si sacas un buen resultado, el DM os revelará la <strong>puerta secreta</strong>.</li>
</ol>`],

  ["Cámara del Tesoro", `
<h1>Sala 6 · La Cámara del Tesoro</h1>
<p>¡Lo habéis encontrado! En el cofre hay <strong>pociones de curación</strong> y una <strong>antorcha</strong> para cada uno.</p>
<h2>Recibir objetos</h2>
<ul>
  <li>El DM arrastrará los objetos a vuestra hoja. Aparecerán en la pestaña <strong>Inventario</strong>.</li>
  <li>Puedes <strong>arrastrar</strong> un objeto de tu inventario a la <strong>barra de macros</strong> para usarlo con un clic.</li>
  <li>Para usar una poción: clic en su icono en el inventario. Se gasta una y la curación sale en el chat.</li>
</ul>
<h2>✔ Reto</h2>
<ol>
  <li>Busca la poción en tu inventario y arrástrala a la barra de macros.</li>
  <li>Úsala desde la barra (número de su casilla) y comprueba que tu cantidad baja.</li>
  <li>Cuando estéis listos, pedid al DM que os lleve a la <strong>Arena de Combate</strong>.</li>
</ol>`],

  ["4 · Tu hoja de personaje", `
<h1>Lección 4 · Tu hoja de personaje</h1>
<p>Ábrela con <strong>doble clic</strong> en tu ficha o desde la pestaña <strong>Actores</strong> de la barra lateral.</p>
<h2>La cabecera</h2>
<ul>
  <li><strong>Puntos de golpe (PG)</strong>: puedes escribir encima para cambiarlos (por ejemplo «−5» o «+3»).</li>
  <li><strong>Clase de armadura (CA)</strong>, <strong>iniciativa</strong>, <strong>velocidad</strong> y <strong>competencia</strong>.</li>
  <li>Los botones de <strong>descanso corto</strong> y <strong>descanso largo</strong>: recuperan PG, usos de rasgos y espacios de conjuro.</li>
</ul>
<h2>Las pestañas</h2>
${table(["Pestaña", "Qué hay"], [
  ["<strong>Detalles</strong>", "Características (FUE, DES…), salvaciones y habilidades. <strong>Haz clic en cualquiera para tirarla.</strong>"],
  ["<strong>Inventario</strong>", "Armas, armadura, equipo y dinero. El icono de cada objeto lo «usa»: ataca, bebe, enciende…"],
  ["<strong>Rasgos</strong> (Features)", "Clase, raza, trasfondo y habilidades especiales (Tomar Aliento, Ataque Furtivo…). Algunos tienen usos limitados."],
  ["<strong>Conjuros</strong>", "Solo para lanzadores. Arriba, tus <strong>espacios de conjuro</strong>; debajo, los conjuros por nivel."],
  ["<strong>Efectos</strong>", "Cosas que te modifican temporalmente: Bendición, Armadura de Mago, venenos…"],
  ["<strong>Biografía</strong>", "Historia y apariencia del personaje."]
])}
<h2>Modo edición</h2>
<p>Arriba de la hoja hay un interruptor para <strong>editar</strong>. En partida déjalo apagado: así no borras nada sin querer. Para cambiar cosas permanentes (subir de nivel, añadir dotes…) consúltalo antes con el DM.</p>
<h2>✔ Reto</h2>
<ol>
  <li>Abre tu hoja y encuentra tu CA, tus PG y tu velocidad.</li>
  <li>Tira <strong>Percepción</strong> y <strong>Atletismo</strong> haciendo clic en ellas.</li>
  <li>Tira una <strong>salvación de Destreza</strong>.</li>
  <li>Quítate 5 PG escribiendo «−5» en la vida, y luego haz un <strong>descanso corto</strong> para recuperarte.</li>
</ol>`],

  ["5 · Tiradas y chat", `
<h1>Lección 5 · Tiradas de dados y chat</h1>
<h2>Ventaja y desventaja</h2>
<p>Al hacer clic en una tirada se abre una ventana con tres botones: <strong>Ventaja</strong>, <strong>Normal</strong> y <strong>Desventaja</strong>. Ahí también puedes añadir un bonificador puntual (por ejemplo +1d4 de <em>Bendición</em>, aunque si el efecto está aplicado se suma solo).</p>
${table(["Atajo al hacer clic", "Resultado"], [
  [k("Shift"), "Tirada normal sin ventana"],
  [k("Alt"), "Tirada con ventaja"],
  [k("Ctrl") + " (" + k("⌘") + " en Mac)", "Tirada con desventaja"]
])}
<h2>Escribir en el chat</h2>
${table(["Escribe", "Qué hace"], [
  ["<code>Hola</code>", "Mensaje normal (como tu personaje si tienes una ficha seleccionada)."],
  ["<code>/ooc Voy a por agua</code>", "Mensaje <em>fuera de personaje</em>."],
  ["<code>/em se rasca la cabeza</code>", "Acción narrada («Randal se rasca la cabeza»)."],
  ["<code>/w Ana ¿le robamos?</code>", "Mensaje <strong>privado</strong> a Ana. Usa <code>/w gm</code> para hablar en privado con el DM."],
  ["<code>/r 1d20+3</code>", "Tira dados a mano. Puedes añadir una etiqueta: <code>/r 2d6+2 # Daño de espada</code>."],
  ["<code>/gmr 1d20</code>", "Tirada que solo veis tú y el DM."],
  ["<code>/br 1d20</code>", "Tirada «a ciegas»: solo la ve el DM."],
  ["<code>[[1d6]]</code> dentro de un mensaje", "Tira el dado dentro de la frase."]
])}
<p>El menú de abajo del chat cambia el <strong>modo de tirada</strong> por defecto (pública, privada al DM, a ciegas, solo para mí).</p>
<h2>✔ Reto</h2>
<ol>
  <li>Escribe <code>/r 1d20 # ¡Mi primera tirada!</code></li>
  <li>Manda un mensaje privado al DM con <code>/w gm</code>.</li>
  <li>Tira <strong>Sigilo con ventaja</strong> usando ${k("Alt")} + clic.</li>
  <li>Arrastra la macro <em>Mi primera tirada</em> (pestaña Macros o el DM te la pasa) a la barra y úsala.</li>
</ol>`],

  ["6 · Atacar y lanzar conjuros", `
<h1>Lección 6 · Atacar y lanzar conjuros</h1>
<h2>Paso 1: marca el objetivo</h2>
<p>Pon el ratón sobre la ficha enemiga y pulsa ${k("T")}. Aparecen unas flechas alrededor: ese es tu <strong>objetivo</strong>. ${k("Shift")} + ${k("T")} añade varios objetivos. Pulsa ${k("T")} otra vez para quitarlo. (También hay un botón de objetivo en el HUD de clic derecho).</p>
<h2>Paso 2: usa el arma o el conjuro</h2>
<ol>
  <li>En tu hoja (Inventario o Conjuros) haz clic en el <strong>icono</strong> del arma o conjuro.</li>
  <li>Si es un conjuro de nivel 1 o más, te pregunta qué <strong>espacio de conjuro</strong> gastar.</li>
  <li>En el chat aparece una <strong>tarjeta</strong> con botones: <strong>Ataque</strong> y <strong>Daño</strong>. Primero ataque; si impacta (iguala o supera la CA), daño.</li>
</ol>
<h2>Tipos de conjuros</h2>
${table(["Tipo", "Ejemplo", "Cómo funciona"], [
  ["Ataque", "Descarga de Fuego, Saeta Guía", "Tiras ataque contra la CA del objetivo, luego daño."],
  ["Salvación", "Llama Sagrada, Arma de Aliento", "El objetivo tira la salvación (botón en la tarjeta). El DM tira por los monstruos."],
  ["Daño seguro", "Proyectil Mágico", "Solo tiras daño."],
  ["Curación", "Curar Heridas, Palabra Curativa, Poción", "Tiras curación; se aplica al objetivo."],
  ["Área", "Dormir, Arma de Aliento", "Coloca la plantilla en el mapa (clic para fijar, rueda para girar, clic derecho para cancelar)."],
  ["Efecto / concentración", "Bendición, Escudo de la Fe", "Aplica el efecto desde la tarjeta. Si te dañan, tirarás salvación de Constitución para mantenerlo."]
])}
<h2>Aplicar daño y curación</h2>
<p>Debajo de cada tirada de daño o curación hay una bandeja para <strong>aplicarla</strong> a las fichas seleccionadas u objetivo (completa, mitad, doble…). Normalmente <strong>el DM aplica el daño a los enemigos</strong>; vosotros podéis aplicar la curación a vuestras fichas.</p>
<h2>✔ Reto (en la Arena)</h2>
<ol>
  <li>Marca un <strong>muñeco</strong> con ${k("T")} y atácale con tu arma.</li>
  <li>Lanzadores: usa un <strong>truco</strong> (Descarga de Fuego o Llama Sagrada) y luego un conjuro de nivel 1. Mira cómo baja tu espacio de conjuro.</li>
  <li>Akra: lanza <em>Bendición</em> sobre el grupo y aplica el efecto.</li>
  <li>Zanna: coloca la plantilla de <em>Dormir</em> sobre los muñecos.</li>
  <li>Escóndete detrás de un pilar y comprueba que el enemigo ya no te ve.</li>
</ol>`],

  ["7 · El combate por turnos", `
<h1>Lección 7 · El combate por turnos</h1>
<ol>
  <li>El DM empieza el combate: en la pestaña <strong>Combate</strong> (las espadas cruzadas) aparece la lista de participantes.</li>
  <li><strong>Tira iniciativa</strong>: clic en el icono del dado junto a tu nombre en esa lista (o desde la iniciativa de tu hoja). La lista se ordena sola.</li>
  <li>Cuando es tu turno tu ficha se resalta y la lista lo marca. Haz: <strong>movimiento</strong> + <strong>acción</strong> (+ acción adicional si tienes alguna).</li>
  <li>Al terminar, pulsa <strong>Terminar turno</strong> (la flecha de la lista de combate) para pasar al siguiente.</li>
</ol>
<h2>Si llegas a 0 puntos de golpe</h2>
<p>Caes inconsciente. En tu turno haz las <strong>tiradas de salvación de muerte</strong> desde tu hoja (aparece un botón junto a los PG): 3 éxitos te estabilizan, 3 fallos… mejor que Akra llegue antes con <em>Palabra Curativa</em>.</p>
<h2>Consejos de mesa</h2>
<ul>
  <li><strong>Piensa tu turno mientras juegan los demás</strong>: ten el objetivo marcado y el conjuro elegido.</li>
  <li>Usa <strong>reacciones</strong> (como <em>Escudo</em> de Zanna) cuando el DM anuncie un ataque contra ti.</li>
  <li>Si algo sale mal (tiraste el ataque equivocado), dilo en el chat: el DM puede borrar mensajes y corregir.</li>
</ul>
<h2>✔ Reto final</h2>
<p>El DM revelará dos <strong>Coyotes Pax</strong> en la Arena. Tirad iniciativa y derrotadlos usando todo lo aprendido. ¡Suerte!</p>`],

  ["Chuleta de atajos", `
<h1>Chuleta de atajos</h1>
${table(["Quiero…", "Cómo"], [
  ["Seleccionar mi ficha", "Clic izquierdo"],
  ["Seleccionar varias", k("Shift") + " + clic, o arrastrar un recuadro"],
  ["Mover", "Arrastrar, o flechas / " + k("W") + k("A") + k("S") + k("D")],
  ["Abrir mi hoja", "Doble clic en la ficha"],
  ["Menú de la ficha (estados, objetivo, elevación)", "Clic derecho en la ficha"],
  ["Medir distancia", k("Ctrl") + " + arrastrar"],
  ["Marcar objetivo", "Ratón encima + " + k("T") + " (" + k("Shift") + " + " + k("T") + " para varios)"],
  ["Señalar un punto a todos (ping)", "Mantener pulsado el clic izquierdo en el mapa"],
  ["Mover la cámara / zoom", "Arrastrar con clic derecho / rueda del ratón"],
  ["Tirada normal rápida", k("Shift") + " + clic en la tirada"],
  ["Ventaja / desventaja", k("Alt") + " + clic / " + k("Ctrl") + " + clic"],
  ["Abrir / cerrar puerta", "Clic en el icono de la puerta"],
  ["Usar macro de la barra", "Teclas " + k("1") + "…" + k("0")],
  ["Deseleccionar / cerrar ventanas", k("Esc")],
  ["Tirar dados a mano", "<code>/r 1d20+5</code>"],
  ["Mensaje privado", "<code>/w Nombre texto</code> (al DM: <code>/w gm</code>)"]
])}`]
];

const DM_PAGINAS = [
  ["Preparar el mundo", `
<h1>Notas del DM · Preparar el mundo</h1>
<p>Esta página solo la ves tú. Si has importado la aventura en un mundo nuevo ya tienes todo: escenas, personajes, enemigos, objetos y diarios.</p>
<h2>Antes de la sesión (10 minutos)</h2>
<ol>
  <li><strong>Crea los usuarios</strong> de tus jugadores: <em>Ajustes → Gestionar jugadores</em> (Configure Players). Ponles contraseña si quieres.</li>
  <li><strong>Asigna personaje</strong> a cada uno: clic derecho sobre su nombre en la lista de jugadores → <em>Configuración de usuario</em> → Personaje. Los cuatro pregenerados son de todos (permiso <em>Propietario</em> por defecto), así nadie se queda bloqueado; si quieres que cada uno controle solo el suyo, cambia los permisos del actor (clic derecho en el actor → <em>Configurar propiedad</em>).</li>
  <li><strong>Activa la escena</strong> <em>1 · Campo de Entrenamiento</em> (clic derecho en la escena → <em>Activar</em>).</li>
  <li>Comprueba que la <strong>puerta del Almacén</strong> está cerrada con llave y que la <strong>puerta secreta</strong> (entre la Sala Oscura y la Cámara del Tesoro) sigue oculta.</li>
  <li>En la Arena, los dos <strong>Coyotes Pax</strong> están <strong>ocultos</strong>. Revélalos para el reto final (clic derecho → icono del ojo).</li>
  <li>Si tu grupo ya tiene sus personajes de la campaña, puedes importarlos aquí también (exportar/importar el actor en JSON o arrastrarlos desde un compendio) y usarlos en lugar de los pregenerados.</li>
</ol>
<h2>Plan de la sesión (~60–90 minutos)</h2>
${table(["Tiempo", "Qué hacer", "Tu papel"], [
  ["5'", "Conectarse, elegir color y personaje. Lección 1.", "Comprobar que todos ven el mapa y oyen/leen el chat."],
  ["10'", "Patio: mover, medir, ping, HUD (lección 2).", "Pide que midan entre dianas (75 pies)."],
  ["10'", "Vestíbulo y Sala de las Puertas (lección 3).", "Cuando intenten el Almacén, pide una tirada y <strong>abre la cerradura</strong>: clic derecho en el icono de la puerta."],
  ["10'", "Hoja de personaje y tiradas (lecciones 4 y 5).", "Pide tiradas concretas: «Percepción con ventaja», «salvación de Destreza»."],
  ["10'", "Sala Oscura: visión y luz.", "Con Percepción CD 12, revela la puerta secreta: abre la configuración del muro (doble clic en él con la capa de muros) y cambia el tipo de <em>Puerta secreta</em> a <em>Puerta</em>, o simplemente haz clic en su icono para abrirla."],
  ["5'", "Cámara del Tesoro: objetos.", "Arrastra desde la pestaña <strong>Objetos</strong> la <em>Poción de Curación</em> y la <em>Antorcha</em> a la hoja de cada jugador."],
  ["20'", "Arena: atacar muñecos, conjuros, plantillas.", "Cambia de escena (activa <em>2 · Arena de Combate</em>). Los muñecos tienen CA 10 y 30 PG."],
  ["20'", "Combate final contra los coyotes (lección 7).", "Revela los coyotes, añade todas las fichas al combate (selecciónalas → clic derecho → <em>Alternar combate</em>), tira la iniciativa de los PNJ y empieza."]
])}
<h2>Trucos útiles para ti</h2>
<ul>
  <li><strong>Tirar por un PNJ en privado</strong>: cambia el modo de tirada del chat a <em>Tirada privada del DM</em>.</li>
  <li><strong>Mover a todos a una escena</strong>: <em>Activar</em> la escena lleva a todos los jugadores.</li>
  <li><strong>Mostrar algo</strong>: en cualquier diario o imagen hay un botón <em>Mostrar a los jugadores</em>.</li>
  <li><strong>Atraer la vista de todos</strong>: ${k("Shift")} + mantener pulsado en el mapa hace un ping que centra la cámara de todos en ese punto.</li>
  <li><strong>Reiniciar la niebla</strong>: en los controles de iluminación hay un botón para restablecer la exploración.</li>
  <li>¿Quieres repetir el tutorial? Vuelve a importar la aventura desde el compendio <em>MT · Tutorial de Foundry</em>: se sobrescriben las escenas y personajes con su estado original.</li>
</ul>`]
];

const page = ([name, content], i) => ({
  _id: pid(name), name, type: "text", sort: (i + 1) * 100000,
  title: { show: false, level: 1 }, text: { format: 1, content: content.trim() },
  ownership: { default: -1 }, flags: {}
});

const journal = [
  { _id: GUIA, name: "Guía de Foundry para Jugadores", folder: FOLDER.JournalEntry, sort: 0, ownership: { default: 2 }, flags: {}, pages: PAGINAS.map(page) },
  { _id: DM, name: "Notas del DM · Tutorial", folder: FOLDER.JournalEntry, sort: 100, ownership: { default: 0 }, flags: {}, pages: DM_PAGINAS.map(page) }
];

/* ------------------------------------------------------------------ */
/*  Personajes pregenerados (héroes del SRD traducidos)                */
/* ------------------------------------------------------------------ */
const HEROES = [
  { nombre: "Randal", titulo: "Guerrero", token: "FighterShield", vision: 0,
    bio: "Antiguo guardia de ciudad. Directo, leal y siempre el primero en cruzar una puerta. <strong>Para aprender:</strong> ataques con arma, el rasgo <em>Tomar Aliento</em> (usos limitados) y la diferencia entre cuerpo a cuerpo y distancia (arco largo)." },
  { nombre: "Riswynn", titulo: "Pícara", token: "RogueHuman", vision: 60,
    bio: "Enana de las colinas que cambió los papeles del ayuntamiento por las cerraduras ajenas. <strong>Para aprender:</strong> habilidades (Sigilo, Juego de Manos), herramientas de ladrón, <em>Ataque Furtivo</em> y visión en la oscuridad." },
  { nombre: "Zanna", titulo: "Maga", token: "WizardTome", vision: 60,
    bio: "Gnoma estudiosa que lo apunta todo en su libro de conjuros. <strong>Para aprender:</strong> trucos, espacios de conjuro, conjuros de área (<em>Dormir</em>), reacciones (<em>Escudo</em>) y efectos (<em>Armadura de Mago</em>)." },
  { nombre: "Akra", titulo: "Clérigo", token: "ClericHuman", vision: 0,
    bio: "Dracónido sacerdote de un dios de la vida. <strong>Para aprender:</strong> curación, conjuros de salvación (<em>Llama Sagrada</em>), concentración (<em>Bendición</em>) y su <em>Arma de Aliento</em> en cono." }
];

function traducir(item) {
  const [es, desc] = OBJETOS[`${item.type}:${item.name}`] ?? OBJETOS[item.name] ?? [item.name, ""];
  for (const e of item.effects ?? []) e.name = es;
  item.name = es;
  item.system.description = { value: desc ? html(desc) : "", chat: "" };
  return item;
}

const actorId = name => tid("actor", name);

const pjs = SRD.heroes.map((src, i) => {
  const h = HEROES[i];
  const a = structuredClone(src);
  a._id = actorId(h.nombre);
  a.name = `${h.nombre} (${h.titulo})`;
  a.img = `systems/dnd5e/tokens/heroes/${h.token}.webp`;
  a.folder = FOLDER.Actor;
  a.sort = i * 100;
  a.ownership = { default: 3 };
  a._stats = { ...STATS, systemVersion: src._stats?.systemVersion ?? STATS.systemVersion };
  a.items = a.items.filter(it => it.type !== "spell" || h.nombre !== "Akra" || CONJUROS_CLERIGO.includes(it.name));
  for (const it of a.items) {
    if (it.type === "spell" && it.system.preparation?.mode === "prepared") it.system.preparation.prepared = true;
    traducir(it);
  }
  a.system.details.biography = { value: html(h.bio), public: "" };
  a.system.details.alignment = "";
  a.prototypeToken = {
    ...a.prototypeToken, name: h.nombre, actorLink: true, disposition: 1,
    texture: { ...a.prototypeToken.texture, src: a.img },
    sight: { ...a.prototypeToken.sight, enabled: true, range: h.vision, visionMode: h.vision ? "darkvision" : "basic" }
  };
  return a;
});

/* ------------------------------------------------------------------ */
/*  Enemigos de práctica                                               */
/* ------------------------------------------------------------------ */
function conIds(doc, seed) {
  doc._id ??= tid(seed);
  for (const [sub, list] of Object.entries({ items: doc.items, effects: doc.effects })) {
    (list ?? []).forEach((c, i) => conIds(c, `${seed}.${sub}.${c.name}.${i}`));
  }
  doc.flags ??= {};
  doc.effects ??= [];
  return doc;
}

const muneco = conIds({
  ...npc("Muñeco de Entrenamiento", {
    img: "systems/dnd5e/tokens/construct/AnimatedArmor.webp", cr: 0, xp: 0, type: "construct", ac: 10, hp: 30, hpFormula: "", walk: 0,
    abilities: abil(10, 1, 10, 1, 1, 1),
    biography: html("Un maniquí de paja y madera con una armadura vieja encima. No ataca ni se mueve: está para que practiquéis ataques, conjuros y plantillas de área.", "CA 10 · 30 PG"),
    items: [trait("Muñeco de Entrenamiento", "Inofensivo", "El muñeco no hace nada en su turno. Si llega a 0 PG, el DM puede devolverle la vida para seguir practicando.")]
  }),
  _id: actorId("Muñeco de Entrenamiento"), folder: FOLDER.Actor, sort: 1000, ownership: { default: 0 }
}, "muneco");
muneco.prototypeToken.disposition = 0;

const coyoteSrc = BESTIARIO.find(b => b.name === "Coyote Pax");
const coyote = conIds({
  ...structuredClone(coyoteSrc), img: "systems/dnd5e/tokens/beast/Jackal.webp",
  _id: actorId("Coyote Pax"), folder: FOLDER.Actor, sort: 1100, ownership: { default: 0 }
}, "coyote");
coyote.prototypeToken = { ...coyote.prototypeToken, texture: { src: coyote.img }, disposition: -1 };

/* ------------------------------------------------------------------ */
/*  Objetos para el botín                                              */
/* ------------------------------------------------------------------ */
const items = [
  ...SRD.items.map((src, i) => {
    const it = traducir(structuredClone(src));
    return { ...it, _id: tid("item", src.name), folder: FOLDER.Item, sort: i * 100, ownership: { default: 0 }, _stats: { ...STATS, systemVersion: src._stats?.systemVersion ?? STATS.systemVersion }, flags: {} };
  }),
  {
    _id: tid("item", "Llave de Hierro"), name: "Llave de Hierro", type: "loot", img: "icons/sundries/misc/key-steel.webp",
    folder: FOLDER.Item, sort: 1000, ownership: { default: 0 }, flags: {}, effects: [], _stats: STATS,
    system: { description: { value: html("Abre la puerta del Almacén del Campo de Entrenamiento. Úsala para practicar a pasar objetos entre personajes."), chat: "" }, quantity: 1, weight: { value: 0, units: "lb" }, price: { value: 0, denomination: "gp" } }
  }
];

/* ------------------------------------------------------------------ */
/*  Escenas                                                            */
/* ------------------------------------------------------------------ */
const T = { wall: [0, 0], door: [1, 0], locked: [1, 2], secret: [2, 0] };
function muro(seed, [x0, y0, x1, y1, tipo = "wall"]) {
  const window = tipo === "window";
  const [door, ds] = T[tipo] ?? [0, 0];
  return {
    _id: tid(seed, x0, y0, x1, y1), c: [x0, y0, x1, y1].map(v => Math.round(v * GRID)),
    light: window ? 0 : 20, move: 20, sight: window ? 0 : 20, sound: window ? 10 : 20,
    dir: 0, door, ds, doorSound: door ? "woodBasic" : undefined,
    threshold: { light: null, sight: null, sound: null, attenuation: false }, flags: {}
  };
}
const luz = (seed, l, i) => ({
  _id: tid(seed, "luz", i), x: l.x * GRID, y: l.y * GRID, elevation: 0, rotation: 0, walls: true, vision: false, hidden: false, flags: {},
  config: {
    bright: l.bright, dim: l.dim, color: l.color, alpha: 0.35, angle: 360, coloration: 1, luminosity: 0.5, attenuation: 0.5,
    animation: l.anim ? { type: l.anim, speed: 3, intensity: 3, reverse: false } : { type: null, speed: 5, intensity: 5, reverse: false }
  }
});
const nota = (seed, x, y, pagina, texto, icon = "icons/svg/book.svg") => ({
  _id: tid(seed, "nota", pagina), entryId: GUIA, pageId: pid(pagina), x: Math.round(x * GRID), y: Math.round(y * GRID), elevation: 0,
  texture: { src: icon, tint: "#ffd27f" }, iconSize: 48, text: texto, fontSize: 32, textAnchor: 1, textColor: "#ffffff", global: false, flags: {}
});
function ficha(seed, actor, [x, y], extra = {}) {
  const p = actor.prototypeToken;
  return {
    _id: tid(seed, "ficha", actor.name, x, y), name: p.name ?? actor.name, actorId: actor._id, actorLink: !!p.actorLink,
    x: x * GRID, y: y * GRID, elevation: 0, width: 1, height: 1, hidden: false, locked: false,
    texture: { src: actor.img, scaleX: 1, scaleY: 1 }, disposition: p.disposition ?? -1,
    displayName: 30, displayBars: 40, bar1: { attribute: "attributes.hp" }, bar2: { attribute: null },
    sight: p.sight ?? { enabled: false }, flags: {}, ...extra
  };
}
const baseEscena = (seed, nombre, img, w, h, extra) => ({
  _id: tid("escena", seed), name: nombre, navName: "", navigation: true, active: false, folder: FOLDER.Scene, ownership: { default: 0 }, flags: {},
  background: { src: `${ASSETS}/${img}.jpg` }, foreground: null, thumb: null,
  width: w * GRID, height: h * GRID, padding: 0, initial: { x: w * GRID / 2, y: h * GRID / 2, scale: 0.5 }, backgroundColor: "#1d1a15",
  grid: { type: 1, size: GRID, distance: 5, units: "pies", style: "solidLines", thickness: 1, color: "#000000", alpha: 0.25 },
  tokenVision: true, fog: { exploration: true, overlay: null, colors: { explored: null, unexplored: null } },
  drawings: [], templates: [], tiles: [], sounds: [], regions: [], journal: GUIA, journalEntryPage: null, playlist: null, playlistSound: null,
  _stats: STATS, ...extra
});

const C = CAMPO;
const campo = baseEscena("campo", "1 · Campo de Entrenamiento", "campo", C.width, C.height, {
  sort: 0, navOrder: 0,
  environment: { darknessLevel: 0.55, globalLight: { enabled: false } },
  walls: C.muros.map(m => muro("campo", m)),
  lights: C.luces.map((l, i) => luz("campo", l, i)),
  notes: [
    nota("campo", 6.5, 13, "1 · La pantalla", "1 · Empieza aquí"),
    nota("campo", 7.5, 13, "2 · Mover tu ficha", "Moverse y medir"),
    nota("campo", 3.5, 2.5, "2 · Mover tu ficha", "Diana", "icons/svg/target.svg"),
    nota("campo", 12, 8.5, "3 · Puertas, ventanas y visión", "2 · Puertas"),
    nota("campo", 20.5, 8.5, "3 · Puertas, ventanas y visión", "3–4 · Cerraduras"),
    nota("campo", 11.5, 16.5, "Sala Oscura", "5 · Oscuridad"),
    nota("campo", 21.5, 16.5, "Cámara del Tesoro", "6 · Tesoro", "icons/svg/chest.svg")
  ],
  tokens: pjs.map((a, i) => ficha("campo", a, C.inicio[i]))
});

const A = ARENA;
const pilarMuros = A.pilares.flatMap(([x, y]) => [[x, y, x + 1, y], [x + 1, y, x + 1, y + 1], [x + 1, y + 1, x, y + 1], [x, y + 1, x, y]]);
const arena = baseEscena("arena", "2 · Arena de Combate", "arena", A.width, A.height, {
  sort: 100, navOrder: 1,
  environment: { darknessLevel: 0, globalLight: { enabled: true } },
  walls: [...arenaMuros(), ...pilarMuros].map(m => muro("arena", m)),
  lights: [],
  notes: [
    nota("arena", 3, 8, "6 · Atacar y lanzar conjuros", "Atacar y conjuros"),
    nota("arena", 21, 8, "7 · El combate por turnos", "Combate")
  ],
  tokens: [
    ...pjs.map((a, i) => ficha("arena", a, A.inicio[i])),
    ...A.munecos.map(p => ficha("arena", muneco, p, { name: "Muñeco" })),
    ...A.enemigos.map(p => ficha("arena", coyote, p, { hidden: true }))
  ]
});

/* ------------------------------------------------------------------ */
/*  Macro                                                              */
/* ------------------------------------------------------------------ */
const macros = [{
  _id: tid("macro", "primera"), name: "Mi primera tirada", type: "chat", scope: "global", img: "icons/svg/d20-highlight.svg",
  command: "/r 1d20 # ¡Mi primera tirada!", folder: FOLDER.Macro, sort: 0, ownership: { default: 2 }, flags: {}, author: null
}];

/* ------------------------------------------------------------------ */
/*  Aventura                                                           */
/* ------------------------------------------------------------------ */
export default [{
  name: "Tutorial de Foundry",
  img: `${ASSETS}/portada.jpg`,
  caption: "Un mundo de práctica para aprender a jugar en Foundry VTT",
  description: html(
    "Importa esta aventura en un <strong>mundo nuevo y vacío</strong> con el sistema dnd5e para tener un campo de entrenamiento listo para tus jugadores.",
    `<ul><li><strong>2 escenas:</strong> un Campo de Entrenamiento (movimiento, puertas, cerraduras, ventanas, puerta secreta, oscuridad) y una Arena de Combate con muñecos y coyotes.</li>
<li><strong>4 personajes pregenerados</strong> de nivel 1 (guerrero, pícara, maga y clérigo), basados en los héroes del SRD 5.1 y traducidos.</li>
<li><strong>Guía de Foundry para Jugadores</strong>: 7 lecciones con retos y una chuleta de atajos.</li>
<li><strong>Notas del DM</strong> con la preparación y un plan de sesión de 60–90 minutos.</li></ul>`,
    "Empieza abriendo el diario <em>Notas del DM · Tutorial</em>."
  ),
  actors: [...pjs, muneco, coyote],
  items, journal, macros,
  scenes: [campo, arena],
  folders, tables: [], combats: [], playlists: [], cards: [],
  sort: 0, flags: {}, _stats: STATS
}];
