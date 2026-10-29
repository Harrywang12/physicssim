# Thermal balance — AP Physics 2, scenario T7

Double-click `index.html` to open the lab in a modern browser. No installation,
server, internet, framework, or CDN is needed. All code and styles are local.

Set both masses and temperatures, predict the equilibrium, press **Mix water**,
and record cases. The animation lasts approximately two seconds and illustrates
progress only, not real mixing time. Inputs remain adjustable during animation;
a change cancels it and recalculates the new case. Energy readouts show final
changes before Mix, progress during animation, and final changes at equilibrium.

**Reset assigned case preserves recorded runs.** Use **Clear table** separately.
**Load my investigation** appends nine computed runs and displays the assigned
case. CSV export includes full calculation precision; the screen rounds values
for readability. Records are stored only in memory until exported.

## Files

- `index.html`: accessible controls, visualization, handwritten SVG graph, table,
  CSV export, and UI logic/styles.
- `physics.js`: pure validation and model functions; no DOM code. The same module
  works as `Physics` in the browser and through `require` in Node.js.
- `tests.js`: required A–J tests plus animation and misconception checks.

Run verification from this folder:

```sh
node tests.js
```

Each test prints PASS/FAIL with expected and actual values. A failure sets a
nonzero exit code. Temperature tolerance is 0.01 °C and heat tolerance is 0.1 J;
the random conservation check uses the stricter 1e-6 J threshold. Random tests
use 1,000 reproducible valid cases at the specified control increments.

## Model and small terminology clarification

Specific heat is constant at 4184 J/(kg·°C). Energy conservation gives
`Tf = (mA*TA + mB*TB)/(mA+mB)`, with `QA = mA*c*(Tf-TA)` and
`QB = mB*c*(Tf-TB)`. Positive Q means energy gained. The raw calculation residual
is retained; residual magnitudes below 1e-6 J display as 0.0 J. Animation uses the
specified linear interpolation; its heat values are equal and opposite exactly
to avoid floating-point drift.

The graph calls fA **Sample A mass fraction**, with a note that it is the hot-mass
fraction when A is hotter. This preserves the symmetric model when A is cooler.
No extra physics is added. The source-check test uses the OpenStax example and
expected values supplied in the project specification.

## Publish with Vercel

Import `Harrywang12/physicssim` in the Vercel dashboard and deploy the `main`
branch. The included `vercel.json` selects the **Other** framework preset,
`npm run build`, and the `dist` output directory. No environment variables or
third-party services are required. The build runs the physics tests before
copying `index.html` and `physics.js` into `dist/`.

For a local deployment build, run `npm run build`. Opening the root `index.html`
still works offline without Node.js, npm, or a build step. Equations use local
HTML/CSS subscripts and fractions; SVG graph labels use SVG subscript spans.

If using the Vercel CLI, upgrade to the current version with
`npm i -g vercel@latest` before deploying for best compatibility.
