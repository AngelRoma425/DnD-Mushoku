// Diario del DM para la campaña «Historias del Mundo de las Seis Caras: Anomalía».
import { uuid } from "../../tools/helpers.mjs";

const O = (name, label = name) => `@UUID[${uuid("mt-campana-objetos", "Item", name)}]{${label}}`;
const M = (name, label = name) => `@UUID[${uuid("mt-anomalias", "Actor", name)}]{${label}}`;
const table = (head, rows) =>
  `<table><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
const ul = items => `<ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
const secret = text => `<section class="secret"><p>${text}</p></section>`;

const P = {};

P["Premisa y Prólogo"] = `
<h1>Historias del Mundo de las Seis Caras: Anomalía</h1>
<h2>Premisa</h2>
<p>Años después de la era de héroes que cambió la historia de las Seis Caras, el mundo parece vivir una relativa calma… o al menos así lo creen quienes buscan una vida mejor entre los gremios y caravanas de la Región de Fittoa. Hoy viven los tataranietos de Rudeus Greyrat, y la guerra contra los apóstoles del Dios Humano se cuenta ya como una leyenda urbana.</p>
<p>En una bulliciosa ciudad, un grupo de aventureros recién formado recibe su primer encargo importante: adentrarse en un nuevo «laberinto» descubierto en el bosque cercano y recuperar los restos de un grupo desaparecido. Es una misión inusual, pero bien pagada… Poco sabe ese grupo que este pequeño encargo marcará su vida sin vuelta atrás, pues se metieron con algo más allá de la comprensión humana: las <strong>anomalías</strong>.</p>
<h2>Prólogo</h2>
<p>Los aventureros se reúnen en el gremio de un pueblo de Fittoa. Por el largo periodo de paz quedan pocos aventureros, así que son agrupados al azar en un mismo grupo de expedición liderado por <strong>Cozbi Cohen</strong>. El encargo: buscar a un grupo extraviado en un laberinto nuevo al norte de Fittoa. Probablemente estén muertos, pero recuperar sus cuerpos para que sus familias puedan despedirlos está bien pagado.</p>
<p>El laberinto resulta ser algo que nunca habían visto: <strong>una estación de metro de Japón</strong>. Dentro luchan contra monstruos mutados y extraños. Al salir, son interceptados por una figura misteriosa que les revela que son los únicos capaces de hacer frente a las «Anomalías», que han comenzado a aparecer por todo el mundo. Deberán abrirse paso continente por continente para detenerlas y encontrar su causa.</p>
<h2>Estructura</h2>
${table(["Acto", "Escenario"], [
  ["Acto 1", "Continente Demoníaco"],
  ["Acto 1.5", "Trama de personajes: Basil, Amaris y Erwin"],
  ["Acto 2 / 2.5 / 3", "Por escribir"]
])}
<h2>Jugadores</h2>
${ul(["Angel (PJ administrativos)", "Cuyo (16)", "Luka (18)", "Twister (18)", "Nozu (16)", "Neon (17)", "Mapache (16)", "Stella", "Hannya (14)"])}`;

P["Origen de las Anomalías (Secreto)"] = `
<h1>Origen de las Anomalías</h1>
<p><em>Solo para el DM.</em></p>
<p>El tiempo entre el <strong>Mundo de Tres Caras</strong> (la Tierra) y el <strong>Mundo de Seis Caras</strong> no está sincronizado. En Japón, un hombre fue atropellado junto a varios adolescentes: el hombre murió y los chicos desaparecieron. En las Seis Caras, aquel hombre renació con sus recuerdos e intentó vivir su nueva vida como una forma de redención, y lo logró dentro de lo que cabe. Diez años después de su nacimiento, un fenómeno de teletransportación dispersó a gran parte de la población por el mundo. Años después, la disputa contra los apóstoles del Dios Humano terminó con la victoria de la Alianza del Dios Dragón y, con las décadas, se convirtió en leyenda urbana.</p>
<h2>La distorsión</h2>
<p>La creación del ciclo de la <strong>Miko del Renacimiento</strong> distorsionó la línea temporal (en la nueva línea, al lado de Akito Shinohara). Transportar a aquellos chicos causó un efecto no deseado: como el maná de la Miko se usó para entrar en aquel mundo, se produjo <strong>un fenómeno de teletransportación en Japón</strong>, igual que la llegada de Nanahoshi lo produjo en el mundo humano.</p>
<p>Y así como Nanahoshi fue transportada, también se llevó algo: <strong>el lado Dios Demonio de Laplace</strong>, que apareció en Japón. Su llegada desató una guerra en el país: usó maldiciones para controlar a la población y lo llevó a la ruina. Sin maná en el Mundo de Tres Caras, buscó la fuente más cercana —las Seis Caras— y creó una conexión que, en lugar de mover cosas dentro del propio mundo, <strong>transportó partes de Japón al otro mundo</strong>.</p>
<h2>La Séptima Estrella Silenciosa</h2>
<p>En un futuro remoto, Nanahoshi logró volver a su mundo, pero lo encontró en ruinas. Laplace, cansado de aquel mundo sin sentido, la usó como nexo: con todo el maná que le quedaba abrió un portal y viajó a un punto anterior al viaje al Mundo de Tres Caras. Esta Nanahoshi del futuro, al entrar en conflicto con la que estaba en animación suspendida, fue despojada de su cuerpo y convertida en una anomalía: <strong>la Séptima Estrella Silenciosa, la anomalía original</strong>.</p>
<p>Contactó en secreto con Orsted, quien le confirmó que esto debía pasar en el ciclo para detener a Hitogami. Sintiéndose traicionada, se aisló en un lugar recóndito del Continente Central, dando origen a <strong>la primera anomalía</strong>: un ancla que une ambos mundos y que está conectada con todas las demás.</p>
<h2>Cómo funcionan las anomalías</h2>
${ul([
  "Su aislamiento las activó como una <strong>resonancia</strong>.",
  "Estaban destinadas a perecer por el <strong>Síndrome de Drenaje</strong>, pero eso reactivó su instinto de autopreservación: aprendieron a <strong>devorar el maná</strong> de todo lo que ven y a expandirse.",
  "Cada una tiene un <strong>guardián</strong>: el primer humano en ser adaptado, que la resguarda y busca expandirla para no perecer."
])}
<h2>Kasten, Kaida y Hitogami</h2>
<p>Los cambios en la historia empezaron a aparecer. Orsted, consciente de ello, usó una versión modificada de su magia de viaje en el tiempo para atraer a una versión joven de sí mismo y, con magia de sanación de nivel Deidad, cambió la composición de su alma para que el mundo lo reconociera como otra existencia: así nació <strong>Kasten</strong>.</p>
<p>Orsted encomendó a Kasten deshacerse de las anomalías, porque lo necesario era el regreso de Laplace, que renacería en un miembro de su grupo que conocería años después: <strong>Kaida Himori</strong>.</p>
<p>Actualmente <strong>Hitogami</strong> busca que las anomalías se expandan un poco más para desestabilizar a Orsted. No tiene mucha fuerza, pero puede manipular a <strong>2 personas a la vez</strong>; la primera es <strong>Holden Claufield</strong>, ayudante de Orsted.</p>`;

P["Personajes y Tramas"] = `
<h1>Personajes Jugadores y sus Tramas</h1>
${table(["PJ", "Continente", "Trama"], [
  ["<strong>Lymon</strong>", "Central", "Humano de Japón cuya alma fue transportada a un cuerpo muerto al intentar ser revivido; fruto del regreso de Laplace, fue enviado al pasado. En el Continente Central descubrirá quién fue; en Millis, la verdad sobre su alma. Poco a poco recuperará recuerdos de ambas vidas."],
  ["<strong>Koda</strong>", "Central", "Elegido de su tribu en la ceremonia de la estatua del trueno; el rayo cayó sobre él. Hitogami le habla en sueños."],
  ["<strong>Erwin</strong>", "Demoníaco", "Superd encerrado en una armadura por la maldición de Laplace."],
  ["<strong>Basil</strong>", "Demoníaco", "Descendiente de <strong>Urupen</strong>, uno de los 5 Generales Dragón. Abandonado tras un ataque a su aldea, fue hallado a la orilla del mar y criado como marinero. Perugius le revelará su linaje, y en el Continente Demoníaco aprenderá el <strong>aura de batalla dracónida</strong> junto a Amaris."],
  ["<strong>Amaris</strong>", "Demoníaco", "¼ dragón, ¼ demonio y mitad humana. Nieta de Laplace (su lado <em>Dios de las Técnicas</em>). Orsted mató a su padre; Laplace huyó con ella al notar en ella el legado del Primer Dios Dragón, pero la abandonó para investigar las anomalías. Kasten la encontró y la acogió."],
  ["<strong>Wynna</strong>", "Millis", "Su hermano muerto fue revivido por Holden y usado como marioneta."],
  ["<strong>Kaida</strong>", "Millis", "Huérfana criada en un templo de Millis." + secret("Laplace renacerá en ella.")],
  ["<strong>Edmund</strong>", "Millis", "Expulsado de su escuela de magia por sus explosivos; exiliado."],
  ["<strong>Clow</strong>", "Millis", "Enana alcohólica en busca de redención; casi mata a un hombre."],
  ["<strong>Nyx</strong>", "Begaritt", "Por desarrollar."]
])}
<h2>Notas de la trama de Amaris</h2>
<p>En el Continente Demoníaco, tras el laberinto, el grupo descansará en la aldea Migurd, donde alguien traducirá el libro con el sello del Dios Dragón: quien lo escribió sabe de Laplace, y Amaris reconocerá el nombre de su abuelo.</p>
${secret("En la pelea final contra Laplace y Nanahoshi, Amaris reconocerá a su abuelo en Laplace.")}
<h2>Visiones de la Vidente (sesión 6)</h2>
<p>Cada PJ ve una alternativa con un «final feliz» y debe rechazarla. Si al menos 5 la rechazan, superan la prueba.</p>
${table(["PJ", "Tentación"], [
  ["Lymon", "Su lápida, con su nombre borrándose, y un limón caído del limonero. Unos niños le piden que les enseñe sus nuevos inventos: puede quedarse y empezar de cero sin olvidar quién era. Si lo rechaza, sus recuerdos se irán de nuevo."],
  ["Wynna", "Come en casa con sus hermanos; Faelan consiguió un puesto de guardia en Millishion y una casa para la familia. Si se va, todo volverá a arder."],
  ["Kaida", "Los sacerdotes encontraron a sus verdaderos padres, vivos. Si lo rechaza, seguirá siendo la huérfana del templo."],
  ["Basil", "Por escribir."],
  ["Amaris", "Su abuelo y sus padres le tienden la mano: encontraron un lugar tranquilo. Si no va, volverán a desaparecer."],
  ["Erwin", "Su armadura se abre y dentro está su cuerpo de carne, intacto; la maldición se desvanece y su aldea prospera. Si lo rechaza, la armadura se cerrará."],
  ["Koda", "El día de su ceremonia puede irse y vivir como un civil más, sin perder a sus futuros compañeros. Si lo rechaza, el rayo volverá a caer."],
  ["Edmund", "En su escuela, en lugar de expulsarlo lo mandan a detención con sus amigos; sus padres lo esperan para cenar. Si se va, volverá a perderlo todo."],
  ["Clow", "En el bar, junto a su hermana y sin ahogar penas; la aceptaron en la universidad y el hombre que casi mata le ofrece cambiarlo todo. Si se va, volverá a ser la alcohólica que busca redención."]
])}
<p><strong>Si superan la prueba</strong>, obtienen una visión fragmentada:</p>
${ul(["Japón en llamas: un incendio arrasa la ciudad.", "Rikarisu desde arriba: los caminos se cubren de flores; la anomalía los rodea y deben actuar ya.", "Su grupo, peleando contra un enemigo invisible; solo siluetas… y uno de ellos falta."])}`;

P["PNJ"] = `
<h1>Personajes No Jugadores</h1>
<h2>Las grandes figuras</h2>
${table(["PNJ", "Descripción"], [
  ["<strong>Orsted</strong>", "El viejo Dios Dragón. Impone miedo con su sola presencia (su casco lo reduce). Mueve los hilos para detener a Hitogami."],
  ["<strong>Kasten</strong>", "Versión joven de Orsted con el alma reconstruida. Contrata al grupo para neutralizar las anomalías. Su maldición intimida a todo el que lo ve. Les dio un mapa de Rikarisu y el " + O("Amuleto de Kasten") + "."],
  ["<strong>Hitogami</strong>", "El Dios Humano. Débil, pero manipula a 2 personas a la vez para expandir las anomalías."],
  ["<strong>Holden Claufield</strong>", "Ayudante de Orsted… y peón de Hitogami. Revivió al hermano de Wynna como marioneta. Observa al grupo a distancia."],
  ["<strong>Laplace</strong>", "Dividido en la Campaña de Laplace: su lado <em>Dios Demonio</em> fue enviado a Japón; su lado <em>Dios de las Técnicas</em> vive oculto bajo múltiples identidades."],
  ["<strong>Nanahoshi / la Séptima Estrella Silenciosa</strong>", "La anomalía original, aislada en un lugar recóndito del Continente Central."],
  ["<strong>Perugius</strong>", "Revelará a Basil que desciende de Urupen."]
])}
<h2>Fittoa</h2>
${ul(["<strong>Cozbi Cohen</strong>: líder del grupo en la primera misión. Murió atravesado por el " + M("Lobo Siamés") + "."])}
<h2>Rikarisu</h2>
${table(["PNJ", "Papel"], [
  ["<strong>Zahra</strong>", "Encargada del gremio. Asigna habitaciones y organiza el plan de las caravanas."],
  ["<strong>Vor'ka</strong>", "Informa al grupo sobre «La Muda del Desierto». Escolta a Yor'Zuh y Nael."],
  ["<strong>Yor'Zuh</strong>", "Mercader. Su hijo <strong>Nael</strong> desapareció en los barrios bajos (misión secundaria)."],
  ["<strong>Myrrha</strong>", "Alquimista. Regaló a Wynna el " + O("Brebaje de Flores") + "."],
  ["<strong>Kiri-Kiri</strong>", "Herrero. Mejoró el equipo de Erwin con el " + O("Lanzador de Cadenas") + "."],
  ["<strong>Seh'ra</strong>", "Cartógrafa."],
  ["<strong>Rakk</strong>", "Contrabandista."],
  ["<strong>Ish'thel</strong>", "Vidente de la taberna del gremio. Ofrece una lectura en un plano onírico."],
  ["<strong>Shurah / Sáqher</strong>", "Comerciante de la taberna oculta entre rocas, al borde de la ciudad."]
])}
<h2>Aldea Migurd</h2>
${ul(["<strong>Misaki</strong>: herida, guía al grupo hasta la aldea; su relación con el incidente de teletransportación se explica con Saru.", "<strong>Saru</strong>, <strong>Nara</strong>, <strong>Goro</strong>, <strong>Muri</strong> y <strong>Kara</strong>: habitantes de la aldea.", "<strong>Roka</strong> y <strong>Dreno</strong>: mercaderes.", "<strong>Vaelthrys</strong>: viejo dragón ermitaño, rasposo y arrogante, muy reservado y amargado. Recluido en una cueva lejana."])}
<h2>Otros</h2>
${ul(["<strong>Rigoberto</strong>: el juguete de madera que cobró vida en la anomalía y volvió a ser juguete al escapar.", "<strong>Vlu</strong>: se disfrazaba en el Piso 1 para evitar a las anomalías."])}`;

P["Mazmorra Anómala: Metro"] = `
<h1>Mazmorra Anómala: el Metro</h1>
<p>Una estación de metro de Japón aparecida en el bosque al norte de Fittoa. El aire asfixia. Allí rescataron a Stella y Mapache, sobrevivientes de expediciones anteriores, y se enfrentaron al ${M("Lobo Siamés")}.</p>
<h2>Botín por jugador</h2>
<p>Los objetos se obtienen en tiendas o en investigación según la tirada (d20): <strong>1–9</strong> nada · <strong>10–13</strong> objeto común · <strong>14–17</strong> objeto poco común.</p>
${table(["Jugador", "10–13 (común)", "14–17 (poco común)"], [
  ["Cuyo", O("Núcleo Óseo Palpitante"), O("Implante Ocular de la Percepción de la Muerte")],
  ["Luka", O("Daga de Punta de Medianoche"), O("Faja del Duelista Solitario")],
  ["Twister", O("Ampolla de Sangre Coagulada"), O("Guante Escamado del Juramento de Sangre")],
  ["Nozu", O("Semilla del Despertar"), O("Broche de Savia Dulce")],
  ["Neon", O("Válvula Reguladora de Presión"), O("Placa de la Marcha Fúnebre")]
])}`;

P["Rikarisu"] = `
<h1>Rikarisu</h1>
<p>El antiguo castillo de la Gran Emperatriz Demonio Kishirika Kishirisu, construido en el centro de un gran cráter. Lo gobierna el Señor Demonio Badigadi. El grupo llega a través de un portal en unas ruinas del bosque y con el ${O("Amuleto de Kasten")}.</p>
<h2>La anomalía: «La Muda del Desierto»</h2>
<p>El laberinto apareció hace 6 meses al suroeste de la ciudad, cerca del anillo exterior, enterrado en la arena. Se encuentra fácil: el desierto a su alrededor está lleno de flores y desprende un aroma dulce. Dentro es como una ciudad entera, «un pueblo patas arriba». Los monstruos han empezado a <strong>mudar de piel</strong> (${M("Monstruo Mudado")}) y asaltan las rutas comerciales.</p>
<h2>Mercaderes</h2>
<p>Encontrarás todos sus objetos en el compendio <strong>MT · Objetos de Campaña</strong>, en la carpeta <em>Rikarisu</em>.</p>
${table(["Mercader", "Especialidad"], [
  ["Yor'Zuh", "Equipo de desierto: " + O("Vendajes de Arena Viva") + ", " + O("Lámpara de Cristal Negro") + ", " + O("Botas de Expedicionario") + "…"],
  ["Myrrha", "Alquimia: pociones, " + O("Sal Inflamable") + ", " + O("Extracto de Maná Concentrado") + "…"],
  ["Kiri-Kiri", "Armas simples y marciales (2–25 oro), armaduras básicas (10–50 oro), " + O("Espada Bastarda") + ", escudos…"],
  ["Seh'ra", "Mapas, permisos de paso y pergaminos."],
  ["Rakk", "Contrabando: ganzúas, " + O("Bomba de Humo") + ", " + O("Pergamino de Desaparición") + "…"],
  ["Sáqher", "Taberna oculta: armas y armaduras raras, " + O("Pergamino de Huida") + "…"]
])}
<h2>Misiones secundarias</h2>
${ul([
  "<strong>Myrrha:</strong> 50 % de descuento si escoltan caravanas médicas al laberinto (+3 enemigos en la emboscada).",
  "<strong>Yor'Zuh — Nael:</strong> su hijo fue visto en los barrios bajos negociando con contrabandistas (llevaba mercancía sin permiso para ayudar a su madre). Lo encuentran herido; lo lastimaron anomalías que se colaron en la ciudad. Opciones: huir (Sigilo) o enfrentarlas (combate). <em>Recompensa:</em> si lo rescatan sin dañar a los contrabandistas, ganan su respeto, un descuento permanente con Yor'Zuh y el contacto de Nael.",
  "<strong>Ish'thel — la lectura:</strong> cada PJ le entrega un objeto importante y viajan a un plano onírico. Reglas: mantener la concentración, resistir impulsos externos y seguir el sentido <em>opuesto</em> al que les dicte su intuición. Sin combate, con tentaciones y miedos. <em>Recompensa:</em> Presagio Benevolente (ventaja en un momento futuro de la trama) y una premonición."
])}
<h2>Investigación en la taberna oculta (sesión 5)</h2>
<p>Tirada de Investigación: <strong>1</strong> nada y tiran Sigilo · <strong>2–9</strong> nada · <strong>10–14</strong> 1 objeto · <strong>15–19</strong> 2 objetos · <strong>20</strong> 3 objetos. Tira 1d20 por objeto:</p>
${table(["d20", "Objeto"], [
  "Juguete de Madera Tallado", "Moneda Desconocida", "Llave Maestra Oxidada", "Cuerda de Arena Trenzada", "Daga con Contrapeso", "<em>(vacío)</em>",
  "Escudo Marcador", "Chaleco de Escamas Recuperadas", "Ballesta Ligera de Carga Rápida", "Hoja con Filo Cansado", "Escudo de Núcleo Triple",
  "Coraza de Placas Mixtas", "Anillo de Estabilidad", "Arco Corto de Tendón Reforzado", "Armadura del Custodio Caído", "Farol de Luz Lunar",
  "Fragmento de Armadura Florecida", "Mapa de Contrabando del Gran Bosque", "Botas del Paso Silente", "Proyectiles Explosivos (x20)"
].map((n, i) => [String(i + 1), n.startsWith("<") ? n : O(n)]))}`;

P["Laberinto: La Muda del Desierto"] = `
<h1>Laberinto de Rikarisu: La Muda del Desierto</h1>
<p>Un complejo de departamentos derrumbado: todos los que vivían allí se mezclaron con la flora y fauna local. El desierto florece porque la anomalía drena la esencia vital de los cadáveres para sobrevivir a falta de maná.</p>
<h2>El viaje (sesión 7)</h2>
${ul([
  "Una caravana se avería: repararla (emboscada segura) o abandonar el carro (no pasa nada).",
  "Caravanas destruidas rodeadas de flores: investigarlas revela que fueron destruidas con fuego. Botín (d20): <strong>1</strong> reciben daño · <strong>2–5</strong> 5–10 oro/huesos o 2–5 hojas/flores poco comunes · <strong>6–9</strong> 15–30 oro/huesos o 10–15 hojas/flores poco comunes · <strong>10–14</strong> 10 hojas/flores raras, 30 oro y 10 huesos anómalos · <strong>15–19</strong> 20 hojas/flores raras, 50 oro y 20 huesos anómalos · <strong>20</strong> " + O("Núcleo Anómalo Apagado") + ".",
  "El cañón del dragón dormido: Sigilo CD 13 (las caravanas pasan automáticamente). Si despierta, lanza bolas de fuego: tienen 1 ronda para salir del área o cubrirse tras rocas, y deben guiar a las caravanas prediciendo dónde impactará."
])}
<h2>Entrada y Recepción</h2>
<p>Una flor gigante sirve de puerta. Para abrirla: acariciarla, hablarle en voz baja o regarla. Si no, se endurece y suelta polvo venenoso (salvación de Destreza CD 14). Al abrirse «bosteza» y los traga: caen al agua del jardín interior (Acrobacias o 1d4 de daño contundente).</p>
<p><strong>Recepción:</strong> una recepción clásica de apartamentos con luz funcional y un elevador. Zona segura para acampar. Un PNJ guía los recibe:</p>
<blockquote><p>«Ah… visitantes, y puntuales. Siempre es agradable cuando llegan puntuales. Sean cordialmente bienvenidos al Atrio Verde, primera sección de nuestro recorrido botánico. Aquí podrán observar ejemplares cultivados con dedicación, ecosistemas balanceados con precisión y armonías naturales preservadas con esmero. Les rogamos no arrancar muestras, no alterar los flujos de agua y no alimentar a los especímenes. El recorrido continúa hacia adelante, donde podrán apreciar la obra principal del recinto.» <em>(sonríe levemente)</em> «El Jardinero estará complacido de saber que han llegado.»</p></blockquote>
<h2>Piso 1: Diques y Represas</h2>
<p>Un jardín enorme con niveles de agua desiguales y una gran compuerta bloqueada. El guía dice que mantenimiento lo arreglará… en 20 años; si se niegan, desaparece advirtiendo que el Jardinero no estará contento.</p>
<p><strong>Puzzle:</strong> investigar para hallar tres papeles (<em>Jardines nivelados</em>, <em>Canal desbordado</em>, <em>Puerta seca</em>) y nivelar el agua con la máquina. Aquí está Vlu, disfrazado para evitar a las anomalías.</p>
<p><strong>Investigación 20:</strong></p>
<blockquote><p><strong>Informe de Observación — Sector Jardín Experimental</strong> (copia archivada). Las especies introducidas en el recinto están mostrando un grado de adaptación superior al esperado. La humedad ambiental permanece estable incluso sin sistemas de riego activos, lo cual sugiere que el suelo está reteniendo agua de forma no convencional. Ninguna de las plantas muestra signos de marchitez, estrés o enfermedad. De hecho, presentan crecimiento simultáneo, como si respondieran a un mismo estímulo. Hemos descartado infección fúngica y plaga. Se recomienda continuar observación pasiva. — Departamento de Botánica Aplicada</p></blockquote>
<h2>Piso 2: Invernadero</h2>
<p>Cuatro anomalías (${M("Guerrero Mantis", "Guerreros Mantis")}), cada una en una zona. Los PJ en el centro notan que ninguna está en la zona de su color; deben convencerlas de cambiarse (CD 16). Si atacan cualquier zona, combaten contra el guerrero de esa zona.</p>
${table(["PNJ", "Zona inicial"], [["Rojo (Enojo)", "Verde"], ["Azul (Tristeza)", "Amarilla"], ["Verde (Celos)", "Azul"], ["Amarillo (Alegría)", "Roja"]])}
<h2>Piso 3: La Cascada</h2>
<p>El ${M("Greenkeeper")} resguarda la puerta al Jardinero: diálogo o combate (dificultad moderada). Después, descanso corto o largo según lo difícil que haya sido.</p>
<h2>Zona secreta y El Jardinero (sesión 10)</h2>
<p>La estatua que guardaba el Greenkeeper los traga y los lleva a una playa. Durante el descanso largo brotan raíces: salvación de Sabiduría CD 18 o ${M("El Jardinero")} aprende una habilidad del PJ (ver la tabla). Hitogami habla en sueños a Koda sobre cómo escapar sin pelear. Despiertan junto a una chica que los guía hasta una flor con un recuerdo:</p>
<blockquote><p>Una mujer y un chico discuten, en un idioma que extrañamente entienden, sobre una flor mutada que podría dañar a los turistas. Un tercero pregunta si vieron las noticias: en un teléfono, el centro de Tokio está en guerra con criaturas desconocidas. Un temblor lo sacude todo. Al volver la luz, ella está en el jardín de la segunda fase; las flores cobran vida, la engullen en un capullo y, al abrirse, su cuerpo ha cambiado. Un ayudante se acerca y las raíces lo drenan. Ella admira el paisaje y admite que «necesita mejoras».</p></blockquote>
${table(["PJ", "Habilidad copiada", "Tipo"], [
  ["Lymon", "Invoca un Constructo Floral (CA 14, 20 PG, 1d8 de daño); solo uno.", "Acción"],
  ["Wynna", "1/combate: las armas florales explotan y curan 3d8 en 10 pies.", "Acción"],
  ["Edmund", "Explosión de 5 pies de radio, 4d6 de fuego.", "Acción"],
  ["Nyx", "Portal floral: se teletransporta 15 pies.", "Acción"],
  ["Clow", "Un ataque básico causa 2d8 radiante adicional.", "Adicional"],
  ["Koda", "Tormenta de pétalos: 5 de daño necrótico en 10 pies.", "Adicional"],
  ["Basil", "Pierde 1d6 PG; sus ataques suman ese valor 1 turno.", "Adicional"],
  ["Kaida", "Círculo de pétalos: +2 CA.", "Reacción"],
  ["Amaris", "Se vuelve translúcido y esquiva un ataque.", "Reacción"],
  ["Erwin", "Reduce el daño recibido en 1d10 + 5.", "Reacción"]
])}
<p>Solo puede usar una habilidad copiada por turno. El Jardinero habla sin combatir al principio: era un jardín botánico que, tras días de cosas raras y un temblor, apareció aquí. Se vieron forzados a consumir este mundo para subsistir, guiados por «la Estrella». Mientras dormían, la anomalía llegó a Rikarisu: aun si lo derrotan, la propagación tardará meses en desaparecer.</p>
<p><strong>Fase 2:</strong> el terreno se vuelve inestable; válvulas regulan el agua y solo una funciona cada vez. Al vencerlo, el laberinto se derrumba: solo quienes saquen 15+ en Investigación pueden saquear antes de escapar. El grupo sube a <strong>nivel 6</strong>, Rigoberto vuelve a ser un juguete y, a lo lejos, Holden los observa antes de retirarse.</p>
<h2>Botín del Jardinero</h2>
<p>Todo en la carpeta <em>La Muda del Desierto / Botín del Jardinero</em> del compendio de objetos de campaña.</p>`;

P["Aldea Migurd y Vaelthrys"] = `
<h1>Aldea Migurd</h1>
<h2>Sesión 12: Un Trago Amargo</h2>
${ul(["<strong>Objetivos:</strong> escapar del laberinto en colapso, dirigirlos a la aldea Migurd y empezar a desarrollar el lore de Basil y Amaris.", "<strong>Gancho:</strong> al salir, Misaki (herida) dice que irá a la aldea Migurd, donde saben mucho de maná. En el camino Holden les habla de los Migurd y de Kasten.", "<strong>Combate opcional:</strong> si atacan a la anomalía moribunda en lugar de dejarla marchitarse, o si no logran dialogar con Holden.", "<strong>Recompensas:</strong> materiales de la carpeta <em>La Muda del Desierto / Materiales</em>.", "<strong>Cliffhanger:</strong> los Migurd sienten el maná de todos y notan algo extraño en Basil y Amaris, que resuenan de sobremanera con ellos."])}
<h2>Sesión 13: Un Cuento Infantil</h2>
<p>Hablar con Saru sobre Misaki y el incidente de teletransportación. El libro del dragón es un cuento escrito por el abuelo de Amaris sobre Laplace; el otro es ilegible, pero es de Rudeus. Saru señala unas ruinas cercanas del Dios Dragón.</p>
<h2>Sesión 14: Escamas de Ermitaño</h2>
<p>Comprar a los PNJ para equiparse y partir en busca del viejo dragón ermitaño <strong>Vaelthrys</strong>, recluido en la lejanía del Continente Demoníaco. Deberán resolver acertijos para llegar a él.</p>
${ul(["<strong>Localizaciones:</strong> Aldea Migurd (charlas finales y compras), camino a la cueva, entrada a la cueva, cueva de Vaelthrys.", "<strong>Roleplay:</strong> el día de compras en la aldea y el puzzle de la entrada.", "<strong>Mercaderes:</strong> Roka y Dreno (carpeta <em>Aldea Migurd</em>; armas básicas, armaduras ligeras y escudos del manual)."])}`;

P["Diario de Sesiones"] = `
<h1>Diario de Sesiones</h1>
${table(["#", "Título", "Resumen"], [
  ["1", "—", "El gremio de Fittoa reúne al grupo bajo Cozbi Cohen. Viaje por el bosque y primeras criaturas."],
  ["2", "—", "El metro. Rescatan a Stella y Mapache y matan al Lobo Siamés, que atraviesa a Cozbi en su último aliento. Kasten los intimida al salir."],
  ["3", "—", "Kasten les cuenta todo (Laplace, la guerra futura y las anomalías). Eligen el Continente Demoníaco (Rikarisu) frente al Gran Bosque o la Mandíbula Inferior del Dragón Rojo. Portal y emboscada."],
  ["4", "—", "Fin de la emboscada; Kasten, herido, se retira. Llegan a Rikarisu: Zahra, Vor'ka y los mercaderes."],
  ["5", "—", "Ish'thel los lleva a la taberna oculta (Sáqher, investigación)."],
  ["6", "Fragmentos", "Kaida y Clow se reúnen con el grupo; emboscada de lagartos floridos. Edmund y Clow se unen. Visiones de la vidente."],
  ["7", "Dunas Floridas", "Caravanas, regalos de Myrrha y Kiri-Kiri, el dragón del cañón y la entrada al laberinto."],
  ["8", "Un Excelente Servicio", "La flor de entrada, la Recepción y el Piso 1 (Diques y Represas)."],
  ["9", "No Pasarás", "Piso 2 (Invernadero) y Piso 3 (La Cascada, Greenkeeper)."],
  ["10", "Cada Rosa Tiene Sus Espinas", "Zona secreta, habilidades copiadas y El Jardinero. Suben a nivel 6."],
  ["11", "Cosechas lo que Siembras", "—"],
  ["12", "Un Trago Amargo", "Escape del laberinto, Holden y la aldea Migurd."],
  ["13", "Un Cuento Infantil", "Saru, Misaki y los libros del Dios Dragón."],
  ["14", "Escamas de Ermitaño", "En busca de Vaelthrys."],
  ["15", "Los Viejos Tiempos", "Por preparar."],
  ["16", "Trazando Nuevos Caminos", "Por preparar."],
  ["17", "5 Toneladas de Chatarra", "Por preparar."],
  ["18", "Recuerdos Oxidados por el Olvido", "Por preparar."],
  ["19", "Una Falta de Tuercas y Tornillos", "Por preparar."],
  ["20", "Un Rostro Conocido", "Por preparar."],
  ["21", "Impermeable Amarillo", "Por preparar."],
  ["22", "Hogar, Dulce Hogar", "Por preparar."]
])}
<h2>Equipos registrados</h2>
${ul([
  "<strong>Sesión 7:</strong> Luka y Neon · Hannya y Nozu · Twister y Cuyo · Mapache.",
  "<strong>Sesión 8:</strong> Twister y Cuyo · Hannya y Nozu · Rulo y Ejsu.",
  "<strong>Sesión 9:</strong> Nozu y Hannya (11) · Twister y Cuyo (11) · Luka y Neon (4) · Vlu y Ejsu (11) · Mapache y Rulo (17).",
  "<strong>Sesión 10:</strong> Nyx y Lymon (9) · Clow y Edmund (17) · Amaris y Wynna (11) · Kaida, Basil y Erwin (9).",
  "<strong>Sesión 11:</strong> Clow y Erwin (19) · Lymon y Koda (12) · Amaris y Wynna (11) · Kaida y Basil (5)."
])}`;

P["Secretos de Objetos"] = `
<h1>Secretos de Objetos</h1>
<p><em>Solo para el DM: efectos ocultos que no aparecen en la ficha del objeto.</em></p>
${table(["Objeto", "Secreto"], [
  [O("Esencia Destilada de Anomalía"), "Si se consume, recupera todos los espacios de conjuro de nivel 1 y 2. Inyectada en un objeto, lo mejora."],
  [O("Broche de Flor de Arena Viviente"), "Se marchita poco a poco. Si se sigue llevando después de completar la anomalía, empieza a enfermar al personaje y desbloquea un <strong>punto de inflexión</strong>."],
  [O("Collar de la Umbra Eterna"), "Conecta al portador con la anomalía y desbloquea otro <strong>punto de inflexión</strong>."],
  [O("Juguete de Madera Tallado"), "Si se lleva a la anomalía, reacciona y se convierte en un acompañante (Rigoberto)."],
  [O("Moneda Desconocida"), "Proviene del mundo humano (Japón). Servirá de amuleto más adelante."],
  [O("Brújula Rota"), "Un experto podría darle una segunda opinión… (por definir)."],
  [O("Fragmento del Corazón del Jardinero"), "Gancho a futuro."]
])}`;

P["Música"] = `
<h1>Música</h1>
${table(["Ambiente", "Enlace"], [
  ["Noche", "https://www.youtube.com/watch?v=ZXCqD0Lxcbk"],
  ["Comercio", "https://www.youtube.com/watch?v=RLzGF1o6EY0"],
  ["Viaje", "https://www.youtube.com/watch?v=SvG1oG8u9L0"],
  ["Suspenso", "https://www.youtube.com/watch?v=iBVKRV8CWlI"],
  ["Dragón", "https://www.youtube.com/watch?v=eNS9ir1yvQ8"]
].map(([a, u]) => [a, `<a href="${u}">${u}</a>`]))}
<p>Consejo: en Foundry puedes crear una <em>Lista de reproducción</em> con estos enlaces (Foundry admite audio de YouTube en algunas versiones; si no, descarga el audio y súbelo).</p>`;

const page = (name, content, i) => ({ name, type: "text", sort: (i + 1) * 100000, title: { show: false, level: 1 }, text: { content: content.trim(), format: 1 } });

export default [{
  name: "Campaña: Anomalía",
  ownership: { default: 0 },
  pages: Object.entries(P).map(([n, c], i) => page(n, c, i))
}];
