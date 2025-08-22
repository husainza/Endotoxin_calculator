'use client'

import { useState } from 'react'

interface TestInputProps {
  onTestValueSet: (value: number | null, unit: string) => void
}

export function TestInput({ onTestValueSet }: TestInputProps) {
  const [testReading, setTestReading] = useState<string>('')
  const [testUnit, setTestUnit] = useState<'EU/mg' | 'EU/mL'>('EU/mg')
  const [isSet, setIsSet] = useState(false)

  const handleSetTestValue = () => {
    const reading = parseFloat(testReading)
    if (isNaN(reading) || reading < 0) {
      alert('Please enter a valid test reading')
      return
    }
    setIsSet(true)
    onTestValueSet(reading, testUnit)
  }

  const handleReset = () => {
    setTestReading('')
    setIsSet(false)
    onTestValueSet(null, testUnit)
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg p-8 border border-purple-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">🧪</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Sample Evaluation</h2>
          <p className="text-gray-600">Enter your endotoxin test results to evaluate against limits</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Test Reading
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={testReading}
              onChange={(e) => setTestReading(e.target.value)}
              placeholder="Enter endotoxin level"
              step="any"
              disabled={isSet}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <select
              value={testUnit}
              onChange={(e) => setTestUnit(e.target.value as 'EU/mg' | 'EU/mL')}
              disabled={isSet}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="EU/mg">EU/mg</option>
              <option value="EU/mL">EU/mL</option>
            </select>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter the endotoxin concentration detected in your sample
          </p>
        </div>

        <div className="flex gap-3">
          {!isSet ? (
            <button
              onClick={handleSetTestValue}
              disabled={!testReading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set Test Value
            </button>
          ) : (
            <>
              <div className="flex-1 px-4 py-3 bg-green-100 border border-green-300 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-green-800 font-medium">Test value set:</span>
                  <span className="ml-2 text-green-900 font-bold">{parseFloat(testReading).toFixed(2)} {testUnit}</span>
                </div>
                <span className="text-2xl">✅</span>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Change
              </button>
            </>
          )}
        </div>

        {isSet && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Next Step:</strong> Enter the dose and animal information below to calculate the endotoxin limit and evaluate if your sample passes.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}