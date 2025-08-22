// Verify calculations for 70kg Human
const humanWeight = 70; // kg
const K = 5; // EU/kg

// Test cases for mg doses
console.log('Human 70kg - mg doses:');
const mgDoses = [1.0, 2.5, 5.0];
mgDoses.forEach(dose => {
  const M = dose / humanWeight; // mg/kg/h
  const limit = K / M;
  console.log(`  ${dose} mg/h: M=${M.toFixed(4)} mg/kg/h, Limit=${limit.toFixed(0)} EU/mg`);
});

console.log('\nHuman 70kg - mL doses:');
const mlDoses = [1.0, 2.0, 5.0];
mlDoses.forEach(dose => {
  const M = dose / humanWeight; // mL/kg/h
  const limit = K / M;
  console.log(`  ${dose} mL/h: M=${M.toFixed(4)} mL/kg/h, Limit=${limit.toFixed(0)} EU/mL`);
});
