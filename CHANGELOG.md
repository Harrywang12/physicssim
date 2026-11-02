# Changelog

## 2026-11-01

- Retained the original water-mixing equations, constant specific heat, valid
  input ranges, symmetry, signed heat, and animation interpolation.
- Made the existing lab more compact with a clear header, smaller control groups,
  side-by-side graph/data areas, and visual weighted/simple-mean comparison.
- Relocated the long guide to the top-right User Guide dialog. Added Escape,
  explicit focus trapping, opener focus restoration, and visible close controls.
- Added three five-step guided investigations with predictions, hints, parameter
  checks, shared Mix controls, analysis, completion summaries, repeat, and menu.
- Masked numerical answers, chart results, and recorded data until prediction or
  deliberate reveal. Existing records survive lesson changes and Reset.
- Preserved manual trials while adding a controlled nine-trial sweep; changing
  only Sample A mass retains the mass-trend prediction and collected trial masses.
- Added synchronized invalidation for changed controls and edited predictions.
- Kept all four input controls independently usable in regular and guided modes.
- Made recorded graph points selectable by mouse, hover, or keyboard, with full
  conditions; points still filter by both current starting temperatures.
- Fixed a regression discovered in testing where the current-case dot covered a
  recorded point. The decorative current dot now ignores pointer events.
- Displayed recorded final temperatures to two decimals for evidence collection.
- Centralized CSV serialization in the calculation module and added a download /
  copy preview so embedded-browser download restrictions do not prevent export.
- Corrected limitations wording: real heat exchange can cause deviations in
  either direction; cooler surroundings and evaporation generally lower results.
- Added compact variable definitions and equations to Physics Behind the Simulation.
- Added responsive dock/bottom-sheet layouts and fixed mobile grid overflow found
  at 390 px width. Added support for reduced-motion preferences.
- Expanded tests from 12 to 17, preserving the original A–L cases; added a test
  report and blank peer review checklist. No peer feedback has been fabricated.
