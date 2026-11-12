"""Extrae del SRD 5.1 (CC-BY-4.0) del sistema dnd5e el equipo básico que venden los mercaderes.

Uso: python3 -I tools/extraer-srd.py <ruta a dnd5e/packs/_source> > src/campana/srd-equipo.json
"""
import sys, glob, json, yaml

SRC = sys.argv[1]
NOMBRES = {
    # Armas sencillas
    "Club": "Garrote", "Dagger": "Daga", "Greatclub": "Gran garrote", "Handaxe": "Hacha de mano",
    "Javelin": "Jabalina", "Light Hammer": "Martillo ligero", "Mace": "Maza", "Quarterstaff": "Bastón",
    "Sickle": "Hoz", "Spear": "Lanza", "Light Crossbow": "Ballesta ligera", "Dart": "Dardo",
    "Shortbow": "Arco corto", "Sling": "Honda",
    # Armas marciales
    "Battleaxe": "Hacha de batalla", "Flail": "Mangual", "Glaive": "Guja", "Greataxe": "Gran hacha",
    "Greatsword": "Espadón", "Halberd": "Alabarda", "Lance": "Lanza de caballería", "Longsword": "Espada larga",
    "Maul": "Mazo", "Morningstar": "Lucero del alba", "Pike": "Pica", "Rapier": "Estoque", "Scimitar": "Cimitarra",
    "Shortsword": "Espada corta", "Trident": "Tridente", "War Pick": "Pico de guerra", "Warhammer": "Martillo de guerra",
    "Whip": "Látigo", "Blowgun": "Cerbatana", "Hand Crossbow": "Ballesta de mano", "Heavy Crossbow": "Ballesta pesada",
    "Longbow": "Arco largo", "Net": "Red",
    # Armaduras y escudo
    "Padded Armor": "Armadura acolchada", "Leather Armor": "Armadura de cuero",
    "Studded Leather Armor": "Armadura de cuero tachonado", "Hide Armor": "Armadura de pieles",
    "Chain Shirt": "Camisa de mallas", "Scale Mail": "Cota de escamas", "Shield": "Escudo",
    # Munición
    "Arrow": "Flecha", "Crossbow Bolt": "Virote",
}
out = {}
for f in glob.glob(f"{SRC}/items/**/*.yml", recursive=True):
    if "_folder" in f:
        continue
    d = yaml.safe_load(open(f))
    if d["name"] not in NOMBRES or d["name"] in out:
        continue
    for k in ["_key", "_stats", "folder", "ownership", "sort"]:
        d.pop(k, None)
    d["flags"] = {}
    d["system"].setdefault("source", {})["custom"] = "SRD 5.1 (CC-BY-4.0)"
    out[d["name"]] = {"es": NOMBRES[d["name"]], "srdId": d["_id"], "doc": d}
missing = set(NOMBRES) - set(out)
if missing:
    sys.exit(f"Faltan en el SRD: {sorted(missing)}")
json.dump(out, sys.stdout, ensure_ascii=False, indent=1)
