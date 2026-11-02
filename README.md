# Thermal balance — AP Physics 2 scenario T7

Open `index.html` in a modern browser for the offline lab. No framework, CDN,
installation, server, internet connection, or account is needed for the runtime.
The project extends the original simulation and retains its calculation module.

## Use the simulation

1. Independently adjust both masses (0.01–1.00 kg in 0.01 kg steps) and both
   initial temperatures (1–99 °C in whole degrees) with sliders or number boxes.
2. Enter a predicted final temperature and choose its relationship to the
   arithmetic mean. Press **Mix water** to compare prediction and calculation.
3. The approximately two-second animation illustrates progress toward
   equilibrium, not a calculated physical mixing time. The energy changes shown
   during animation remain equal and opposite.
4. **Record this run** appends the current valid case. **Load my investigation**
   appends nine computed 80/20 °C trials. Records retain full precision internally;
   the table shows final temperatures to two decimal places.
5. **Export CSV** opens a preview with **Download CSV** and **Copy CSV**. Copy is
   useful in embedded browsers that block downloads. If clipboard permission is
   unavailable, select the data and use the normal keyboard copy shortcut.
6. **Reset** restores the assigned case, clears predictions/animation and returns
   an open investigation panel to its menu. Recorded data stays intact.
   **Clear table** is the separate, explicit data deletion control.

All records live in browser memory. Export them before refreshing or closing.
The **User Guide** button at the top right opens instructions. Close with its
button or Escape; focus returns to the opener. The modal traps keyboard focus.

## Guided investigations

The top-right **Guided Investigations** button opens a nonmodal side panel. The
simulation remains interactive. On narrow screens the panel becomes a bottom
sheet occupying 45% of screen height. Use Back, Next, Close, Hint, Check parameters,
or a deliberate Reveal answers action. Each lesson has five steps and a summary.

- **Typical situation:** 0.20 kg at 80 °C plus 0.30 kg at 20 °C. Predict the final
  temperature and energy direction, Mix, analyze energy conservation, then test
  the simple-average misconception with dynamically calculated energy imbalance.
- **Controlled comparison:** keep temperatures at 80/20 °C and Sample B at 0.30 kg.
  Predict a trend and explain it. Run the nine-trial mass sweep or collect manual
  trials. All nine distinct prescribed masses are needed for completion. Explain
  why final temperature is linear in Sample A mass fraction, not in Sample A mass
  alone when Sample B mass is fixed. Finish with a written explanation about heat
  and temperature change.
- **Boundary case:** unequal masses at the same 45 °C. Predict temperature,
  energy transfer, and the arrow, then Mix and explain zero net transfer.

Calculated answers, theory/recorded graph results, table data, and export are
hidden until a prediction is submitted or answers are deliberately revealed.
Existing records are preserved while hidden. An incorrect prediction is welcome;
a valid response is required, not a correct one. Editing a submitted prediction
requires resubmission. Changing a controlled input invalidates the prediction and
returns to the prediction step. Changing only Sample A mass in the mass collection
step preserves the trend prediction and previous collected trial masses.

The main prediction fields are shared with guided mode. **Go to prediction box**
focuses and scrolls to them. All four physical controls remain editable. Wrong
investigation parameters are explained without preventing free exploration.
Close the panel to use normal mode; reopen it to resume the lesson.

## Model and representations

Specific heat is constant at 4184 J/(kg·°C). The existing pure calculation rules:

```text
Tf = (mA*TA + mB*TB)/(mA+mB)
QA = mA*c*(Tf-TA)
QB = mB*c*(Tf-TB)
fA = mA/(mA+mB)
Tf = TB + fA*(TA-TB)
```

Positive Q is energy gained. The isolated system conserves energy. The raw
floating-point residual is retained; residual magnitudes below 1e-6 J display as
0.0 J. During animation Q values are exactly equal and opposite. Equations in the
interface use local HTML/CSS fractions and subscripts, and SVG subscript spans.

The graph uses **Sample A Mass Fraction**, since A can be cooler. Its line slopes
downward when A is cooler, and is horizontal at equal temperatures. Only records
with matching initial temperatures are plotted. Click, hover over, or keyboard
focus a recorded point to inspect its masses, temperatures, and final result.

Expand **Physics Behind the Simulation** for variable definitions, governing
rules, and limits. No evaporation, phase change, container heat capacity, external
heat exchange, or actual mixing rate is modeled. Heat exchange with surroundings
can shift real measurements in either direction; heat loss to cooler surroundings
or evaporation generally lowers the final temperature.

## Files and verification

- `index.html`: original UI wiring plus compact layout, SVG graph, native dialogs,
  and integrated guided workflow. No third-party runtime assets.
- `physics.js`: preserved calculation functions plus pure investigation-control,
  energy-direction, graph-filter, and CSV helpers. No DOM code.
- `tests.js`: original A–L tests plus M–Q regression tests.
- `TEST_REPORT.md`: executed checks, issues found and repaired, and manual checks.
- `CHANGELOG.md`: changes and their reasons.
- `PEER_REVIEW.md`: blank checklist for genuine learner feedback.

Run `node tests.js`, or `npm test`. Each test prints PASS/FAIL with expected and
actual output. Failure returns a nonzero exit code. Deterministic tolerances are
0.01 °C and 0.1 J; the 1,000 random conservation cases require residual < 1e-6 J.
Random tests are seeded and reproducible. No test dependencies need installing.

`npm run build` runs the same tests and copies the two runtime files into `dist/`.
The included `vercel.json` selects Other/static, this build command, and `dist`.
Existing Vercel/GitHub deployment settings are preserved. No secrets are needed.
If using the Vercel CLI, upgrade with `npm i -g vercel@latest` for compatibility.

## Assignment alignment and assistance

Reviewed the instructor-provided `Simulation Project Thermodynamics_2026-27 (1).docx`
and `Rubric_Simulation Project_Thermodynamics (1).xlsx` as reference material.
The three lessons correspond to the assignment's typical, relationship, and
boundary categories. The sweep exceeds its minimum of five independent-variable
values. Free controls support an unexpected teacher-selected input change.

This revision used OpenAI Codex assistance for implementation and verification.
No external assets or third-party runtime code were added. The OpenStax comparison
in tests uses the example and expected values supplied in the original development
request; this revision does not claim an independent source lookup. No peer
feedback, student observations, or citations have been invented. The formal
presentation, reflection, independently worked predictions, and APA citations
remain the student's separate submission.
