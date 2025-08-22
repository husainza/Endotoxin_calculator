'use client'

import type { AnimalModel } from '@/lib/calculations'

interface MaximumSafeDoseProps {
  testValue: number
  testUnit: string
  animal: AnimalModel
  doseUnit: string
  frequency: 'hourly' | 'daily'
  route: 'standard' | 'intrathecal'
}

export function MaximumSafeDose({
  testValue,
  testUnit,
  animal,
  doseUnit,
  frequency,
  route
}: MaximumSafeDoseProps) {
  // K value based on route
  const K = route === 'intrathecal' ? 0.2 : 5 // EU/kg

  // Calculate maximum safe dose based on the test value
  // Formula: Endotoxin Limit = K/M, so M = K/Endotoxin Limit
  // Then dose = M * weight (for absolute doses) or dose = M (for per kg doses)
  
  const maxM = K / testValue // Maximum M that would keep us at the limit
  
  let maxSafeDose: number
  let explanation: string

  if (doseUnit === 'mg/kg' || doseUnit === 'mL/kg') {
    // For per kg doses, M is already the dose per kg per hour
    maxSafeDose = frequency === 'daily' ? maxM * 24 : maxM
    explanation = `To stay within the endotoxin limit of ${testValue.toFixed(2)} ${testUnit}, the maximum ${doseUnit} dose should be ${maxSafeDose.toFixed(3)} ${doseUnit}${frequency === 'daily' ? ' per day' : ' per hour'}.`
  } else {
    // For absolute doses, need to multiply by body weight
    const maxHourlyDose = maxM * animal.weight
    maxSafeDose = frequency === 'daily' ? maxHourlyDose * 24 : maxHourlyDose
    explanation = `To stay within the endotoxin limit of ${testValue.toFixed(2)} ${testUnit}, the maximum ${doseUnit} dose for a ${animal.weight}kg ${animal.name} should be ${maxSafeDose.toFixed(3)} ${doseUnit}${frequency === 'daily' ? ' per day' : ' per hour'}.`
  }

  const recommendedDose = maxSafeDose * 0.9 // 90% of max for safety margin

  return (
    <div className="mt-4 p-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg">
      <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Maximum Safe Dose Calculation
      </h3>
      
      <div className="space-y-3">
        <div className="p-3 bg-white rounded border border-orange-200">
          <p className="text-sm font-medium text-gray-700 mb-1">Given Parameters:</p>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• Test Result: {testValue.toFixed(2)} {testUnit}</li>
            <li>• Animal: {animal.name} ({animal.weight} kg)</li>
            <li>• Route: {route === 'intrathecal' ? 'Intrathecal' : 'Standard'}</li>
            <li>• K value: {K} EU/kg</li>
          </ul>
        </div>

        <div className="p-3 bg-white rounded border border-orange-200">
          <p className="text-sm font-medium text-gray-700 mb-1">Calculation:</p>
          <div className="text-sm text-gray-600 space-y-1 ml-4">
            <p>• Maximum M = K ÷ Test Value = {K} ÷ {testValue.toFixed(2)} = {maxM.toFixed(4)} {doseUnit.replace('/kg', '')}/kg/h</p>
            {doseUnit.includes('/kg') ? (
              <p>• Maximum Dose = {maxM.toFixed(4)} {doseUnit}/h{frequency === 'daily' ? ' × 24h = ' + maxSafeDose.toFixed(3) + ' ' + doseUnit + '/day' : ''}</p>
            ) : (
              <p>• Maximum Dose = {maxM.toFixed(4)} × {animal.weight} kg = {(maxM * animal.weight).toFixed(3)} {doseUnit}/h{frequency === 'daily' ? ' × 24h = ' + maxSafeDose.toFixed(3) + ' ' + doseUnit + '/day' : ''}</p>
            )}
          </div>
        </div>

        <div className="p-3 bg-red-50 rounded border border-red-300">
          <p className="text-sm font-bold text-red-800 mb-2">Maximum Safe Dose:</p>
          <p className="text-2xl font-bold text-red-900">
            {maxSafeDose.toFixed(3)} {doseUnit}
            <span className="text-sm font-normal text-red-700 ml-2">
              {frequency === 'daily' ? 'per day' : 'per hour'}
            </span>
          </p>
        </div>

        <div className="p-3 bg-green-50 rounded border border-green-300">
          <p className="text-sm font-bold text-green-800 mb-2">Recommended Dose (90% of maximum):</p>
          <p className="text-xl font-bold text-green-900">
            {recommendedDose.toFixed(3)} {doseUnit}
            <span className="text-sm font-normal text-green-700 ml-2">
              {frequency === 'daily' ? 'per day' : 'per hour'}
            </span>
          </p>
          <p className="text-xs text-green-700 mt-1">
            This provides a 10% safety margin below the endotoxin limit
          </p>
        </div>

        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded">
          <p className="text-xs text-yellow-800">
            <strong>Important:</strong> {explanation} Consider additional purification to reduce endotoxin levels or adjust the dosing regimen to stay within safe limits.
          </p>
        </div>
      </div>
    </div>
  )
}