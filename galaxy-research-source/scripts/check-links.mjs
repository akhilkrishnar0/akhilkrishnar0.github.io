import assert from 'node:assert/strict';
import {publications} from '../src/data/publications.js';
import {projects} from '../src/data/projects.js';
import {themes} from '../src/data/themes.js';
import {images} from '../src/data/images.js';
import {url} from '../src/utils/path.js';
const unique=(items,label)=>assert.equal(new Set(items).size,items.length,`Duplicate ${label}`);
unique(publications.map(p=>p.id),'publication IDs');
unique(publications.filter(p=>p.doi).map(p=>p.doi),'DOIs');
unique(projects.map(p=>`${p.theme}/${p.slug}`),'project paths');
unique(themes.map(t=>t.slug),'themes');
for(const p of projects){assert(themes.some(t=>t.slug===p.theme),`Unknown theme: ${p.theme}`);for(const id of p.papers)assert(publications.some(pub=>pub.id===id),`Missing paper: ${id}`);for(const fig of p.figures)assert(images[fig.key],`Unknown figure: ${fig.key}`);}
for(const t of themes)if(t.image)assert(images[t.image],`Missing theme image ${t.image}`);
for(const [k,img] of Object.entries(images)){assert(img.src.startsWith('https://')||img.src.startsWith(url('')),`Unexpected URL for ${k}`);assert(img.credit&&img.source&&img.license,`Missing image rights metadata: ${k}`);}
console.log(`Data check OK: ${themes.length} themes, ${projects.length} projects, ${publications.length} publication/preprint records, ${Object.keys(images).length} source images.`);
