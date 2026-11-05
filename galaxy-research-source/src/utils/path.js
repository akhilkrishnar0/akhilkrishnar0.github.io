export const base='/galaxy-research/';
export const url=(path='')=>base+String(path).replace(/^\/+/, '');
export const adsForDoi=(doi)=>`https://ui.adsabs.harvard.edu/search/q=${encodeURIComponent('doi:'+doi)}`;
