import os
import sys
import subprocess
from PIL import Image

OUT_DIR = "c:/projects/SGK18_Portfolio/public/sprites/skills"
os.makedirs(OUT_DIR, exist_ok=True)

# Helper to create a 20x20 RGBA image
def make_sprite(pixels_dict):
    img = Image.new("RGBA", (20, 20), (0, 0, 0, 0))
    for (x, y), color in pixels_dict.items():
        if 0 <= x < 20 and 0 <= y < 20:
            img.putpixel((x, y), color)
    return img

def hex_to_rgba(hex_code, alpha=255):
    hex_code = hex_code.lstrip("#")
    r = int(hex_code[0:2], 16)
    g = int(hex_code[2:4], 16)
    b = int(hex_code[4:6], 16)
    return (r, g, b, alpha)

# ── 1. TypeScript ───────────────────────────────────────────
def draw_typescript():
    d = {}
    c_blue = hex_to_rgba("#3178C6")
    c_dark = hex_to_rgba("#1A4B82")
    c_hi = hex_to_rgba("#5C9CE6")
    c_white = (255, 255, 255, 255)

    # Base chip 16x16 at (2,2) to (17,17)
    for y in range(2, 18):
        for x in range(2, 18):
            if x in (2, 17) or y in (2, 17):
                d[(x, y)] = c_dark
            elif x == 3 or y == 3:
                d[(x, y)] = c_hi
            else:
                d[(x, y)] = c_blue

    # Letter 'T': crossbar at y=6,7, x=5..9; stem at y=8..13, x=7
    for x in range(5, 10):
        d[(x, 6)] = c_white
        d[(x, 7)] = c_white
    for y in range(8, 14):
        d[(x := 7, y)] = c_white

    # Letter 'S': x=11..15, y=6..13
    for x in range(11, 16):
        d[(x, 6)] = c_white
        d[(x, 9)] = c_white
        d[(x, 10)] = c_white
        d[(x, 13)] = c_white
    d[(11, 7)] = c_white
    d[(11, 8)] = c_white
    d[(15, 11)] = c_white
    d[(15, 12)] = c_white

    return make_sprite(d)

# ── 2. JavaScript ───────────────────────────────────────────
def draw_javascript():
    d = {}
    c_yellow = hex_to_rgba("#F7DF1E")
    c_dark = hex_to_rgba("#C9B310")
    c_hi = hex_to_rgba("#FFF176")
    c_black = hex_to_rgba("#1F1F1F")

    for y in range(2, 18):
        for x in range(2, 18):
            if x in (2, 17) or y in (2, 17):
                d[(x, y)] = c_dark
            elif x == 3 or y == 3:
                d[(x, y)] = c_hi
            else:
                d[(x, y)] = c_yellow

    # Letter 'J': stem at x=7, y=8..12; hook at (5,12), (6,13), (7,13)
    d[(7, 8)] = c_black
    d[(7, 9)] = c_black
    d[(7, 10)] = c_black
    d[(7, 11)] = c_black
    d[(7, 12)] = c_black
    d[(6, 13)] = c_black
    d[(5, 12)] = c_black

    # Letter 'S': x=10..14, y=7..13
    for x in range(10, 15):
        d[(x, 7)] = c_black
        d[(x, 10)] = c_black
        d[(x, 13)] = c_black
    d[(10, 8)] = c_black
    d[(10, 9)] = c_black
    d[(14, 11)] = c_black
    d[(14, 12)] = c_black

    return make_sprite(d)

# ── 3. Python ───────────────────────────────────────────────
def draw_python():
    d = {}
    c_blue = hex_to_rgba("#3776AB")
    c_blue_hi = hex_to_rgba("#4B8BBE")
    c_yellow = hex_to_rgba("#FFD438")
    c_yellow_hi = hex_to_rgba("#FFE873")
    c_white = (255, 255, 255, 255)
    c_dark = hex_to_rgba("#1A3A54")

    # Top snake (Blue)
    for y in range(2, 8):
        for x in range(4, 12):
            d[(x, y)] = c_blue
    for y in range(5, 12):
        for x in range(4, 8):
            d[(x, y)] = c_blue
    # Blue eye
    d[(6, 4)] = c_white
    d[(7, 4)] = c_dark

    # Bottom snake (Yellow)
    for y in range(12, 18):
        for x in range(8, 16):
            d[(x, y)] = c_yellow
    for y in range(8, 15):
        for x in range(12, 16):
            d[(x, y)] = c_yellow
    # Yellow eye
    d[(13, 15)] = c_white
    d[(12, 15)] = c_dark

    # Highlights
    d[(5, 3)] = c_blue_hi
    d[(6, 3)] = c_blue_hi
    d[(14, 16)] = c_yellow_hi

    return make_sprite(d)

# ── 4. Java ─────────────────────────────────────────────────
def draw_java():
    d = {}
    c_mug = hex_to_rgba("#E5E7EB")
    c_mug_hi = (255, 255, 255, 255)
    c_rim = hex_to_rgba("#374151")
    c_coffee = hex_to_rgba("#5B2E10")
    c_red_steam = hex_to_rgba("#E3000F")
    c_orange_steam = hex_to_rgba("#F97316")

    # Steam vapor curves (y=2..7)
    d[(7, 5)] = c_orange_steam
    d[(8, 4)] = c_red_steam
    d[(7, 3)] = c_red_steam
    d[(8, 2)] = c_orange_steam

    d[(11, 6)] = c_orange_steam
    d[(12, 5)] = c_red_steam
    d[(11, 4)] = c_red_steam
    d[(12, 3)] = c_orange_steam

    # Mug body (x: 4..14, y: 8..16)
    for y in range(9, 16):
        for x in range(4, 15):
            d[(x, y)] = c_mug
    # Cup rim
    for x in range(4, 15):
        d[(x, 8)] = c_rim
        d[(x, 9)] = c_coffee

    # Mug handle (x: 14..17, y: 10..14)
    for y in range(10, 15):
        d[(16, y)] = c_mug
    d[(15, 10)] = c_mug
    d[(15, 14)] = c_mug

    # Saucer base
    for x in range(3, 16):
        d[(x, 17)] = c_rim

    return make_sprite(d)

# ── 5. Dart ─────────────────────────────────────────────────
def draw_dart():
    d = {}
    c_cyan = hex_to_rgba("#00D2B8")
    c_blue = hex_to_rgba("#0175C2")
    c_dark_blue = hex_to_rgba("#02569B")
    c_teal = hex_to_rgba("#00A98F")

    # Origami dart kite shape
    # Top-right pointing geometric facets
    for i in range(12):
        # Center fold
        d[(6 + i, 16 - i)] = c_blue
        d[(7 + i, 16 - i)] = c_cyan
        d[(5 + i, 16 - i)] = c_dark_blue

    # Wing tips
    for y in range(5, 10):
        for x in range(12, 17):
            if x + y >= 18:
                d[(x, y)] = c_cyan

    for y in range(10, 16):
        for x in range(4, 9):
            if x + y <= 21:
                d[(x, y)] = c_teal

    return make_sprite(d)

# ── 6. SQL ──────────────────────────────────────────────────
def draw_sql():
    d = {}
    c_plate = hex_to_rgba("#94A3B8")
    c_dark = hex_to_rgba("#334155")
    c_blue = hex_to_rgba("#38BDF8")
    c_hi = hex_to_rgba("#E2E8F0")

    # 3 Database cylinder discs
    for disc_y in [3, 8, 13]:
        # Disc oval
        for x in range(5, 15):
            d[(x, disc_y)] = c_dark
            d[(x, disc_y + 1)] = c_hi if x in (6, 7) else c_plate
            d[(x, disc_y + 2)] = c_dark
        # Data LED dot
        d[(13, disc_y + 1)] = c_blue

    return make_sprite(d)

# ── 7. PL/SQL ───────────────────────────────────────────────
def draw_plsql():
    d = {}
    c_plate = hex_to_rgba("#00758F")
    c_dark = hex_to_rgba("#003B47")
    c_hi = hex_to_rgba("#22D3EE")
    c_bolt = hex_to_rgba("#F59E0B")
    c_bolt_hi = hex_to_rgba("#FDE047")

    # Cylinder stack
    for disc_y in [4, 9, 14]:
        for x in range(4, 16):
            d[(x, disc_y)] = c_dark
            d[(x, disc_y + 1)] = c_plate
            d[(x, disc_y + 2)] = c_dark

    # Lightning bolt striking through
    bolt_coords = [(11, 2), (10, 3), (9, 4), (8, 5), (9, 6), (10, 6), (11, 6),
                   (9, 7), (8, 8), (7, 9), (8, 10), (9, 10), (7, 11), (6, 12)]
    for x, y in bolt_coords:
        d[(x, y)] = c_bolt
        d[(x + 1, y)] = c_bolt_hi

    return make_sprite(d)

# ── 8. C++ ──────────────────────────────────────────────────
def draw_cpp():
    d = {}
    c_blue = hex_to_rgba("#00599C")
    c_dark = hex_to_rgba("#00355E")
    c_hi = hex_to_rgba("#659AD2")
    c_white = (255, 255, 255, 255)
    c_cyan = hex_to_rgba("#00D8FF")

    # Blue shield / hexagon base
    for y in range(2, 18):
        for x in range(2, 18):
            d[(x, y)] = c_blue
    for x in range(2, 18):
        d[(x, 2)] = c_dark
        d[(x, 17)] = c_dark
    for y in range(2, 18):
        d[(2, y)] = c_dark
        d[(17, y)] = c_dark

    # 'C'
    for y in range(6, 14):
        d[(5, y)] = c_white
    for x in range(6, 9):
        d[(x, 6)] = c_white
        d[(x, 13)] = c_white

    # First '+'
    d[(11, 9)] = c_cyan
    d[(11, 10)] = c_cyan
    d[(11, 11)] = c_cyan
    d[(10, 10)] = c_cyan
    d[(12, 10)] = c_cyan

    # Second '+'
    d[(15, 9)] = c_cyan
    d[(15, 10)] = c_cyan
    d[(15, 11)] = c_cyan
    d[(14, 10)] = c_cyan
    d[(16, 10)] = c_cyan

    return make_sprite(d)

# ── 9. React ────────────────────────────────────────────────
def draw_react():
    d = {}
    c_cyan = hex_to_rgba("#00D8FF")
    c_dark = hex_to_rgba("#007B99")
    c_white = (255, 255, 255, 255)

    # Central nucleus
    for y in range(8, 12):
        for x in range(8, 12):
            d[(x, y)] = c_cyan
    d[(9, 9)] = c_white
    d[(10, 9)] = c_white

    # Orbital rings
    # Horizontal
    for x in range(3, 17):
        d[(x, 9)] = c_dark
        d[(x, 10)] = c_dark
    d[(3, 9)] = c_cyan
    d[(16, 10)] = c_cyan

    # Diagonal 1
    for i in range(12):
        d[(4 + i, 4 + i)] = c_dark
    d[(5, 5)] = c_cyan
    d[(14, 14)] = c_cyan

    # Diagonal 2
    for i in range(12):
        d[(15 - i, 4 + i)] = c_dark
    d[(14, 5)] = c_cyan
    d[(5, 14)] = c_cyan

    return make_sprite(d)

# ── 10. Next.js ─────────────────────────────────────────────
def draw_nextjs():
    d = {}
    c_black = hex_to_rgba("#0A0A0A")
    c_border = hex_to_rgba("#2A2A2A")
    c_white = (255, 255, 255, 255)
    c_red = hex_to_rgba("#E3000F")

    # Black circle disk
    import math
    for y in range(2, 18):
        for x in range(2, 18):
            dist = math.hypot(x - 9.5, y - 9.5)
            if dist <= 7.8:
                d[(x, y)] = c_border if dist >= 7.0 else c_black

    # 'N' stems
    for y in range(6, 14):
        d[(6, y)] = c_white
        d[(13, y)] = c_white

    # Diagonal slash with red energy spark
    for i in range(7):
        d[(7 + i, 7 + i)] = c_white
    d[(13, 13)] = c_red
    d[(12, 12)] = c_red

    return make_sprite(d)

# ── 11. Flutter ─────────────────────────────────────────────
def draw_flutter():
    d = {}
    c_dark_blue = hex_to_rgba("#02569B")
    c_mid_blue = hex_to_rgba("#0175C2")
    c_cyan = hex_to_rgba("#29B6F6")
    c_light = hex_to_rgba("#81D4FA")

    # Flutter Chevron 1 (Top wing)
    for i in range(6):
        d[(8 + i, 3 + i)] = c_mid_blue
        d[(7 + i, 3 + i)] = c_light
    for i in range(6):
        d[(13 - i, 8 + i)] = c_mid_blue

    # Flutter Chevron 2 (Bottom wing)
    for i in range(5):
        d[(10 + i, 9 + i)] = c_cyan
        d[(14 - i, 13 + i)] = c_dark_blue

    return make_sprite(d)

# ── 12. Capacitor ───────────────────────────────────────────
def draw_capacitor():
    d = {}
    c_blue = hex_to_rgba("#119EFF")
    c_dark = hex_to_rgba("#005FA3")
    c_silver = hex_to_rgba("#CBD5E1")
    c_spark = hex_to_rgba("#FDE047")

    # Capacitor can cylinder (x: 5..14, y: 5..15)
    for y in range(5, 16):
        for x in range(5, 15):
            d[(x, y)] = c_blue
    for y in range(5, 16):
        d[(5, y)] = c_dark
        d[(14, y)] = c_dark
        d[(7, y)] = c_silver

    # Lead pins at bottom
    d[(7, 16)] = c_silver
    d[(7, 17)] = c_silver
    d[(12, 16)] = c_silver
    d[(12, 17)] = c_silver

    # Spark at top
    d[(9, 3)] = c_spark
    d[(10, 2)] = c_spark
    d[(10, 4)] = c_spark

    return make_sprite(d)

# ── 13. Tailwind CSS ────────────────────────────────────────
def draw_tailwindcss():
    d = {}
    c_teal = hex_to_rgba("#38BDF8")
    c_dark = hex_to_rgba("#0284C7")
    c_hi = hex_to_rgba("#BAE6FD")

    # Wave 1
    coords1 = [(4, 11), (5, 10), (6, 9), (7, 9), (8, 10), (9, 11), (10, 11), (11, 10)]
    for x, y in coords1:
        d[(x, y)] = c_teal
        d[(x, y + 1)] = c_dark
        d[(x, y - 1)] = c_hi

    # Wave 2
    coords2 = [(10, 8), (11, 7), (12, 6), (13, 6), (14, 7), (15, 8), (16, 8)]
    for x, y in coords2:
        d[(x, y)] = c_teal
        d[(x, y + 1)] = c_dark
        d[(x, y - 1)] = c_hi

    return make_sprite(d)

# ── 14. PWA ─────────────────────────────────────────────────
def draw_pwa():
    d = {}
    c_purple = hex_to_rgba("#5A0FC8")
    c_dark = hex_to_rgba("#2E0866")
    c_screen = hex_to_rgba("#1E1035")
    c_arrow = hex_to_rgba("#10B981")
    c_white = (255, 255, 255, 255)

    # Smartphone frame (x: 5..14, y: 2..17)
    for y in range(2, 18):
        for x in range(5, 15):
            d[(x, y)] = c_screen
    for x in range(5, 15):
        d[(x, 2)] = c_purple
        d[(x, 17)] = c_purple
    for y in range(2, 18):
        d[(5, y)] = c_purple
        d[(14, y)] = c_purple

    # Download arrow inside
    d[(9, 6)] = c_arrow
    d[(10, 6)] = c_arrow
    d[(9, 7)] = c_arrow
    d[(10, 7)] = c_arrow
    d[(9, 8)] = c_arrow
    d[(10, 8)] = c_arrow
    d[(7, 9)] = c_arrow
    d[(8, 9)] = c_arrow
    d[(9, 9)] = c_arrow
    d[(10, 9)] = c_arrow
    d[(11, 9)] = c_arrow
    d[(12, 9)] = c_arrow
    d[(9, 10)] = c_white
    d[(10, 10)] = c_white
    d[(9, 11)] = c_white
    d[(10, 11)] = c_white

    return make_sprite(d)

# ── 15. Service Workers ─────────────────────────────────────
def draw_serviceworkers():
    d = {}
    c_gear = hex_to_rgba("#FF6A00")
    c_dark = hex_to_rgba("#B84D00")
    c_wave = hex_to_rgba("#FBBF24")

    # Gear body
    for y in range(6, 14):
        for x in range(6, 14):
            d[(x, y)] = c_gear
    d[(9, 9)] = (0, 0, 0, 0)
    d[(10, 9)] = (0, 0, 0, 0)
    d[(9, 10)] = (0, 0, 0, 0)
    d[(10, 10)] = (0, 0, 0, 0)

    # Gear teeth
    d[(9, 4)] = c_gear; d[(10, 4)] = c_gear
    d[(9, 15)] = c_gear; d[(10, 15)] = c_gear
    d[(4, 9)] = c_gear; d[(4, 10)] = c_gear
    d[(15, 9)] = c_gear; d[(15, 10)] = c_gear

    # Wi-Fi broadcast wave
    d[(15, 3)] = c_wave
    d[(16, 4)] = c_wave
    d[(17, 5)] = c_wave

    return make_sprite(d)

# ── 16. Node.js ─────────────────────────────────────────────
def draw_nodejs():
    d = {}
    c_green = hex_to_rgba("#339933")
    c_dark = hex_to_rgba("#1C571C")
    c_hi = hex_to_rgba("#68C154")
    c_white = (255, 255, 255, 255)

    # Hexagon
    for y in range(3, 17):
        for x in range(3, 17):
            d[(x, y)] = c_green

    # 'N' in center
    for y in range(6, 14):
        d[(7, y)] = c_white
        d[(12, y)] = c_white
    for i in range(6):
        d[(7 + i, 7 + i)] = c_white

    return make_sprite(d)

# ── 17. Express ─────────────────────────────────────────────
def draw_express():
    d = {}
    c_black = hex_to_rgba("#1A1A1A")
    c_border = hex_to_rgba("#333333")
    c_white = (255, 255, 255, 255)
    c_red = hex_to_rgba("#E3000F")

    for y in range(3, 17):
        for x in range(3, 17):
            d[(x, y)] = c_black
    for x in range(3, 17):
        d[(x, 3)] = c_border
        d[(x, 16)] = c_border

    # 'e'
    for y in range(7, 13):
        d[(6, y)] = c_white
    for x in range(6, 10):
        d[(x, 7)] = c_white
        d[(x, 9)] = c_white
        d[(x, 12)] = c_white

    # 'x'
    for i in range(6):
        d[(11 + i, 7 + i)] = c_white
        d[(16 - i, 7 + i)] = c_white

    # Fast forward red stripe
    for x in range(6, 17):
        d[(x, 14)] = c_red

    return make_sprite(d)

# ── 18. PostgreSQL ──────────────────────────────────────────
def draw_postgresql():
    d = {}
    c_blue = hex_to_rgba("#336791")
    c_dark = hex_to_rgba("#1D3E59")
    c_white = (255, 255, 255, 255)
    c_tusk = hex_to_rgba("#F1F5F9")

    # Elephant head
    for y in range(4, 15):
        for x in range(4, 15):
            d[(x, y)] = c_blue

    # Trunk
    for y in range(11, 17):
        d[(4, y)] = c_blue
        d[(5, y)] = c_blue
    d[(6, 16)] = c_blue

    # Ear contour
    for y in range(5, 13):
        d[(14, y)] = c_dark

    # Eye
    d[(8, 7)] = c_white
    d[(8, 8)] = c_dark

    # Tusk
    d[(6, 12)] = c_tusk
    d[(7, 13)] = c_tusk

    return make_sprite(d)

# ── 19. Oracle DB ───────────────────────────────────────────
def draw_oracledb():
    d = {}
    c_red = hex_to_rgba("#F80000")
    c_dark_red = hex_to_rgba("#990000")
    c_silver = hex_to_rgba("#E2E8F0")

    # Red database cylinder
    for y in range(4, 16):
        for x in range(4, 16):
            d[(x, y)] = c_red

    for disc_y in [4, 9, 15]:
        for x in range(4, 16):
            d[(x, disc_y)] = c_silver

    for y in range(4, 16):
        d[(4, y)] = c_dark_red
        d[(15, y)] = c_dark_red

    return make_sprite(d)

# ── 20. MongoDB ─────────────────────────────────────────────
def draw_mongodb():
    d = {}
    c_green = hex_to_rgba("#13AA52")
    c_dark = hex_to_rgba("#0B6E33")
    c_spine = (255, 255, 255, 255)

    # Leaf silhouette
    for y in range(3, 17):
        width = 6 - abs(y - 10) // 2
        for x in range(10 - width, 10 + width + 1):
            d[(x, y)] = c_green if x <= 10 else c_dark

    # Central spine
    for y in range(4, 16):
        d[(10, y)] = c_spine

    return make_sprite(d)

# ── 21. Valkey ──────────────────────────────────────────────
def draw_valkey():
    d = {}
    c_red = hex_to_rgba("#E3000F")
    c_bright = hex_to_rgba("#FF4D5A")
    c_dark = hex_to_rgba("#7A0008")
    c_white = (255, 255, 255, 255)

    # Diamond crystal facet
    for y in range(4, 16):
        w = 6 - abs(y - 10)
        for x in range(10 - w, 10 + w + 1):
            d[(x, y)] = c_bright if x <= 10 else c_dark

    # Facet lines
    d[(10, 4)] = c_white
    d[(10, 10)] = c_white
    d[(6, 10)] = c_white
    d[(14, 10)] = c_white

    return make_sprite(d)

# ── 22. MySQL HeatWave ──────────────────────────────────────
def draw_mysqlheatwave():
    d = {}
    c_dolphin = hex_to_rgba("#00758F")
    c_orange = hex_to_rgba("#FF6600")
    c_sun = hex_to_rgba("#F59E0B")
    c_white = (255, 255, 255, 255)

    # Heatwave sun rays at top
    for x in range(3, 17, 2):
        d[(x, 3)] = c_orange
        d[(x, 4)] = c_sun

    # Jumping dolphin arc
    dolphin_pts = [(4, 13), (5, 12), (6, 11), (7, 10), (8, 9), (9, 9), (10, 9), (11, 10), (12, 11), (13, 12), (14, 13), (15, 13)]
    for x, y in dolphin_pts:
        d[(x, y)] = c_dolphin
        d[(x, y + 1)] = c_dolphin
    d[(8, 8)] = c_dolphin # dorsal fin
    d[(14, 8)] = c_white  # splash glint

    return make_sprite(d)

# ── 23. Docker ──────────────────────────────────────────────
def draw_docker():
    d = {}
    c_blue = hex_to_rgba("#2496ED")
    c_dark_blue = hex_to_rgba("#0B5A96")
    c_cyan_box = hex_to_rgba("#00D8FF")
    c_green_box = hex_to_rgba("#10B981")
    c_yellow_box = hex_to_rgba("#FBBF24")
    c_red_box = hex_to_rgba("#EF4444")
    c_white = (255, 255, 255, 255)

    # Whale body
    for y in range(11, 16):
        for x in range(3, 16):
            d[(x, y)] = c_blue
    # Whale tail
    d[(2, 11)] = c_blue
    d[(2, 12)] = c_blue
    d[(1, 10)] = c_blue
    d[(1, 11)] = c_blue

    # Whale eye & mouth
    d[(14, 13)] = c_white
    d[(14, 14)] = c_dark_blue

    # Cargo container blocks
    d[(5, 8)] = c_cyan_box; d[(6, 8)] = c_cyan_box; d[(5, 9)] = c_cyan_box; d[(6, 9)] = c_cyan_box
    d[(8, 8)] = c_green_box; d[(9, 8)] = c_green_box; d[(8, 9)] = c_green_box; d[(9, 9)] = c_green_box
    d[(11, 8)] = c_yellow_box; d[(12, 8)] = c_yellow_box; d[(11, 9)] = c_yellow_box; d[(12, 9)] = c_yellow_box
    # Top tier box
    d[(8, 6)] = c_red_box; d[(9, 6)] = c_red_box; d[(8, 7)] = c_red_box; d[(9, 7)] = c_red_box

    return make_sprite(d)

# ── 24. OCI (Oracle Cloud) ──────────────────────────────────
def draw_oci():
    d = {}
    c_red = hex_to_rgba("#F80000")
    c_gray = hex_to_rgba("#64748B")
    c_white = (255, 255, 255, 255)

    # Dual cloud puffs
    for y in range(7, 14):
        for x in range(3, 12):
            d[(x, y)] = c_red
    for y in range(5, 12):
        for x in range(8, 17):
            d[(x, y)] = c_gray

    # Cloud center cutout
    d[(10, 9)] = c_white
    d[(9, 9)] = c_white

    return make_sprite(d)

# ── 25. CI/CD ───────────────────────────────────────────────
def draw_cicd():
    d = {}
    c_green = hex_to_rgba("#10B981")
    c_blue = hex_to_rgba("#2563EB")
    c_dark = hex_to_rgba("#0F172A")

    # Infinity loop
    # Left loop (green)
    for x in range(4, 9):
        d[(x, 7)] = c_green
        d[(x, 13)] = c_green
    d[(3, 8)] = c_green; d[(3, 12)] = c_green; d[(3, 9)] = c_green; d[(3, 10)] = c_green; d[(3, 11)] = c_green

    # Right loop (blue)
    for x in range(11, 16):
        d[(x, 7)] = c_blue
        d[(x, 13)] = c_blue
    d[(16, 8)] = c_blue; d[(16, 12)] = c_blue; d[(16, 9)] = c_blue; d[(16, 10)] = c_blue; d[(16, 11)] = c_blue

    # Center intersection
    d[(9, 9)] = c_green
    d[(10, 10)] = c_blue
    d[(9, 11)] = c_blue
    d[(10, 9)] = c_green

    # Arrow head
    d[(15, 6)] = c_blue
    d[(16, 6)] = c_blue

    return make_sprite(d)

# ── 26. FCM ─────────────────────────────────────────────────
def draw_fcm():
    d = {}
    c_amber = hex_to_rgba("#FFA000")
    c_orange = hex_to_rgba("#F57C00")
    c_red = hex_to_rgba("#FF5722")
    c_yellow = hex_to_rgba("#FFD54F")

    # Firebase flame
    for y in range(4, 16):
        w = 6 - abs(y - 12)
        for x in range(10 - w, 10 + w):
            d[(x, y)] = c_orange
    d[(10, 3)] = c_yellow
    d[(10, 4)] = c_yellow
    d[(9, 6)] = c_amber
    d[(10, 6)] = c_amber
    d[(10, 10)] = c_red
    d[(11, 10)] = c_red

    return make_sprite(d)

# ── 27. OneSignal ───────────────────────────────────────────
def draw_onesignal():
    d = {}
    c_red = hex_to_rgba("#E54B4D")
    c_white = (255, 255, 255, 255)
    c_dark = hex_to_rgba("#9E2A2B")

    # Red circular badge
    import math
    for y in range(2, 18):
        for x in range(2, 18):
            dist = math.hypot(x - 9.5, y - 9.5)
            if dist <= 7.5:
                d[(x, y)] = c_red

    # Signal sound waves
    d[(7, 9)] = c_white; d[(7, 10)] = c_white
    d[(10, 7)] = c_white; d[(10, 12)] = c_white; d[(11, 8)] = c_white; d[(11, 11)] = c_white
    d[(13, 6)] = c_white; d[(13, 13)] = c_white

    return make_sprite(d)

# ── 28. Google OAuth ────────────────────────────────────────
def draw_googleoauth():
    d = {}
    c_blue = hex_to_rgba("#4285F4")
    c_red = hex_to_rgba("#EA4335")
    c_yellow = hex_to_rgba("#FBBC05")
    c_green = hex_to_rgba("#34A853")

    # 'G' shape with 4 quadrants
    # Blue right bar & cross
    for y in range(9, 13):
        d[(14, y)] = c_blue
    for x in range(10, 15):
        d[(x, 10)] = c_blue

    # Red top arc
    for x in range(6, 14):
        d[(x, 4)] = c_red
        d[(x, 5)] = c_red

    # Yellow left top arc
    for y in range(6, 11):
        d[(4, y)] = c_yellow
        d[(5, y)] = c_yellow

    # Green bottom arc
    for x in range(6, 13):
        d[(x, 14)] = c_green
        d[(x, 15)] = c_green

    return make_sprite(d)

# ── 29. Resend ──────────────────────────────────────────────
def draw_resend():
    d = {}
    c_black = hex_to_rgba("#0F172A")
    c_white = (255, 255, 255, 255)
    c_red = hex_to_rgba("#E3000F")

    # Mail envelope (x: 3..16, y: 5..14)
    for y in range(5, 15):
        for x in range(3, 17):
            d[(x, y)] = c_black

    # Envelope flap lines
    for i in range(7):
        d[(3 + i, 5 + i)] = c_white
        d[(16 - i, 5 + i)] = c_white

    # Bottom border
    for x in range(3, 17):
        d[(x, 14)] = c_white

    # Fast delivery red swoosh
    d[(14, 3)] = c_red
    d[(15, 3)] = c_red
    d[(16, 4)] = c_red

    return make_sprite(d)

# ── 30. Git & GitHub ────────────────────────────────────────
def draw_gitgithub():
    d = {}
    c_orange = hex_to_rgba("#F05032")
    c_dark = hex_to_rgba("#24292F")
    c_white = (255, 255, 255, 255)

    # Git diamond branch
    # Diamond outline (orange)
    for i in range(7):
        d[(10 - i, 3 + i)] = c_orange
        d[(10 + i, 3 + i)] = c_orange
        d[(4 + i, 10 + i)] = c_orange
        d[(16 - i, 10 + i)] = c_orange

    # Git commit nodes
    d[(10, 6)] = c_white
    d[(10, 10)] = c_white
    d[(7, 9)] = c_white
    # Branch lines
    d[(10, 7)] = c_dark
    d[(10, 8)] = c_dark
    d[(10, 9)] = c_dark
    d[(9, 8)] = c_dark
    d[(8, 9)] = c_dark

    return make_sprite(d)

# ── 31. Vercel ──────────────────────────────────────────────
def draw_vercel():
    d = {}
    c_black = hex_to_rgba("#000000")
    c_hi = hex_to_rgba("#333333")

    # Equilateral triangle
    # Apex at (9, 3), Base at y=15, x=3..16
    for y in range(3, 16):
        w = y - 3
        for x in range(9 - w, 10 + w + 1):
            if 0 <= x < 20:
                d[(x, y)] = c_black
    # Top highlight bevel
    d[(9, 3)] = c_hi
    d[(10, 3)] = c_hi

    return make_sprite(d)

# ── 32. Neo4j ───────────────────────────────────────────────
def draw_neo4j():
    d = {}
    c_blue = hex_to_rgba("#018BFF")
    c_cyan = hex_to_rgba("#00D4FF")
    c_line = hex_to_rgba("#5C9CE6")
    c_white = (255, 255, 255, 255)

    # Graph edges
    for t in [(7, 6), (8, 7), (8, 8), (9, 9)]:
        d[t] = c_line
    for t in [(6, 13), (7, 12), (8, 12), (9, 11)]:
        d[t] = c_line
    for t in [(11, 10), (12, 10), (13, 9), (14, 9)]:
        d[t] = c_line
    for y in range(7, 13):
        d[(5, y)] = c_line

    # Nodes
    for x in range(5, 8):
        for y in range(4, 7):
            d[(x, y)] = c_blue
    d[(6, 5)] = c_white
    d[(5, 4)] = c_cyan

    for x in range(4, 7):
        for y in range(13, 16):
            d[(x, y)] = c_blue
    d[(5, 14)] = c_white
    d[(4, 13)] = c_cyan

    for x in range(9, 12):
        for y in range(9, 12):
            d[(x, y)] = c_cyan
    d[(10, 10)] = c_white

    for x in range(14, 17):
        for y in range(8, 11):
            d[(x, y)] = c_blue
    d[(15, 9)] = c_white
    d[(14, 8)] = c_cyan

    return make_sprite(d)

# ── 33. AWS ─────────────────────────────────────────────────
def draw_aws():
    d = {}
    c_dark = hex_to_rgba("#232F3E")
    c_orange = hex_to_rgba("#FF9900")
    c_white = (255, 255, 255, 255)
    c_border = hex_to_rgba("#141E28")

    # Dark chip background (2, 2) to (17, 17)
    for y in range(2, 18):
        for x in range(2, 18):
            if x in (2, 17) or y in (2, 17):
                d[(x, y)] = c_border
            else:
                d[(x, y)] = c_dark

    # 'A': x=4..6, y=5..9
    d[(5, 5)] = c_white
    d[(4, 6)] = c_white; d[(6, 6)] = c_white
    d[(4, 7)] = c_white; d[(5, 7)] = c_white; d[(6, 7)] = c_white
    d[(4, 8)] = c_white; d[(6, 8)] = c_white
    d[(4, 9)] = c_white; d[(6, 9)] = c_white

    # 'W': x=8..11, y=5..9
    d[(8, 5)] = c_white; d[(11, 5)] = c_white
    d[(8, 6)] = c_white; d[(11, 6)] = c_white
    d[(8, 7)] = c_white; d[(11, 7)] = c_white
    d[(8, 8)] = c_white; d[(9, 8)] = c_white; d[(10, 8)] = c_white; d[(11, 8)] = c_white
    d[(8, 9)] = c_white; d[(11, 9)] = c_white

    # 'S': x=13..15, y=5..9
    d[(14, 5)] = c_white; d[(15, 5)] = c_white
    d[(13, 6)] = c_white
    d[(14, 7)] = c_white
    d[(15, 8)] = c_white
    d[(13, 9)] = c_white; d[(14, 9)] = c_white

    # Smile curve
    for x in range(7, 12):
        d[(x, 14)] = c_orange
    d[(4, 12)] = c_orange; d[(5, 13)] = c_orange; d[(6, 13)] = c_orange
    d[(12, 13)] = c_orange; d[(13, 13)] = c_orange; d[(14, 12)] = c_orange
    d[(15, 11)] = c_orange; d[(15, 12)] = c_orange; d[(14, 11)] = c_orange; d[(15, 13)] = c_orange

    return make_sprite(d)

# Map all skills
SKILL_GENERATORS = {
    "typescript": draw_typescript,
    "javascript": draw_javascript,
    "python": draw_python,
    "java": draw_java,
    "dart": draw_dart,
    "sql": draw_sql,
    "plsql": draw_plsql,
    "cpp": draw_cpp,
    "react": draw_react,
    "nextjs": draw_nextjs,
    "flutter": draw_flutter,
    "capacitor": draw_capacitor,
    "tailwindcss": draw_tailwindcss,
    "pwa": draw_pwa,
    "serviceworkers": draw_serviceworkers,
    "nodejs": draw_nodejs,
    "express": draw_express,
    "postgresql": draw_postgresql,
    "oracledb": draw_oracledb,
    "mongodb": draw_mongodb,
    "valkey": draw_valkey,
    "mysqlheatwave": draw_mysqlheatwave,
    "docker": draw_docker,
    "neo4j": draw_neo4j,
    "oci": draw_oci,
    "aws": draw_aws,
    "cicd": draw_cicd,
    "fcm": draw_fcm,
    "onesignal": draw_onesignal,
    "googleoauth": draw_googleoauth,
    "resend": draw_resend,
    "gitgithub": draw_gitgithub,
    "vercel": draw_vercel,
}

def main():
    print(f"Generating {len(SKILL_GENERATORS)} 2D pixel skill sprites...")
    for name, gen_fn in SKILL_GENERATORS.items():
        img = gen_fn()
        png_path = os.path.join(OUT_DIR, f"{name}.png")
        img.save(png_path)
        print(f"  [OK] Saved {name}.png")

    print("\nConverting to .aseprite files using Aseprite CLI...")
    for name in SKILL_GENERATORS.keys():
        png_path = os.path.join(OUT_DIR, f"{name}.png")
        ase_path = os.path.join(OUT_DIR, f"{name}.aseprite")
        cmd = f'aseprite -b "{png_path}" --save-as "{ase_path}"'
        res = subprocess.run(cmd, shell=True)
        if res.returncode == 0:
            print(f"  [ASEPRITE OK] {name}.aseprite")
        else:
            print(f"  [WARN] Failed to export {name}.aseprite")

    print("\nAll skill sprites generated successfully!")

if __name__ == "__main__":
    main()
