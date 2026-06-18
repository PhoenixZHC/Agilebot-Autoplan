const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const compiledAssets = [
    ['static/i18n.js', 'static/i18n-compiled.js'],
    ['static/api-i18n-keys.js', 'static/api-i18n-keys-compiled.js'],
    ['static/language-switcher.js', 'static/language-switcher-compiled.js'],
    ['static/script.js', 'static/script-compiled.js'],
];

test('the page loads compiled first-party JavaScript only', () => {
    const template = read('templates/index.html');
    const loadedScripts = [...template.matchAll(/path='([^']+\.js)'/g)]
        .map((match) => match[1]);

    assert.deepEqual(loadedScripts, [
        'extension-runtime.js',
        'i18n-compiled.js',
        'api-i18n-keys-compiled.js',
        'language-switcher-compiled.js',
        'script-compiled.js',
    ]);
});

test('the build transpiles every first-party script for the legacy TP WebView', () => {
    const packageJson = JSON.parse(read('package.json'));
    const buildCommand = packageJson.scripts['build:frontend'];

    for (const [source, output] of compiledAssets) {
        assert.match(buildCommand, new RegExp(`${source} --out-file[= ]${output}`));
    }
    assert.equal(packageJson.babel.presets[0][1].targets.ie, '11');
});

test('TP notifications send application text as the detail argument', () => {
    const script = read('static/script.js');

    for (const type of ['success', 'error', 'info']) {
        assert.match(
            script,
            new RegExp(`gbtExtension\\.rtmNotification\\.${type}\\('', message\\)`),
        );
    }
});

test('release surfaces consistently report version 7.5.8', () => {
    const config = JSON.parse(read('config.json'));
    const app = read('app.py');
    const launcher = read('start_autoplan.bat');
    const readmeZh = read('README.md');
    const readmeEn = read('README.en.md');

    assert.equal(config.version, '7.5.8');
    assert.match(app, /--name AutoPlan_V7\.5\.8\b/);
    assert.match(launcher, /AutoPlan_V7\.5\.8\.exe/g);
    assert.doesNotMatch(launcher, /AutoPlan_V7\.5\.7\.exe/);

    assert.match(readmeZh, /\*\*版本 v7\.5\.8 \| 更新日期：2026年6月18日\*\*/);
    assert.match(readmeZh, /### v7\.5\.8 \(2026年6月18日\)/);
    assert.match(readmeZh, /版本 v7\.5\.8 \| 更新日期：2026年6月18日/);

    assert.match(readmeEn, /\*\*Version v7\.5\.8 \| Updated: June 18, 2026\*\*/);
    assert.match(readmeEn, /### v7\.5\.8 \(June 18, 2026\)/);
    assert.match(readmeEn, /Version v7\.5\.8 \| Updated: June 18, 2026/);
});
