import sys, os
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
out="/tmp/forge"; os.makedirs(out,exist_ok=True)
times=[0.6,1.2,1.3,2.0,2.9,3.6,4.3,5.0]
with sync_playwright() as p:
    b=p.chromium.launch()
    for name,(W,H) in {"desk":(1280,720),"mob":(390,844)}.items():
        pg=b.new_page(viewport={"width":W,"height":H})
        errs=[]; pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        pg.add_init_script("window.__FORGE_TEST=true")
        pg.goto("http://localhost:3100/"); pg.wait_for_function("typeof window.__forgeSeek==='function'",timeout=20000); pg.wait_for_timeout(800)
        ims=[]
        for t in times:
            pg.evaluate(f"window.__forgeSeek({t})"); pg.wait_for_timeout(60)
            f=f"{out}/{name}_{t}.png"; pg.screenshot(path=f); ims.append(Image.open(f))
        sw=480 if W>H else 200; sh=int(sw*H/W)
        cols=4; rows=2
        sheet=Image.new("RGB",(cols*(sw+4),rows*(sh+4)),"#333")
        for k,im in enumerate(ims):
            im=im.resize((sw,sh)); ImageDraw.Draw(im).text((6,4),f"t={times[k]}",fill="#ff0"); sheet.paste(im,((k%cols)*(sw+4),(k//cols)*(sh+4)))
        sheet.save(f"{out}/sheet_{name}.png"); print(name,"errors:",errs[:3])
    b.close()
