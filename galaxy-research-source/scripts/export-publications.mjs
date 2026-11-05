import {publications} from '../src/data/publications.js';
import {writeFileSync} from 'node:fs';
const cols=['year','type','authors','title','journal','doi','arxiv','verified'];
const escape=(v)=>'"'+String(v??'').replace(/"/g,'""')+'"';
writeFileSync('docs/PUBLICATION_REGISTER.csv',cols.join(',')+'\n'+publications.map(p=>cols.map(k=>escape(p[k])).join(',')).join('\n')+'\n');
console.log(`Exported ${publications.length} records to docs/PUBLICATION_REGISTER.csv`);
