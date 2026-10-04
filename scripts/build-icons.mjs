import fs from 'node:fs';

// MX ICON LANGUAGE v0.1 / UPLINK TERMINAL
// Generates icons/files/*.svg, icons/folders/*.svg, the icon theme JSON and
// the review sheet. The generated files are committed; VS Code never runs this.

const CYAN = '#4CC9F0', VIOLET = '#A78BFA', BLUE = '#58A6FF', AMBER = '#FFD166', ORANGE = '#FFB454';
const TEAL = '#2DD4BF', MAGENTA = '#FF4FD8', GRAY = '#93A9B7', LIGHT = '#E6EDF3';

// ---------------------------------------------------------------- file icons
// Every file icon is the same document frame plus a glyph: [color, path, extra nodes].
// Path glyphs avoid font dependencies at Explorer's native 16px size.
const frame = 'M3 1.5H10L13 4.5V14.5H3Z M10 1.5V4.5H13';

const fileTypes = {
  file: [GRAY, 'M5.5 7H10.5 M5.5 9.5H10.5 M5.5 12H9'],
  text: [LIGHT, 'M5 7.5H11 M8 7.5V12'],
  markdown: [CYAN, 'M4.5 11.5V7.5L6 9.5L7.5 7.5V11.5 M10.25 7.5V11.5 M9 10L10.25 11.5L11.5 10'],
  json: [AMBER, 'M6.5 6.5H5.5V8.5L4.5 9.5L5.5 10.5V12.5H6.5 M9.5 6.5H10.5V8.5L11.5 9.5L10.5 10.5V12.5H9.5'],
  yaml: ['#FF6B9A', 'M5 7.5H6 M7.5 7.5H11 M5 9.5H6 M7.5 9.5H11 M5 11.5H6 M7.5 11.5H10'],
  xml: [AMBER, 'M6 7.5L4.5 9.5L6 11.5 M10 7.5L11.5 9.5L10 11.5 M8.75 7.5L7.25 11.5'],
  env: [TEAL, 'M5 7V12 M8 7V12 M11 7V12 M4 8.5H6 M7 10.5H9 M10 8.5H12'],
  config: [TEAL, 'M6 7.5H4.5V11.5H6 M10 7.5H11.5V11.5H10 M7.5 9.5H8.5'],
  lock: [GRAY, 'M5.5 9.5H10.5V12.5H5.5Z M6.5 9.5V7.5H9.5V9.5'],
  log: [GRAY, 'M5 7V12 M7 7.5H11 M7 9.5H9.5 M7 11.5H11'],
  archive: [AMBER, 'M7 6.5H8 M8 8.5H9 M7 10.5H8 M8 12.5H9'],
  image: [VIOLET, 'M4.5 12L7 9L9 11L10 10L11.5 12Z', '<rect x="9.5" y="6.5" width="1" height="1"/>'],
  svg: [ORANGE, 'M6 11L10 8', '<rect x="4.5" y="10.5" width="1.5" height="1.5"/><rect x="9.5" y="6.5" width="1.5" height="1.5"/>'],
  pdf: [MAGENTA, 'M4.5 11.5V7.5H6V9.5H4.5 M7.5 7.5V11.5H8.5L9.5 10.5V8.5L8.5 7.5Z M11 11.5V7.5H12 M11 9.5H12'],
  csv: [AMBER, 'M5 7H11V12H5Z M5 9.5H11 M8 7V12'],
};

const languages = {
  php: [VIOLET, 'M4.5 11.5V7.5H6V9.5H4.5 M7.5 7.5V11.5 M9.5 7.5V11.5 M7.5 9.5H9.5 M11 11.5V7.5H12V9.5H11'],
  python: [AMBER, 'M4.5 11.5V7.5H7.5V9.5H4.5 M9 7.5V9.5H11.5V7.5 M10.25 9.5V11.5'],
  csharp: [VIOLET, 'M6.5 7.5H4.5V11.5H6.5 M9 7.5V11.5 M11 7.5V11.5 M8.5 8.5H11.5 M8.5 10.5H11.5'],
  java: [ORANGE, 'M5 7.5H7.5V11.5H4.5V10.5 M9 7.5L10.25 11.5L11.5 7.5'],
  kotlin: [MAGENTA, 'M4.5 7.5V11.5 M7 7.5L4.5 9.5L7 11.5 M9 7.5H11.5 M10.25 7.5V11.5'],
  javascript: [AMBER, 'M5 7.5H7.5V11.5H4.5V10.5 M11.5 7.5H9V9.5H11.5V11.5H9'],
  typescript: [BLUE, 'M4.5 7.5H7.5 M6 7.5V11.5 M11.5 7.5H9V9.5H11.5V11.5H9'],
  html: [ORANGE, 'M6.5 7.5L4.5 9.5L6.5 11.5 M9.5 7.5L11.5 9.5L9.5 11.5'],
  css: [CYAN, 'M5 7H11L10.5 11.5L8 12.5L5.5 11.5 M6 9H10.5'],
  scss: [MAGENTA, 'M5 7H11L10.5 11.5L8 12.5L5.5 11.5Z M8 8.5V10.5'],
  dart: [BLUE, 'M4.5 7.5V11.5H6.5L7.5 10.5V8.5L6.5 7.5Z M9 7.5H11.5 M10.25 7.5V11.5'],
  rust: [ORANGE, 'M4.5 11.5V7.5H7.5V9.5H4.5 M6 9.5L7.5 11.5 M11.5 7.5H9V9.5H11.5V11.5H9'],
  sql: [AMBER, 'M6 7.5H4.5V9.5H6V11.5H4.5 M7.5 7.5H9.5V11.5H7.5Z M8.5 10.5L9.5 12 M11 7.5V11.5H12'],
  shell: ['#7BE7FF', 'M5 7.5L7.5 9.5L5 11.5 M8.5 11.5H11.5'],
  powershell: [BLUE, 'M4.5 11.5V7.5H7.5V9.5H4.5 M11.5 7.5H9V9.5H11.5V11.5H9'],
};

// Framework file types (own extension) and tool / manifest / infrastructure files.
const specialFiles = {
  blade: [VIOLET, 'M5.5 12L9.5 7H11L7 12Z'],
  vue: [TEAL, 'M4.5 7.5L8 12.5L11.5 7.5 M6.5 7.5L8 9.5L9.5 7.5'],
  svelte: [ORANGE, 'M11 7H5.5V9.5H10.5V12H5'],
  // Framework identities: only for the file that is the framework's own entry point / config.
  django: [TEAL, 'M4.5 7.5V11.5H6.5L7.5 10.5V8.5L6.5 7.5Z M9.5 7.5H11.5V11.5H9V10.5'],
  // Logos need the whole 16px to stay recognisable, so these two drop the document frame (4th value).
  // Laravel: outline of the isometric mark. Angular: the four solid pieces whose gaps form the A.
  laravel: [MAGENTA, 'M1 2.5L3.5 1.25L6 2.5V8.5L9 7V4L12 2.5L15 4V7L12 8.5V11.5L6 14.5L1 12Z M1 2.5L3.5 3.75L6 2.5 M3.5 3.75V10.25L6 11.5L12 8.5 M6 11.5V14.5 M9 4L12 5.5L15 4 M12 5.5V8.5', '', true],
  angular: [VIOLET, '', '<path fill="' + VIOLET + '" stroke="none" d="M1.5 3.5L2 11L6.5 1Z M14.5 3.5L14 11L9.5 1Z M8 4.5L10 9H6Z M5.5 11.5H10.5L11.5 13L8 15L4.5 13Z"/>', true],
  docker: [CYAN, 'M4.5 9.5H11.5V12.5H4.5Z M8 9.5V12.5 M4.5 9.5V7H8V9.5'],
  'docker-compose': [CYAN, 'M4.5 7H7.5V9H4.5Z M8.5 10.5H11.5V12.5H8.5Z M7.5 8H10V10.5'],
  nginx: [TEAL, 'M5.5 12V7L10.5 12V7'],
  git: [ORANGE, 'M6 7.5V11.5 M6 9.5H10V7.5', '<rect x="5" y="6.5" width="2" height="2"/><rect x="5" y="10.5" width="2" height="2"/><rect x="9" y="6.5" width="2" height="2"/>'],
  github: [LIGHT, 'M7.5 8L9.5 9.5L7.5 11Z', '<circle cx="8" cy="9.5" r="3"/>'],
  npm: [MAGENTA, 'M5 7.5H11V12H5Z M7 12V9.5H9V12'],
  composer: [VIOLET, 'M5 8L8 6.5L11 8V11L8 12.5L5 11Z M5 8L8 9.5L11 8 M8 9.5V12.5'],
  cargo: [ORANGE, 'M5 7.5H11V12H5Z M5 7.5L11 12'],
  aws: [ORANGE, 'M5 12H11V9.5H9.5V7.5H6.5V9.5H5Z'],
  database: [AMBER, 'M5 8L6 7H10L11 8L10 9H6Z M5 8V11.5L6 12.5H10L11 11.5V8'],
  migration: [AMBER, 'M5 10.5H11V12.5H5Z M8 9V6.5 M6.5 8L8 6.5L9.5 8'],
  test: [MAGENTA, 'M5 9.5L7 11.5L11 7.5'],
};

const fileIcons = { ...fileTypes, ...languages, ...specialFiles };

// -------------------------------------------------------------- folder icons
// Every folder is the generic folder outline plus a role glyph drawn in a
// 6 x 3 box (local coordinates), placed inside the body / the open flap.
const folderClosed = 'M1.5 13.5V3H6L8 5H14.5V13.5Z';
const folderOpen = 'M1.5 12.5V3H6L8 5H13V7 M1.5 13.5L4 7.5H14.5L12 13.5Z';
const glyphAtClosed = 'translate(5 7.5)';
const glyphAtOpen = 'translate(5 9)';

const folderGlyphs = {
  src: [LIGHT, 'M0 0L2 1.5L0 3 M3.5 3H6'],
  app: [BLUE, 'M0 0H6V3H0Z M0 1H6'],
  config: [TEAL, 'M1 0V3 M5 0V3 M0 1H2 M4 2H6'],
  database: [AMBER, 'M0.5 0H5.5 M0.5 3H5.5'],
  migrations: [AMBER, 'M0 1.5H3.5 M2.5 0L4 1.5L2.5 3 M6 0V3'],
  models: [VIOLET, 'M0 0H2.5V3H0Z M4 0H6 M4 3H6'],
  entities: [VIOLET, 'M3 0L6 1.5L3 3L0 1.5Z'],
  controllers: [BLUE, 'M1.5 0L0 1.5L1.5 3 M4.5 0L6 1.5L4.5 3 M3 0V3'],
  services: [TEAL, 'M0 0.5H2V2.5H0Z M4 0.5H6V2.5H4Z M2 1.5H4'],
  repositories: [AMBER, 'M0 0H6V3H0Z M2 0V3'],
  api: [BLUE, 'M1.5 0H0V3H1.5 M4.5 0H6V3H4.5 M2.5 1.5H3.5'],
  routes: [ORANGE, 'M0 1.5H2 M2 1.5L4 0H6 M2 1.5L4 3H6'],
  middleware: [MAGENTA, 'M0 1.5H1.5 M4.5 1.5H6 M1.5 0V3 M4.5 0V3'],
  components: [BLUE, 'M0 0H3V3H0Z M4.5 1.5H6V3H4.5Z'],
  pages: [ORANGE, 'M0.5 0H4L5.5 1.5V3H0.5Z'],
  views: [ORANGE, 'M0 1.5L2 0H4L6 1.5L4 3H2Z M2.5 1.5H3.5'],
  templates: [ORANGE, 'M0 1V0H1.5 M4.5 0H6V1 M6 2V3H4.5 M1.5 3H0V2'],
  assets: [VIOLET, 'M0 0H6V3H0Z M0 0L6 3'],
  images: [VIOLET, 'M0 3L2 0L3.5 2L4.5 1L6 3Z'],
  styles: [MAGENTA, 'M2 0V3 M4 0V3 M0.5 0.5H5.5 M0.5 2.5H5.5'],
  scripts: [AMBER, 'M0.5 0L2 1.5L0.5 3 M3.5 0L5 1.5L3.5 3'],
  public: [TEAL, 'M3 3V1.5 M3 1.5L1 0 M3 1.5L5 0'],
  static: [GRAY, 'M0 1.5H6 M0 0V3 M6 0V3'],
  storage: [AMBER, 'M0 0H6V3H0Z M4 1.5H4.5'],
  uploads: [TEAL, 'M3 3V0 M1.5 1.5L3 0L4.5 1.5 M0 3H1 M5 3H6'],
  tests: [MAGENTA, 'M0.5 1.5L2 3L5.5 0'],
  docs: [LIGHT, 'M0 0H6 M0 3H3.5'],
  github: [LIGHT, 'M0.5 0V3 M0.5 1.5H5.5V0'],
  vscode: [BLUE, 'M5 0V3L0.5 1.5Z'],
  idea: [MAGENTA, 'M0.5 0V3 M3 0H5.5V3H2.5V2'],
  'node-modules': [GRAY, 'M1.5 0H4.5L6 1.5L4.5 3H1.5L0 1.5Z'],
  vendor: [GRAY, 'M0 0H6V3H0Z M2.5 0V1.5H3.5V0'],
  dist: [GRAY, 'M0 0H2.5V3H0Z M3.5 1.5H6 M4.5 0L6 1.5L4.5 3'],
  build: [GRAY, 'M0.5 3V2 M3 3V1 M5.5 3V0'],
  bin: [GRAY, 'M0.5 0H2.5V3H0.5Z M5 0V3'],
  docker: [LIGHT, 'M0 1.5H6V3H0Z M3 0H6V1.5 M3 0V3'],
  infra: [TEAL, 'M3 0V1.5 M0.5 3V1.5H5.5V3'],
  deploy: [MAGENTA, 'M3 0L5.5 3H0.5Z'],
  mobile: [LIGHT, 'M2 0H4V3H2Z'],
  web: [ORANGE, 'M0 1.5H0.5 M5.5 1.5H6', '<circle cx="3" cy="1.5" r="1.5"/>'],
  desktop: [LIGHT, 'M0 0H6V2H0Z M3 2V3 M1.5 3H4.5'],
  android: [TEAL, 'M0.5 3V1.5L2 0H4L5.5 1.5V3Z'],
  ios: [LIGHT, 'M1 0.5L1.5 0H4.5L5 0.5V2.5L4.5 3H1.5L1 2.5Z'],
  linux: [AMBER, 'M0 2L1.5 0.5L4.5 2.5L6 1'],
  windows: [BLUE, 'M0 0H2.5V3H0Z M3.5 0H6V3H3.5Z'],
};

// ------------------------------------------------------------------ mappings
// Icons follow the file type. A file name only overrides its extension when the
// file itself is the manifest / config of a tool. Keys are lower case because
// VS Code matches names case-insensitively.
const fileExtensions = {
  php: ['php'],
  python: ['py', 'pyi', 'pyw'],
  csharp: ['cs', 'csproj', 'sln'],
  java: ['java'],
  kotlin: ['kt', 'kts'],
  javascript: ['js', 'mjs', 'cjs', 'jsx'],
  typescript: ['ts', 'mts', 'cts', 'tsx'],
  html: ['html', 'htm'],
  css: ['css'],
  scss: ['scss', 'sass'],
  dart: ['dart'],
  rust: ['rs'],
  sql: ['sql'],
  shell: ['sh', 'bash', 'zsh', 'fish'],
  powershell: ['ps1', 'psm1', 'psd1'],
  json: ['json', 'jsonc', 'json5'],
  yaml: ['yaml', 'yml'],
  xml: ['xml'],
  markdown: ['md', 'markdown'],
  text: ['txt'],
  csv: ['csv', 'tsv'],
  log: ['log'],
  svg: ['svg'],
  image: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'ico'],
  pdf: ['pdf'],
  archive: ['zip', 'tar', 'gz', 'tgz', '7z', 'rar'],
  config: ['toml', 'ini', 'conf', 'cfg', 'gradle'],
  lock: ['lock'],
  env: ['env'],
  database: ['db', 'sqlite', 'sqlite3'],
  docker: ['dockerfile'],
  blade: ['blade.php'],
  vue: ['vue'],
  svelte: ['svelte'],
  // "folder/ext" matches that extension directly inside that folder.
  github: ['workflows/yml', 'workflows/yaml'],
};

const fileNames = {
  env: ['.env', '.env.example', '.env.local', '.env.production', '.env.development', '.env.testing'],
  git: ['.gitignore', '.gitattributes', '.gitmodules', '.gitkeep'],
  markdown: ['readme', 'readme.md', 'changelog.md'],
  text: ['license', 'license.md', 'license.txt'],
  shell: ['.bashrc', '.bash_profile', '.bash_aliases', '.zshrc', '.profile'],
  config: ['.editorconfig'],
  lock: ['pnpm-lock.yaml'],
  npm: ['package.json', 'package-lock.json', '.npmrc'],
  composer: ['composer.json', 'composer.lock'],
  cargo: ['cargo.toml', 'cargo.lock'],
  python: ['requirements.txt', 'pyproject.toml'],
  django: ['manage.py'],
  laravel: ['artisan'],
  angular: ['angular.json'],
  java: ['pom.xml'],
  typescript: ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.spec.json', 'tsconfig.node.json', 'tsconfig.build.json'],
  javascript: ['jsconfig.json'],
  dart: ['pubspec.yaml', 'pubspec.lock'],
  docker: ['dockerfile', '.dockerignore'],
  'docker-compose': ['docker-compose.yml', 'docker-compose.yaml', 'compose.yml', 'compose.yaml', 'docker-compose.override.yml'],
  nginx: ['nginx.conf'],
  github: ['codeowners', 'dependabot.yml'],
  aws: ['buildspec.yml', 'buildspec.yaml', 'samconfig.toml', 'cdk.json'],
  migration: ['alembic.ini', 'flyway.conf', 'liquibase.properties'],
  test: ['phpunit.xml', 'phpunit.xml.dist', 'pytest.ini', 'jest.config.js', 'jest.config.ts', 'vitest.config.js', 'vitest.config.ts', 'karma.conf.js', 'playwright.config.ts', 'cypress.config.ts'],
};

const folderNames = {
  src: ['src', 'source'],
  app: ['app', 'apps'],
  config: ['config', 'configs', 'configuration'],
  database: ['db', 'database', 'databases'],
  migrations: ['migration', 'migrations'],
  models: ['model', 'models'],
  entities: ['entity', 'entities'],
  controllers: ['controller', 'controllers'],
  services: ['service', 'services'],
  repositories: ['repository', 'repositories', 'repo', 'repos'],
  api: ['api', 'apis'],
  routes: ['route', 'routes'],
  middleware: ['middleware', 'middlewares'],
  components: ['component', 'components'],
  pages: ['page', 'pages'],
  views: ['view', 'views'],
  templates: ['template', 'templates'],
  assets: ['asset', 'assets'],
  images: ['image', 'images', 'img'],
  styles: ['style', 'styles', 'css', 'scss'],
  scripts: ['script', 'scripts'],
  public: ['public'],
  static: ['static'],
  storage: ['storage'],
  uploads: ['upload', 'uploads'],
  tests: ['test', 'tests', 'spec', 'specs', '__tests__'],
  docs: ['doc', 'docs', 'documentation'],
  github: ['.github'],
  vscode: ['.vscode'],
  idea: ['.idea'],
  'node-modules': ['node_modules'],
  vendor: ['vendor'],
  dist: ['dist', 'output', 'out'],
  build: ['build', 'builds'],
  bin: ['bin'],
  docker: ['docker'],
  infra: ['infra', 'infrastructure'],
  deploy: ['deploy', 'deployment', 'deployments'],
  mobile: ['mobile'],
  web: ['web'],
  desktop: ['desktop'],
  android: ['android'],
  ios: ['ios'],
  linux: ['linux'],
  windows: ['windows'],
};

// --------------------------------------------------------------- SVG writers
function svg(color, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="${color}" stroke-width="1.25" stroke-linejoin="miter" stroke-linecap="square">${body}</svg>\n`;
}

function createFileIcon([color, glyph, nodes = '', frameless = false]) {
  const d = frameless ? glyph : `${frame} ${glyph}`;
  return svg(color, (d ? `<path d="${d}"/>` : '') + nodes);
}

function createFolderIcon(outline, glyphAt, [color, glyph, nodes = ''] = []) {
  const role = glyph ? `<g transform="${glyphAt}" stroke="${color}"><path d="${glyph}"/>${nodes}</g>` : '';
  return svg(CYAN, `<path d="${outline}"/>${role}`);
}

const svgs = {};
for (const [name, icon] of Object.entries(fileIcons)) svgs[`files/${name}`] = createFileIcon(icon);
svgs['folders/folder'] = createFolderIcon(folderClosed);
svgs['folders/folder-open'] = createFolderIcon(folderOpen);
for (const [name, glyph] of Object.entries(folderGlyphs)) {
  svgs[`folders/folder-${name}`] = createFolderIcon(folderClosed, glyphAtClosed, glyph);
  svgs[`folders/folder-${name}-open`] = createFolderIcon(folderOpen, glyphAtOpen, glyph);
}
fs.mkdirSync('icons/files', { recursive: true });
fs.mkdirSync('icons/folders', { recursive: true });
for (const [name, source] of Object.entries(svgs)) fs.writeFileSync(`icons/${name}.svg`, source);

// ---------------------------------------------------------------- theme JSON
// { icon: [key, ...] }  ->  { key: iconId }
function invert(groups, iconId = (icon) => icon) {
  const map = {};
  for (const [icon, keys] of Object.entries(groups)) {
    for (const key of keys) {
      if (map[key]) throw new Error(`Duplicate mapping: ${key}`);
      map[key] = iconId(icon);
    }
  }
  return map;
}

const iconDefinitions = {};
for (const name of Object.keys(svgs)) iconDefinitions[name.split('/')[1]] = { iconPath: `./${name}.svg` };

const theme = {
  iconDefinitions,
  showLanguageModeIcons: false,
  file: 'file',
  folder: 'folder',
  folderExpanded: 'folder-open',
  rootFolder: 'folder',
  rootFolderExpanded: 'folder-open',
  fileExtensions: invert(fileExtensions),
  fileNames: invert(fileNames),
  folderNames: invert(folderNames, (icon) => `folder-${icon}`),
  folderNamesExpanded: invert(folderNames, (icon) => `folder-${icon}-open`),
};
fs.writeFileSync('icons/mx-y2k-icon-theme.json', JSON.stringify(theme, null, 2) + '\n');

// -------------------------------------------------------------- review sheet
const WIDTH = 960, COLUMNS = 8, CELL_W = 116, CELL_H = 84, LEFT = 24;
let y = 80;
let sheet = '';

function place(name, x, top, size) {
  return svgs[name].trim().replace('<svg ', `<svg x="${x}" y="${top}" width="${size}" height="${size}" `);
}

function section(title, names, label) {
  sheet += `<text x="${LEFT}" y="${y}" fill="${CYAN}" font-size="13">${title}</text>`;
  sheet += `<path d="M${LEFT} ${y + 8}H${WIDTH - LEFT}" stroke="#1B2530"/>`;
  y += 28;
  names.forEach((name, i) => {
    const x = LEFT + (i % COLUMNS) * CELL_W, top = y + Math.floor(i / COLUMNS) * CELL_H;
    sheet += place(name, x, top, 48) + place(name, x + 60, top + 16, 16);
    sheet += `<text x="${x}" y="${top + 64}" fill="#C7D4DC" font-size="10">${label(name)}</text>`;
  });
  y += Math.ceil(names.length / COLUMNS) * CELL_H + 28;
}

const fileLabel = (name) => name.split('/')[1];
const folderLabel = (name) => name.split('/')[1].replace(/^folder-?/, '').replace(/-?open$/, '') || 'folder';
section('FILE TYPES', Object.keys(fileTypes).map((name) => `files/${name}`), fileLabel);
section('LANGUAGES', Object.keys(languages).map((name) => `files/${name}`), fileLabel);
section('SPECIAL FILES', Object.keys(specialFiles).map((name) => `files/${name}`), fileLabel);
section('FOLDERS', ['folders/folder', ...Object.keys(folderGlyphs).map((name) => `folders/folder-${name}`)], folderLabel);
section('OPEN FOLDERS', ['folders/folder-open', ...Object.keys(folderGlyphs).map((name) => `folders/folder-${name}-open`)], folderLabel);

// Explorer-like rows at the real size: [icon, label, indent].
const explorer = [
  ['folders/folder-github-open', '.github', 0], ['folders/folder-open', 'workflows', 1], ['files/github', 'ci.yml', 2],
  ['folders/folder-app-open', 'app', 0], ['folders/folder-controllers-open', 'Controllers', 1], ['files/php', 'UserController.php', 2],
  ['folders/folder-models', 'Models', 1], ['folders/folder-services', 'Services', 1], ['folders/folder-middleware', 'Middleware', 1],
  ['folders/folder-config', 'config', 0], ['folders/folder-database-open', 'database', 0], ['folders/folder-migrations', 'migrations', 1],
  ['files/database', 'database.sqlite', 1], ['files/sql', 'schema.sql', 1], ['folders/folder-public', 'public', 0],
  ['folders/folder-views-open', 'views', 0], ['files/blade', 'home.blade.php', 1], ['files/vue', 'App.vue', 1],
  ['folders/folder-src-open', 'src', 0], ['folders/folder-components', 'components', 1], ['folders/folder-api', 'api', 1],
  ['files/typescript', 'auth.service.ts', 1], ['files/javascript', 'index.js', 1], ['files/python', 'models.py', 1],
  ['files/csharp', 'Program.cs', 1], ['files/java', 'Main.java', 1], ['files/kotlin', 'Main.kt', 1],
  ['files/dart', 'main.dart', 1], ['files/rust', 'main.rs', 1], ['files/html', 'index.html', 1],
  ['files/css', 'site.css', 1], ['files/scss', 'theme.scss', 1], ['files/svelte', 'Nav.svelte', 1],
  ['folders/folder-tests', 'tests', 0], ['folders/folder-docs', 'docs', 0], ['folders/folder-node-modules', 'node_modules', 0],
  ['folders/folder-vendor', 'vendor', 0], ['folders/folder-dist', 'dist', 0], ['folders/folder', 'misc', 0],
  ['files/env', '.env', 0], ['files/git', '.gitignore', 0], ['files/docker', 'Dockerfile', 0],
  ['files/docker-compose', 'compose.yml', 0], ['files/nginx', 'nginx.conf', 0], ['files/npm', 'package.json', 0],
  ['files/composer', 'composer.json', 0], ['files/cargo', 'Cargo.toml', 0], ['files/test', 'phpunit.xml', 0],
  ['files/django', 'manage.py', 0], ['files/laravel', 'artisan', 0], ['files/angular', 'angular.json', 0],
  ['files/json', 'data.json', 0], ['files/yaml', 'settings.yml', 0], ['files/xml', 'feed.xml', 0],
  ['files/csv', 'export.csv', 0], ['files/config', 'app.ini', 0], ['files/lock', 'yarn.lock', 0],
  ['files/log', 'error.log', 0], ['files/markdown', 'README.md', 0], ['files/text', 'LICENSE', 0],
  ['files/pdf', 'manual.pdf', 0], ['files/image', 'logo.png', 0], ['files/svg', 'icon.svg', 0],
  ['files/archive', 'backup.zip', 0], ['files/shell', 'deploy.sh', 0], ['files/powershell', 'build.ps1', 0],
  ['files/file', 'unknown.bin', 0],
];
const ROWS = 17, ROW_H = 22, LIST_W = 228;
sheet += `<text x="${LEFT}" y="${y}" fill="${CYAN}" font-size="13">ACTUAL 16x16</text>`;
sheet += `<path d="M${LEFT} ${y + 8}H${WIDTH - LEFT}" stroke="#1B2530"/>`;
y += 24;
explorer.forEach(([name, label, indent], i) => {
  const x = LEFT + Math.floor(i / ROWS) * LIST_W + indent * 14, top = y + (i % ROWS) * ROW_H;
  sheet += place(name, x, top, 16) + `<text x="${x + 22}" y="${top + 12}" fill="#C7D4DC" font-size="12">${label}</text>`;
});
y += ROWS * ROW_H + 16;

fs.writeFileSync('concepts/uplink-icons-review.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${y}" viewBox="0 0 ${WIDTH} ${y}"><rect width="${WIDTH}" height="${y}" fill="#07090D"/><g font-family="monospace"><text x="${LEFT}" y="30" fill="${CYAN}" font-size="16">MX ICON LANGUAGE v0.1 / UPLINK TERMINAL</text><text x="${LEFT}" y="46" fill="${GRAY}" font-size="11">48px geometry + 16px native / ${Object.keys(fileIcons).length} file icons / ${Object.keys(svgs).length - Object.keys(fileIcons).length} folder icons</text>${sheet}</g></svg>\n`);

console.log(`${Object.keys(fileIcons).length} file icons, ${Object.keys(svgs).length - Object.keys(fileIcons).length} folder icons, ${Object.keys(theme.fileExtensions).length} extensions, ${Object.keys(theme.fileNames).length} file names, ${Object.keys(theme.folderNames).length} folder names`);
