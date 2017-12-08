/* eslint-disable */

// NPM BUILD SCRIPT TO INSERT TRACKING PIXELS INTO HTML
// See /build_snippets/README.md for more info.

const fs = require('fs');

console.log('Start build-snippets.js script...');
const PLATFORM_BRANCH = process.env.PLATFORM_BRANCH;
console.log(PLATFORM_BRANCH);

// Read index.html contents.
let indexHtml = fs.readFileSync('./build/index.html', 'utf8');

// Default mode is test.
const mode = (PLATFORM_BRANCH === 'master' ? 'live' : 'test');

// Supported zones for tracking pixels.
// Each zone has corresponding <snippet> tqg in public/index.html.
const snippet_zones = ['head', 'body.top', 'body.bottom'];

snippet_zones.forEach((zone) => {
  const snippetPlaceholder = `<snippet zone="${zone}"></snippet>`;

  // Fail the build if snippet placeholder was accidentally removed / changed.
  if (!indexHtml.includes(snippetPlaceholder)) {
    console.log('Snippet tag not found: ');
    console.log(snippetPlaceholder);
    process.exit(1);
  }

  const dir = `./build_snippets/${zone}/`;
  const files = fs.readdirSync(dir);

  const snippets = [
    // Include all snippets with .env.html suffix.
    ...files.filter(file => new RegExp(`[.]${mode}[.]html$`).test(file)),
    // Include all global snippets *without any environment suffix).
    ...files.filter(file => !(new RegExp('[.](test|live)[.]html$').test(file)))
  ];

  // Join all found snippets' html into one variable.
  const zoneHTML = snippets.reduce((html, file) => html + fs.readFileSync(dir + file, 'utf8') + "\n", '');
  // Replace <snippet> tag with final HTML.
  indexHtml = indexHtml.replace(snippetPlaceholder, zoneHTML);
});

fs.writeFileSync('./build/index.html', indexHtml);
console.log('End build-snippets.js script.');
