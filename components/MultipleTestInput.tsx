'use client'

import { useState } from 'react'

interface TestReading {
  id: string
  sampleName: string
  value: number
  unit: 'EU/mg' | 'EU/mL'
}

interface MultipleTestInputProps {
  onTestValuesSet: (readings: TestReading[]) => void
  onReset: () => void
}

export function MultipleTestInput({ onTestValuesSet, onReset }: MultipleTestInputProps) {
  const [readings, setReadings] = useState<TestReading[]>([])
  const [currentSampleName, setCurrentSampleName] = useState('')
  const [currentValue, setCurrentValue] = useState('')
  const [currentUnit, setCurrentUnit] = useState<'EU/mg' | 'EU/mL'>('EU/mg')
  const [isLocked, setIsLocked] = useState(false)

  const handleAddReading = () => {
    const value = parseFloat(currentValue)
    if (isNaN(value) || value < 0) {
      alert('Please enter a valid test reading')
      return
    }

    const newReading: TestReading = {
      id: Date.now().toString(),
      sampleName: currentSampleName.trim() || `Sample ${readings.length + 1}`,
      value,
      unit: currentUnit
    }

    const updatedReadings = [...readings, newReading]
    setReadings(updatedReadings)
    
    // Clear inputs for next reading
    setCurrentSampleName('')
    setCurrentValue('')
  }

  const handleRemoveReading = (id: string) => {
    if (isLocked) return
    setReadings(readings.filter(r => r.id !== id))
  }

  const handleConfirmReadings = () => {
    if (readings.length === 0) {
      alert('Please add at least one test reading')
      return
    }
    setIsLocked(true)
    onTestValuesSet(readings)
  }

  const handleReset = () => {
    setReadings([])
    setCurrentSampleName('')
    setCurrentValue('')
    setCurrentUnit('EU/mg')
    setIsLocked(false)
    onReset()
  }

  const maxValue = readings.length > 0 
    ? Math.max(...readings.map(r => r.value))
    : 0

  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl shadow-lg p-8 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sample Test Results</h2>
        <p className="text-gray-600">Enter endotoxin test readings (up to 10 samples)</p>
      </div>

      {!isLocked && (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sample Name/ID <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                value={currentSampleName}
                onChange={(e) => setCurrentSampleName(e.target.value)}
                placeholder={`e.g., Sample ${readings.length + 1}`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endotoxin Reading <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder="Enter value"
                  step="any"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  value={currentUnit}
                  onChange={(e) => setCurrentUnit(e.target.value as 'EU/mg' | 'EU/mL')}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="EU/mg">EU/mg</option>
                  <option value="EU/mL">EU/mL</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddReading}
              disabled={!currentValue || readings.length >= 10}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Add Reading {readings.length > 0 && `(${readings.length}/10)`}
            </button>
            {readings.length > 0 && (
              <button
                onClick={handleConfirmReadings}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md"
              >
                Confirm & Calculate
              </button>
            )}
          </div>
        </div>
      )}

      {/* Display readings */}
      {readings.length > 0 && (
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Readings:</h3>
            <div className="space-y-2">
              {readings.map((reading) => (
                <div
                  key={reading.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">{reading.sampleName}:</span>
                    <span className="ml-2 text-gray-600">
                      {reading.value.toFixed(2)} {reading.unit}
                    </span>
                  </div>
                  {!isLocked && (
                    <button
                      onClick={() => handleRemoveReading(reading.id)}
                      className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Note about using maximum value */}
          {readings.length > 1 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> The maximum value ({maxValue.toFixed(2)} {readings[0].unit}) will be used for safety calculations. Each sample will be evaluated individually for pass/fail determination.
              </p>
            </div>
          )}

          {isLocked && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reset All
              </button>
              <div className="flex-1 p-3 bg-green-50 border border-green-300 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Locked:</strong> Using maximum value ({maxValue.toFixed(2)} {readings[0].unit}) for calculations
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}