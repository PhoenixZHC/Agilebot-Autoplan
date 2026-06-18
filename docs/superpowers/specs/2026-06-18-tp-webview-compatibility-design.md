# TP WebView Compatibility Fix

## Problem

The TP template loads `i18n.js`, `api-i18n-keys.js`, and
`language-switcher.js` directly. These source files contain modern JavaScript
syntax that the TP WebView may not parse. A parse failure prevents later
scripts, including `script-compiled.js`, from running, which breaks translated
text and event-handler registration.

The TP notification API accepts `(message, detail)`. The current adapter passes
only `message`, while the TP notification UI renders application content from
`detail`, producing notifications without their body text.

## Design

- Keep editable JavaScript in the existing source files.
- Generate a `*-compiled.js` counterpart for every application script loaded by
  `templates/index.html`.
- Load only compiled application scripts in the template. The third-party
  `extension-runtime.js` remains unchanged.
- Target a conservative legacy Chrome runtime in Babel so modern syntax is
  removed from every generated file.
- Pass TP notification content as the second notification argument while
  preserving browser `alert()` behavior outside the extension.
- Add repository tests that enforce compiled template references and the TP
  notification contract.
- Add `AGENTS.md` rules requiring future frontend changes to update and verify
  compiled assets.

## Verification

Automated checks will build all frontend assets, parse every loaded application
script, verify that the template references compiled files, and exercise the
notification adapter with a stub TP runtime. Existing Python tests, if present,
and application syntax checks will also run.
