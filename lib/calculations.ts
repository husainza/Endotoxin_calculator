export interface AnimalModel {
  name: string
  weight: number // in kg
  isCustom?: boolean
}

export const animalModels: AnimalModel[] = [
  { name: 'Mouse', weight: 0.03 },
  { name: 'Gerbil', weight: 0.09 },
  { name: 'Rat', weight: 0.45 },
  { name: 'Rabbit', weight: 4 },
  { name: 'Monkey', weight: 8 },  // Corrected back to 8 kg as per the table
  { name: 'Baboon', weight: 12 },
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

// Reference tables from the paper
export const referenceTablesMg: Record<string, number[][]> = {
  'Mouse': [[0.001, 150], [0.010, 15], [0.025, 6]],
  'Gerbil': [[0.001, 450], [0.010, 45], [0.025, 18]],
  'Rat': [[0.001, 2250], [0.010, 225], [0.025, 90]],
  'Rabbit': [[0.010, 2000], [0.025, 800], [0.050, 400]],
  'Monkey': [[0.250, 160], [0.500, 80], [1.000, 40]],
  'Baboon': [[0.250, 240], [0.500, 120], [1.000, 60]],
}

export const referenceTablesMl: Record<string, number[][]> = {
  'Mouse': [[0.050, 3.00], [0.100, 1.50], [0.200, 0.75]],
  'Gerbil': [[0.050, 9.00], [0.100, 4.50], [0.200, 2.25]],
  'Rat': [[0.050, 45.00], [0.100, 22.50], [0.200, 11.25]],
  'Rabbit': [[0.10, 200], [0.20, 100], [0.50, 40]],
  'Monkey': [[0.10, 400], [0.20, 200], [0.50, 80]],
  'Baboon': [[0.10, 600], [0.20, 300], [0.50, 120]],
}