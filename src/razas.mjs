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

const idiomas = t => `<li><strong>Idiomas:</strong> ${t}</li>`;

export default [
  race("Migurd (Tribu de Cabello Azul)", "migurd", {
    darkvision: 60,
    description: html(
      "<p>Una raza mágica pacífica del Continente Demoníaco, de pelo azul y aspecto eternamente juvenil. Viven en aldeas pequeñas y aisladas y se comunican entre ellos sin palabras. Saben mucho sobre el maná: perciben el de los demás y notan cuando algo «resuena» de forma extraña.</p>",
      "<ul><li><strong>Tamaño:</strong> Mediano (aunque suelen ser bajitos). <strong>Velocidad:</strong> 30 pies.</li><li><strong>Rasgos:</strong> Telepatía Migurd, Juventud Eterna, Visión en la Oscuridad.</li>" + idiomas("Común y Dracónico (idioma del Dios Demonio).") + "</ul>"
    )
  }),
  race("Superd (Tribu de Cabello Verde)", "superd", {
    darkvision: 60,
    description: html(
      "<p>Una tribu guerrera de pelo verde esmeralda y una gema roja en la frente. Arrastran una maldición ligada a Laplace que hace que los demás los teman; quedan muy pocos y la mayoría del mundo los considera monstruos.</p>",
      "<ul><li><strong>Tamaño:</strong> Mediano. <strong>Velocidad:</strong> 30 pies.</li><li><strong>Rasgos:</strong> Tercer Ojo, Maestría con la Lanza Superd, Estigma de los Superd.</li>" + idiomas("Común y Dracónico (idioma del Dios Demonio).") + "</ul>"
    )
  }),
  race("Dedorudia (Hombre-gato)", "dedorudia", {
    walk: 35,
    description: html(
      "<p>Raza feral del Gran Bosque, con orejas y cola de gato. Una de las tribus más numerosas y orgullosas, de fuerte tradición guerrera.</p>",
      "<ul><li><strong>Tamaño:</strong> Mediano. <strong>Velocidad:</strong> 35 pies.</li><li><strong>Rasgos:</strong> Sentidos Salvajes, Garras y Colmillos, Agilidad Felina.</li>" + idiomas("Común y Silvano (idioma del Dios Feral).") + "</ul>"
    )
  }),
  race("Adorudia (Hombre-perro)", "adorudia", {
    description: html(
      "<p>Raza feral del Gran Bosque, con orejas y cola de perro. Muy leales a su familia y a su tribu, y rastreadores sin igual.</p>",
      "<ul><li><strong>Tamaño:</strong> Mediano. <strong>Velocidad:</strong> 30 pies.</li><li><strong>Rasgos:</strong> Sentidos Salvajes, Olfato del Rastreador, Lealtad de la Manada.</li>" + idiomas("Común y Silvano (idioma del Dios Feral).") + "</ul>"
    )
  }),
  race("Mirudetto (Hombre-conejo)", "mirudetto", {
    walk: 35,
    description: html(
      "<p>Raza feral de largas orejas de conejo. Rápidos, asustadizos y con un oído extraordinario; son excelentes exploradores y mensajeros.</p>",
      "<ul><li><strong>Tamaño:</strong> Mediano. <strong>Velocidad:</strong> 35 pies.</li><li><strong>Rasgos:</strong> Oídos de Conejo, Salto del Conejo, Pies Ligeros.</li>" + idiomas("Común y Silvano (idioma del Dios Feral).") + "</ul>"
    )
  }),
  race("Orejas Puntiagudas (Elfo)", "elfo", {
    darkvision: 60,
    description: html(
      "<p>Habitantes longevos de los bosques, hábiles arqueros y con una afinidad natural por la magia de viento. Las mezclas con humanos son relativamente comunes y suelen heredar parte de su longevidad.</p>",
      "<ul><li><strong>Tamaño:</strong> Mediano. <strong>Velocidad:</strong> 30 pies.</li><li><strong>Rasgos:</strong> Afinidad con el Viento, Longevidad Élfica, Visión en la Oscuridad.</li>" + idiomas("Común y Élfico.") + "</ul>"
    )
  }),
  race("Mineros de Carbón (Enano)", "enano", {
    walk: 25, darkvision: 60,
    description: html(
      "<p>Bajos, fuertes y orgullosos de su oficio. Mineros y herreros sin igual; muchos de los mejores magos de tierra son de su linaje.</p>",
      "<ul><li><strong>Tamaño:</strong> Mediano. <strong>Velocidad:</strong> 25 pies (no se reduce por armadura pesada).</li><li><strong>Rasgos:</strong> Resistencia Enana, Artesano de la Piedra, Visión en la Oscuridad.</li>" + idiomas("Común y Enano.") + "</ul>"
    )
  }),
  race("Cuerpo de Niño (Hobbit)", "hobbit", {
    walk: 25, size: "sm",
    description: html(
      "<p>Un pueblo de baja estatura cuyos adultos parecen niños toda su vida. Ágiles, afortunados y sorprendentemente difíciles de atrapar.</p>",
      "<ul><li><strong>Tamaño:</strong> Pequeño. <strong>Velocidad:</strong> 25 pies.</li><li><strong>Rasgos:</strong> Suerte del Pequeño, Paso Ágil, Apariencia Inocente.</li>" + idiomas("Común y Mediano.") + "</ul>"
    )
  })
];
