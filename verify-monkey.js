// Verify calculations for 3kg Cynomolgus monkey

const monkeyWeight = 3; // kg
const K = 5; // EU/kg

// Test cases for mg doses
console.log('Monkey (Cynomolgus) 3kg - mg doses:');
const mgDoses = [0.100, 0.250, 0.500];
mgDoses.forEach(dose => {
  const M = dose / monkeyWeight; // mg/kg/h
  const limit = K / M;
  console.log(`  ${dose} mg/h: M=${M.toFixed(4)} mg/kg/h, Limit=${limit.toFixed(0)} EU/mg`);
});

console.log('\nMonkey (Cynomolgus) 3kg - mL doses:');
const mlDoses = [0.10, 0.20, 0.50];
mlDoses.forEach(dose => {
  const M = dose / monkeyWeight; // mL/kg/h
  const limit = K / M;
  console.log(`  ${dose} mL/h: M=${M.toFixed(4)} mL/kg/h, Limit=${limit.toFixed(0)} EU/mL`);
});

console.log('\nFor mg/kg doses (all animals):');
console.log('  1 mg/kg/h: M=1, Limit=5 EU/mg (constant for all animals)');