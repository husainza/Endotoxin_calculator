'use client'

import { useState } from 'react'
import { AnimalSelector } from './AnimalSelector'
import { DoseInput } from './DoseInput'
import { ResultsDisplay } from './ResultsDisplay'
import { TestEvaluation } from './TestEvaluation'
import { TestInput } from './TestInput'
import { MultipleTestInput } from './MultipleTestInput'
import { MaximumSafeDose } from './MaximumSafeDose'
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
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalModel>(animalModels[2]) // Monkey as default
  const [dose, setDose] = useState<string>('')
  const [doseUnit, setDoseUnit] = useState<DoseUnit>('mg/kg') // mg/kg as default
  const [frequency, setFrequency] = useState<DoseFrequency>('hourly')
  const [route, setRoute] = useState<RouteOfAdministration>('standard')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [testValue, setTestValue] = useState<number | null>(null)
  const [testUnit, setTestUnit] = useState<string>('EU/mg')
  const [sampleName, setSampleName] = useState<string>('')
  const [useMultipleReadings, setUseMultipleReadings] = useState(false)
  const [multipleReadings, setMultipleReadings] = useState<any[]>([])

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

  const handleResetAll = () => {
    // Reset everything to initial state
    setSelectedAnimal(animalModels[2])
    setDose('')
    setDoseUnit('mg/kg')
    setFrequency('hourly')
    setRoute('standard')
    setResult(null)
    setTestValue(null)
    setTestUnit('EU/mg')
    setSampleName('')
    setUseMultipleReadings(false)
    setMultipleReadings([])
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

  const handleMultipleReadingsSet = (readings: any[]) => {
    setMultipleReadings(readings)
    if (readings.length > 0) {
      // Use the maximum value for safety
      const maxReading = Math.max(...readings.map((r: any) => r.value))
      const unit = readings[0].unit
      // Find the sample with max value
      const maxSample = readings.find((r: any) => r.value === maxReading)
      setTestValue(maxReading)
      setTestUnit(unit)
      setSampleName(maxSample?.sampleName || 'Multiple Samples')
    }
  }

  const handleMultipleReadingsReset = () => {
    setMultipleReadings([])
    setTestValue(null)
    setTestUnit('EU/mg')
    setSampleName('')
    setResult(null)
  }

  return (
    <div className="space-y-6">
      {/* Toggle for single vs multiple readings */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setUseMultipleReadings(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              !useMultipleReadings 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Single Reading
          </button>
          <button
            onClick={() => setUseMultipleReadings(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              useMultipleReadings 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Multiple Readings (up to 10)
          </button>
        </div>
        <button
          onClick={handleResetAll}
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset All
        </button>
      </div>

      {/* Test Input Section - Show based on toggle */}
      {useMultipleReadings ? (
        <MultipleTestInput 
          onTestValuesSet={handleMultipleReadingsSet} 
          onReset={handleMultipleReadingsReset}
        />
      ) : (
        <TestInput onTestValueSet={handleTestValueSet} />
      )}
      
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
          </div>

          {result && (
            <>
              {/* Show info about multiple readings if applicable */}
              {multipleReadings.length > 1 && testValue !== null && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Multiple Readings Analysis:</strong> Using maximum value of {testValue.toFixed(2)} {testUnit} from {multipleReadings.length} samples for safety evaluation.
                  </p>
                </div>
              )}
              
              {/* Test Evaluation First */}
              {testValue !== null && testUnit === result.unit && (
                <>
                  <TestEvaluation 
                    endotoxinLimit={result.endotoxinLimit}
                    unit={result.unit}
                    presetTestValue={testValue}
                  />
                  
                  {/* Show maximum safe dose calculation if limit is exceeded */}
                  {testValue > result.endotoxinLimit && (
                    <MaximumSafeDose
                      testValue={testValue}
                      testUnit={testUnit}
                      animal={selectedAnimal}
                      doseUnit={doseUnit}
                      frequency={frequency}
                      route={route}
                    />
                  )}
                  {sampleName ? (
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
                  ) : (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600 text-center">
                        To generate a PDF report, please provide a Sample Name/ID above
                      </p>
                    </div>
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
    </div>
  )
}