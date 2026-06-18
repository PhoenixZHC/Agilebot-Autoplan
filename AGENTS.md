# Repository Instructions

## TP JavaScript Compatibility

- Treat the TP plugin WebView as a legacy JavaScript runtime. First-party
  JavaScript loaded by `templates/index.html` must be transpiled by Babel.
- Keep editable source in `static/*.js` and load its corresponding
  `static/*-compiled.js` file from the template. The bundled third-party
  `static/extension-runtime.js` is the only exception.
- When adding a first-party script, add its Babel command to
  `package.json` under `build:frontend`, load only the compiled output, and add
  the source/output pair to `tests/frontend-compatibility.test.js`.
- Do not edit generated `*-compiled.js` files manually. Change the source and
  run `pnpm build`; commit the regenerated files with the source change.
- Keep the Babel target compatible with the TP WebView. Do not raise the target
  above the current legacy setting without testing on the actual TP runtime.

## Required Frontend Verification

After changing frontend JavaScript, template script tags, Babel configuration,
or TP notification behavior, run:

```powershell
pnpm build
pnpm test
node --check static/i18n-compiled.js
node --check static/api-i18n-keys-compiled.js
node --check static/language-switcher-compiled.js
node --check static/script-compiled.js
```

TP notifications use `(message, detail)`. Application text must be passed as
the second argument, for example `rtmNotification.success('', message)`, so the
notification body is visible in the plugin UI.
