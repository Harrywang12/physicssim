# Verification report

Updated: 2026-11-02. This report distinguishes executed checks from unverified or
human-only checks. No peer observations or testing outcomes have been fabricated.

## Executed calculation and build checks

`node tests.js`: **18 passed, 0 failed**. Full expected/actual output is retained
in `TEST_OUTPUT.txt`. `npm run build` also succeeded and produced the two-file
static site in `dist/`; its output is retained in `BUILD_OUTPUT.txt`.

Added regression R runs the actual UI animation loop under controlled frame timestamps, including a first frame earlier than the click clock, a backwards frame, a midpoint, a delayed completion, and replay. It passed for default, reversed, and equal temperatures.

The original A–L tests remain. Required cases A–J include the assigned case,
equal masses, equal temperatures, swapped labels, reversed temperatures, the
supplied published comparison, 1,000 seeded random bounds checks, 1,000 seeded
random energy-conservation checks, validation, and the nine-mass investigation.
Added tests cover guided presets and controlled variables, energy direction and
symmetric graph slopes, matching-temperature record filtering, computed CSV
serialization, and valid/invalid boundary inputs. Animation interpolation and
exact balance and the simple-average imbalance remain covered.

Maximum random |Q_A+Q_B| was **1.146e-10 J**, below 1e-6 J. The default case gave
44.00 °C, −30124.8 J, +30124.8 J. The sweep gave 28.57, 35.00, 40.00, 44.00, 50.00,
54.29, 60.00, 62.86, 65.00 °C. Deterministic tolerances were 0.01 °C and 0.1 J.
JavaScript syntax checks passed for the calculation module and inline UI script.

## Executed browser checks

Ran the app in the in-app browser against a localhost server. The recorded
assertion history in `BROWSER_CHECKS.json` has **53 successful assertions** and
**two earlier failures subsequently repaired and retested**. These are assertions
within actual browser workflows, not 53 separate user studies or test suites.

Verified:

- User Guide opens, closes with Escape, explicitly traps Tab focus, and restores
  focus to its opener. Guided panel opens/closes, including Escape.
- All three investigations complete through their five steps and completion
  screens. Typical case compares a 46 °C prediction with the computed 44 °C and
  reports +2 °C difference. Its analysis shows ±30124.8 J and the +12.552 kJ
  arithmetic-mean imbalance. Boundary Mix shows 45 °C, zero heat, no arrow, and
  the exact equal-temperatures message.
- Answers and Mix are blocked before a guided prediction. Hint, deliberate
  reveal, repeat, Back, parameter checks, and input-change invalidation work.
  Editing a submitted prediction requires resubmission.
- Mass-trend prediction and reasoning precede the sweep. Nine computed rows append
  to existing records; the mass lesson completes after its explanation question.
  A manual changed-mass trial preserves the trend prediction, Mix + Record counts
  that mass, and a changed controlled temperature returns to the prediction step.
- All four sliders update the associated number box and recalculate readouts.
  Typed mass also synchronizes its slider. Zero mass disables Mix and removes
  calculated outputs. Reset restores the assigned case and preserves recorded
  data; explicit Clear table removes it.
- Reversed starting temperatures reverse the arrow and give a descending theory
  line in the rendered SVG. Equal temperatures give a horizontal theory line.
  Matching-temperature graph filtering and recorded-point selection work.
- CSV preview contains nine computed sweep rows, ten columns per row, correct
  endpoints and balanced heat values. Copy CSV succeeded and the clipboard
  contents exactly matched the exported CSV. Download CSV executed its request
  handler. The browser did not provide a newly saved download file for inspection;
  download-file saving is therefore listed below as manual verification.
- No remote script, stylesheet, or image runtime dependencies exist in the DOM.
- At 1366 × 768 the guided panel docks beside the simulation rather than covering
  it. At 390 × 844 the bottom drawer occupies less than half the viewport; after
  fixing mobile grid sizing, document width equals screen width (390 px).

## Problems found and revisions verified

1. The current-case graph dot intercepted clicks on an overlapping recorded dot.
   Set the decorative dot to ignore pointer events; selecting the recorded
   assigned-case point now shows its correct masses, temperatures, and result.
2. Native dialog behavior allowed Tab to leave the document in the test browser.
   Added explicit wrapping of Tab/Shift+Tab among modal controls. Retests verified
   focus stays inside the dialog and returns to User Guide on closing.
3. Mobile grids overflowed the viewport by 11 px. Set grid children to min-width:0
   and allowed narrow control labels to wrap. Retest measured 390 px document
   width on the 390 px viewport.
4. Embedded-browser download restrictions prevented confirming a newly saved CSV
   file. Added a CSV preview and copy fallback, then verified the complete CSV and
   actual clipboard contents instead of claiming file saving had passed.

## Manual verification still required

- Double-click `index.html` in a regular browser with networking disabled and run
  the three lessons. The embedded browser's security policy blocks `file://`
  navigation, so direct file loading could not be executed here. The root page
  and build output use only local assets, and no runtime server calls are made.
- Save a downloaded CSV in the user's regular browser and open it in a spreadsheet
  application. Serialization, preview, copy, and request initiation were executed;
  an actual newly saved download file was not verified in the embedded browser.
- A real student should complete `PEER_REVIEW.md`, especially explaining concepts
  without help. No peer review has yet been performed.
- Check screen-reader announcement quality, physical projector readability, and
  Safari/Firefox/Edge behavior. Keyboard, DOM, one laptop viewport, and one small
  viewport were tested; a full assistive-technology/browser matrix was not.

## Remaining model and product limits

The model intentionally excludes phase change, evaporation, container heating,
external heat exchange, and actual mixing rates. Its illustrative animation is
not a measured or calculated time law. Records and lesson progress are held in
memory; export data before refreshing. The formal presentation, independent
hand calculations, genuine peer feedback, reflection, and source citations are
separate student work. No Vercel production deployment status is inferred from
local testing.

## 2026-11-02 animation regression investigation

Reproduced the failure in the old loop: a 1000 ms click-time clock and a first
frame timestamp of 999 ms yielded negative progress and `RangeError: Progress
must be between 0 and 1.` The loop stopped before updating the progress bar.
The new timer begins on the first frame and clamps progress to 0–1.

Executed browser checks after the fix: default run reached 100% and 44.0 °C;
reversed temperatures reached 100% and 56.0 °C; equal temperatures reached 100%
and 45.0 °C; replay reached 100%. Editing mass during animation reset progress
and the next Mix completed. The guided typical run completed and advanced to
Step 4 analysis. No browser errors were reported during the first four runs.
These are additional checks to the earlier 53 successful assertions above.
