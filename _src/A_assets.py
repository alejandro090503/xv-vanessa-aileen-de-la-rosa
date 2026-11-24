import numpy as np
from PIL import Image, ImageFilter, ImageDraw
R='C:/Users/aleja/xv-vanessa-aileen-de-la-rosa/'
INK='C:/Users/aleja/save-the-date-lekshmy-jaylin/ink-%s.jpg'
def hx(h): h=h.lstrip('#'); return np.array([int(h[i:i+2],16) for i in (0,2,4)],float)
# ---- 1. tintas (claro -> oscuro)
STOPS=[hx(c) for c in ('#fffcf8','#fff4e4','#ffddcf','#e6b3aa','#B76E79','#8a4552')]
METAL=hx('#cdbfbd')  # plata C0C0C0 con toque durazno
def gmap(L):
    t=(1-L/255.)*(len(STOPS)-1); i=np.clip(t.astype(int),0,len(STOPS)-2); f=(t-i)[...,None]
    S=np.array(STOPS); return S[i]*(1-f)+S[i+1]*f
for n in ('hero','top','oval','corner','footer'):
    im=Image.open(INK%n).convert('L').resize((520,932),Image.LANCZOS)
    L=np.asarray(im,float)
    g=gmap(L)
    bl=np.asarray(im.filter(ImageFilter.GaussianBlur(3)),float)
    vein=np.clip((bl-L)*6/255.,0,1)[...,None]
    rgb=g*(1-.85*vein)+METAL*.85*vein
    dark=np.clip((255-L)/255.,0,1)
    a=np.clip(dark*1.9,0,1)**.9
    a=np.maximum(a,vein[...,0]*.9)
    out=np.dstack([rgb,a*255]).clip(0,255).astype('uint8')
    # premultiplicado manda a transparente el color de las zonas claras
    Image.fromarray(out,'RGBA').save(R+'ink/%s.webp'%n,quality=62,alpha_quality=50,method=6)
# ---- 3. adornos
def fade(im,sides,F):
    a=np.asarray(im).astype(float); h,w=a.shape[:2]
    y,x=np.mgrid[0:h,0:w]; m=np.ones((h,w))
    d={'t':y,'b':h-1-y,'l':x,'r':w-1-x}
    for s in sides:
        t=np.clip(d[s]/F,0,1); m*=t*t*(3-2*t)
    a[...,3]*=m
    return Image.fromarray(a.astype('uint8'),'RGBA')
def blur(im,r):
    a=np.asarray(im).astype(float); al=a[...,3:]/255.
    p=np.dstack([a[...,:3]*al,a[...,3:]])
    ch=[np.asarray(Image.fromarray(p[...,i].clip(0,255).astype('uint8')).filter(ImageFilter.GaussianBlur(r)),float) for i in range(4)]
    p=np.dstack(ch); al=np.maximum(p[...,3:]/255.,1e-3)
    return Image.fromarray(np.dstack([(p[...,:3]/al).clip(0,255),p[...,3:]]).astype('uint8'),'RGBA')
CUT={'flora':'tblr','fauna':'blr','primavera':'b','corona':'l'}
for n in ('flora','fauna','primavera','castillo','rosas-ramo','corona','rueca','aurora'):
    im=Image.open(R+n+'.webp').convert('RGBA')
    if n in CUT: im=fade(im,CUT[n],max(10,int(min(im.size)*.09)))
    k=n.replace('rosas-ramo','rosas')
    im.save(R+'assets/ad-%s.webp'%k,quality=88,alpha_quality=95,method=6)
    blur(im,1.8).save(R+'assets/ad-%s-b.webp'%k,quality=80,alpha_quality=85,method=6)
# ---- 4. particulas: petalos
def petal(c0,c1,seed):
    S=4; W,H=96*S,128*S
    m=Image.new('L',(W,H),0); d=ImageDraw.Draw(m)
    L=[];Rr=[]
    for i in range(0,101):
        v=i/100; hw=.47*W*np.sin(np.pi*min(v**.8,1))**.85*(1-.12*v); cx=W/2+.07*W*np.sin(np.pi*v)
        yy=H*.04+v*H*.92
        L.append((cx-hw,yy)); Rr.append((cx+hw*.94,yy))
    pts=L+Rr[::-1]
    d.polygon(pts,fill=255)
    a=np.asarray(m,float)/255.
    y,x=np.mgrid[0:H,0:W]; t=(y/H)[...,None]
    col=hx(c0)*(1-t)+hx(c1)*t
    rng=np.random.RandomState(seed)
    vein=np.exp(-((x-W/2)/(W*.018))**2)[...,None]*.12*(1-t)
    col=col*(1-vein)+255*vein
    edge=np.asarray(m.filter(ImageFilter.GaussianBlur(5*S)),float)/255.
    col=col*(.80+.2*edge[...,None])
    im=Image.fromarray(np.dstack([col.clip(0,255),a*255]).astype('uint8'),'RGBA')
    return im.resize((96,128),Image.LANCZOS)
for i,(c0,c1) in enumerate((('#fff4e4','#ffddcf'),('#ffddcf','#e6aaa0'),('#F7E7CE','#d9a29a'))):
    p=petal(c0,c1,i); p.save(R+'assets/particula-%d.webp'%(i+1),quality=88,alpha_quality=90,method=6)
    blur(p,2).save(R+'assets/particula-%d-b.webp'%(i+1),quality=80,alpha_quality=85,method=6)
