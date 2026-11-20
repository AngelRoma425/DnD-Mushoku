// Puente (mundo aislado): pasa los mensajes del popup a page.js, que vive en
// el contexto de la página y puede leer window.Campaign.
(() => {
  const pending = new Map();
  let seq = 0;

  window.addEventListener("message", (ev) => {
    if (ev.source !== window || !ev.data || ev.data.source !== "r20x-res") return;
    const cb = pending.get(ev.data.id);
    if (!cb) return;
    pending.delete(ev.data.id);
    cb(ev.data);
  });

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (!msg || !msg.r20x) return;
    const id = ++seq;
    pending.set(id, (res) => sendResponse(res.error ? { error: res.error } : { result: res.result }));
    window.postMessage({ source: "r20x-req", id, action: msg.action, payload: msg.payload }, "*");
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        sendResponse({ error: "Roll20 no respondió a tiempo. Espera a que la partida termine de cargar y vuelve a intentarlo." });
      }
    }, 5 * 60 * 1000);
    return true; // respuesta asíncrona
  });
})();
