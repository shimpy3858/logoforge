"""Seeks every CSS animation to fixed times and screenshots it. Usage: python3 scripts/shoot_intros.py <html_dir> <out_dir> <WxH> <ids,comma> <t1,t2,..>"""
import sys, os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
src, out, size, ids, times = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4].split(","), [float(t) for t in sys.argv[5].split(",")]
W, H = [int(x) for x in size.split("x")]
os.makedirs(out, exist_ok=True)
SEEK = "t => { document.getAnimations().forEach(a => { a.pause(); try { a.currentTime = t; } catch(e){} }); }"
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": W, "height": H})
    errs = []
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errs.append(str(e)))
    for i in ids:
        pg.goto(f"file://{src}/{i}.html"); pg.wait_for_timeout(250)
        shots = []
        for t in times:
            pg.evaluate(SEEK, t * 1000); pg.wait_for_timeout(120)
            f = f"{out}/{i}_{t}.png"; pg.screenshot(path=f); shots.append(f)
        ims = [Image.open(s) for s in shots]
        sw = 640 if W >= H else 300; sh = int(sw * H / W)
        sheet = Image.new("RGB", (sw * len(ims) + 4 * (len(ims) - 1), sh), "#444")
        for k, im in enumerate(ims):
            im = im.resize((sw, sh)); ImageDraw.Draw(im).text((8, 6), f"{i} t={times[k]}s", fill="#ff0")
            sheet.paste(im, (k * (sw + 4), 0))
        sheet.save(f"{out}/sheet_{i}.png")
    print("console errors:", errs[:5])
    b.close()
