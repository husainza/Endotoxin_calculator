'use client'

import { useState } from 'react'
import { AnimalSelector } from './AnimalSelector'
import { DoseInput } from './DoseInput'
import { ResultsDisplay } from './ResultsDisplay'
import { ReferenceTables } from './ReferenceTables'
import { TestEvaluation } from './TestEvaluation'
import { TestInput } from './TestInput'
import { ExportReport } from './ExportReport'
import {
  animalModels,
  calculateEndotoxinLimit,
  type AnimalModel,
  type DoseUnit,
  type DoseFrequency,
  type RouteOfAdministration,
  type CalculationResult
} from '@/lib/calculations'

export function Calculator() {
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalModel>(animalModels[0])
  const [dose, setDose] = useState<string>('')
  const [doseUnit, setDoseUnit] = useState<DoseUnit>('mg')
  const [frequency, setFrequency] = useState<DoseFrequency>('hourly')
  const [route, setRoute] = useState<RouteOfAdministration>('standard')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [showReferenceTables, setShowReferenceTables] = useState(false)
  const [testValue, setTestValue] = useState<number | null>(null)
  const [testUnit, setTestUnit] = useState<string>('EU/mg')
  const [sampleName, setSampleName] = useState<string>('')

  const handleCalculate = () => {
    const doseValue = parseFloat(dose)
    if (isNaN(doseValue) || doseValue <= 0) {
      alert('Please enter a valid dose value')
      return
    }

    if (selectedAnimal.isCustom && (!selectedAnimal.name || selectedAnimal.name === 'Custom' || selectedAnimal.weight <= 0)) {
      alert('Please enter a valid species name and body weight')
      return
    }

    const calculationResult = calculateEndotoxinLimit({
      animalModel: selectedAnimal,
      dose: doseValue,
      doseUnit,
      frequency,
      route
    })

    setResult(calculationResult)
  }

  const handleReset = () => {
    setDose('')
    setResult(null)
  }

  const handleTestValueSet = (value: number | null, unit: string, name: string) => {
    setTestValue(value)
    setTestUnit(unit)
    setSampleName(name)
    // Reset calculation when test value changes
    if (value === null) {
      setResult(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Test Input Section - Always visible at top */}
      <TestInput onTestValueSet={handleTestValueSet} />
      
      {/* Calculation Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Calculate Endotoxin Limit</h3>
          <p className="text-gray-600">
            Enter dose and animal information to determine the acceptable limit
          </p>
        </div>

        <div className="space-y-6">
          <AnimalSelector
            selectedAnimal={selectedAnimal}
            onAnimalChange={setSelectedAnimal}
          />

          <DoseInput
            dose={dose}
            doseUnit={doseUnit}
            frequency={frequency}
            route={route}
            onDoseChange={setDose}
            onDoseUnitChange={setDoseUnit}
            onFrequencyChange={setFrequency}
            onRouteChange={setRoute}
          />

          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Calculate Limit
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setShowReferenceTables(!showReferenceTables)}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all"
            >
              {showReferenceTables ? 'Hide' : 'Show'} Quick Reference
            </button>
          </div>

          {result && (
            <>
              {/* Test Evaluation First */}
              {testValue !== null && testUnit === result.unit && (
                <>
                  <TestEvaluation 
                    endotoxinLimit={result.endotoxinLimit}
                    unit={result.unit}
                    presetTestValue={testValue}
                  />
                  {sampleName && (
                    <ExportReport
                      sampleName={sampleName}
                      testValue={testValue}
                      testUnit={testUnit}
                      endotoxinLimit={result.endotoxinLimit}
                      animal={selectedAnimal}
                      dose={parseFloat(dose)}
                      doseUnit={doseUnit}
                      frequency={frequency}
                      route={route}
                      result={result}
                    />
                  )}
                </>
              )}
              {testValue !== null && testUnit !== result.unit && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Unit Mismatch:</strong> Your test was measured in {testUnit} but the limit is calculated in {result.unit}. 
                    Please ensure units match for accurate evaluation.
                  </p>
                </div>
              )}
              
              {/* Calculation Display After */}
              <ResultsDisplay 
                result={result} 
                animal={selectedAnimal}
                dose={parseFloat(dose)}
                doseUnit={doseUnit}
                frequency={frequency}
              />
            </>
          )}
        </div>
      </div>

      {showReferenceTables && (
        <div className="mt-6">
          <ReferenceTables />
        </div>
      )}
    </div>
  )
}