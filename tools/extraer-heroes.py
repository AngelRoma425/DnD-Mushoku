"""Extrae del SRD 5.1 (CC-BY-4.0) del sistema dnd5e los héroes iniciales y algunos objetos que usa el tutorial de Foundry.

Uso: python3 -I tools/extraer-heroes.py <ruta a dnd5e/packs/_source> > src/tutorial/srd-heroes.json
(probado con dnd5e release-4.4.4). Las descripciones se vacían: el texto en español está en src/tutorial.mjs.
"""
import sys, json, yaml

SRC = sys.argv[1]
EXTRA = ["items/potion/potion-of-healing", "items/trinket/torch"]
HEROES = ["randal-human-fighter", "riswynn-dwarf-rogue", "zanna-gnome-wizard", "akra-dragonborn-cleric"]

def clean(d, top=False):
    for k in ["_key", "folder", "sort"] + ([] if top else ["_stats"]):
        d.pop(k, None)
    d["flags"] = {}
    desc = d.get("system", {}).get("description")
    if isinstance(desc, dict):
        desc["value"] = ""
        desc["chat"] = ""
    return d

out = []
for h in HEROES:
    d = clean(yaml.safe_load(open(f"{SRC}/heroes/{h}.yml")), top=True)
    s = d["system"]["details"]
    for k in ["biography"]:
        s[k] = {"value": "", "public": ""}
    for k in ["appearance", "trait", "ideal", "bond", "flaw"]:
        s[k] = ""
    d["items"] = [clean(i) for i in d["items"]]
    for i in d["items"]:
        for a in (i["system"].get("activities") or {}).values():
            a.get("description", {})["chatFlavor"] = ""
    d["effects"] = [clean(e) for e in d.get("effects", [])]
    out.append(d)
extra = [clean(yaml.safe_load(open(f"{SRC}/{e}.yml")), top=True) for e in EXTRA]
json.dump({"heroes": out, "items": extra}, sys.stdout, ensure_ascii=False, indent=1)
