import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const { label, path: colorThemePath } of manifest.contributes.themes) {
  const colorTheme = JSON.parse(fs.readFileSync(colorThemePath, 'utf8'));
  assert.equal(colorTheme.type, 'dark');
  assert.ok(Object.keys(colorTheme.colors).length > 0, `No colors in ${label}`);
  assert.ok(colorTheme.tokenColors.length > 0, `No tokenColors in ${label}`);
  console.log(`OK color theme: ${colorThemePath}`);
}
const themePath = manifest.contributes.iconThemes[0].path;
const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
assert.equal(Object.keys(theme.iconDefinitions).length, 10);
for (const [id, definition] of Object.entries(theme.iconDefinitions)) {
  const svgPath = path.join(path.dirname(themePath), definition.iconPath);
  const svg = fs.readFileSync(svgPath, 'utf8');
  assert.match(svg, /viewBox="0 0 16 16"/);
  assert.match(svg, /stroke-width="1.25"/);
  assert.match(svg, /fill="none"/);
  assert.doesNotMatch(svg, /<(image|text|foreignObject)\b/);
  assert.doesNotMatch(svg, /(?:href=|url\()/);
  console.log(`OK ${id}: ${svgPath}`);
}
for (const key of ['file', 'folder', 'folderExpanded', 'rootFolder', 'rootFolderExpanded']) {
  assert.ok(theme.iconDefinitions[theme[key]], `Unknown ${key}`);
}
for (const mapping of [theme.fileExtensions, theme.fileNames]) {
  for (const id of Object.values(mapping)) assert.ok(theme.iconDefinitions[id]);
}
console.log('Manifest, theme JSON, references, and SVG design constraints passed.');
