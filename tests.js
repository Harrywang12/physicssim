'use strict';
const P = require('./physics.js');
let passed = 0, failed = 0;
function test(name, expected, callback) {
  try {
    const actual = callback();
    console.log(`PASS ${name}\n  Expected: ${expected}\n  Actual:   ${actual}`);
    passed++;
  } catch (error) {
    console.log(`FAIL ${name}\n  Expected: ${expected}\n  Actual:   ${error.message}`);
    failed++;
  }
}
function near(actual, expected, tolerance) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    throw new Error(`${actual} differs from ${expected} by more than ${tolerance}`);
  }
}
function describe(r) {
  return `T_f=${r.tf.toFixed(2)} °C, Q_A=${r.qA.toFixed(1)} J, Q_B=${r.qB.toFixed(1)} J, sum=${r.residual.toExponential(2)} J`;
}
function caseTest(name, input, tf, qA, qB) {
  test(name, `T_f=${tf.toFixed(2)} °C, Q_A=${qA.toFixed(1)} J, Q_B=${qB.toFixed(1)} J, sum=0 J`, () => {
    const r = P.calculate(input);
    near(r.tf, tf, 0.01); near(r.qA, qA, 0.1); near(r.qB, qB, 0.1); near(r.residual, 0, 0.1);
    return describe(r);
  });
}
caseTest('A. Assigned case', P.DEFAULTS, 44, -30124.8, 30124.8);
caseTest('B. Equal masses', {mA:.2,tA:80,mB:.2,tB:20}, 50, -25104, 25104);
caseTest('C. Equal temperatures', {mA:.17,tA:45,mB:.83,tB:45}, 45, 0, 0);
caseTest('D. Swapped labels', {mA:.3,tA:20,mB:.2,tB:80}, 44, 30124.8, -30124.8);
caseTest('E. Reversed temperatures', {mA:.2,tA:20,mB:.3,tB:80}, 56, 30124.8, -30124.8);
caseTest('F. Supplied OpenStax §12.3 source check', {mA:.2,tA:20,mB:.2,tB:40}, 30, 8368, -8368);
// A seeded PRNG makes the 1,000 random valid cases reproducible.
let seed = 123456789;
function random() { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; }
function randomInput() {
  return { mA:(1+Math.floor(random()*100))/100, mB:(1+Math.floor(random()*100))/100,
    tA:1+Math.floor(random()*99), tB:1+Math.floor(random()*99) };
}
const randomCases = Array.from({length:1000}, randomInput);
test('G. Bounds across 1000 random valid inputs', '1000/1000 final temperatures between starting temperatures', () => {
  let maxViolation = 0;
  for (const input of randomCases) {
    const r = P.calculate(input);
    const violation = Math.max(Math.min(input.tA,input.tB)-r.tf, r.tf-Math.max(input.tA,input.tB), 0);
    maxViolation = Math.max(violation,maxViolation);
    if (violation > 0.01) throw new Error(describe(r));
  }
  return `1000/1000 within bounds; maximum numerical excursion ${maxViolation.toExponential(2)} °C`;
});
test('H. Energy conservation across 1000 random valid inputs', '|Q_A+Q_B| < 1e-6 J in 1000/1000 cases', () => {
  let maxResidual = 0;
  for (const input of randomCases) {
    const r = P.calculate(input);
    maxResidual = Math.max(maxResidual, Math.abs(r.residual));
    if (Math.abs(r.residual) >= 1e-6) throw new Error(describe(r));
  }
  return `1000/1000 conserved; maximum |residual|=${maxResidual.toExponential(3)} J`;
});
test('I. Invalid inputs rejected', 'Reject zero/negative/too-large masses, temperatures outside 1–99 °C, nonfinite and off-step inputs', () => {
  const bad = [ {mA:0}, {mB:0}, {mA:-.2}, {mB:-.3}, {mA:1.01}, {mB:.001},
    {tA:0}, {tB:100}, {tA:100}, {tB:0}, {mA:NaN}, {tB:Infinity}, {tA:20.5}, {mA:.205} ];
  for (const change of bad) {
    let rejected = false;
    try { P.calculate({...P.DEFAULTS,...change}); } catch (e) { if (e instanceof RangeError) rejected = true; else throw e; }
    if (!rejected) throw new Error(`Accepted ${JSON.stringify(change)}`);
  }
  return `${bad.length}/${bad.length} invalid inputs rejected`;
});
test('J. Investigation sweep', '0.05→28.57, 0.10→35.00, 0.15→40.00, 0.20→44.00, 0.30→50.00, 0.40→54.29, 0.60→60.00, 0.75→62.86, 0.90→65.00 °C', () => {
  const expected = [28.57,35,40,44,50,54.29,60,62.86,65], results = P.investigation();
  results.forEach((r,i) => near(r.tf,expected[i],.01));
  return results.map(r=>`${r.mA.toFixed(2)}→${r.tf.toFixed(2)}`).join(', ')+' °C';
});
test('K. Animation interpolation and exact energy balance', 'At s=0/0.25/0.5/0.75/1: linear temperatures, equal and opposite Q, residual exactly 0 J', () => {
  for (const input of [P.DEFAULTS,{mA:.2,tA:20,mB:.3,tB:80},{mA:.2,tA:45,mB:.3,tB:45}]) {
    const r = P.calculate(input);
    for (const s of [0,.25,.5,.75,1]) {
      const p = P.progress(input,s);
      near(p.tA,input.tA+s*(r.tf-input.tA),.01); near(p.tB,input.tB+s*(r.tf-input.tB),.01);
      near(p.qA,input.mA*P.C*(p.tA-input.tA),.1); near(p.qB,input.mB*P.C*(p.tB-input.tB),.1);
      if (p.residual !== 0) throw new Error(`Residual ${p.residual}`);
    }
  }
  return '15/15 frames verified; residual exactly 0 J';
});
test('L. Simple-average misconception check', 'Default at 50 °C: Q_A=-25104 J, Q_B=37656 J, imbalance=12552 J; equal masses conserve energy', () => {
  const r = P.simpleAverage(P.DEFAULTS);
  near(r.temperature,50,.01); near(r.qA,-25104,.1); near(r.qB,37656,.1); near(r.residual,12552,.1);
  near(P.simpleAverage({mA:.2,tA:80,mB:.2,tB:20}).residual,0,.1);
  return `At ${r.temperature} °C: Q_A=${r.qA} J, Q_B=${r.qB} J, imbalance=${r.residual} J; equal-mass imbalance=0 J`;
});
test('M. Guided presets and controlled variables', 'Typical and boundary presets valid; mass investigation varies only mA; changed fixed inputs detected', () => {
  for(const id of ['typical','mass','boundary']) {
    const setup=P.investigationSetup(id);
    if(!P.checkInvestigation(id,setup).ok)throw new Error('Invalid preset '+id);
    P.calculate(setup);
  }
  if(!P.checkInvestigation('mass',{...P.investigationSetup('mass'),mA:.9}).ok)throw new Error('Mass variation rejected');
  if(P.checkInvestigation('mass',{...P.investigationSetup('mass'),mB:.4}).ok)throw new Error('Changed control accepted');
  if(P.checkInvestigation('typical',{...P.DEFAULTS,tA:79}).ok)throw new Error('Wrong typical condition accepted');
  if(P.checkInvestigation('boundary',{...P.investigationSetup('boundary'),mA:0}).ok)throw new Error('Invalid mass accepted');
  return '3 valid presets; free mA accepted; wrong fixed and invalid inputs rejected';
});
test('N. Direction and graph symmetry', 'A→B for 80/20, B→A for 20/80, no arrow at equal temperatures; ascending/descending/horizontal theory', () => {
  for(const [tA,tB,direction] of [[80,20,'AtoB'],[20,80,'BtoA'],[45,45,'none']]) {
    const input={...P.DEFAULTS,tA,tB};
    if(P.energyDirection(input)!==direction)throw new Error('Wrong direction');
    const left=P.calculate({...input,mA:.01,mB:1}),right=P.calculate({...input,mA:1,mB:.01});
    if(Math.sign(right.tf-left.tf)!==Math.sign(tA-tB))throw new Error('Wrong slope');
    for(const r of [left,right])near(r.tf,tB+r.fraction*(tA-tB),.01);
  }
  return 'Three directions and theory slopes verified with live calculations';
});
test('O. Recorded graph-point filtering', 'Plot only runs whose two initial temperatures match the current graph', () => {
  const records=[P.calculate(P.DEFAULTS),P.calculate({...P.DEFAULTS,tA:20,tB:80}),P.calculate({...P.DEFAULTS,mA:.4})];
  const visible=P.matchingRuns(records,P.DEFAULTS);
  if(visible.length!==2||visible.some(r=>r.tA!==80||r.tB!==20))throw new Error('Wrong matching records');
  return '2/3 records selected; reversed-temperature record excluded';
});
test('P. CSV export uses computed records', 'Header + nine rows, ten columns each, correct temperatures, signed heat, normalized residual', () => {
  const records=P.investigation().map((r,i)=>({...r,run:i+1}));
  const rows=P.exportCSV(records).split('\r\n').map(r=>r.split(','));
  if(rows.length!==10||rows.some(r=>r.length!==10))throw new Error('Invalid CSV shape');
  records.forEach((r,i)=>{near(Number(rows[i+1][6]),r.tf,.01);near(Number(rows[i+1][7]),r.qA,.1);near(Number(rows[i+1][8]),r.qB,.1);if(rows[i+1][9]!=='0')throw new Error('Residual not normalized');});
  return '9 computed rows; 10 columns; temperatures and both signed heat values verified';
});
test('Q. Boundary extremes and strict validation', 'Valid minimum/maximum inputs conserve energy; blank/string/undefined rejected; invalid progress rejected', () => {
  for(const input of [{mA:.01,mB:1,tA:1,tB:99},{mA:1,mB:.01,tA:99,tB:1}]) {
    const r=P.calculate(input);near(r.residual,0,.1);if(r.tf<1||r.tf>99)throw new Error('Out of bounds');
  }
  for(const bad of ['',undefined,'0.20']){let rejected=false;try{P.calculate({...P.DEFAULTS,mA:bad});}catch(e){rejected=e instanceof RangeError;}if(!rejected)throw new Error('Accepted invalid mass');}
  for(const bad of [-.1,1.1,NaN]){let rejected=false;try{P.progress(P.DEFAULTS,bad);}catch(e){rejected=e instanceof RangeError;}if(!rejected)throw new Error('Accepted invalid progress');}
  return 'Valid extremes passed; 3 invalid masses and 3 invalid progress values rejected';
});
// Execute the actual UI frame loop with deterministic browser-frame timestamps.
// Renderers still call the real physics functions, so invalid progress throws.
test('R. Animation starts safely and reaches equilibrium', 'Earlier first-frame timestamp: 0% → 50% → 100%; balanced heat, one completion, replay starts at 0%', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const vm = require('node:vm');
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const start = html.indexOf('  let animationStart = null;');
  const end = html.indexOf("\n});\n$('record')", start);
  if(start<0||end<0)throw new Error('Animation loop not found');
  const loop = html.slice(start,end);
  for (const input of [P.DEFAULTS,{mA:.2,mB:.3,tA:20,tB:80},{mA:.2,mB:.3,tA:45,tB:45}]) {
    const nodes={},frames=[];let completion=0,guidedCompletion=0;
    const context = {
      performance:{now:()=>1000}, progressValue:0,mixed:false,animation:null,
      $:id=>nodes[id]||(nodes[id]={style:{},disabled:true}),
      requestAnimationFrame:callback=>{frames.push(callback);return frames.length;},
      renderStage:s=>P.progress(input,s),
      renderReadouts:s=>{const p=P.progress(input,s);if(p.residual!==0)throw new Error('Energy imbalance');},
      finishPrediction:()=>completion++,onGuidedMixed:()=>guidedCompletion++
    };
    const sandbox=vm.createContext(context);
    vm.runInContext(loop,sandbox);
    frames.shift()(999); // A frame earlier than the click-time clock is valid.
    near(context.progressValue,0,0);
    frames.shift()(998); // A backwards timestamp must never produce negative s.
    near(context.progressValue,0,0);
    frames.shift()(1999); near(context.progressValue,.5,1e-12);
    frames.shift()(5000); near(context.progressValue,1,0);
    if(frames.length||completion!==1||guidedCompletion!==1||context.animation!==null||!context.mixed)throw new Error('Incorrect completion state');
    if(nodes['progress-label'].textContent!=='Progress: 100%'||nodes.mix.disabled)throw new Error('UI did not finish');
    // A new Mix uses a new timeline, even after a completed run.
    vm.runInContext('{'+loop+'}',sandbox);
    frames.shift()(8000);near(context.progressValue,0,0);
    if(nodes['progress-label'].textContent!=='Progress: 0%')throw new Error('Replay did not reset');
  }
  return 'Default, reversed, and equal-temperature runs reach 100%; exact balance; replay resets to 0%';
});
console.log(`\n${passed} passed, ${failed} failed.`);
if (failed) process.exitCode = 1;
