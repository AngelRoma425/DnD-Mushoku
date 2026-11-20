// Se ejecuta en el contexto de la página del editor de Roll20 (mundo MAIN),
// donde existe el objeto global `Campaign` con los personajes.
(() => {
  if (window.__r20xLoaded) return;
  window.__r20xLoaded = true;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function campaign() {
    const c = window.Campaign;
    if (!c || !c.characters) {
      throw new Error("No encuentro los personajes de la partida. Abre la partida en el editor de Roll20 y espera a que cargue del todo.");
    }
    return c;
  }

  function campaignName() {
    try {
      return (window.Campaign.get && window.Campaign.get("name")) || document.title.replace(/\s*\|\s*Roll20.*$/i, "").trim();
    } catch {
      return document.title;
    }
  }

  // Lee un "blob" (bio, gmnotes, defaulttoken). Roll20 los guarda aparte y
  // solo los descarga cuando se piden.
  function getBlob(char, key) {
    return new Promise((resolve) => {
      if (typeof char._getLatestBlob !== "function") return resolve(char.get(key) || "");
      let done = false;
      const finish = (v) => { if (!done) { done = true; resolve(typeof v === "string" ? v : v ?? ""); } };
      try {
        char._getLatestBlob(key, finish);
      } catch {
        finish(char.get(key) || "");
      }
      setTimeout(() => finish(char.get(key) || ""), 10000);
    });
  }

  // Espera a que una colección de Backbone (attribs, abilities) deje de crecer.
  async function loadCollection(coll, { timeout = 15000, quiet = 700 } = {}) {
    if (!coll) return;
    if (coll.length === 0 && typeof coll.fetch === "function") {
      try { coll.fetch(coll); } catch { /* algunas versiones no lo necesitan */ }
    }
    const start = Date.now();
    let last = -1;
    let stableSince = Date.now();
    while (Date.now() - start < timeout) {
      if (coll.length !== last) {
        last = coll.length;
        stableSince = Date.now();
      } else if (Date.now() - stableSince >= quiet && (last > 0 || Date.now() - start > 3000)) {
        return;
      }
      await sleep(100);
    }
  }

  const plain = (model) => (model && typeof model.toJSON === "function" ? model.toJSON() : { ...(model?.attributes || model) });

  // Agrupa los atributos repeating_<sección>_<idFila>_<campo> por sección y fila.
  function groupRepeating(attribs) {
    const out = {};
    const re = /^repeating_([^_]+)_(-[A-Za-z0-9_-]{19})_(.+)$/;
    for (const a of attribs) {
      const m = re.exec(a.name || "");
      if (!m) continue;
      const [, section, rowId, field] = m;
      const rows = (out[section] ||= {});
      const row = (rows[rowId] ||= { _rowId: rowId });
      row[field] = a.current;
      if (a.max !== undefined && a.max !== "") row[`${field}_max`] = a.max;
    }
    const result = {};
    for (const [section, rows] of Object.entries(out)) result[section] = Object.values(rows);
    return result;
  }

  function simpleAttributes(attribs) {
    const out = {};
    for (const a of attribs) {
      if (!a.name || a.name.startsWith("repeating_")) continue;
      out[a.name] = a.max !== undefined && a.max !== "" ? { current: a.current, max: a.max } : a.current;
    }
    return out;
  }

  async function exportCharacter(char, opts) {
    await Promise.all([loadCollection(char.attribs), loadCollection(char.abilities, { timeout: 5000 })]);

    const attribs = (char.attribs?.models || []).map((m) => {
      const j = plain(m);
      return { name: j.name, current: j.current ?? "", max: j.max ?? "", id: j.id };
    });
    const abilities = (char.abilities?.models || []).map((m) => {
      const j = plain(m);
      return {
        name: j.name,
        description: j.description ?? "",
        istokenaction: !!j.istokenaction,
        action: j.action ?? "",
        order: j.order ?? -1,
        id: j.id,
      };
    });

    const [bio, gmnotes, defaulttoken] = await Promise.all([
      opts.blobs ? getBlob(char, "bio") : "",
      opts.blobs ? getBlob(char, "gmnotes") : "",
      getBlob(char, "defaulttoken"),
    ]);

    const a = char.attributes || {};
    const character = {
      oldId: a.id ?? char.id,
      name: a.name ?? "",
      avatar: a.avatar ?? "",
      bio,
      gmnotes,
      defaulttoken,
      tags: a.tags ?? "",
      controlledby: a.controlledby ?? "",
      inplayerjournals: a.inplayerjournals ?? "",
      archived: !!a.archived,
      attribs,
      abilities,
    };

    const out = { schema_version: 2, type: "character", character };
    if (opts.parsed) {
      out.parsed = {
        sheet: a.charactersheetname || window.Campaign?.get?.("charactersheetname") || "",
        attributes: simpleAttributes(attribs),
        repeating: groupRepeating(attribs),
      };
    }
    return out;
  }

  // Nombre de archivo seguro. Se quitan tildes y caracteres no ASCII porque
  // algunos navegadores ignoran el nombre sugerido si los lleva.
  function safeName(s, fallback = "personaje") {
    const clean = (s || "")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^\x20-\x7e]+/g, "_")
      .replace(/[\\/:*?"<>|]+/g, "_")
      .replace(/\s+/g, " ").trim().slice(0, 100);
    return /[A-Za-z0-9]/.test(clean) ? clean : fallback;
  }

  function download(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  const actions = {
    ping() {
      return { ok: !!(window.Campaign && window.Campaign.characters), campaign: campaignName() };
    },

    list() {
      const c = campaign();
      return {
        campaign: campaignName(),
        characters: c.characters.models
          .map((ch) => ({ id: ch.id, name: ch.get("name") || "(sin nombre)", archived: !!ch.get("archived"), avatar: ch.get("avatar") || "" }))
          .sort((x, y) => x.name.localeCompare(y.name, "es")),
      };
    },

    async export({ ids, bundle = false, blobs = true, parsed = true }) {
      const c = campaign();
      const opts = { blobs, parsed };
      const exported = [];
      const report = [];
      for (const id of ids) {
        const ch = c.characters.get(id);
        if (!ch) { report.push({ id, error: "no encontrado" }); continue; }
        try {
          const data = await exportCharacter(ch, opts);
          exported.push(data);
          report.push({ id, name: data.character.name, attribs: data.character.attribs.length, abilities: data.character.abilities.length });
          if (!bundle) {
            download(`${safeName(data.character.name, `personaje ${id}`)}.json`, data);
            await sleep(350); // evita que el navegador bloquee descargas seguidas
          }
        } catch (e) {
          report.push({ id, name: ch.get("name"), error: String(e?.message || e) });
        }
      }
      if (bundle && exported.length) {
        const date = new Date().toISOString().slice(0, 10);
        download(`${safeName(campaignName(), "roll20")} - personajes ${date}.json`, {
          schema_version: 2,
          type: "campaign-characters",
          campaign: campaignName(),
          exportedAt: new Date().toISOString(),
          characters: exported,
        });
      }
      return { report };
    },
  };

  window.addEventListener("message", async (ev) => {
    if (ev.source !== window || !ev.data || ev.data.source !== "r20x-req") return;
    const { id, action, payload } = ev.data;
    try {
      if (!actions[action]) throw new Error(`Acción desconocida: ${action}`);
      const result = await actions[action](payload || {});
      window.postMessage({ source: "r20x-res", id, result }, "*");
    } catch (e) {
      window.postMessage({ source: "r20x-res", id, error: String(e?.message || e) }, "*");
    }
  });
})();
