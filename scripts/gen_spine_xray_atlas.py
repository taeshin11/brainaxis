"""
gen_spine_xray_atlas.py

Converts labeled spine X-ray images from ImageLabelAPI_SPINAI
into BodyAtlas format under public/data/spine-xray/.

Source data:
  - Lateral: SBJ_LLXR/0 label 후/2508/20250807_00273183_T-L-spine_Lat_1.*
  - AP:      SBJ_LLXR/0 label 후/2508/20250806_00154057_L-spine_AP_1.*

Output structure:
  public/data/spine-xray/
    lateral/0000.png
    ap/0000.png
    labels/lateral/0000.json
    labels/ap/0000.json
    info.json
    structures.json
"""

import json, os, shutil
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────────────
SRC_BASE = Path("D:/ImageLabelAPI_SPINAI/SBJ_LLXR/0 label 후/2508")
OUT_BASE = Path(__file__).parent.parent / "public/data/spine-xray"

LAT_JSON = SRC_BASE / "20250807_00273183_T-L-spine_Lat_1.json"
LAT_IMG  = SRC_BASE / "20250807_00273183_T-L-spine_Lat_1.png"
AP_JSON  = SRC_BASE / "20250806_00154057_L-spine_AP_1.json"
AP_IMG   = SRC_BASE / "20250806_00154057_L-spine_AP_1.png"

# ── Vertebra metadata ────────────────────────────────────────────────────────
VERTEBRA_DEFS = [
    # (name, display_en, display_ko, category, color)
    ("C1",  "C1 (Atlas)",      "C1 (환추)",     "bone", "#F59E0B"),
    ("C2",  "C2 (Axis)",       "C2 (축추)",     "bone", "#F59E0B"),
    ("C3",  "C3",              "C3 경추",       "bone", "#F59E0B"),
    ("C4",  "C4",              "C4 경추",       "bone", "#F59E0B"),
    ("C5",  "C5",              "C5 경추",       "bone", "#F59E0B"),
    ("C6",  "C6",              "C6 경추",       "bone", "#F59E0B"),
    ("C7",  "C7",              "C7 경추",       "bone", "#F59E0B"),
    ("T1",  "T1",              "T1 흉추",       "bone", "#10B981"),
    ("T2",  "T2",              "T2 흉추",       "bone", "#10B981"),
    ("T3",  "T3",              "T3 흉추",       "bone", "#10B981"),
    ("T4",  "T4",              "T4 흉추",       "bone", "#10B981"),
    ("T5",  "T5",              "T5 흉추",       "bone", "#10B981"),
    ("T6",  "T6",              "T6 흉추",       "bone", "#10B981"),
    ("T7",  "T7",              "T7 흉추",       "bone", "#10B981"),
    ("T8",  "T8",              "T8 흉추",       "bone", "#10B981"),
    ("T9",  "T9",              "T9 흉추",       "bone", "#10B981"),
    ("T10", "T10",             "T10 흉추",      "bone", "#10B981"),
    ("T11", "T11",             "T11 흉추",      "bone", "#10B981"),
    ("T12", "T12",             "T12 흉추",      "bone", "#10B981"),
    ("L1",  "L1",              "L1 요추",       "bone", "#3B82F6"),
    ("L2",  "L2",              "L2 요추",       "bone", "#3B82F6"),
    ("L3",  "L3",              "L3 요추",       "bone", "#3B82F6"),
    ("L4",  "L4",              "L4 요추",       "bone", "#3B82F6"),
    ("L5",  "L5",              "L5 요추",       "bone", "#3B82F6"),
    ("S1",  "S1 (Sacrum)",     "S1 (천추)",     "bone", "#8B5CF6"),
    ("sacrum_lat", "Sacrum",   "천골",          "bone", "#8B5CF6"),
]

NAME_TO_DEF = {d[0]: d for d in VERTEBRA_DEFS}

def labelme_to_contours(labelme_json_path):
    """Convert labelme polygon JSON → {label: [contour_points]}"""
    with open(labelme_json_path, encoding="utf-8") as f:
        data = json.load(f)
    result = {}
    for shape in data["shapes"]:
        label = shape["label"]
        pts = [[round(x, 1), round(y, 1)] for x, y in shape["points"]]
        if label not in result:
            result[label] = []
        result[label].append(pts)
    return result, data.get("imageWidth"), data.get("imageHeight")

def build_atlas_labels(labelme_json_path, structures_list):
    """Build BodyAtlas label JSON for one view (list of {id, name, contours})"""
    contours_map, w, h = labelme_to_contours(labelme_json_path)
    label_entries = []
    for struct in structures_list:
        name = struct["name"]
        if name in contours_map:
            label_entries.append({
                "id": struct["id"],
                "name": name,
                "contours": contours_map[name],
            })
    return label_entries, w, h

def build_structures_json(names_lat, names_ap):
    """Build structures.json from all vertebra names seen in either view."""
    all_names = sorted(set(names_lat) | set(names_ap))
    structures = []
    for idx, name in enumerate(all_names):
        defn = NAME_TO_DEF.get(name, (name, name, name, "bone", "#94A3B8"))
        structures.append({
            "id": idx,
            "name": name,
            "displayName": {
                "en": defn[1],
                "ko": defn[2],
                "ja": defn[1],
                "zh": defn[1],
                "es": defn[1],
                "de": defn[1],
                "fr": defn[1],
            },
            "category": defn[3],
            "color": defn[4],
            # For X-ray: bestSlice is always 0, sliceRange is [0,0]
            "bestSlice": {"lateral": 0, "ap": 0},
            "sliceRange": {"lateral": [0, 0], "ap": [0, 0]},
        })
    return structures

def main():
    # Create output dirs
    for plane in ("lateral", "ap"):
        (OUT_BASE / plane).mkdir(parents=True, exist_ok=True)
        (OUT_BASE / "labels" / plane).mkdir(parents=True, exist_ok=True)

    # Parse labels from both views
    contours_lat, w_lat, h_lat = labelme_to_contours(LAT_JSON)
    contours_ap,  w_ap,  h_ap  = labelme_to_contours(AP_JSON)

    names_lat = list(contours_lat.keys())
    names_ap  = list(contours_ap.keys())
    print(f"Lateral labels ({len(names_lat)}): {sorted(names_lat)}")
    print(f"AP labels ({len(names_ap)}): {sorted(names_ap)}")

    # Build structures list
    structures = build_structures_json(names_lat, names_ap)
    struct_by_name = {s["name"]: s for s in structures}

    # Build label JSONs
    lat_labels = []
    for name, contour_list in contours_lat.items():
        if name in struct_by_name:
            lat_labels.append({"id": struct_by_name[name]["id"], "name": name, "contours": contour_list})

    ap_labels = []
    for name, contour_list in contours_ap.items():
        if name in struct_by_name:
            ap_labels.append({"id": struct_by_name[name]["id"], "name": name, "contours": contour_list})

    # Write label JSONs
    with open(OUT_BASE / "labels/lateral/0000.json", "w") as f:
        json.dump(lat_labels, f)
    with open(OUT_BASE / "labels/ap/0000.json", "w") as f:
        json.dump(ap_labels, f)
    print("Wrote label JSONs")

    # Copy images
    shutil.copy2(LAT_IMG, OUT_BASE / "lateral/0000.png")
    shutil.copy2(AP_IMG, OUT_BASE / "ap/0000.png")
    print(f"Copied images: lateral {w_lat}x{h_lat}, ap {w_ap}x{h_ap}")

    # Write info.json
    info = {
        "modality": "X-Ray",
        "planes": {
            "lateral": {"slices": 1, "width": w_lat, "height": h_lat},
            "ap":      {"slices": 1, "width": w_ap,  "height": h_ap},
        },
    }
    with open(OUT_BASE / "info.json", "w") as f:
        json.dump(info, f, indent=2)

    # Write structures.json
    structures_out = {"totalStructures": len(structures), "structures": structures}
    with open(OUT_BASE / "structures.json", "w") as f:
        json.dump(structures_out, f, indent=2)

    print(f"Done. {len(structures)} structures, output: {OUT_BASE}")

if __name__ == "__main__":
    main()
