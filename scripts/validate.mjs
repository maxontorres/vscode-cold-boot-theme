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

// package.json contribution
assert.equal(manifest.contributes.iconThemes.length, 1);
const { id: themeId, path: themePath } = manifest.contributes.iconThemes[0];
assert.ok(themeId && themePath.startsWith('./'), 'Icon theme needs an id and a relative path');
const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
const themeDir = path.dirname(themePath);

// Minimal well-formedness check: every tag closes, in order, under one root.
function assertWellFormed(svg, file) {
  const stack = [];
  let roots = 0;
  for (const [, closing, name, selfClosing] of svg.matchAll(/<(\/?)([A-Za-z][\w:-]*)(?:\s+[\w:-]+="[^"<]*")*\s*(\/?)>/g)) {
    if (closing) assert.equal(stack.pop(), name, `Mismatched </${name}> in ${file}`);
    else {
      if (stack.length === 0) roots++;
      if (!selfClosing) stack.push(name);
    }
  }
  assert.equal(stack.length, 0, `Unclosed tag in ${file}`);
  assert.equal(roots, 1, `Expected one root element in ${file}`);
  assert.equal(svg.replace(/<[^<>]*>/g, '').trim(), '', `Stray text or malformed tag in ${file}`);
}

// SVG design constraints + references
const referenced = new Set();
for (const [id, definition] of Object.entries(theme.iconDefinitions)) {
  assert.ok(definition.iconPath.startsWith('./'), `Non-relative iconPath for ${id}`);
  const svgPath = path.join(themeDir, definition.iconPath);
  assert.ok(fs.existsSync(svgPath), `Missing SVG for ${id}: ${svgPath}`);
  referenced.add(path.normalize(svgPath));
  const svg = fs.readFileSync(svgPath, 'utf8');
  assertWellFormed(svg, svgPath);
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 16 16"/, `Bad root in ${svgPath}`);
  assert.match(svg, /stroke-width="1.25"/);
  assert.doesNotMatch(svg, /<(image|text|foreignObject|style|linearGradient|radialGradient|filter)\b/);
  assert.doesNotMatch(svg, /(?:href=|url\()/);
  // Transparent background: outline only, nothing filled, no full-size rect.
  const fills = [...svg.matchAll(/fill="([^"]*)"/g)].map((m) => m[1]);
  assert.equal(fills[0], 'none', `Root must be fill="none" in ${svgPath}`);
  // Only the frameless logo icons may contain solid pieces.
  if (!['angular'].includes(id)) assert.equal(fills.length, 1, `Filled shape in ${svgPath}`);
  assert.doesNotMatch(svg, /<rect[^>]*width="16"/, `Background rect in ${svgPath}`);
}
console.log(`OK ${referenced.size} icon definitions: SVG exists, well-formed, 16x16 viewBox, transparent`);

// Every generated SVG is referenced, and every folder has its open variant.
for (const dir of ['files', 'folders']) {
  for (const file of fs.readdirSync(path.join(themeDir, dir))) {
    assert.ok(referenced.has(path.normalize(path.join(themeDir, dir, file))), `Unreferenced file: ${dir}/${file}`);
  }
}
const ids = Object.keys(theme.iconDefinitions);
for (const id of ids.filter((id) => id.startsWith('folder') && !id.endsWith('-open'))) {
  assert.ok(theme.iconDefinitions[`${id}-open`], `Missing open variant for ${id}`);
}
const expectedFiles = ['file', 'text', 'markdown', 'json', 'yaml', 'xml', 'env', 'config', 'lock', 'log', 'archive', 'image', 'svg', 'pdf', 'csv',
  'php', 'python', 'csharp', 'java', 'kotlin', 'javascript', 'typescript', 'html', 'css', 'scss', 'dart', 'rust', 'sql', 'shell', 'powershell',
  'blade', 'vue', 'svelte', 'django', 'laravel', 'angular', 'docker', 'docker-compose', 'nginx', 'git', 'github', 'npm', 'composer', 'cargo', 'aws', 'database', 'migration', 'test'];
const expectedFolders = ['src', 'app', 'config', 'database', 'migrations', 'models', 'entities', 'controllers', 'services', 'repositories', 'api',
  'routes', 'middleware', 'components', 'pages', 'views', 'templates', 'assets', 'images', 'styles', 'scripts', 'public', 'static', 'storage',
  'uploads', 'tests', 'docs', 'github', 'vscode', 'idea', 'node-modules', 'vendor', 'dist', 'build', 'bin', 'docker', 'infra', 'deploy', 'mobile',
  'web', 'desktop', 'android', 'ios', 'linux', 'windows'];
for (const id of [...expectedFiles, 'folder', ...expectedFolders.map((name) => `folder-${name}`)]) {
  assert.ok(theme.iconDefinitions[id], `Expected icon is missing: ${id}`);
}
console.log(`OK expected icons: ${expectedFiles.length} file, ${(expectedFolders.length + 1) * 2} folder`);

// Mapping targets
for (const key of ['file', 'folder', 'folderExpanded', 'rootFolder', 'rootFolderExpanded']) {
  assert.ok(theme.iconDefinitions[theme[key]], `Unknown ${key}`);
}
for (const section of ['fileExtensions', 'fileNames', 'folderNames', 'folderNamesExpanded']) {
  for (const [key, id] of Object.entries(theme[section])) {
    assert.ok(theme.iconDefinitions[id], `${section}.${key} -> unknown icon ${id}`);
    assert.equal(key, key.toLowerCase(), `${section}.${key} must be lower case`);
  }
}
assert.deepEqual(Object.keys(theme.folderNamesExpanded), Object.keys(theme.folderNames));
for (const [name, id] of Object.entries(theme.folderNames)) {
  assert.equal(theme.folderNamesExpanded[name], `${id}-open`, `Open folder mismatch for ${name}`);
}

// Resolve a path the way VS Code does: file name, then the longest extension,
// each preferring a "parent/..." association over the bare one.
function resolveFile(filePath) {
  const parts = filePath.toLowerCase().split('/');
  const name = parts.pop(), parent = parts.pop();
  const lookup = (map, key) => (parent && map[`${parent}/${key}`]) || map[key];
  let icon = lookup(theme.fileNames, name);
  for (let dot = name.indexOf('.'); !icon && dot !== -1; dot = name.indexOf('.', dot + 1)) {
    icon = lookup(theme.fileExtensions, name.slice(dot + 1));
  }
  return icon ?? theme.file;
}
const fileCases = {
  // ordinary source files stay with their language
  'UserController.php': 'php', 'AppointmentService.php': 'php', 'migration.php': 'php',
  'app.component.ts': 'typescript', 'auth.service.ts': 'typescript', 'main.ts': 'typescript', 'auth.spec.ts': 'typescript',
  'models.py': 'python', 'views.py': 'python', 'manage_helpers.py': 'python',
  'Program.cs': 'csharp', 'UserService.cs': 'csharp', 'App.csproj': 'csharp', 'App.sln': 'csharp',
  'Main.java': 'java', 'AuthService.java': 'java', 'pom.xml': 'java',
  'Main.kt': 'kotlin', 'build.gradle.kts': 'kotlin', 'build.gradle': 'config',
  'index.mjs': 'javascript', 'index.cts': 'typescript', 'index.htm': 'html', 'site.css': 'css', 'site.sass': 'scss',
  'main.dart': 'dart', 'main.rs': 'rust', 'schema.sql': 'sql', 'run.zsh': 'shell', 'build.psm1': 'powershell',
  // generic data / documents
  'random-data.json': 'json', 'settings.yml': 'yaml', 'feed.xml': 'xml', 'notes.markdown': 'markdown',
  'notes.txt': 'text', 'export.csv': 'csv', 'error.log': 'log', 'icon.svg': 'svg', 'photo.jpeg': 'image', 'manual.pdf': 'pdf',
  'backup.tar.gz': 'archive', 'unknown.xyz': 'file', 'yarn.lock': 'lock',
  // framework file types
  'home.blade.php': 'blade', 'App.vue': 'vue', 'Nav.svelte': 'svelte',
  // special file names
  '.env': 'env', '.env.testing': 'env', '.gitignore': 'git', 'README.md': 'markdown', 'README': 'markdown', 'CHANGELOG.md': 'markdown',
  'LICENSE': 'text', 'LICENSE.md': 'text', 'package.json': 'npm', 'package-lock.json': 'npm', 'composer.json': 'composer',
  'composer.lock': 'composer', 'requirements.txt': 'python', 'pyproject.toml': 'python', 'manage.py': 'django', 'artisan': 'laravel', 'angular.json': 'angular', 'Cargo.toml': 'cargo',
  'Cargo.lock': 'cargo', 'tsconfig.json': 'typescript', 'pubspec.yaml': 'dart', 'pubspec.lock': 'dart', 'Dockerfile': 'docker',
  'docker-compose.yml': 'docker-compose', 'compose.yaml': 'docker-compose', 'nginx.conf': 'nginx', 'phpunit.xml': 'test',
  '.github/workflows/ci.yml': 'github', 'config/ci.yml': 'yaml',
};
for (const [file, expected] of Object.entries(fileCases)) {
  assert.equal(resolveFile(file), expected, `${file} should use the ${expected} icon`);
}
const folderCases = {
  src: 'src', source: 'src', configuration: 'config', db: 'database', migrations: 'migrations', entity: 'entities', repos: 'repositories',
  apis: 'api', middlewares: 'middleware', img: 'images', specs: 'tests', documentation: 'docs', out: 'dist', builds: 'build',
  infrastructure: 'infra', '.github': 'github', '.vscode': 'vscode', '.idea': 'idea', node_modules: 'node-modules',
};
for (const [folder, expected] of Object.entries(folderCases)) {
  assert.equal(theme.folderNames[folder], `folder-${expected}`, `${folder}/ should use folder-${expected}`);
}
assert.equal(theme.folderNames.misc, undefined);
console.log(`OK mappings: ${Object.keys(theme.fileExtensions).length} extensions, ${Object.keys(theme.fileNames).length} file names, ${Object.keys(theme.folderNames).length} folder names, ${Object.keys(fileCases).length + Object.keys(folderCases).length} resolution cases`);

// The review sheet is a development artifact and stays out of the VSIX.
assert.match(fs.readFileSync('.vscodeignore', 'utf8'), /^concepts\/\*\*$/m);
console.log('Manifest, theme JSON, references, mappings, and SVG design constraints passed.');
