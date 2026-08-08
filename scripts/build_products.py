#!/usr/bin/env python3
"""Build filtered product catalog from products1.xlsx using local product photos."""

from __future__ import annotations

import hashlib
import json
import re
import shutil
from collections import Counter, defaultdict
from difflib import SequenceMatcher
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / "products1.xlsx"
OUT_JSON = ROOT / "src" / "data" / "products.json"
CLIENT_IMAGES = ROOT / "images"
CATALOG_DIR = ROOT / "public" / "images" / "catalog"
FALLBACK_DIR = ROOT / "public" / "images" / "products"

KNOWN_BRANDS = [
    "HISENSE", "SAMSUNG", "LG", "PHILIPS", "SONY", "HAIER", "RAMTONS", "VON", "BRUHM",
    "SPJ", "GEEPAS", "ROCH", "ADH", "BLACKARK", "MAXPLUS", "SAYONA", "SAYONNA", "SONASHI",
    "SHONASHI", "MEWE", "RAF", "WINNING STAR", "WINNING", "GLOBAL STAR", "GLOBALSTAR",
    "GLOBAL", "MIKA", "ARMCO", "ONIDA", "KRYPTON", "DIGIWAVE", "BOSS", "SONIFER",
    "CN TRONIC", "CNTRONIC", "SIMBALAND", "MAGIC BULLET", "GEORGE HOME", "POWERKING",
    "SMARTPLUS", "SMART PLUS", "BESTER", "LEC", "SIGNATURE",
]

EXCLUDE_GROUPS = {"SPARES", "PHONE ACCESSORIES", "SMALL ITEMS /HIDEN CAMERAS"}

EXCLUDE_NAME = re.compile(
    r"CAMERA|MEMORY CARD|CHARGER|POWER\s*BANK|FLUX|BLUB|BULB|WIRE|FORK|PADLOCK|"
    r"SOLAR LIGHT|MAPP GAS|DRILL|TUBE LIGHT|LAMP\s*BELT|LEDON|SPEAKER STAND|"
    r"MASS[AO]GER|TRIMMER|HAIR\s*(CLIPPER|DRYER|CURL)|FLEXIBLE|ADAPTER|"
    r"SOCKET|BUTTON CAMERA|LAMP HOLDER|FLAT IRON CABLE|DISPENSER TAPES",
    re.I,
)

INCLUDE_NAME = re.compile(
    r"FRIDGE|REFRIGERATOR|FREEZER|FRERZER|WASHING|WASHER|TV\b|TELEVISION|"
    r"COOKER|MICROWAVE|OVEN|IRON|STEAMER|BLENDER|BLEADER|JUICER|DISPENSER|"
    r"DISPERSER|AIR\s*COND|AIRCON|WATER\s*DISP|AIR\s*FRYER|STAND\s*MIXER|"
    r"MEAT\s*GRINDER|PRESSURE\s*COOK|GAS\s*PLATE|POPCORN|KETTLE|FOOD\s*WARMER|"
    r"DISPLAY\s*FOOD|CHOPPER|HAND\s*BLENDER|MAGIC\s*BULLET|FAN\b|"
    r"ELECTRIC\s*FRYER|WET\s*GRINDER|MULTI-?FUNCTION",
    re.I,
)

INCLUDE_GROUPS = {
    "DEEP FREEZER NEW", "NEW FRIDGES", "washing machine", "TVS", "COOKER",
    "AIR CONDITIONER", "IRON BOXES", "NEW FRIDGES /MICROWAVES", "BLENDERS",
    "BLEADERS", "WATER DISPENSER", "washing machine/JUICE DISPERSERS",
    "POPCORN MACHINES", "DEEP FREEZER NEW/OLD DEEP FREEZER", "EX UK",
}

CATEGORY_FALLBACKS = {
    "Refrigerators": ["/images/products/refrigerators-1.jpg", "/images/products/refrigerators-2.jpg"],
    "Freezers": ["/images/products/freezers-1.jpg", "/images/products/freezers-2.jpg"],
    "Washing Machines": ["/images/products/washing-machines-1.jpg", "/images/products/washing-machines-2.jpg"],
    "Televisions": ["/images/products/televisions-1.jpg", "/images/products/televisions-2.jpg"],
    "Microwaves & Ovens": ["/images/products/microwaves-ovens-1.jpg", "/images/products/microwaves-ovens-2.jpg"],
    "Cookers": ["/images/ramtons3.webp", "/images/products/cookers-1.jpg"],
    "Irons": ["/images/phillipsironbox.jpeg"],
    "Blenders & Mixers": ["/images/smallappliances.png"],
    "Kitchen Appliances": ["/images/smallappliances.png"],
    "Water Dispensers": ["/images/products/water-dispensers-1.jpg"],
    "Air Conditioners": ["/images/products/air-conditioners-1.jpg"],
    "Juice Dispensers": ["/images/smallappliances.png"],
    "Fans": ["/images/products/fans-1.jpg"],
}


def normalize_category(group: str, name: str) -> str:
    g = (group or "").upper()
    n = (name or "").upper()
    if re.search(r"AIR\s*COND|AIRCON", n) or "AIR CONDITIONER" in g:
        return "Air Conditioners"
    if re.search(r"TV\b|TELEVISION|SMART\s*TV|DIGITAL\s*TV|QLED", n) or g == "TVS":
        return "Televisions"
    if re.search(r"WASHING|WASHER", n) or "WASHING MACHINE" in g:
        return "Washing Machines"
    if re.search(r"FREEZER|FRERZER|CHEST", n) or "DEEP FREEZER" in g:
        return "Freezers"
    if re.search(r"FRIDGE|REFRIGERATOR|SHOW\s*CASE", n) or (
        "NEW FRIDGES" in g and "MICRO" not in n and "OVEN" not in n
    ):
        if re.search(r"MICROWAVE|OVEN", n):
            return "Microwaves & Ovens"
        return "Refrigerators"
    if re.search(r"MICROWAVE|OVEN", n) or "MICROWAVE" in g:
        return "Microwaves & Ovens"
    if re.search(r"COOKER|GAS\s*PLATE|HOT\s*PLATE|INFRA?RED", n) or g == "COOKER":
        return "Cookers"
    if re.search(r"IRON|STEAMER|STREAMER|GERMENT", n) or "IRON" in g:
        return "Irons"
    if re.search(r"WATER\s*DISP", n) or "WATER DISPENSER" in g:
        return "Water Dispensers"
    if re.search(r"BLENDER|BLEADER|JUICER|CHOPPER|MAGIC\s*BULLET|GRINDER|MIXER", n) or "BLEND" in g or "BLEAD" in g:
        return "Blenders & Mixers"
    if re.search(r"DISPENSER|DISPERSER", n):
        return "Juice Dispensers"
    if re.search(
        r"AIR\s*FRYER|ELECTRIC\s*FRYER|PRESSURE\s*COOK|FOOD\s*STEAM|POPCORN|KETTLE|BURGER|FOOD\s*WARMER|MULTI-?FUNCTION\s*POT",
        n,
    ):
        return "Kitchen Appliances"
    if re.search(r"FAN\b", n):
        return "Fans"
    return "Other Appliances"


def extract_brand(name: str) -> str:
    n = (name or "").upper().strip()
    for brand in sorted(KNOWN_BRANDS, key=len, reverse=True):
        if n.startswith(brand) or f" {brand} " in f" {n} ":
            pretty = brand.title()
            overrides = {
                "Spj": "SPJ", "Lg": "LG", "Adh": "ADH", "Raf": "RAF",
                "Cn Tronic": "CN Tronic", "Cntronic": "CN Tronic",
                "Globalstar": "Global Star", "Sayonna": "Sayona",
                "Shonashi": "Sonashi", "Smartplus": "Smartplus",
                "Smart Plus": "Smartplus", "Lec": "LEC",
            }
            return overrides.get(pretty, pretty)
    if n.startswith("EX UK") or n.startswith("EXUK"):
        for brand in sorted(KNOWN_BRANDS, key=len, reverse=True):
            if brand in n:
                return extract_brand(brand)
        return "Ex UK"
    return "Generic"


def clean_name(name: str) -> str:
    n = re.sub(r"\s+", " ", (name or "").strip())
    n = n.replace("[", " ").replace("]", " ")
    return re.sub(r"\s+", " ", n).strip()


def should_include(d: dict) -> bool:
    group = (d.get("ProductGroup") or "UNGROUPED").strip()
    name = d.get("Name") or ""
    price = d.get("Price") or 0
    if price < 10000:
        return False
    if group in EXCLUDE_GROUPS:
        return False
    if EXCLUDE_NAME.search(name):
        return False
    if group in INCLUDE_GROUPS:
        return True
    if group == "SMALL ITEMS":
        return bool(
            re.search(
                r"PRESSURE\s*COOK|FOOD\s*STEAM|MULTI-?FUNCTION\s*POT|AIR\s*FRYER|"
                r"BLENDER|COOKER|MICROWAVE|KETTLE|WET\s*GRINDER|IRON|STEAMER|"
                r"DISPENSER|DISPERSER|OVEN|FRYER|MIXER|JUICER|CHOPPER|FAN\b|"
                r"HOT\s*PLATE|INFRA?RED|UGALI",
                name,
                re.I,
            )
        )
    if group == "UNGROUPED":
        return bool(INCLUDE_NAME.search(name))
    return False


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:80]


def norm_key(text: str) -> str:
    s = (text or "").upper()
    replacements = {
        "BLEADER": "BLENDER",
        "DISPERSER": "DISPENSER",
        "WASHUNG": "WASHING",
        "FRERZER": "FREEZER",
        "CONDITINER": "CONDITIONER",
        "CONDIOTIONER": "CONDITIONER",
        "PRESSURRE": "PRESSURE",
        "PRESURE": "PRESSURE",
        "STREAMER": "STEAMER",
        "STREAM IRON": "STEAM IRON",
        "INFRED": "INFRARED",
        "GEEPASS": "GEEPAS",
        "GEOGRGEHOME": "GEORGE HOME",
        "JUCIER": "JUICER",
        "FREYER": "FRYER",
        "MAX PLUS": "MAXPLUS",
        "SMART PLUS": "SMARTPLUS",
        "SMARTPLUS": "SMARTPLUS",
        "DIGITAL WAVE": "DIGIWAVE",
        "DIGIWAVE": "DIGIWAVE",
        "TWINE TURBO": "TWIN TURBO",
    }
    for a, b in replacements.items():
        s = s.replace(a, b)
    s = re.sub(r"[\[\]\(\);,:&/]", " ", s)
    s = re.sub(r"[^A-Z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def sync_client_images() -> list[dict]:
    """Copy client photos into public/images/catalog with safe filenames."""
    CATALOG_DIR.mkdir(parents=True, exist_ok=True)
    # clear previous catalog copies
    for old in CATALOG_DIR.glob("*"):
        if old.is_file():
            old.unlink()

    entries = []
    if not CLIENT_IMAGES.exists():
        print("No ./images folder found")
        return entries

    for src in sorted(CLIENT_IMAGES.iterdir()):
        if src.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue
        safe = f"{slug(src.stem)}{src.suffix.lower()}"
        dest = CATALOG_DIR / safe
        # avoid collisions
        i = 2
        while dest.exists():
            safe = f"{slug(src.stem)}-{i}{src.suffix.lower()}"
            dest = CATALOG_DIR / safe
            i += 1
        shutil.copy2(src, dest)
        entries.append(
            {
                "path": f"/images/catalog/{safe}",
                "key": norm_key(src.stem),
                "stem": src.stem,
                "file": src.name,
            }
        )
    print(f"Synced {len(entries)} client images -> public/images/catalog")
    return entries


def score_match(product_key: str, image_key: str) -> float:
    if not product_key or not image_key:
        return 0.0
    if product_key == image_key:
        return 1.0
    # strong partial matches when one is essentially a cleaned version of the other
    if product_key in image_key or image_key in product_key:
        shorter, longer = sorted([product_key, image_key], key=len)
        return 0.95 if len(shorter) / max(len(longer), 1) >= 0.55 else 0.82
    ratio = SequenceMatcher(None, product_key, image_key).ratio()
    return ratio


def find_image(product_name: str, images: list[dict], min_score: float = 0.82) -> str | None:
    key = norm_key(product_name)
    best = None
    best_score = 0.0
    for img in images:
        score = score_match(key, img["key"])
        if score > best_score:
            best_score = score
            best = img
    if best and best_score >= min_score:
        return best["path"]
    return None


def category_fallback(category: str, key: str) -> str:
    pool = CATEGORY_FALLBACKS.get(category) or ["/images/product_display.png"]
    # prefer existing files
    existing = []
    for p in pool:
        rel = ROOT / "public" / p.lstrip("/")
        if rel.exists():
            existing.append(p)
    if not existing:
        existing = ["/images/product_display.png"]
    idx = int(hashlib.md5(key.encode()).hexdigest(), 16) % len(existing)
    return existing[idx]


def build_products(images: list[dict]) -> list[dict]:
    wb = openpyxl.load_workbook(XLSX, data_only=True)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))
    headers = rows[0]
    raw = [dict(zip(headers, r)) for r in rows[1:] if r[0]]

    products = []
    matched = 0
    for i, d in enumerate(raw, start=1):
        if not should_include(d):
            continue
        name = clean_name(d["Name"])
        group = (d.get("ProductGroup") or "UNGROUPED").strip()
        category = normalize_category(group, name)
        if category in {"Other Appliances", "Audio"}:
            continue
        brand = extract_brand(name)
        sku = str(int(d["SKU"])) if d.get("SKU") else str(i)
        image = find_image(name, images) or find_image(d["Name"], images)
        if image:
            matched += 1
        else:
            image = category_fallback(category, f"{sku}-{name}")
        products.append(
            {
                "id": int(d.get("SKU") or i),
                "name": name,
                "brand": brand,
                "category": category,
                "price": int(d["Price"]),
                "oldPrice": None,
                "discount": 0,
                "isNew": False,
                "image": image,
                "sku": sku,
            }
        )

    seen = set()
    unique = []
    for p in products:
        key = (p["name"].upper(), p["price"])
        if key in seen:
            continue
        seen.add(key)
        unique.append(p)

    unique.sort(key=lambda p: (p["category"], p["brand"], p["price"]))
    print(f"Matched client photos: {matched}/{len(unique)}")
    return unique


def category_icons(products: list[dict]) -> dict[str, str]:
    """Pick a representative product image per category for the category section."""
    by_cat = defaultdict(list)
    for p in products:
        if "/catalog/" in p["image"]:
            by_cat[p["category"]].append(p["image"])
    icons = {}
    for cat, imgs in by_cat.items():
        icons[cat] = imgs[0]
    for cat, pool in CATEGORY_FALLBACKS.items():
        icons.setdefault(cat, pool[0])
    return icons


def main() -> None:
    print("Syncing client product images...")
    images = sync_client_images()
    print("\nBuilding product catalog...")
    products = build_products(images)
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(products, indent=2))

    icons = category_icons(products)
    icons_path = ROOT / "src" / "data" / "categoryIcons.json"
    icons_path.write_text(json.dumps(icons, indent=2))

    print(f"\nWrote {len(products)} products -> {OUT_JSON}")
    print(f"Wrote category icons -> {icons_path}")
    print("By category:")
    for c, n in Counter(p["category"] for p in products).most_common():
        print(f"  {n:3d}  {c}")


if __name__ == "__main__":
    main()
