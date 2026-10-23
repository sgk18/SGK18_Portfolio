import os
import subprocess
from PIL import Image

OUT_DIR = "c:/projects/SGK18_Portfolio/public/sprites"
os.makedirs(OUT_DIR, exist_ok=True)

def hex_to_rgba(hex_code, alpha=255):
    hex_code = hex_code.lstrip("#")
    r = int(hex_code[0:2], 16)
    g = int(hex_code[2:4], 16)
    b = int(hex_code[4:6], 16)
    return (r, g, b, alpha)

# Colors matching SGK18_Portfolio Neobrutalist palette exactly:
C_BLACK   = hex_to_rgba("#0A0A0A") # primary ink border
C_WHITE   = (255, 255, 255, 255)   # envelope body
C_SHADOW  = hex_to_rgba("#E5E7EB") # envelope inner shadow
C_RED     = hex_to_rgba("#E3000F") # signature crimson
C_RED_HI  = hex_to_rgba("#FF3845") # bright crimson highlight
C_GREEN   = hex_to_rgba("#10B981") # emerald delivery check
C_GREEN_HI= hex_to_rgba("#34D399") # bright emerald
C_GOLD    = hex_to_rgba("#F59E0B") # spark gold
C_GOLD_HI = hex_to_rgba("#FDE047") # bright spark
C_DARK    = hex_to_rgba("#27272A") # flap crease

def create_frame(frame_idx):
    # 48x48 canvas
    grid = {}
    
    # Hover offsets for frames:
    # 0: y_off=0, 1: y_off=-2, 2: y_off=-4, 3: y_off=-6, 4: y_off=-5, 5: y_off=-2
    y_offsets = [0, -2, -4, -6, -5, -2]
    yo = y_offsets[frame_idx]

    # Envelope base dimensions: 26 wide (x: 11..36), 18 tall (y: 20..37 + yo)
    bx1, bx2 = 11, 36
    by1, by2 = 20 + yo, 37 + yo

    # 1. Exhaust / Propulsion (frames 2, 3, 4, 5)
    if frame_idx in (2, 3, 4, 5):
        # Twin jet thrusters below envelope
        for tx in (15, 32):
            grid[(tx, by2 + 1)] = C_RED
            grid[(tx + 1, by2 + 1)] = C_RED
            thrust_len = 3 if frame_idx == 3 else 2
            for ty in range(by2 + 2, by2 + 2 + thrust_len):
                grid[(tx, ty)] = C_GOLD_HI if ty == by2 + 2 else C_GOLD
                grid[(tx + 1, ty)] = C_GOLD_HI if ty == by2 + 2 else C_GOLD

    # 2. Pixel Wings (frames 2, 3, 4, 5)
    if frame_idx >= 2:
        # Left wing
        wing_y = by1 + 4
        grid[(bx1 - 1, wing_y)] = C_BLACK
        grid[(bx1 - 2, wing_y - 1)] = C_BLACK
        grid[(bx1 - 3, wing_y - 2)] = C_BLACK
        grid[(bx1 - 4, wing_y - 3)] = C_RED
        grid[(bx1 - 5, wing_y - 4)] = C_RED_HI
        grid[(bx1 - 4, wing_y - 2)] = C_WHITE
        grid[(bx1 - 3, wing_y - 1)] = C_WHITE
        grid[(bx1 - 2, wing_y)] = C_BLACK
        grid[(bx1 - 1, wing_y + 1)] = C_BLACK

        # Right wing
        grid[(bx2 + 1, wing_y)] = C_BLACK
        grid[(bx2 + 2, wing_y - 1)] = C_BLACK
        grid[(bx2 + 3, wing_y - 2)] = C_BLACK
        grid[(bx2 + 4, wing_y - 3)] = C_RED
        grid[(bx2 + 5, wing_y - 4)] = C_RED_HI
        grid[(bx2 + 4, wing_y - 2)] = C_WHITE
        grid[(bx2 + 3, wing_y - 1)] = C_WHITE
        grid[(bx2 + 2, wing_y)] = C_BLACK
        grid[(bx2 + 1, wing_y + 1)] = C_BLACK

    # 3. Main Envelope Body (White with Neobrutalist Black Border)
    for y in range(by1, by2 + 1):
        for x in range(bx1, bx2 + 1):
            if x in (bx1, bx2) or y in (by1, by2):
                grid[(x, y)] = C_BLACK
            elif y >= by2 - 1 or x >= bx2 - 1:
                grid[(x, y)] = C_SHADOW
            else:
                grid[(x, y)] = C_WHITE

    # 4. Envelope Flap V-Fold
    mid_x = (bx1 + bx2) // 2 # 23
    for i in range(13):
        # Diagonal lines from corners (bx1, by1) and (bx2, by1) meeting at center
        lx, rx = bx1 + i, bx2 - i
        fy = by1 + (i * 8 // 12)
        if lx <= mid_x:
            grid[(lx, fy)] = C_DARK
            grid[(rx, fy)] = C_DARK

    # 5. Red Wax Seal / Center Emblem
    seal_y = by1 + 7
    seal_color = C_RED_HI if frame_idx in (1, 2) else C_RED
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            if abs(dx) + abs(dy) <= 3:
                grid[(mid_x + dx, seal_y + dy)] = seal_color
    grid[(mid_x, seal_y)] = C_WHITE # seal inner highlight

    # 6. Delivery Confirmation Checkmark (Frames 3, 4, 5)
    if frame_idx >= 3:
        # Green stamp badge above / on envelope
        chk_cx = mid_x
        chk_cy = by1 - 5 if frame_idx == 3 else by1 - 6
        # Emerald round stamp
        for dy in range(-3, 4):
            for dx in range(-3, 4):
                if abs(dx) + abs(dy) <= 4:
                    grid[(chk_cx + dx, chk_cy + dy)] = C_GREEN
        # White checkmark inside
        # (chk_cx - 1, chk_cy) -> (chk_cx, chk_cy + 1) -> (chk_cx + 2, chk_cy - 1)
        grid[(chk_cx - 2, chk_cy)] = C_WHITE
        grid[(chk_cx - 1, chk_cy + 1)] = C_WHITE
        grid[(chk_cx, chk_cy + 2)] = C_WHITE
        grid[(chk_cx + 1, chk_cy + 1)] = C_WHITE
        grid[(chk_cx + 2, chk_cy)] = C_WHITE
        grid[(chk_cx + 3, chk_cy - 1)] = C_WHITE

    # 7. Sparkle Particles around envelope (Frames 1, 3, 4, 5)
    if frame_idx == 1:
        grid[(bx1 - 3, by1 + 2)] = C_GOLD_HI
        grid[(bx2 + 3, by1 + 2)] = C_GOLD_HI
    elif frame_idx in (3, 4, 5):
        sparks = [
            (8, 12), (39, 10), (10, 38), (37, 39), (23, 4)
        ]
        for sx, sy in sparks:
            grid[(sx, sy)] = C_GOLD_HI
            grid[(sx - 1, sy)] = C_GOLD
            grid[(sx + 1, sy)] = C_GOLD
            grid[(sx, sy - 1)] = C_GOLD
            grid[(sx, sy + 1)] = C_GOLD

    # Convert grid to PIL Image
    img = Image.new("RGBA", (48, 48), (0, 0, 0, 0))
    for (x, y), col in grid.items():
        if 0 <= x < 48 and 0 <= y < 48:
            img.putpixel((x, y), col)
    return img

def main():
    frames = [create_frame(i) for i in range(6)]
    
    # Save individual PNG frames
    for i, frame in enumerate(frames):
        frame.save(os.path.join(OUT_DIR, f"message_sent_f{i}.png"))
    
    # Save animated GIF directly with Pillow
    gif_path = os.path.join(OUT_DIR, "message_sent.gif")
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=150, # 150ms per frame
        loop=0,       # infinite loop
        disposal=2    # clear frame buffer
    )
    print(f"[OK] Generated {gif_path}")

    # Use Aseprite to compile master .aseprite native file
    ase_script_path = os.path.join("c:/projects/SGK18_Portfolio/scripts", "generate_contact_sprite.lua")
    lua_code = f"""
local spr = Sprite(48, 48)
local layer = spr.layers[1]
layer.name = "DeliveryAnimation"

for f = 1, 6 do
    if f > 1 then
        spr:newEmptyFrame()
    end
    spr.frames[f].duration = 0.15
    local img = Image{48, 48}
    -- load frame png
    local framePng = Image{48, 48}
    framePng = Image:createFromFile("c:/projects/SGK18_Portfolio/public/sprites/message_sent_f" .. (f - 1) .. ".png")
    spr:newCel(layer, f, framePng)
end

local tag = spr:newTag(1, 6)
tag.name = "sent_delivery"
tag.color = Color{{r=227, g=0, b=15, a=255}}

spr:saveCopyAs("c:/projects/SGK18_Portfolio/public/sprites/message_sent.aseprite")
spr:close()
print("Saved message_sent.aseprite successfully!")
app.command.Exit()
"""
    with open(ase_script_path, "w", encoding="utf-8") as f:
        f.write(lua_code)

    res = subprocess.run(f'aseprite -b --script "{ase_script_path}"', shell=True)
    if res.returncode == 0:
        print("[OK] Compiled message_sent.aseprite with Aseprite CLI!")

if __name__ == "__main__":
    main()
