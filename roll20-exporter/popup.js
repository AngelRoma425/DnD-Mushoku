const $ = (id) => document.getElementById(id);
const status = (text, cls = "") => { $("status").className = cls; $("status").textContent = text; };

let tabId = null;
let characters = [];
const selected = new Set();

async function send(action, payload) {
  const res = await chrome.tabs.sendMessage(tabId, { r20x: true, action, payload });
  if (!res) throw new Error("Sin respuesta de la página.");
  if (res.error) throw new Error(res.error);
  return res.result;
}

function visible() {
  const q = $("filter").value.trim().toLowerCase();
  const showArchived = $("archived").checked;
  return characters.filter((c) => (showArchived || !c.archived) && c.name.toLowerCase().includes(q));
}

function render() {
  const list = $("list");
  list.textContent = "";
  const items = visible();
  if (!items.length) {
    list.innerHTML = '<div class="muted" style="padding:8px">No hay personajes que mostrar.</div>';
  }
  for (const c of items) {
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = selected.has(c.id);
    cb.addEventListener("change", () => { cb.checked ? selected.add(c.id) : selected.delete(c.id); update(); });
    const img = document.createElement("img");
    if (c.avatar) img.src = c.avatar;
    img.alt = "";
    const name = document.createElement("span");
    name.textContent = c.name;
    label.append(cb, img, name);
    if (c.archived) {
      const a = document.createElement("span");
      a.className = "arch";
      a.textContent = "archivado";
      label.append(a);
    }
    list.append(label);
  }
  update();
}

function update() {
  const n = selected.size;
  $("go").disabled = n === 0;
  $("go").textContent = n ? `Exportar ${n} personaje${n === 1 ? "" : "s"}` : "Exportar";
}

$("filter").addEventListener("input", render);
$("archived").addEventListener("change", render);
$("all").addEventListener("click", () => {
  const items = visible();
  const allOn = items.every((c) => selected.has(c.id));
  for (const c of items) allOn ? selected.delete(c.id) : selected.add(c.id);
  render();
});

$("go").addEventListener("click", async () => {
  $("go").disabled = true;
  status("Exportando… (los personajes con muchos atributos pueden tardar unos segundos)", "muted");
  try {
    const ids = characters.filter((c) => selected.has(c.id)).map((c) => c.id);
    const { report } = await send("export", {
      ids,
      bundle: $("bundle").checked,
      blobs: $("blobs").checked,
      parsed: $("parsed").checked,
    });
    const ok = report.filter((r) => !r.error);
    const bad = report.filter((r) => r.error);
    const empty = ok.filter((r) => r.attribs === 0);
    let msg = `✔ ${ok.length} exportado${ok.length === 1 ? "" : "s"}.`;
    if (empty.length) msg += `\n⚠ Sin atributos: ${empty.map((r) => r.name).join(", ")}. Abre su ficha una vez en Roll20 y vuelve a exportar.`;
    if (bad.length) msg += `\n✖ Fallaron: ${bad.map((r) => `${r.name || r.id} (${r.error})`).join(", ")}`;
    status(msg, bad.length ? "err" : "ok");
  } catch (e) {
    status(`Error: ${e.message}`, "err");
  } finally {
    update();
  }
});

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !/^https:\/\/app\.roll20\.net\/editor/.test(tab.url || "")) {
    $("campaign").textContent = "Abre una partida en app.roll20.net/editor para usar la extensión.";
    return;
  }
  tabId = tab.id;
  try {
    const data = await send("list");
    characters = data.characters;
    $("campaign").textContent = `${data.campaign} · ${characters.length} personajes`;
    $("main").hidden = false;
    render();
  } catch (e) {
    const msg = /Receiving end does not exist|Could not establish connection/i.test(e.message)
      ? "La extensión aún no está activa en esta pestaña. Recarga la página de Roll20 y vuelve a abrirla."
      : e.message;
    $("campaign").textContent = "No se pudo leer la partida.";
    status(msg, "err");
  }
})();
