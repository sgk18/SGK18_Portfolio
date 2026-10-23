import os
import sys
import subprocess
import json

def get_react_frames():
    # 32x32 frames, 4 frames
    # Colors
    c_empty = None
    c_border = (10, 16, 26, 255)       # dark badge outline
    c_bg = (15, 23, 42, 255)           # deep slate navy
    c_bg_hi = (30, 41, 59, 255)        # slate highlight
    c_cyan_dark = (0, 130, 155, 255)   # dark cyan
    c_cyan_mid = (0, 216, 255, 255)    # react cyan
    c_cyan_bright = (125, 249, 255, 255)# glowing neon cyan
    c_white = (255, 255, 255, 255)     # white specular
    c_spark = (210, 255, 255, 255)

    frames = []
    for f in range(4):
        grid = [[c_empty for _ in range(32)] for _ in range(32)]

        # Draw hexagonal/octagonal retro badge plate
        for y in range(3, 29):
            for x in range(3, 29):
                # Cut corners for retro octagonal cartridge badge
                dist_corner_tl = (4 - x) + (4 - y)
                dist_corner_tr = (x - 27) + (4 - y)
                dist_corner_bl = (4 - x) + (y - 27)
                dist_corner_br = (x - 27) + (y - 27)
                
                is_corner = (x <= 6 and y <= 6 and (6-x)+(6-y) > 3) or \
                            (x >= 25 and y <= 6 and (x-25)+(6-y) > 3) or \
                            (x <= 6 and y >= 25 and (6-x)+(y-25) > 3) or \
                            (x >= 25 and y >= 25 and (x-25)+(y-25) > 3)
                
                if not is_corner:
                    # Border vs interior
                    is_edge = (x == 3 or x == 28 or y == 3 or y == 28 or
                               ((x <= 6 and y <= 6) and (6-x)+(6-y) == 3) or
                               ((x >= 25 and y <= 6) and (x-25)+(6-y) == 3) or
                               ((x <= 6 and y >= 25) and (6-x)+(y-25) == 3) or
                               ((x >= 25 and y >= 25) and (x-25)+(y-25) == 3))
                    if is_edge:
                        grid[y][x] = c_border
                    else:
                        # Inner subtle gradient and bevel
                        if y == 4 or x == 4:
                            grid[y][x] = c_bg_hi
                        elif y == 27 or x == 27:
                            grid[y][x] = c_border
                        else:
                            grid[y][x] = c_bg

        # Draw React Orbits (3 ellipses: horizontal, +60 deg, -60 deg)
        # Math for ellipse: x' = cos*dx - sin*dy, y' = sin*dx + cos*dy
        # (x'/a)^2 + (y'/b)^2 approx 1
        cx, cy = 15.5, 15.5
        import math

        angles = [0, math.pi / 3, -math.pi / 3]
        a, b = 9.0, 3.8

        # Draw orbital rings in mid/dark cyan
        for ang in angles:
            cos_a = math.cos(ang)
            sin_a = math.sin(ang)
            for step in range(120):
                theta = step * (2 * math.pi / 120)
                ex = a * math.cos(theta)
                ey = b * math.sin(theta)
                # Rotate
                rx = cos_a * ex - sin_a * ey + cx
                ry = sin_a * ex + cos_a * ey + cy
                ix, iy = int(round(rx)), int(round(ry))
                if 4 <= ix <= 27 and 4 <= iy <= 27:
                    if grid[iy][ix] not in (c_border, c_cyan_bright, c_white):
                        grid[iy][ix] = c_cyan_dark

        # Draw revolving electrons for this frame (phase shifted by f * pi/2)
        for i, ang in enumerate(angles):
            cos_a = math.cos(ang)
            sin_a = math.sin(ang)
            # Electron position along the ellipse
            e_theta = (f * (math.pi / 2)) + (i * (2 * math.pi / 3))
            ex = a * math.cos(e_theta)
            ey = b * math.sin(e_theta)
            rx = cos_a * ex - sin_a * ey + cx
            ry = sin_a * ex + cos_a * ey + cy
            ix, iy = int(round(rx)), int(round(ry))
            
            # Electron core
            if 4 <= ix <= 27 and 4 <= iy <= 27:
                grid[iy][ix] = c_white
                # Electron halo
                for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                    nx, ny = ix + dx, iy + dy
                    if 4 <= nx <= 27 and 4 <= ny <= 27 and grid[ny][nx] != c_white:
                        grid[ny][nx] = c_cyan_bright

        # Draw React Center Nucleus with pulsing energy
        # f=0: r=2, f=1: r=2.5, f=2: r=3 (peak), f=3: r=2.5
        pulse_sizes = [2, 2.5, 3.0, 2.5]
        pr = pulse_sizes[f]
        for y in range(11, 21):
            for x in range(11, 21):
                d = math.hypot(x - cx, y - cy)
                if d <= pr:
                    if d <= pr * 0.4:
                        grid[y][x] = c_white
                    elif d <= pr * 0.75:
                        grid[y][x] = c_cyan_bright
                    else:
                        grid[y][x] = c_cyan_mid
                elif d <= pr + 0.8:
                    if grid[y][x] not in (c_white, c_cyan_bright):
                        grid[y][x] = c_cyan_dark

        # Frame 2 has glint sparkle on nucleus
        if f == 2:
            grid[15][11] = c_spark
            grid[15][20] = c_spark
            grid[11][15] = c_spark
            grid[20][15] = c_spark

        frames.append(grid)
    return frames


def get_nextjs_frames():
    # 32x32 frames, 4 frames
    # Colors
    c_empty = None
    c_border = (10, 10, 10, 255)
    c_bg = (18, 18, 18, 255)          # matte dark carbon
    c_bg_hi = (38, 38, 38, 255)       # carbon rim
    c_white = (255, 255, 255, 255)    # pure white
    c_silver = (210, 210, 210, 255)   # silver gradient
    c_dark_gray = (90, 90, 90, 255)   # shadow on N
    c_red_accent = (227, 0, 15, 255)   # #E3000F signature crimson
    c_red_neon = (255, 60, 75, 255)    # neon red laser
    c_red_glow = (255, 140, 150, 255)  # laser core spark

    frames = []
    for f in range(4):
        grid = [[c_empty for _ in range(32)] for _ in range(32)]

        # Circular retro badge disk
        cx, cy = 15.5, 15.5
        import math
        for y in range(2, 30):
            for x in range(2, 30):
                d = math.hypot(x - cx, y - cy)
                if d <= 13.5:
                    if d >= 12.5:
                        grid[y][x] = c_border
                    elif d >= 11.5:
                        grid[y][x] = c_bg_hi
                    else:
                        grid[y][x] = c_bg

        # Base Next.js "N" logo:
        # Left bar: x = 9, 10; y from 9 to 22
        # Right bar: x = 21, 22; y from 9 to 22
        # Diagonal: from (10, 9) down-right to (22, 22)
        n_pixels = set()
        # Left stem
        for y in range(9, 23):
            for x in (9, 10):
                grid[y][x] = c_white
                n_pixels.add((x, y))

        # Right stem
        for y in range(9, 23):
            for x in (21, 22):
                grid[y][x] = c_white
                n_pixels.add((x, y))

        # Diagonal stroke (width 2-3)
        # y goes from 9 to 22 (14 steps), x goes from 10 to 22 (12 steps)
        for i in range(14):
            y = 9 + i
            x_mid = 10.0 + (i / 13.0) * 11.0
            x1 = int(math.floor(x_mid))
            x2 = int(math.ceil(x_mid))
            for x in (x1, x2, x2 + 1 if i > 6 else x1 - 1):
                if 9 <= x <= 22 and 9 <= y <= 22:
                    # gradient fading towards bottom right
                    if i < 4:
                        col = c_white
                    elif i < 9:
                        col = c_silver
                    else:
                        col = c_dark_gray
                    grid[y][x] = col
                    n_pixels.add((x, y))

        # Animation: Neon Crimson energy laser pulse moving down the diagonal
        # f=0: laser at top (y=9..11, x=10..12)
        # f=1: laser at mid-upper (y=13..15, x=13..15)
        # f=2: laser at mid-lower (y=17..19, x=17..19)
        # f=3: laser impacts bottom right (y=21..23, x=20..23) with 4-point cross spark
        spark_positions = [
            (10, 10),
            (14, 14),
            (18, 18),
            (21, 22)
        ]
        sx, sy = spark_positions[f]

        # Draw red laser trail and glow
        for dy in range(-1, 2):
            for dx in range(-1, 2):
                px, py = sx + dx, sy + dy
                if 0 <= px < 32 and 0 <= py < 32:
                    if (px, py) == (sx, sy):
                        grid[py][px] = c_red_glow
                    elif (px, py) in n_pixels or math.hypot(dx, dy) <= 1.2:
                        grid[py][px] = c_red_neon

        if f == 3:
            # Impact spark flare at corner
            for ox, oy in [(-2, 0), (2, 0), (0, -2), (0, 2)]:
                fx, fy = sx + ox, sy + oy
                if 0 <= fx < 32 and 0 <= fy < 32:
                    grid[fy][fx] = c_red_accent

        frames.append(grid)
    return frames


def get_typescript_frames():
    # 32x32 frames, 4 frames
    # Colors
    c_empty = None
    c_border = (12, 38, 75, 255)       # deep dark navy border
    c_blue = (49, 120, 198, 255)       # #3178C6 TS Blue
    c_blue_hi = (92, 160, 235, 255)    # top edge highlight
    c_blue_dark = (26, 75, 130, 255)   # bottom shadow
    c_gold = (245, 180, 20, 255)       # connector pins
    c_gold_hi = (255, 230, 100, 255)   # bright gold spark
    c_gold_dark = (170, 120, 10, 255)  # dark pin
    c_white = (255, 255, 255, 255)     # TS text
    c_cyan_data = (80, 240, 255, 255)  # data bit pulse
    c_chip_slot = (8, 20, 36, 255)

    frames = []
    for f in range(4):
        grid = [[c_empty for _ in range(32)] for _ in range(32)]

        # Cartridge Body: x: 4..27, y: 4..25
        # Cut top corners like an arcade cartridge/floppy
        for y in range(4, 26):
            for x in range(4, 28):
                is_cut = (y == 4 and (x in (4, 27))) or (y == 5 and (x in (4, 27)))
                if not is_cut:
                    is_edge = (x == 4 or x == 27 or y == 4 or y == 25 or
                               (y == 5 and (x == 5 or x == 26)))
                    if is_edge:
                        grid[y][x] = c_border
                    elif y == 5 or x == 5:
                        grid[y][x] = c_blue_hi
                    elif y == 24 or x == 26:
                        grid[y][x] = c_blue_dark
                    else:
                        grid[y][x] = c_blue

        # Notch / grip ridges at top (x: 10..21, y: 5..6)
        for x in range(11, 21, 2):
            grid[5][x] = c_blue_dark
            grid[6][x] = c_blue_hi

        # Gold connector pins at bottom (y: 26..28)
        # 5 pin slots
        pin_x_list = [7, 11, 15, 19, 23]
        for px in pin_x_list:
            for py in range(26, 29):
                grid[py][px] = c_gold
                grid[py][px + 1] = c_gold_dark

        # Pin active lighting up based on frame
        active_pin = pin_x_list[f % len(pin_x_list)]
        grid[26][active_pin] = c_gold_hi
        grid[27][active_pin] = c_gold_hi

        # Data pulse travelling up onto chip circuit
        # f=0: pin active
        # f=1: pulse at bottom of chip (y=23, 22)
        # f=2: pulse at text bevel (y=18, 17)
        # f=3: pulse illuminates "TS" text
        pulse_y = [25, 22, 18, 14][f]
        grid[pulse_y][active_pin] = c_cyan_data
        if 0 <= active_pin+1 < 32:
            grid[pulse_y][active_pin+1] = c_cyan_data

        # Draw "TS" pixel typography
        # 'T':
        # top bar: x: 8..14, y: 11, 12
        # stem: x: 10, 11, y: 13..20
        # 'S':
        # top bar: x: 17..22, y: 11, 12
        # left upper: x: 17, 18, y: 13, 14
        # mid bar: x: 17..22, y: 15, 16
        # right lower: x: 21, 22, y: 17, 18
        # bottom bar: x: 17..22, y: 19, 20

        ts_color = c_white if f != 3 else c_cyan_data

        # T top
        for x in range(8, 15):
            for y in (11, 12):
                grid[y][x] = ts_color
        # T stem
        for y in range(13, 21):
            for x in (10, 11):
                grid[y][x] = ts_color

        # S
        for x in range(17, 23):
            for y in (11, 12):
                grid[y][x] = ts_color
        for y in (13, 14):
            for x in (17, 18):
                grid[y][x] = ts_color
        for x in range(17, 23):
            for y in (15, 16):
                grid[y][x] = ts_color
        for y in (17, 18):
            for x in (21, 22):
                grid[y][x] = ts_color
        for x in range(17, 23):
            for y in (19, 20):
                grid[y][x] = ts_color

        # Frame 3: extra specular glint on top of T and S
        if f == 3:
            grid[10][8] = c_white
            grid[10][17] = c_white

        frames.append(grid)
    return frames


def get_ai_frames():
    # 32x32 frames, 4 frames
    # Colors
    c_empty = None
    c_border = (20, 8, 40, 255)
    c_bg = (28, 15, 54, 255)           # deep cyberpunk violet
    c_neon_purple = (157, 78, 221, 255)# #9D4EDD
    c_neon_magenta = (255, 0, 128, 255)# hot pink
    c_neon_cyan = (0, 240, 255, 255)   # cyber cyan
    c_neon_green = (16, 185, 129, 255) # emerald synaptic glow
    c_white = (255, 255, 255, 255)
    c_core_glow = (200, 245, 255, 255)

    frames = []
    # Hover offset: f=0:0, f=1:-1, f=2:-1, f=3:0
    hover_offsets = [0, -1, -1, 0]

    for f in range(4):
        grid = [[c_empty for _ in range(32)] for _ in range(32)]
        dy_hover = hover_offsets[f]

        # Hexagonal Cyber Base Plate
        cx, cy = 15.5, 15.5 + dy_hover
        import math
        for y in range(3, 29):
            for x in range(3, 29):
                # Hexagon distance: |x|*sqrt(3)/2 + |y|/2 ...
                dx = abs(x - cx)
                dy = abs(y - cy)
                # Hexagon equation: max(|y|, |x|*0.577 + |y|*0.5) <= R
                val = max(dy, dx * 0.866 + dy * 0.5)
                if val <= 12.5:
                    if val >= 11.5:
                        grid[y][x] = c_neon_purple
                    elif val >= 10.5:
                        grid[y][x] = c_border
                    else:
                        grid[y][x] = c_bg

        # Neural Network Nodes & Synapses:
        # 1 central neural core, 4 satellite nodes (Top, Bottom, Left, Right)
        nodes = [
            (int(round(cx)), int(round(cy))),          # 0: Center
            (int(round(cx)), int(round(cy - 7))),      # 1: Top
            (int(round(cx - 7)), int(round(cy))),      # 2: Left
            (int(round(cx + 7)), int(round(cy))),      # 3: Right
            (int(round(cx)), int(round(cy + 7))),      # 4: Bottom
            (int(round(cx - 5)), int(round(cy - 5))),  # 5: TL
            (int(round(cx + 5)), int(round(cy - 5))),  # 6: TR
            (int(round(cx - 5)), int(round(cy + 5))),  # 7: BL
            (int(round(cx + 5)), int(round(cy + 5))),  # 8: BR
        ]

        # Draw synaptic connections (lines from center to satellites)
        synapses = [(0, 1), (0, 2), (0, 3), (0, 4), (1, 5), (1, 6), (2, 5), (3, 6), (2, 7), (3, 8), (4, 7), (4, 8)]
        for n1, n2 in synapses:
            x1, y1 = nodes[n1]
            x2, y2 = nodes[n2]
            # simple bresenham
            steps = max(abs(x2 - x1), abs(y2 - y1))
            for s in range(1, steps):
                px = int(round(x1 + (x2 - x1) * (s / steps)))
                py = int(round(y1 + (y2 - y1) * (s / steps)))
                if 0 <= px < 32 and 0 <= py < 32:
                    grid[py][px] = (80, 40, 110, 255) # dim violet trace

        # Animated Synaptic Firing:
        # f=0: Center pulses to TL & TR
        # f=1: TL & TR fire to Top and Left
        # f=2: Top and Left fire to Center with green spark
        # f=3: All satellites glow with magenta/cyan ring
        active_synapses = [
            [(0, 5), (0, 6)],
            [(5, 1), (5, 2), (6, 1), (6, 3)],
            [(1, 0), (2, 0), (3, 0), (4, 0)],
            []
        ][f]

        for n1, n2 in active_synapses:
            x1, y1 = nodes[n1]
            x2, y2 = nodes[n2]
            steps = max(abs(x2 - x1), abs(y2 - y1))
            for s in range(steps + 1):
                px = int(round(x1 + (x2 - x1) * (s / steps)))
                py = int(round(y1 + (y2 - y1) * (s / steps)))
                if 0 <= px < 32 and 0 <= py < 32:
                    grid[py][px] = c_neon_cyan if f % 2 == 0 else c_neon_green

        # Draw satellite nodes
        for idx in range(1, len(nodes)):
            nx, ny = nodes[idx]
            node_col = c_neon_cyan if f in (0, 2) else c_neon_magenta
            if 0 <= nx < 32 and 0 <= ny < 32:
                grid[ny][nx] = node_col

        # Draw Central Quantum Neural Core (3x3 glowing cluster)
        ccx, ccy = nodes[0]
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                px, py = ccx + dx, ccy + dy
                if 0 <= px < 32 and 0 <= py < 32:
                    if dx == 0 and dy == 0:
                        grid[py][px] = c_white
                    elif math.hypot(dx, dy) <= 1.0:
                        grid[py][px] = c_core_glow if f % 2 == 0 else c_neon_cyan
                    else:
                        grid[py][px] = c_neon_magenta

        frames.append(grid)
    return frames


def get_terminal_frames():
    # 32x32 frames, 4 frames
    # Colors
    c_empty = None
    c_chassis = (30, 38, 48, 255)      # CRT retro gray chassis
    c_chassis_hi = (55, 68, 85, 255)   # chassis light
    c_chassis_dark = (15, 20, 26, 255) # chassis shadow
    c_screen_bg = (6, 26, 12, 255)     # dark phosphor green glass
    c_scanline = (10, 42, 20, 255)     # scanline row
    c_green = (0, 255, 102, 255)       # #00FF66 terminal phosphor
    c_green_bright = (150, 255, 180, 255)# phosphor highlight
    c_white = (255, 255, 255, 255)
    c_led_green = (34, 197, 94, 255)   # power led
    c_led_amber = (245, 158, 11, 255)

    frames = []
    for f in range(4):
        grid = [[c_empty for _ in range(32)] for _ in range(32)]

        # CRT Monitor Chassis (x: 4..27, y: 5..25)
        for y in range(5, 26):
            for x in range(4, 28):
                is_corner = (x in (4, 27) and y in (5, 25))
                if not is_corner:
                    is_edge = (x == 4 or x == 27 or y == 5 or y == 25)
                    if is_edge:
                        grid[y][x] = c_chassis_dark
                    elif y == 6 or x == 5:
                        grid[y][x] = c_chassis_hi
                    elif y == 24 or x == 26:
                        grid[y][x] = c_chassis_dark
                    else:
                        grid[y][x] = c_chassis

        # Monitor Pedestal / Stand (x: 12..19, y: 26..28)
        for y in range(26, 28):
            for x in range(13, 19):
                grid[y][x] = c_chassis_dark if y == 27 else c_chassis
        for x in range(10, 22):
            grid[28][x] = c_chassis_dark

        # CRT Screen Glass: x: 7..24, y: 8..20
        for y in range(8, 21):
            for x in range(7, 25):
                # CRT subtle curved corners
                is_sc_corner = (x in (7, 24) and y in (8, 20))
                if not is_sc_corner:
                    # Alternating CRT scanlines
                    if y % 2 == 1:
                        grid[y][x] = c_scanline
                    else:
                        grid[y][x] = c_screen_bg

        # Power LED (x: 23, y: 23)
        grid[23][23] = c_led_green if f != 2 else c_led_amber

        # Vent slits on right chassis
        grid[23][18] = c_chassis_dark
        grid[23][20] = c_chassis_dark

        # Prompt symbol "> " at (9, 11)
        # > : (9, 10), (10, 11), (9, 12)
        grid[10][9] = c_green
        grid[11][10] = c_green_bright
        grid[12][9] = c_green

        # Terminal text typing animation:
        # f=0: cursor blinking: "> _"
        # f=1: types "r": "> r"
        # f=2: types "un": "> run" + scanline sweep
        # f=3: execute prompt: "> run ■"

        if f == 0:
            # blinking block cursor at (12, 11)
            for cy in range(10, 13):
                grid[cy][12] = c_green_bright
                grid[cy][13] = c_green
        elif f == 1:
            # Letter 'r': x: 12..14
            # (12, 10..12), (13, 10), (14, 11)
            for cy in range(10, 13):
                grid[cy][12] = c_green
            grid[10][13] = c_green
            grid[11][14] = c_green
            # cursor at (16, 11)
            for cy in range(10, 13):
                grid[cy][16] = c_green_bright
        elif f == 2:
            # 'r'
            for cy in range(10, 13):
                grid[cy][12] = c_green
            grid[10][13] = c_green
            grid[11][14] = c_green
            # 'u': x: 15..17
            for cy in range(10, 13):
                grid[cy][15] = c_green
                grid[cy][17] = c_green
            grid[12][16] = c_green
            # 'n': x: 19..21
            for cy in range(10, 13):
                grid[cy][19] = c_green
                grid[cy][21] = c_green
            grid[10][20] = c_green

            # Scanline flash bar across screen (y=15)
            for sx in range(8, 24):
                grid[15][sx] = (40, 120, 70, 255)
        elif f == 3:
            # 'r u n'
            for cy in range(10, 13):
                grid[cy][12] = c_green
            grid[10][13] = c_green
            grid[11][14] = c_green
            for cy in range(10, 13):
                grid[cy][15] = c_green
                grid[cy][17] = c_green
            grid[12][16] = c_green
            for cy in range(10, 13):
                grid[cy][19] = c_green
                grid[cy][21] = c_green
            grid[10][20] = c_green
            # Output result on line 2 (y=15..17): "OK!"
            # O
            grid[15][10] = c_green_bright
            grid[16][9] = c_green
            grid[16][11] = c_green
            grid[17][10] = c_green_bright
            # K
            grid[15][13] = c_green_bright
            grid[16][13] = c_green_bright
            grid[17][13] = c_green_bright
            grid[15][15] = c_green
            grid[16][14] = c_green
            grid[17][15] = c_green
            # !
            grid[15][17] = c_white
            grid[16][17] = c_green_bright
            grid[17][17] = c_green_bright

        frames.append(grid)
    return frames


def build_aseprite_lua():
    badges = {
        "react": get_react_frames(),
        "nextjs": get_nextjs_frames(),
        "typescript": get_typescript_frames(),
        "ai": get_ai_frames(),
        "terminal": get_terminal_frames(),
    }

    # Generate Lua script that creates individual .aseprite files, gifs, sheets
    # and a master developer_badges.aseprite file
    lua_lines = []
    lua_lines.append("-- Aseprite Lua Generator for Developer Retro Badges")
    lua_lines.append("local out_dir = 'c:/projects/SGK18_Portfolio/public/sprites/'")
    lua_lines.append("")

    # Helper function in Lua to create sprite from frames data
    lua_lines.append("""
function createBadgeSprite(name, framesData)
    local spr = Sprite(32, 32)
    local layer = spr.layers[1]
    layer.name = "Artwork"
    
    for fIdx, grid in ipairs(framesData) do
        local frameNum = fIdx
        if fIdx > 1 then
            spr:newEmptyFrame()
        end
        spr.frames[frameNum].duration = 0.15
        
        local img = Image(32, 32)
        for y = 0, 31 do
            for x = 0, 31 do
                local pixel = grid[y + 1][x + 1]
                if pixel then
                    img:drawPixel(x, y, Color{r=pixel[1], g=pixel[2], b=pixel[3], a=pixel[4]})
                end
            end
        end
        spr:newCel(layer, frameNum, img)
    end
    
    local tag = spr:newTag(1, #framesData)
    tag.name = name
    tag.color = Color{r=227, g=0, b=15, a=255}
    
    -- Save native Aseprite file
    spr:saveCopyAs(out_dir .. name .. '.aseprite')
    -- Save animated GIF
    spr:saveCopyAs(out_dir .. name .. '.gif')
    spr:close()
end
""")

    # Embed data for each badge
    for name, frames in badges.items():
        lua_lines.append(f"local data_{name} = {{")
        for f in frames:
            lua_lines.append("  {")
            for row in f:
                row_str = "{" + ",".join(
                    f"{{{p[0]},{p[1]},{p[2]},{p[3]}}}" if p else "nil"
                    for p in row
                ) + "},"
                lua_lines.append("    " + row_str)
            lua_lines.append("  },")
        lua_lines.append("}")
        lua_lines.append(f"createBadgeSprite('{name}', data_{name})")
        lua_lines.append(f"print('Generated {name}.aseprite and {name}.gif')")
        lua_lines.append("")

    # Now create Master Combined Sprite with all 5 badges and tags
    lua_lines.append("""
-- Create Master Combined Sprite
local masterSpr = Sprite(32, 32)
local masterLayer = masterSpr.layers[1]
masterLayer.name = "Badges"

local badgeNames = {'react', 'nextjs', 'typescript', 'ai', 'terminal'}
local badgeDatasets = {data_react, data_nextjs, data_typescript, data_ai, data_terminal}

local currentFrame = 1
for bIdx, bName in ipairs(badgeNames) do
    local bData = badgeDatasets[bIdx]
    for fIdx, grid in ipairs(bData) do
        if currentFrame > 1 then
            masterSpr:newEmptyFrame()
        end
        masterSpr.frames[currentFrame].duration = 0.15
        
        local img = Image(32, 32)
        for y = 0, 31 do
            for x = 0, 31 do
                local pixel = grid[y + 1][x + 1]
                if pixel then
                    img:drawPixel(x, y, Color{r=pixel[1], g=pixel[2], b=pixel[3], a=pixel[4]})
                end
            end
        end
        masterSpr:newCel(masterLayer, currentFrame, img)
        currentFrame = currentFrame + 1
    end
end

-- Create precise tags for each 4-frame animation loop
local t_react = masterSpr:newTag(1, 4)
t_react.name = 'react'
local t_next = masterSpr:newTag(5, 8)
t_next.name = 'nextjs'
local t_ts = masterSpr:newTag(9, 12)
t_ts.name = 'typescript'
local t_ai = masterSpr:newTag(13, 16)
t_ai.name = 'ai'
local t_term = masterSpr:newTag(17, 20)
t_term.name = 'terminal'

masterSpr:saveCopyAs(out_dir .. 'developer_badges.aseprite')
masterSpr:saveCopyAs(out_dir .. 'developer_badges.gif')
masterSpr:close()
print('Generated master developer_badges.aseprite and developer_badges.gif')
app.command.Exit()
""")

    script_path = "c:/projects/SGK18_Portfolio/scripts/generate_badges.lua"
    os.makedirs("c:/projects/SGK18_Portfolio/scripts", exist_ok=True)
    with open(script_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lua_lines))

    print(f"Lua script written to {script_path}")

if __name__ == "__main__":
    build_aseprite_lua()
