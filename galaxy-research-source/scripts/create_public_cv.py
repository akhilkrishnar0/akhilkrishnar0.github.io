"""Create a public-facing CV from verified September 2026 source CV; excludes phone and referees."""
from pathlib import Path
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,KeepTogether
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib import colors
from reportlab.lib.units import inch
import re
p=Path(__file__).resolve().parents[1]/'public/documents/Akhil_Krishna_R_public_CV.pdf'
p.parent.mkdir(parents=True,exist_ok=True)
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='AKTitle',parent=styles['Title'],fontName='Helvetica-Bold',fontSize=19,leading=22,spaceAfter=7,textColor=colors.HexColor('#17202a'),alignment=TA_LEFT))
styles.add(ParagraphStyle(name='AKHead',parent=styles['Heading2'],fontName='Helvetica-Bold',fontSize=10.7,leading=13,spaceBefore=16,spaceAfter=7,textColor=colors.HexColor('#17202a')))
styles.add(ParagraphStyle(name='AKBody',parent=styles['BodyText'],fontName='Helvetica',fontSize=9.2,leading=13.5,spaceAfter=5))
styles.add(ParagraphStyle(name='AKSm',parent=styles['BodyText'],fontName='Helvetica',fontSize=8.1,leading=11.7,spaceAfter=4))
story=[]
def para(t,style='AKBody'):story.append(Paragraph(t,styles[style]))
def section(s):para(s,'AKHead')
para('Akhil Krishna R.','AKTitle')
para('Postdoctoral Fellow | Indian Institute of Astrophysics | Bengaluru, India','AKBody')
para('akhil.krishna@iiap.res.in | ORCID: 0000-0002-6096-3330 | github.com/akhilkrishnar0','AKSm')
section('Research interests')
para('Galaxy structure and evolution; polar-ring and low-surface-brightness galaxies; disc dynamics and stellar bars; multiwavelength observations; star formation; stellar populations; globular-cluster systems; modelling and numerical simulations.')
section('Appointments and education')
for x in [
'2025–present | Postdoctoral Fellow, Indian Institute of Astrophysics, Bengaluru.',
'2020–2025 | Ph.D. Physics, Christ University, Bengaluru. Thesis: Tracing the Evolution of Polar Ring Galaxies through Multi-wavelength Observations and Cosmological Simulations. Supervisor: Dr. Sreeja S. Kartha.',
'2019–2020 | Research Fellow, Christ University, Bengaluru. UV upturn in early-type galaxies.',
'2017–2019 | M.Sc. Physics, Christ University, Bengaluru. Thesis: UV Upturn in Early-Type Galaxies.',
'2014–2017 | B.Sc. Physics, Catholicate College, Mahatma Gandhi University, Kerala.'
]:para(x,'AKSm')
section('First-author refereed publications')
first=[
'2025 | Akhil, K. R., et al. Connecting the dots: Tracing the evolutionary pathway of polar ring galaxies in the cases of NGC 3718, NGC 2685, and NGC 4262. PASA 42, e056. doi:10.1017/pasa.2025.24.',
'2024 | Akhil, K. R., et al. Deciphering the properties of UV upturn galaxies in the Virgo cluster. MNRAS 534, 4063–4071. doi:10.1093/mnras/stae2382.',
'2024 | Akhil, K. R., Kartha, S. S., and Mathew, B. Beyond the rings: Polar ring galaxy NGC 4262 and its globular cluster system. MNRAS 530, 2907–2918. doi:10.1093/mnras/stae1061.',
'2024 | Akhil, K. R., et al. DES J024008.08−551047.5: A new member of the polar ring galaxy family. A&amp;A 681, A35. doi:10.1051/0004-6361/202347357.'
]
for x in first:para(x,'AKSm')
section('Selected co-authored refereed publications')
co=[
'2025 | Sruthi, K., et al. Probing the resolved K–S relation in nearby galaxies: Insights from UVIT and ALMA observations. PASA 42, e140. doi:10.1017/pasa.2025.10088.',
'2025 | Devaraj, A., et al. Non-linear solar EUV-driven sodium release from the lunar surface: A contrast to the linear PSD model. MNRAS 543, 1079–1091. doi:10.1093/mnras/staf1447.',
'2025 | Arun, R., et al. Polycyclic Aromatic Hydrocarbons in the Circumstellar Medium of Herbig Ae/Be Stars. RAA 25, 095004. doi:10.1088/1674-4527/ade65c.',
'2024 | Robin, T., et al. The Interaction Jigsaw: Investigating star formation in interacting galaxies. MNRAS 534, 1902–1912. doi:10.1093/mnras/stae2211.',
'2024 | Ujjwal, K., et al. Disentangling the association of PAH molecules with star formation: Insights from the James Webb Space Telescope and the UltraViolet Imaging Telescope. A&amp;A 684, A71. doi:10.1051/0004-6361/202347620.',
'2022 | Ezhikode, S. H., et al. Long-term Optical and Gamma-Ray Variability of the Blazar PKS 1222+216. ApJ 939, 76. doi:10.3847/1538-4357/ac9627.'
]
for x in co:para(x,'AKSm')
section('Selected conference presentations and activities')
para('2026: IIA In-House Symposium (talk); 44th Astronomical Society of India Meeting (talk). 2023: APRIM, Japan (talk); International NUVA e-Meeting (talk); 3rd Australia–ESO Galaxy Transformation Meeting (poster). 2022: ASI Meeting, IIT Roorkee (poster). 2020: ASI Meeting, IISER Tirupati (poster).','AKSm')
section('Teaching, observational programmes and service')
para('Mentored five M.Sc. students; taught introductory astronomy, Python programming and astronomy laboratory classes. Awarded telescope time: AstroSat/UVIT, 3.6-m Devasthal Optical Telescope (ADFOSC), ESO New Technology Telescope (EFOSC2). WALLABY collaboration member; Astronomical Society of India life member. Workshop resource person and conference organizing committee member.','AKSm')
para('Source: September 2026 academic CV; public edition prepared without phone number or referee contact details.','AKSm')
def foot(canvas,doc):
 canvas.setFont('Helvetica',7);canvas.setFillColor(colors.HexColor('#64707c'));canvas.drawRightString(7.65*inch,.47*inch,f'Public academic CV | {doc.page}')
doc=SimpleDocTemplate(str(p),pagesize=(8.27*inch,11.69*inch),rightMargin=.65*inch,leftMargin=.65*inch,topMargin=.65*inch,bottomMargin=.7*inch,metadata={'Title':'Akhil Krishna R — Public Academic CV','Author':'Akhil Krishna R'})
doc.build(story,onFirstPage=foot,onLaterPages=foot)
print(p,p.stat().st_size)
