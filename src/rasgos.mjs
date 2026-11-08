// Dotes, estilos de espada, ojos demoníacos y rasgos raciales.
import { SOURCE, dmg, act, activities, attackActivity, saveActivity, healActivity, utilityActivity, uses, consumeUse, html } from "../tools/helpers.mjs";

function feat(name, { img, kind = "feat", subtype = "", requirements = "", description, activation, usesData, acts = [] }) {
  return {
    name, type: "feat", img,
    system: {
      description: { value: description, chat: "" },
      source: SOURCE,
      type: { value: kind, subtype },
      requirements,
      activation: activation ?? { type: "", value: null, condition: "" },
      uses: usesData ?? { spent: 0, max: "", recovery: [] },
      activities: activities(...acts.map(f => f(name)))
    }
  };
}

export const RASGOS_RACIALES = {
  migurd: ["Telepatía Migurd", "Juventud Eterna", "Visión en la Oscuridad"],
  superd: ["Tercer Ojo", "Maestría con la Lanza Superd", "Estigma de los Superd"],
  bestia: ["Sentidos Salvajes", "Garras y Colmillos", "Agilidad Felina"],
  elfo: ["Afinidad con el Viento", "Longevidad Élfica", "Visión en la Oscuridad"],
  enano: ["Resistencia Enana", "Artesano de la Piedra", "Visión en la Oscuridad"]
};

export default [
  // ───────────────────────────── MAGIA ─────────────────────────────
  feat("Lanzamiento sin Encantamiento", {
    img: "icons/svg/silenced.svg", requirements: "Capacidad de lanzar al menos un conjuro",
    description: html(
      "Has aprendido a dar forma al maná solo con la mente, algo que casi nadie en el mundo consigue. Obtienes estos beneficios:",
      "<ul><li>Puedes lanzar conjuros sin su componente <strong>verbal</strong>. Las criaturas no notan que estás lanzando un conjuro a menos que superen una prueba de Sabiduría (Percepción) contra tu CD de conjuros.</li><li>Una vez por turno, al lanzar un truco de daño puedes <strong>modificar su forma</strong>: aumentar su alcance en 30 pies, o cambiar su tipo de daño entre contundente, perforante y cortante.</li><li>Aumenta tu Inteligencia o Sabiduría en 1 (máximo 20).</li></ul>",
      "<p><em>En Mushoku, esta habilidad se suele desarrollar en la infancia, antes de que los canales de maná se asienten.</em></p>"
    )
  }),
  feat("Reserva de Maná Desbordante", {
    img: "icons/svg/upgrade.svg", requirements: "Capacidad de lanzar conjuros",
    activation: act("bonus"), usesData: uses(1, "lr"),
    description: html(
      "Entrenaste tu capacidad de maná hasta el límite desde muy joven. Tu reserva es muchísimo mayor que la de un mago normal.",
      "<ul><li>Una vez por descanso largo, como acción adicional, recuperas un espacio de conjuro gastado de nivel igual o inferior a la mitad de tu bonificador por competencia (redondeando hacia arriba).</li><li>Si usas la variante de <strong>Puntos de Maná</strong> de la guía, tu máximo de puntos aumenta en tu nivel de personaje.</li><li>Ya no sufres agotamiento por usar magia de manera continua (a discreción del DM).</li></ul>"
    ),
    acts: [n => utilityActivity(n, { consumption: consumeUse })]
  }),
  feat("Control Fino del Maná", {
    img: "icons/svg/aura.svg", requirements: "Lanzamiento sin Encantamiento o nivel 4",
    description: html(
      "Puedes ajustar la velocidad, dureza y rotación de los proyectiles que conjuras.",
      "<ul><li>Cuando haces un ataque de conjuro a distancia, puedes sumar la mitad de tu bonificador por competencia (redondeando hacia abajo) a la tirada de daño.</li><li>Ignoras la cobertura media con ataques de conjuro a distancia.</li><li>Cuando un conjuro tuyo obliga a una salvación, puedes elegir a un número de criaturas igual a tu modificador de característica para lanzar conjuros: superan la salvación automáticamente y no reciben daño.</li></ul>"
    )
  }),

  // ──────────────────────── ESTILOS DE ESPADA ────────────────────────
  feat("Estilo del Dios de la Espada", {
    img: "icons/svg/sword.svg", requirements: "Competencia con armas marciales",
    usesData: uses("@prof", "lr"),
    description: html(
      "<p>El estilo más practicado del mundo: <strong>atacar primero y terminar el combate con un único golpe</strong>. Su técnica secreta es el <em>Corte Veloz como la Luz</em>.</p>",
      "<ul><li>Sumas tu bonificador por competencia a las tiradas de iniciativa.</li><li><strong>Corte Veloz como la Luz.</strong> Durante el primer turno de cada combate, tu primer ataque con un arma cuerpo a cuerpo tiene ventaja e inflige <strong>2d8 de daño adicional</strong> si impacta. Además, un número de veces igual a tu bonificador por competencia por descanso largo puedes aplicar ese daño adicional a un ataque con arma fuera del primer turno.</li></ul>",
      "<p><strong>Rangos sugeridos:</strong> Principiante (nv 1–4), Intermedio (nv 5–8), Avanzado (nv 9–12), Santo (nv 13–16), Rey/Emperador (nv 17–20).</p>"
    ),
    acts: [n => utilityActivity(n, { name: "Corte Veloz como la Luz", formula: "2d8", rollName: "Daño adicional", consumption: consumeUse })]
  }),
  feat("Estilo del Dios del Agua", {
    img: "icons/svg/shield.svg", requirements: "Competencia con armas marciales",
    activation: act("reaction", 1, "cuando una criatura que puedas ver te ataque cuerpo a cuerpo"),
    usesData: uses("@prof", "sr"),
    description: html(
      "<p>El estilo de la <strong>defensa absoluta y el contraataque</strong>. No toma la iniciativa: espera, desvía y devuelve la fuerza del enemigo contra él.</p>",
      "<ul><li>Mientras empuñes un arma cuerpo a cuerpo y no te muevas más de la mitad de tu velocidad en tu turno, obtienes +1 a la CA.</li><li><strong>Flujo Desviado.</strong> Como reacción cuando una criatura te ataca cuerpo a cuerpo, sumas tu bonificador por competencia a tu CA contra ese ataque. Si falla, puedes hacer de inmediato un ataque cuerpo a cuerpo contra ella. Usos: tu bonificador por competencia por descanso corto.</li></ul>",
      "<p>Los espadachines de este estilo son especialmente buscados como guardaespaldas en el Reino de Asura.</p>"
    ),
    acts: [n => utilityActivity(n, { name: "Flujo Desviado", consumption: consumeUse })]
  }),
  feat("Estilo del Dios del Norte", {
    img: "icons/svg/daze.svg", requirements: "Destreza o Fuerza 13",
    activation: act("bonus"),
    description: html(
      "<p>Un estilo <strong>práctico, impredecible y sin escrúpulos</strong>. Cualquier arma, cualquier truco, cualquier terreno: lo que importa es sobrevivir y ganar.</p>",
      "<ul><li>Eres competente con las armas improvisadas y puedes usar Destreza en lugar de Fuerza con ellas.</li><li><strong>Truco Sucio.</strong> Como acción adicional, elige una criatura a 5 pies: debe superar una salvación de Sabiduría (CD 8 + tu bonificador por competencia + tu modificador de Destreza o Fuerza) o tu siguiente ataque contra ella antes del final de tu turno tiene ventaja.</li><li>Tienes ventaja en las pruebas para evitar ser derribado o apresado.</li></ul>"
    ),
    acts: [n => saveActivity(n, { ability: "wis", onSave: "none", parts: [], name: "Truco Sucio", dc: "8 + @prof + max(@abilities.dex.mod, @abilities.str.mod)", activation: act("bonus") })]
  }),
  feat("Toki (Aura de Combate)", {
    img: "icons/svg/aura.svg", requirements: "Nivel 3, sin capacidad para lanzar conjuros de nivel 1 o superior (a criterio del DM)",
    activation: act("bonus"), usesData: uses("@prof", "lr"),
    description: html(
      "<p>Los guerreros de este mundo que no pueden lanzar magia de forma externa recubren su cuerpo de maná sin darse cuenta. Ese aura, el <strong>Toki</strong>, les permite resistir golpes que matarían a cualquiera y moverse a velocidades inhumanas.</p>",
      "<p>Como acción adicional, activas tu Toki durante 1 minuto:</p>",
      "<ul><li>Obtienes puntos de golpe temporales iguales a tu bonificador por competencia + tu modificador de Constitución.</li><li>Tu velocidad aumenta 10 pies.</li><li>Tienes ventaja en las pruebas de Fuerza (Atletismo) y en las salvaciones de Fuerza.</li></ul>",
      "<p>Usos: tu bonificador por competencia por descanso largo.</p>"
    ),
    acts: [n => healActivity(n, dmg(null, null, "temphp", { custom: "@prof + @abilities.con.mod" }), { consumption: consumeUse, name: "Activar Toki" })]
  }),

  // ──────────────────────── OJOS DEMONÍACOS ────────────────────────
  feat("Ojo Demoníaco de la Previsión", {
    img: "icons/svg/eye.svg", requirements: "Otorgado por la Emperatriz Demoníaca o por la historia de la campaña",
    activation: act("reaction", 1, "cuando seas objetivo de un ataque"),
    usesData: uses("@prof", "lr"),
    description: html(
      "<p>Uno de tus ojos ha sido sustituido por un ojo demoníaco que te muestra, como una imagen superpuesta, lo que ocurrirá en el instante siguiente.</p>",
      "<ul><li>No puedes ser sorprendido mientras estés consciente.</li><li>Tienes ventaja en las salvaciones de Destreza contra efectos que puedas ver.</li><li>Como reacción cuando eres objetivo de un ataque, impones desventaja a esa tirada. Usos: tu bonificador por competencia por descanso largo.</li></ul>",
      "<p><em>Inconveniente:</em> si abres el ojo sin práctica, la avalancha de imágenes te causa náuseas. Hasta que lo controles (a criterio del DM), sufres desventaja en las pruebas de Constitución para mantener la concentración.</p>"
    ),
    acts: [n => utilityActivity(n, { name: "Ver el futuro", consumption: consumeUse })]
  }),
  feat("Ojo Demoníaco de la Lejanía", {
    img: "icons/svg/eye.svg", requirements: "Otorgado por la historia de la campaña",
    activation: act("action"), usesData: uses(1, "sr"),
    description: html(
      "<p>Este ojo demoníaco te permite ver lo que está muy lejos, como si fuera un catalejo perfecto.</p>",
      "<ul><li>Ves con claridad hasta 1 milla como si estuvieras a 100 pies, y tienes ventaja en Sabiduría (Percepción) basada en la vista.</li><li>Una vez por descanso corto, puedes lanzar <em>clarividencia</em> sin componentes, solo hacia un lugar dentro de tu línea de visión natural.</li></ul>"
    ),
    acts: [n => utilityActivity(n, { consumption: consumeUse })]
  }),

  // ──────────────────────── RASGOS RACIALES ────────────────────────
  feat("Visión en la Oscuridad", {
    img: "icons/svg/eye.svg", kind: "race",
    description: html("Ves en luz tenue a 60 pies como si fuera luz brillante, y en la oscuridad como si fuera luz tenue. No distingues colores en la oscuridad, solo tonos de gris.")
  }),
  feat("Telepatía Migurd", {
    img: "icons/svg/aura.svg", kind: "race",
    description: html(
      "Los Migurd se comunican entre ellos mediante ondas mentales. Puedes hablar telepáticamente con cualquier criatura de tu misma raza a 120 pies.",
      "Con otras criaturas que conozcas bien y que acepten el vínculo puedes compartir emociones simples (no palabras) a 30 pies."
    )
  }),
  feat("Juventud Eterna", {
    img: "icons/svg/sun.svg", kind: "race",
    description: html(
      "Tu apariencia deja de envejecer al llegar a la adolescencia y la mantienes durante siglos. Tienes ventaja en las pruebas de Carisma (Engaño) para hacerte pasar por alguien más joven, y las criaturas suelen subestimarte.",
      "Además tienes ventaja en las salvaciones contra efectos que te harían envejecer mágicamente."
    )
  }),
  feat("Tercer Ojo", {
    img: "icons/svg/eye.svg", kind: "race",
    description: html(
      "La gema de tu frente es un órgano sensorial. Tienes <strong>vista ciega</strong> a 30 pies: percibes la presencia, posición y movimiento de criaturas vivas y objetos aunque estén invisibles, a oscuras o detrás de ti.",
      "No puedes ser sorprendido por criaturas dentro de ese alcance. Si la gema está cubierta, pierdes este rasgo."
    )
  }),
  feat("Maestría con la Lanza Superd", {
    img: "icons/svg/sword.svg", kind: "race",
    description: html(
      "Tu pueblo nace con una lanza en la mano: eres competente con lanzas, picas y tridentes.",
      "Cuando atacas con una lanza, su daño aumenta un dado (d6 → d8; d8 → d10) y su propiedad <em>Alcance</em> se aplica aunque no la tenga normalmente, si la empuñas a dos manos."
    )
  }),
  feat("Estigma de los Superd", {
    img: "icons/svg/terror.svg", kind: "race",
    description: html(
      "Una leyenda negra pesa sobre tu pueblo desde hace siglos. La mayoría de humanoides que te reconocen como Superd reaccionan con miedo u hostilidad: tienes desventaja en las pruebas de Carisma (Persuasión) con ellos, pero ventaja en Carisma (Intimidación).",
      "<p><em>Para el DM:</em> el pelo verde y la gema delatan a un Superd. Muchos se tiñen o rapan para pasar desapercibidos. Este rasgo es una excelente fuente de drama.</p>"
    )
  }),
  feat("Sentidos Salvajes", {
    img: "icons/svg/eye.svg", kind: "race",
    description: html("Eres competente en Sabiduría (Percepción) y tienes ventaja en las pruebas de Percepción basadas en el olfato o el oído. Puedes rastrear a una criatura que hayas olido en las últimas 24 horas.")
  }),
  feat("Garras y Colmillos", {
    img: "icons/svg/blood.svg", kind: "race",
    activation: act("action"),
    description: html("Tus ataques sin armas pueden ser con garras o mordisco. Al impactar, infligen 1d6 + tu modificador de Fuerza de daño cortante (garras) o perforante (mordisco) en lugar del daño normal."),
    acts: [n => attackActivity(n, { kind: "melee", classification: "unarmed", ability: "str", parts: [dmg(1, 6, "slashing", { bonus: "@mod" })] })]
  }),
  feat("Agilidad Felina", {
    img: "icons/svg/wing.svg", kind: "race",
    activation: act("special"), usesData: uses(1, "sr"),
    description: html("Cuando te mueves en tu turno, puedes duplicar tu velocidad hasta el final del turno. Tras hacerlo, no puedes volver a usarlo hasta terminar un descanso corto o largo. Además, no sufres daño por caídas de 20 pies o menos."),
    acts: [n => utilityActivity(n, { consumption: consumeUse })]
  }),
  feat("Afinidad con el Viento", {
    img: "icons/svg/wing.svg", kind: "race",
    description: html("Conoces el truco <em>Cuchilla de Viento</em> (o cualquier otro truco de viento). Cuando lanzas un conjuro que inflija daño cortante o mueva criaturas mediante el viento, puedes sumar tu modificador de Sabiduría al daño de una de sus tiradas (mínimo +1). Eres competente en arcos largos y cortos.")
  }),
  feat("Longevidad Élfica", {
    img: "icons/svg/sun.svg", kind: "race",
    description: html("Vives varios siglos. Tienes ventaja en las salvaciones contra quedar <em>Hechizado</em>, y la magia no puede dormirte. Eres competente en Inteligencia (Historia): has visto mucho mundo, o tus mayores te lo contaron.")
  }),
  feat("Resistencia Enana", {
    img: "icons/svg/shield.svg", kind: "race",
    description: html("Tienes resistencia al daño de veneno y ventaja en las salvaciones contra quedar <em>Envenenado</em>. Tu máximo de puntos de golpe aumenta en 1, y en 1 más cada vez que subes de nivel. El alcohol humano apenas te afecta.")
  }),
  feat("Artesano de la Piedra", {
    img: "icons/svg/statue.svg", kind: "race",
    description: html("Eres competente con herramientas de herrero o de albañil (a tu elección). Cuando haces una prueba de Inteligencia (Historia) sobre trabajos en piedra o metal, añades el doble de tu bonificador por competencia. Conoces el truco <em>Bala de Piedra</em>; la Constitución es tu característica para lanzarlo.")
  })
];
