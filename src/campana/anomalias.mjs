// Bestiario de la campaña «Anomalía».
// Las estadísticas son una propuesta (el documento solo describe a las criaturas):
// ajústalas al número de jugadores y nivel del grupo.
import { dmg, act, uses, consumeUse, html, saveActivity, healActivity, utilityActivity, damageActivity } from "../../tools/helpers.mjs";
import { abil, weapon, trait, npc } from "../bestiario.mjs";

const noCost = { targets: [], scaling: { allowed: false, max: "" }, spellSlot: false };

function extend(actor, { folder, dr = [], dv = [], ci = [], legact = 0, legres = 0, saves = [] } = {}) {
  actor.folder = folder;
  actor.prototypeToken.disposition = -1;
  Object.assign(actor.system.traits, {
    dr: { value: dr, custom: "" }, dv: { value: dv, custom: "" }, ci: { value: ci, custom: "" }
  });
  for (const s of saves) actor.system.abilities[s].proficient = 1;
  if (legact || legres) actor.system.resources = { legact: { value: legact, max: legact }, legres: { value: legres, max: legres }, lair: { value: false, initiative: null } };
  return actor;
}

const ANOMALIA = (owner) => trait(owner, "Síndrome de Drenaje",
  "Esta criatura fue alterada por una anomalía y necesita devorar maná o esencia vital para no perecer. Cuando una criatura viva cae a 0 puntos de golpe a 30 pies de ella, recupera 1d6 puntos de golpe. Las criaturas afectadas parecen sufrir una agonía constante.");

const L = "Lobos y bestias";
const MUDA = "La Muda del Desierto";

export default [
  // ───────────── Laberinto del Metro ─────────────
  extend(npc("Lobo Siamés", {
    cr: 2, type: "monstrosity", ac: 13, hp: 52, hpFormula: "7d10+14", walk: 40, size: "lg",
    abilities: abil(17, 14, 15, 3, 13, 6), skills: { per: 2 }, darkvision: 60,
    biography: html("Un lobo mutado con dos cabezas fusionadas, hallado en el laberinto del metro. Se mueve en un estado de agonía constante. Atravesó a Cozbi Cohen con su último aliento. Sus colmillos sirvieron después para mejorar el Lanzador de Cadenas de Erwin."),
    items: [
      weapon("Lobo Siamés", "Mordisco", { number: 2, denomination: 6, types: ["piercing"], description: "Si impacta, el objetivo debe superar una salvación de Fuerza CD 13 o quedar derribado." }),
      trait("Lobo Siamés", "Ataque Múltiple", "El lobo hace dos ataques de Mordisco, uno con cada cabeza."),
      trait("Lobo Siamés", "Dos Cabezas", "El lobo tiene ventaja en las pruebas de Percepción y en las salvaciones contra quedar cegado, ensordecido, asustado o aturdido. No puede ser sorprendido."),
      trait("Lobo Siamés", "Último Aliento", "Cuando el lobo cae a 0 puntos de golpe, puede hacer un ataque de Mordisco como reacción antes de morir.", { activation: act("reaction", 1, "al caer a 0 puntos de golpe") }),
      ANOMALIA("Lobo Siamés")
    ]
  }), { folder: "Laberinto del Metro", saves: ["con"] }),

  // ───────────── Rikarisu y La Muda del Desierto ─────────────
  extend(npc("Monstruo Mudado", {
    cr: 0.125, type: "monstrosity", ac: 10, hp: 9, hpFormula: "2d8", walk: 30,
    abilities: abil(12, 10, 11, 2, 8, 3), darkvision: 30,
    biography: html("Bestias o monstruos menores que han mudado literalmente de piel, quedando como monstruosidades de carne y hueso que lo roen todo. Son débiles, pero son muchos: salen del laberinto de Rikarisu y asaltan las rutas comerciales."),
    items: [
      weapon("Monstruo Mudado", "Roer", { number: 1, denomination: 6, types: ["piercing"] }),
      trait("Monstruo Mudado", "Marea de Carne", "El monstruo tiene ventaja en las tiradas de ataque contra una criatura si al menos otros dos aliados están a 5 pies de ella."),
      ANOMALIA("Monstruo Mudado")
    ]
  }), { folder: MUDA }),
  extend(npc("Lagarto Florido", {
    cr: 1, type: "monstrosity", ac: 13, hp: 26, hpFormula: "4d8+8", walk: 30,
    abilities: abil(14, 14, 14, 3, 12, 5), skills: { ste: 2 }, darkvision: 60,
    biography: html("Lagartos del desierto cubiertos de flores que brotan de sus escamas. Emboscaron al grupo en Rikarisu. Desprenden el mismo aroma dulce que rodea al laberinto."),
    items: [
      weapon("Lagarto Florido", "Mordisco", { number: 1, denomination: 8, types: ["piercing"], extraParts: [dmg(1, 4, "poison")] }),
      trait("Lagarto Florido", "Nube de Polen (Recarga 5–6)", "El lagarto sacude sus flores. Cada criatura a 10 pies debe superar una salvación de Constitución CD 12 o recibir 2d6 de daño de veneno y quedar envenenada hasta el final de su siguiente turno; la mitad del daño si la supera.", {
        activation: act("action"), acts: [n => saveActivity(n, { ability: "con", dc: 12, onSave: "half", parts: [dmg(2, 6, "poison")] })]
      }),
      trait("Lagarto Florido", "Camuflaje Floral", "Tiene ventaja en las pruebas de Destreza (Sigilo) en terreno con flores o vegetación."),
      ANOMALIA("Lagarto Florido")
    ]
  }), { folder: MUDA, dr: ["poison"] }),
  extend(npc("Guerrero Mantis", {
    cr: 3, type: "monstrosity", ac: 15, hp: 58, hpFormula: "9d8+18", walk: 40,
    abilities: abil(14, 17, 14, 8, 13, 10), skills: { per: 1, acr: 1 },
    biography: html("Guardianes del Invernadero (Piso 2). Cada uno cuida una zona de cultivo y encarna una emoción: <strong>Rojo</strong> (Enojo), <strong>Azul</strong> (Tristeza), <strong>Verde</strong> (Celos) y <strong>Amarillo</strong> (Alegría). Si alguien ataca una zona, el guerrero de esa zona entra en combate.",
      "<ul><li><strong>Enojo:</strong> +2 al daño, −2 a la CA.</li><li><strong>Tristeza:</strong> sus golpes imponen desventaja en la siguiente tirada del objetivo.</li><li><strong>Celos:</strong> tiene ventaja contra la criatura que más daño le hizo.</li><li><strong>Alegría:</strong> recupera 5 puntos de golpe al inicio de su turno.</li></ul>"),
    items: [
      weapon("Guerrero Mantis", "Guadaña", { number: 1, denomination: 10, types: ["slashing"], properties: ["fin"], ability: "dex" }),
      trait("Guerrero Mantis", "Ataque Múltiple", "El guerrero hace dos ataques de Guadaña."),
      trait("Guerrero Mantis", "Parada", "El guerrero suma 3 a su CA contra un ataque cuerpo a cuerpo que lo impactaría. Debe ver al atacante.", { activation: act("reaction") }),
      ANOMALIA("Guerrero Mantis")
    ]
  }), { folder: MUDA }),
  extend(npc("Greenkeeper", {
    cr: 5, type: "humanoid", ac: 16, hp: 110, hpFormula: "13d8+52", walk: 30,
    abilities: abil(18, 13, 18, 10, 14, 12), skills: { ath: 2, per: 1 },
    biography: html("El guerrero que resguarda la puerta al Jardinero en el Piso 3 (La Cascada). Se puede dialogar con él o vencerlo; la pelea es de dificultad moderada. Custodia una estatua que oculta una zona secreta."),
    items: [
      weapon("Greenkeeper", "Hoja Desbrozadora", { type: "martialM", number: 2, denomination: 6, types: ["slashing"], properties: ["hvy", "two"] }),
      trait("Greenkeeper", "Ataque Múltiple", "El Greenkeeper hace tres ataques con su Hoja Desbrozadora, o dos y usa Raíces Guardianas."),
      trait("Greenkeeper", "Raíces Guardianas", "Raíces brotan bajo una criatura a 30 pies: debe superar una salvación de Fuerza CD 15 o quedar apresada (puede repetirla al final de cada turno).", {
        activation: act("action"), acts: [n => saveActivity(n, { ability: "str", dc: 15, onSave: "none", parts: [] })]
      }),
      trait("Greenkeeper", "No Pasarás", "Las criaturas que empiezan su turno a 5 pies del Greenkeeper tienen su velocidad reducida a la mitad. Tiene ventaja en las salvaciones contra ser movido."),
      ANOMALIA("Greenkeeper")
    ]
  }), { folder: MUDA, saves: ["str", "con"] }),
  extend(npc("El Jardinero", {
    cr: 8, type: "aberration", ac: 15, hp: 230, hpFormula: "20d10+120", walk: 30, size: "lg",
    abilities: abil(18, 12, 22, 16, 18, 16), skills: { nat: 2, ins: 1, per: 1 }, darkvision: 120, languages: ["common"],
    biography: html(
      "La anomalía de <strong>La Muda del Desierto</strong>, el «primer humano en ser adaptado». Antes era una mujer de un jardín botánico de Japón; tras el temblor que trasladó el recinto a este mundo, fue engullida por un capullo floral y transformada. Habla con cortesía, se refiere a los intrusos como «visitantes» y obedece a «la Estrella».",
      "<p><strong>Fase 1:</strong> combate en su jardín. <strong>Fase 2:</strong> el terreno se vuelve inestable; hay válvulas que regulan el nivel del agua y solo una funciona cada vez.</p>",
      "<p><strong>Habilidades copiadas:</strong> mientras el grupo dormía en la playa, cada PJ que falló la salvación de Sabiduría CD 18 le enseñó una habilidad. Puede usar <strong>una</strong> habilidad copiada por turno (ver sus rasgos).</p>"
    ),
    items: [
      weapon("El Jardinero", "Podar", { number: 2, denomination: 10, types: ["slashing"], reach: 10, description: "El Jardinero recupera puntos de golpe iguales a la mitad del daño infligido." }),
      trait("El Jardinero", "Ataque Múltiple", "El Jardinero hace dos ataques de Podar y usa Esporas o Lianas."),
      trait("El Jardinero", "Esporas", "Cada criatura en un cono de 30 pies debe hacer una salvación de Constitución CD 16: 4d8 de daño de veneno y envenenada 1 minuto si falla, o la mitad del daño si la supera.", {
        activation: act("action"), acts: [n => saveActivity(n, { ability: "con", dc: 16, onSave: "half", parts: [dmg(4, 8, "poison")] })]
      }),
      trait("El Jardinero", "Lianas", "Hasta dos criaturas a 30 pies deben superar una salvación de Destreza CD 16 o quedar apresadas y recibir 2d6 de daño necrótico al inicio de cada uno de sus turnos (drena su energía).", {
        activation: act("action"), acts: [n => saveActivity(n, { ability: "dex", dc: 16, onSave: "none", parts: [dmg(2, 6, "necrotic")] })]
      }),
      trait("El Jardinero", "Resistencia Legendaria (2/día)", "Si falla una tirada de salvación, puede elegir superarla.", { usesData: uses(2, "day") }),
      trait("El Jardinero", "Acción Legendaria: Brote", "El Jardinero mueve una de sus raíces: una criatura a 30 pies hace una salvación de Fuerza CD 16 o es derribada.", { activation: act("legendary", 1) }),
      trait("El Jardinero", "Acción Legendaria: Podar (cuesta 2)", "El Jardinero hace un ataque de Podar.", { activation: act("legendary", 2) }),
      // Habilidades copiadas de los PJ (sesión 10)
      trait("El Jardinero", "Copiada · Constructo Floral (Lymon)", "Acción. Invoca un Constructo Floral (CA 14, 20 PG) que causa 1d8 de daño. Solo puede haber uno.", { activation: act("action"), acts: [n => damageActivity(n, [dmg(1, 8, "bludgeoning")], { name: "Golpe del constructo" })] }),
      trait("El Jardinero", "Copiada · Floración Explosiva (Wynna)", "Acción, 1 vez por combate. Todas las armas florales explotan, curando 3d8 puntos de golpe a todo en un radio de 10 pies.", { activation: act("action"), usesData: uses(1, "lr"), acts: [n => healActivity(n, dmg(3, 8, "healing"), { consumption: consumeUse })] }),
      trait("El Jardinero", "Copiada · Explosión (Edmund)", "Acción. Explosión de 5 pies de radio que causa 4d6 de daño de fuego (salvación de Destreza CD 16 para la mitad).", { activation: act("action"), acts: [n => saveActivity(n, { ability: "dex", dc: 16, onSave: "half", parts: [dmg(4, 6, "fire")] })] }),
      trait("El Jardinero", "Copiada · Portal Floral (Nyx)", "Acción. Abre un portal floral y se teletransporta hasta 15 pies.", { activation: act("action") }),
      trait("El Jardinero", "Copiada · Golpe Radiante (Clow)", "Acción adicional. Mejora un ataque básico, que causa 2d8 de daño radiante adicional.", { activation: act("bonus"), acts: [n => damageActivity(n, [dmg(2, 8, "radiant")])] }),
      trait("El Jardinero", "Copiada · Tormenta de Pétalos (Koda)", "Acción adicional. Causa 5 de daño necrótico a todo lo que haya a 10 pies.", { activation: act("bonus"), acts: [n => damageActivity(n, [dmg(null, null, "necrotic", { custom: "5" })])] }),
      trait("El Jardinero", "Copiada · Sacrificio de Sangre (Basil)", "Acción adicional. Pierde 1d6 puntos de golpe, pero sus ataques infligen ese mismo valor de daño extra durante 1 turno.", { activation: act("bonus"), acts: [n => utilityActivity(n, { formula: "1d6", rollName: "Vida perdida / daño extra" })] }),
      trait("El Jardinero", "Copiada · Círculo de Pétalos (Kaida)", "Reacción. Crea un círculo de pétalos que aumenta su CA en 2.", { activation: act("reaction") }),
      trait("El Jardinero", "Copiada · Translucidez (Amaris)", "Reacción. Se vuelve translúcido y esquiva un ataque inminente.", { activation: act("reaction") }),
      trait("El Jardinero", "Copiada · Resistir (Erwin)", "Reacción. Reduce el daño recibido en 1d10 + 5.", { activation: act("reaction"), acts: [n => utilityActivity(n, { formula: "1d10 + 5", rollName: "Daño reducido", consumption: noCost })] }),
      ANOMALIA("El Jardinero")
    ]
  }), { folder: MUDA, dr: ["poison", "necrotic"], ci: ["poisoned", "charmed"], legact: 3, legres: 2, saves: ["con", "wis"] })
];
