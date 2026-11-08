// Razas (especies) jugables del mundo de Mushoku Tensei.
import { SOURCE, id, uuid, html } from "../tools/helpers.mjs";
import { RASGOS_RACIALES } from "./rasgos.mjs";

function race(name, key, { img = "icons/svg/mystery-man.svg", walk = 30, darkvision = 0, size = "med", description }) {
  const adv = (type, configuration, extra = {}) => ({ _id: id(name, "adv", type), type, configuration, value: {}, level: 0, title: extra.title ?? "", hint: "" });
  return {
    name, type: "race", img,
    system: {
      description: { value: description, chat: "" },
      source: SOURCE,
      identifier: key,
      type: { value: "humanoid", subtype: "", custom: "" },
      movement: { walk, burrow: null, climb: null, fly: null, swim: null, units: "ft", hover: false },
      senses: { darkvision, blindsight: null, tremorsense: null, truesight: null, units: "ft", special: "" },
      advancement: [
        adv("Size", { sizes: [size] }),
        adv("AbilityScoreImprovement", { points: 3, fixed: {}, cap: 2, locked: [] }, { title: "Aumento de características (reglas 2014)" }),
        adv("ItemGrant", {
          items: RASGOS_RACIALES[key].map(n => ({ uuid: uuid("mt-rasgos", "Item", n), optional: false })),
          optional: false, spell: null
        }, { title: "Rasgos de raza" })
      ]
    }
  };
}

export default [
  race("Migurd", "migurd", {
    darkvision: 60,
    description: html(
      "<p>Una raza demoníaca pacífica del Continente Demoníaco, de pelo azul y aspecto eternamente juvenil. Viven en aldeas pequeñas y aisladas, desconfían de los forasteros y se comunican entre ellos sin palabras.</p>",
      "<ul><li><strong>Tamaño:</strong> Mediano (aunque suelen ser bajitos). <strong>Velocidad:</strong> 30 pies.</li><li><strong>Rasgos:</strong> Telepatía Migurd, Juventud Eterna, Visión en la Oscuridad.</li><li><strong>Idiomas:</strong> Común (Dios Humano), Dios Demonio.</li></ul>",
      "<p><em>Ideas de trasfondo:</em> una maga que huyó de su aldea porque no podía usar la telepatía y quería ver el mundo.</p>"
    )
  }),
  race("Superd", "superd", {
    darkvision: 60,
    description: html(
      "<p>Una tribu guerrera de pelo verde esmeralda y una gema roja en la frente. Fueron temidos durante siglos por una tragedia del pasado; hoy quedan muy pocos, y la mayoría del mundo los considera monstruos.</p>",
      "<ul><li><strong>Tamaño:</strong> Mediano. <strong>Velocidad:</strong> 30 pies.</li><li><strong>Rasgos:</strong> Tercer Ojo, Maestría con la Lanza Superd, Estigma de los Superd.</li><li><strong>Idiomas:</strong> Común, Dios Demonio.</li></ul>",
      "<p><em>Ideas de trasfondo:</em> un guerrero centenario que busca limpiar el nombre de su pueblo protegiendo a los niños.</p>"
    )
  }),
  race("Bestia (Tribu Dedoldia)", "bestia", {
    walk: 35,
    description: html(
      "<p>Los hombres bestia del Gran Bosque, con orejas y cola de gato, perro u otros animales. La tribu Dedoldia es una de las más numerosas. Son orgullosos, con fuertes tradiciones de guerreros y una nariz increíble.</p>",
      "<ul><li><strong>Tamaño:</strong> Mediano. <strong>Velocidad:</strong> 35 pies.</li><li><strong>Rasgos:</strong> Sentidos Salvajes, Garras y Colmillos, Agilidad Felina.</li><li><strong>Idiomas:</strong> Común, Dios Bestia.</li></ul>"
    )
  }),
  race("Elfo (Orejas Largas)", "elfo", {
    darkvision: 60,
    description: html(
      "<p>Habitantes longevos de los bosques, hábiles arqueros y con una afinidad natural por la magia de viento. Las mezclas con humanos son relativamente comunes y suelen heredar parte de su longevidad.</p>",
      "<ul><li><strong>Tamaño:</strong> Mediano. <strong>Velocidad:</strong> 30 pies.</li><li><strong>Rasgos:</strong> Afinidad con el Viento, Longevidad Élfica, Visión en la Oscuridad.</li><li><strong>Idiomas:</strong> Común, Dios Bestia o Élfico.</li></ul>"
    )
  }),
  race("Enano", "enano", {
    walk: 25, darkvision: 60,
    description: html(
      "<p>Bajos, fuertes y orgullosos de su oficio. Los enanos son herreros y mineros sin igual, y muchos de los mejores magos de tierra son de su linaje.</p>",
      "<ul><li><strong>Tamaño:</strong> Mediano. <strong>Velocidad:</strong> 25 pies (no se reduce por armadura pesada).</li><li><strong>Rasgos:</strong> Resistencia Enana, Artesano de la Piedra, Visión en la Oscuridad.</li><li><strong>Idiomas:</strong> Común, Enano.</li></ul>"
    )
  })
];
