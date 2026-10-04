import fs from 'node:fs';

// Path glyphs avoid font dependencies at Explorer's native 16px size.
const frame = 'M3 1.5H10L13 4.5V14.5H3Z M10 1.5V4.5H13';
const icons = {
  'folders/folder': ['#4CC9F0', 'M1.5 13.5V3H6L8 5H14.5V13.5Z'],
  'folders/folder-open': ['#4CC9F0', 'M1.5 12.5V3H6L8 5H13V7 M1.5 13.5L4 7.5H14.5L12 13.5Z'],
  'files/file': ['#93A9B7', frame + ' M5.5 7H10.5 M5.5 9.5H10.5 M5.5 12H9'],
  'files/php': ['#A78BFA', frame + ' M4.5 11.5V7.5H6V9.5H4.5 M7.5 7.5V11.5 M9.5 7.5V11.5 M7.5 9.5H9.5 M11 11.5V7.5H12V9.5H11'],
  'files/typescript': ['#58A6FF', frame + ' M4.5 7.5H7.5 M6 7.5V11.5 M11.5 7.5H9V9.5H11.5V11.5H9'],
  'files/json': ['#FFD166', frame + ' M6.5 6.5H5.5V8.5L4.5 9.5L5.5 10.5V12.5H6.5 M9.5 6.5H10.5V8.5L11.5 9.5L10.5 10.5V12.5H9.5'],
  'files/html': ['#FFB454', frame + ' M6.5 7.5L4.5 9.5L6.5 11.5 M9.5 7.5L11.5 9.5L9.5 11.5'],
  'files/css': ['#4CC9F0', frame + ' M5 7H11L10.5 11.5L8 12.5L5.5 11.5 M6 9H10.5'],
  'files/env': ['#2DD4BF', frame + ' M5 7V12 M8 7V12 M11 7V12 M4 8.5H6 M7 10.5H9 M10 8.5H12'],
  'files/git': ['#FFB454', frame + ' M6 7.5V11.5 M6 9.5H10V7.5', '<rect x="5" y="6.5" width="2" height="2"/><rect x="5" y="10.5" width="2" height="2"/><rect x="9" y="6.5" width="2" height="2"/>'],
};
for (const [name, [color, path, nodes = '']] of Object.entries(icons)) {
  fs.mkdirSync(`icons/${name.split('/')[0]}`, { recursive: true });
  fs.writeFileSync(`icons/${name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="${color}" stroke-width="1.25" stroke-linejoin="miter" stroke-linecap="square"><path d="${path}"/>${nodes}</svg>\n`);
}
const cells = Object.entries(icons).map(([name], i) => {
  const x = 24 + (i % 5) * 144, y = 70 + Math.floor(i / 5) * 160;
  const source = fs.readFileSync(`icons/${name}.svg`, 'utf8');
  const native = source.replace('<svg ', `<svg x="${x}" y="${y}" width="16" height="16" `);
  const large = source.replace('<svg ', `<svg x="${x + 40}" y="${y}" width="64" height="64" `);
  const mono = source.replace(/stroke="#[A-Fa-f0-9]+"/, 'stroke="#C7D4DC"').replace('<svg ', `<svg x="${x}" y="${y + 32}" width="16" height="16" `);
  return `${native}${large}${mono}<text x="${x}" y="${y + 92}" fill="#C7D4DC" font-size="12">${name.split('/')[1]}</text>`;
}).join('\n');
fs.writeFileSync('concepts/terminal-icons-review.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="744" height="410" viewBox="0 0 744 410"><rect width="744" height="410" fill="#07090D"/><g font-family="monospace"><text x="24" y="28" fill="#4CC9F0" font-size="16">MX ICON LANGUAGE v0.1 / TERMINAL</text><text x="24" y="48" fill="#93A9B7" font-size="12">16px color + monochrome / 64px geometry review</text>${cells}</g></svg>\n`);
