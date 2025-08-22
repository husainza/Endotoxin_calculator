export interface AnimalModel {
  name: string
  weight: number // in kg
  isCustom?: boolean
}

export const animalModels: AnimalModel[] = [
  { name: 'Mouse', weight: 0.03 },
  { name: 'Rat', weight: 0.45 },
  { name: 'Monkey (Cynomolgus)', weight: 3 },  // Cynomolgus monkeys typical weight
  { name: 'Human', weight: 70 },  // Average adult human weight
  { name: 'Custom', weight: 0, isCustom: true },
]

export type DoseUnit = 'mg' | 'mL' | 'mg/kg' | 'mL/kg'
export type DoseFrequency = 'hourly' | 'daily'
export type RouteOfAdministration = 'standard' | 'intrathecal'

export interface CalculationInput {
  animalModel: AnimalModel
  dose: number
  doseUnit: DoseUnit
  frequency: DoseFrequency
  route: RouteOfAdministration
}

export interface CalculationResult {
  M: number // Maximum dose per kg body weight per hour
  K: number // Threshold pyrogenic dose
  endotoxinLimit: number // K/M
  unit: string // EU/mg or EU/mL
}

export function calculateEndotoxinLimit(input: CalculationInput): CalculationResult {
  const { animalModel, dose, doseUnit, frequency, route } = input
  
  // K value based on route of administration
  const K = route === 'intrathecal' ? 0.2 : 5 // EU/kg
  
  // Calculate M (dose per kg body weight per hour)
  let M: number
  
  if (doseUnit === 'mg/kg' || doseUnit === 'mL/kg') {
    // For per kg doses, the dose is already per kg
    // Just need to convert to hourly if daily
    M = frequency === 'daily' ? dose / 24 : dose
  } else {
    // For absolute doses (mg or mL), need to divide by body weight
    // First convert to hourly if daily
    const hourlyDose = frequency === 'daily' ? dose / 24 : dose
    // Then divide by body weight to get per kg
    M = hourlyDose / animalModel.weight
  }
  
  // Calculate endotoxin limit
  const endotoxinLimit = K / M
  
  // Format unit - for /kg units, the result is still EU/mg or EU/mL
  const baseUnit = doseUnit.replace('/kg', '')
  const unit = `EU/${baseUnit}`
  
  return {
    M,
    K,
    endotoxinLimit,
    unit
  }
}

// Reference tables from the paper (updated for 3kg Cynomolgus monkey and 70kg Human)
export const referenceTablesMg: Record<string, number[][]> = {
  'Mouse': [[0.001, 150], [0.010, 15], [0.025, 6]],
  'Rat': [[0.001, 2250], [0.010, 225], [0.025, 90]],
  'Monkey (Cynomolgus)': [[0.100, 150], [0.250, 60], [0.500, 30]],  // Updated for 3kg weight
  'Human': [[1.000, 350], [2.500, 140], [5.000, 70]],  // For 70kg human
}

export const referenceTablesMl: Record<string, number[][]> = {
  'Mouse': [[0.050, 3.00], [0.100, 1.50], [0.200, 0.75]],
  'Rat': [[0.050, 45.00], [0.100, 22.50], [0.200, 11.25]],
  'Monkey (Cynomolgus)': [[0.10, 150], [0.20, 75], [0.50, 30]],  // Updated for 3kg weight
  'Human': [[1.00, 350], [2.00, 175], [5.00, 70]],  // For 70kg human
}