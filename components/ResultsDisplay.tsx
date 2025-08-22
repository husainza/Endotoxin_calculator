'use client'

import type { CalculationResult, AnimalModel } from '@/lib/calculations'

interface ResultsDisplayProps {
  result: CalculationResult
  animal: AnimalModel
  dose: number
  doseUnit: string
  frequency: string
}

export function ResultsDisplay({ result, animal, dose, doseUnit, frequency }: ResultsDisplayProps) {
  const isPerKg = doseUnit.includes('/kg')
  const actualDose = isPerKg ? dose * animal.weight : dose
  const hourlyDose = frequency === 'daily' ? actualDose / 24 : actualDose
  
  return (
    <div className="mt-6 space-y-6">
      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Endotoxin Limit Calculation
        </h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-blue-200">
            <span className="text-gray-700">Animal Model:</span>
            <span className="font-semibold">{animal.name} ({animal.weight} kg)</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-blue-200">
            <span className="text-gray-700">K (Threshold Pyrogenic Dose):</span>
            <span className="font-semibold">{result.K} EU/kg</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-blue-200">
            <span className="text-gray-700">M (Dose per kg per hour):</span>
            <span className="font-semibold">{result.M.toFixed(4)} {result.unit.replace('EU/', '')}/kg/h</span>
          </div>
          
          <div className="flex justify-between items-center py-4 bg-gradient-to-r from-indigo-100 to-blue-100 px-4 -mx-4 rounded-lg">
            <span className="text-lg font-medium text-indigo-900">Endotoxin Limit:</span>
            <span className="text-3xl font-bold text-indigo-900">
              {result.endotoxinLimit.toFixed(2)} {result.unit}
            </span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> The formulation must contain less than {result.endotoxinLimit.toFixed(2)} {result.unit} of endotoxin for safe administration.
          </p>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Calculation</h3>
        
        <div className="space-y-4 text-sm">
          <div className="p-3 bg-white rounded border border-gray-300">
            <p className="font-semibold text-gray-700 mb-2">Step 1: Determine Input Values</p>
            <ul className="space-y-1 text-gray-600 ml-4">
              <li>• Dose: {dose} {doseUnit}</li>
              <li>• Animal Weight: {animal.weight} kg</li>
              <li>• Frequency: {frequency === 'daily' ? 'Per day (24 hours)' : 'Per hour'}</li>
              <li>• K value: {result.K} EU/kg (threshold pyrogenic dose)</li>
            </ul>
          </div>

          {isPerKg && (
            <div className="p-3 bg-white rounded border border-gray-300">
              <p className="font-semibold text-gray-700 mb-2">Step 2: Convert per kg dose to total dose</p>
              <p className="text-gray-600 ml-4 font-mono">
                Total dose = {dose} {doseUnit} × {animal.weight} kg = {actualDose.toFixed(4)} {doseUnit.replace('/kg', '')}
              </p>
            </div>
          )}

          {frequency === 'daily' && (
            <div className="p-3 bg-white rounded border border-gray-300">
              <p className="font-semibold text-gray-700 mb-2">Step {isPerKg ? '3' : '2'}: Convert daily dose to hourly dose</p>
              <p className="text-gray-600 ml-4 font-mono">
                Hourly dose = {actualDose.toFixed(4)} {doseUnit.replace('/kg', '')} ÷ 24 hours = {hourlyDose.toFixed(4)} {doseUnit.replace('/kg', '')}/h
              </p>
            </div>
          )}

          <div className="p-3 bg-white rounded border border-gray-300">
            <p className="font-semibold text-gray-700 mb-2">
              Step {isPerKg ? (frequency === 'daily' ? '4' : '3') : (frequency === 'daily' ? '3' : '2')}: Calculate M (dose per kg body weight per hour)
            </p>
            <p className="text-gray-600 ml-4 font-mono">
              M = {hourlyDose.toFixed(4)} {doseUnit.replace('/kg', '')}/h ÷ {animal.weight} kg = {result.M.toFixed(4)} {doseUnit.replace('/kg', '')}/kg/h
            </p>
          </div>

          <div className="p-3 bg-white rounded border border-gray-300">
            <p className="font-semibold text-gray-700 mb-2">
              Step {isPerKg ? (frequency === 'daily' ? '5' : '4') : (frequency === 'daily' ? '4' : '3')}: Calculate Endotoxin Limit
            </p>
            <p className="text-gray-600 ml-4 font-mono">
              Endotoxin Limit = K ÷ M = {result.K} EU/kg ÷ {result.M.toFixed(4)} {doseUnit.replace('/kg', '')}/kg/h
            </p>
            <p className="text-gray-600 ml-4 font-mono font-bold mt-2">
              = {result.endotoxinLimit.toFixed(2)} {result.unit}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
          <p className="text-sm text-green-800">
            <strong>Formula Summary:</strong> Endotoxin Limit = K/M where K = {result.K} EU/kg and M = {result.M.toFixed(4)} {doseUnit.replace('/kg', '')}/kg/h
          </p>
        </div>
      </div>
    </div>
  )
}