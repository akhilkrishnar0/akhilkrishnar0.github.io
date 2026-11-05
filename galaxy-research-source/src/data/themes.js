export const themes=[
 {slug:'polar-ring-galaxies',title:'Polar Ring Galaxies',status:'Published research',intro:'How do external accretion and interactions produce orthogonal or strongly warped structures? Multiwavelength observations are used to compare stellar populations, star formation and the structure of host galaxies and rings.',image:'prg1'},
 {slug:'giant-low-surface-brightness-galaxies',title:'Giant Low Surface Brightness Galaxies',status:'Ongoing research',intro:'Extended, diffuse stellar discs provide a way to test star formation at low gas surface density. Current work examines UV emission, star-forming complexes and the growth of outer discs.',image:null},
 {slug:'galaxy-dynamics',title:'Galaxy Dynamics',status:'Ongoing research',intro:'Why do some disc galaxies develop bars while others remain unbarred? This work investigates disc stability, inner mass distributions, gas kinematics and targeted numerical models.',image:null},
 {slug:'stellar-populations',title:'Stellar Populations',status:'Published research',intro:'UV-to-optical spectral energy distributions, evolved stellar populations and globular clusters constrain the assembly histories of nearby galaxies.',image:'prg9'}
];
export const themeBySlug=(slug)=>themes.find(t=>t.slug===slug);
