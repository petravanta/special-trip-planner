// Checks what the JSON Schemas can't: the index matches the files, ids are unique, and every reference points at something that exists.
// Run: node scripts/check-data.js            (the built-in templates)
//      node scripts/check-data.js file.json  (any template file, such as one you keep outside the repo)
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

const LISTS = ['phases', 'rules', 'meds', 'packing', 'food', 'contacts', 'logistics', 'daily', 'sources'];

function checkTemplate(t, where) {
  const anchors = new Map((t.anchors || []).map(a => [a.id, a]));
  if (anchors.size !== (t.anchors || []).length) fail(where, 'anchor ids repeat');
  const ids = {};
  for (const list of LISTS) {
    ids[list] = new Set();
    for (const item of t[list] || []) {
      if (ids[list].has(item.id)) fail(where, `${list} id "${item.id}" repeats`);
      ids[list].add(item.id);
    }
  }
  const anchorRef = (ref, at) => {
    const [id, edge] = ref.split(':');
    const a = anchors.get(id);
    if (!a) fail(where, `${at} names anchor "${id}", which doesn't exist`);
    else if (edge && a.kind !== 'range') fail(where, `${at} uses "${ref}", but anchor "${id}" is a single day`);
  };
  const when = (w, at) => {
    if (!w) return;
    if (w.phase) { if (!ids.phases.has(w.phase)) fail(where, `${at} names phase "${w.phase}", which doesn't exist`); return; }
    anchorRef(w.anchor, at);
    if (w.toAnchor) anchorRef(w.toAnchor, at);
  };
  const why = (y, at) => {
    for (const s of (y && y.sources) || []) if (!ids.sources.has(s)) fail(where, `${at} cites source "${s}", which isn't listed`);
  };
  for (const list of LISTS) {
    for (const item of t[list] || []) {
      const at = `${list}/${item.id}`;
      when(item.when, at);
      why(item.why, at);
      if (item.obtain && item.obtain.byWhen) anchorRef(item.obtain.byWhen.anchor, at);
      if (item.byWhen) anchorRef(item.byWhen.anchor, at);
      if (item.medId && !ids.meds.has(item.medId)) fail(where, `${at} names med "${item.medId}", which doesn't exist`);
      if (item.contactId && !ids.contacts.has(item.contactId)) fail(where, `${at} names contact "${item.contactId}", which doesn't exist`);
      for (const idea of item.ideas || []) if (idea.contactId && !ids.contacts.has(idea.contactId)) fail(where, `${at} idea "${idea.name}" names contact "${idea.contactId}", which doesn't exist`);
    }
  }
}

const files = process.argv.slice(2);
if (files.length) {
  for (const f of files) checkTemplate(JSON.parse(fs.readFileSync(f, 'utf8')), f);
} else {
  const index = JSON.parse(fs.readFileSync(path.join(root, 'data/templates.json'), 'utf8'));
  const dir = path.join(root, 'data/templates');
  const onDisk = fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5));
  for (const id of onDisk) if (!index.includes(id)) fail('data/templates.json', `data/templates/${id}.json isn't listed`);
  for (const id of index) {
    const file = path.join(dir, `${id}.json`);
    if (!fs.existsSync(file)) { fail('data/templates.json', `lists "${id}", but data/templates/${id}.json is missing`); continue; }
    const t = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (t.id !== id) fail(`data/templates/${id}.json`, `its id is "${t.id}", but the file name says "${id}"`);
    checkTemplate(t, `data/templates/${id}.json`);
  }
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Data checks passed.');
