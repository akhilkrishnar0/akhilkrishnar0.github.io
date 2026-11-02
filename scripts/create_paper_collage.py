#!/usr/bin/env python3
"""Assemble unchanged figure crops from the PDF preprints of four first-author papers."""
from pathlib import Path
import re, io, time
import requests, fitz
from PIL import Image, ImageOps, ImageDraw
OUT=Path("assets/img/research_figures"); OUT.mkdir(parents=True,exist_ok=True)
PAPERS=[
 ("2503.03709","pasa_evolution",1),
 ("2404.10059","mnras_globular",1),
 ("2308.15534","aa_ring_candidate",1),
 ("2410.17328","mnras_uv_upturn",3),
]
headers={"User-Agent":"Academic-website-figure-collage/1.0 (research visualization)"}
def pdf_download(arxiv_id):
  dst=OUT/(arxiv_id+".pdf")
  if dst.exists():return dst
  urls=[f"https://arxiv.org/pdf/{arxiv_id}",f"https://export.arxiv.org/pdf/{arxiv_id}",f"https://arxiv.org/pdf/{arxiv_id}.pdf"]
  for url in urls:
    try:
      resp=requests.get(url,headers=headers,timeout=100);resp.raise_for_status()
      if resp.content[:4]!=b"%PDF":raise ValueError("not a PDF")
      dst.write_bytes(resp.content)
      return dst
    except Exception as ex:print("Download attempt:",url,str(ex)[:180],flush=True);time.sleep(1)
  raise RuntimeError("PDF download failed: "+arxiv_id)
def extract(pdf_path, preferred):
  doc=fitz.open(pdf_path)
  candidates=[]
  for pno,page in enumerate(doc):
    if pno>13:break
    pw,ph=page.rect.width,page.rect.height
    # Capture the actual original image bounding box, preserving original axes and sub-panels.
    seen=set()
    for img in page.get_images(full=True):
      xref=img[0]
      for rect in page.get_image_rects(xref):
        key=(pno,round(rect.x0),round(rect.y0),round(rect.x1),round(rect.y1))
        if key in seen:continue
        seen.add(key)
        if rect.width<105 or rect.height<85:continue
        if rect.width>pw*.98 and rect.height>ph*.98:continue
        area=rect.width*rect.height
        if area<pw*ph*.075:continue
        # slight margin, but preserve actual figure content.
        clip=fitz.Rect(max(0,rect.x0-4),max(0,rect.y0-4),min(pw,rect.x1+4),min(ph,rect.y1+4))
        pix=page.get_pixmap(matrix=fitz.Matrix(2.3,2.3),clip=clip,alpha=False)
        im=Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
        candidates.append((im,area,pno,"image",rect))
    # Vector line charts and SED figures often have no image xref; crop above captions.
    blocks=page.get_text("blocks")
    for block in blocks:
      val=block[4].strip()
      m=re.match(r"^(?:Figure|Fig\.?)\s*(\d+)\s*[\.:]",val,re.I)
      if not m:continue
      no=int(m.group(1));top=float(block[1])
      if top<150:continue
      # Exclude running headers, and use the region immediately preceding caption.
      above=max(50,top-min(340,top-70))
      rect=fitz.Rect(35,above,pw-35,top-5)
      if rect.height<85:continue
      pix=page.get_pixmap(matrix=fitz.Matrix(2.1,2.1),clip=rect,alpha=False)
      im=Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
      candidates.append((im,rect.width*rect.height,pno,"figure"+str(no),rect))
  if not candidates:raise RuntimeError("No figures in "+str(pdf_path))
  # Save inspection sheet for scientific audit.
  thumbs=[]
  for idx,(im,area,page,kind,rect) in enumerate(candidates[:28]):
    t=ImageOps.contain(im,(340,245),Image.Resampling.LANCZOS)
    bg=Image.new("RGB",(370,280),"#eceef2")
    bg.paste(t,((370-t.width)//2,(250-t.height)//2))
    ImageDraw.Draw(bg).text((10,255),f"{idx} p{page+1} {kind}",fill="#111111")
    thumbs.append(bg)
  w=370*4;h=280*((len(thumbs)+3)//4)
  sheet=Image.new("RGB",(w,h),"white")
  for i,thumb in enumerate(thumbs):sheet.paste(thumb,((i%4)*370,(i//4)*280))
  sheet.save(OUT/(pdf_path.stem+"_candidates.jpg"),quality=88)
  # Preference: original image panel on a page which has the selected Figure caption.
  matched=[]
  for c in candidates:
    if c[3]=="figure"+str(preferred):
      matched.append(c)
  if matched:
    pageid=matched[0][2]
    image_candidates=[c for c in candidates if c[2]==pageid and c[3]=="image"]
    if image_candidates:
      winner=max(image_candidates,key=lambda c:c[1])
    else:
      winner=max(matched,key=lambda c:c[1])
  else:
    image_candidates=[c for c in candidates if c[3]=="image"]
    winner=max(image_candidates or candidates,key=lambda c:c[1])
  return winner
def main():
  selected=[]
  for arxiv_id,name,number in PAPERS:
    print("Working on",arxiv_id,name,flush=True)
    path=pdf_download(arxiv_id)
    im,area,page,kind,_=extract(path,number)
    im.save(OUT/(name+".png"),optimize=True)
    print("selected",name,page+1,kind,im.size,flush=True)
    selected.append((name,im))
  # 2x2 collage: actual figure crops only; no titles/captions/overlaid plots.
  W,H=2400,1580
  margin,gap=20,16
  cellw=(W-2*margin-gap)//2
  cellh=(H-2*margin-gap)//2
  canvas=Image.new("RGB",(W,H),"#05070b")
  for i,(name,im) in enumerate(selected):
    x=margin+(i%2)*(cellw+gap);y=margin+(i//2)*(cellh+gap)
    # No crop of data. Fit entire original panel, preserving axes.
    fitted=ImageOps.contain(im,(cellw,cellh),Image.Resampling.LANCZOS)
    paper=Image.new("RGB",(cellw,cellh),"#ffffff")
    paper.paste(fitted,((cellw-fitted.width)//2,(cellh-fitted.height)//2))
    canvas.paste(paper,(x,y))
  canvas.save(OUT/"original_paper_figures_collage.webp",format="WEBP",quality=94,method=6)
  canvas.save(OUT/"original_paper_figures_collage.png",optimize=True)
  print("Output:",OUT/"original_paper_figures_collage.webp")
if __name__=="__main__":main()
