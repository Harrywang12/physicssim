/* Pure thermodynamics calculations; works in both a browser and Node.js. */
(function (root) {
  'use strict';
  const C = 4184; // Specific heat of liquid water, J/(kg·°C).
  const DEFAULTS = { mA: 0.20, tA: 80, mB: 0.30, tB: 20 };
  const INVESTIGATION_MASSES = [0.05, 0.10, 0.15, 0.20, 0.30, 0.40, 0.60, 0.75, 0.90];

  function validate(input) {
    const errors = {};
    for (const key of ['mA', 'mB', 'tA', 'tB']) {
      const value = input[key];
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        errors[key] = 'Enter a finite number.';
      } else if (key[0] === 'm') {
        if (value < 0.01 || value > 1) errors[key] = 'Mass must be 0.01–1.00 kg (greater than zero).';
        else if (Math.abs(value * 100 - Math.round(value * 100)) > 1e-8) errors[key] = 'Use increments of 0.01 kg.';
      } else {
        if (value < 1 || value > 99) errors[key] = 'Temperature must be 1–99 °C.';
        else if (!Number.isInteger(value)) errors[key] = 'Use whole degrees Celsius (step 1 °C).';
      }
    }
    return errors;
  }

  function calculate(input) {
    const errors = validate(input);
    if (Object.keys(errors).length) {
      const error = new RangeError(Object.values(errors).join(' '));
      error.fields = errors;
      throw error; // Never calculate from invalid inputs.
    }
    const { mA, mB, tA, tB } = input;
    // Isolation gives mA*c*(tf-tA) + mB*c*(tf-tB) = 0.
    // The same constant c cancels, giving this mass-weighted mean.
    const tf = (mA * tA + mB * tB) / (mA + mB);
    const dA = tf - tA;
    const dB = tf - tB;
    // Positive heat means the sample gains internal energy.
    const qA = mA * C * dA;
    const qB = mB * C * dB;
    return { ...input, tf, dA, dB, qA, qB, residual: qA + qB,
      fraction: mA / (mA + mB), mean: (tA + tB) / 2 };
  }

  function simpleAverage(input) {
    const result = calculate(input);
    // Test the proposed arithmetic mean using the same Q = m*c*ΔT equation.
    const qA = input.mA * C * (result.mean - input.tA);
    const qB = input.mB * C * (result.mean - input.tB);
    return { temperature: result.mean, qA, qB, residual: qA + qB };
  }

  function progress(input, s) {
    const result = calculate(input);
    if (!Number.isFinite(s) || s < 0 || s > 1) throw new RangeError('Progress must be between 0 and 1.');
    // s is an illustration parameter, not a physical time law.
    const tA = input.tA + s * result.dA;
    const tB = input.tB + s * result.dB;
    const qA = s * result.qA;
    // Enforce exact balance in the animation, avoiding floating-point drift.
    const qB = -qA;
    return { tA, tB, dA: s * result.dA, dB: s * result.dB, qA, qB, residual: qA + qB };
  }

  function investigation() {
    return INVESTIGATION_MASSES.map(mA => calculate({ mA, mB: 0.30, tA: 80, tB: 20 }));
  }
  // Investigation helpers describe experimental controls, not additional physics.
  function investigationSetup(id) {
    if (id === 'typical') return { ...DEFAULTS };
    if (id === 'mass') return { mA: 0.05, mB: 0.30, tA: 80, tB: 20 };
    if (id === 'boundary') return { mA: 0.20, mB: 0.30, tA: 45, tB: 45 };
    throw new RangeError('Unknown investigation.');
  }
  function checkInvestigation(id, input) {
    const errors = validate(input);
    if (Object.keys(errors).length) return { ok: false, message: 'Correct the marked inputs first.' };
    const expected = investigationSetup(id);
    const fixed = id === 'mass' ? ['mB', 'tA', 'tB'] : ['mA', 'mB', 'tA', 'tB'];
    const wrong = fixed.filter(key => Math.abs(input[key] - expected[key]) > 1e-8);
    return { ok: wrong.length === 0, message: wrong.length ? 'Starting conditions differ: check ' + wrong.map(key => ({mA:'Sample A mass',mB:'Sample B mass',tA:'Sample A temperature',tB:'Sample B temperature'})[key]).join(', ') + '.' : 'Parameters match. All four controls remain adjustable.' };
  }
  function energyDirection(input) {
    calculate(input); // Apply the same validation as every other model entry point.
    return input.tA === input.tB ? 'none' : input.tA > input.tB ? 'AtoB' : 'BtoA';
  }
  function matchingRuns(records, input) {
    return records.filter(run => run.tA === input.tA && run.tB === input.tB);
  }
  function exportCSV(records) {
    const header = 'Run,m_A (kg),m_B (kg),T_A (deg C),T_B (deg C),f_A (dimensionless),T_f (deg C),Q_A (J),Q_B (J),Residual (J)';
    return [header, ...records.map(r => [r.run,r.mA,r.mB,r.tA,r.tB,r.fraction,r.tf,r.qA,r.qB,Math.abs(r.residual)<1e-6?0:r.residual].join(','))].join('\r\n');
  }
  const api = { C, DEFAULTS, validate, calculate, simpleAverage, progress, investigation, investigationSetup, checkInvestigation, energyDirection, matchingRuns, exportCSV };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Physics = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
