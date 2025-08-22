'use client'

import { useState } from 'react'

interface TestInputProps {
  onTestValueSet: (value: number | null, unit: string, sampleName: string) => void
}

export function TestInput({ onTestValueSet }: TestInputProps) {
  const [sampleName, setSampleName] = useState<string>('')
  const [testReading, setTestReading] = useState<string>('')
  const [testUnit, setTestUnit] = useState<'EU/mg' | 'EU/mL'>('EU/mg')
  const [isSet, setIsSet] = useState(false)

  const handleSetTestValue = () => {
    if (!sampleName.trim()) {
      alert('Please enter a sample name')
      return
    }
    const reading = parseFloat(testReading)
    if (isNaN(reading) || reading < 0) {
      alert('Please enter a valid test reading')
      return
    }
    setIsSet(true)
    onTestValueSet(reading, testUnit, sampleName)
  }

  const handleReset = () => {
    setSampleName('')
    setTestReading('')
    setIsSet(false)
    onTestValueSet(null, testUnit, '')
  }

  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl shadow-lg p-8 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sample Information</h2>
        <p className="text-gray-600">Enter sample details and endotoxin test results</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sample Name/ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={sampleName}
            onChange={(e) => setSampleName(e.target.value)}
            placeholder="e.g., Batch-001, Sample-A"
            disabled={isSet}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endotoxin Test Reading <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={testReading}
              onChange={(e) => setTestReading(e.target.value)}
              placeholder="Enter endotoxin level"
              step="any"
              disabled={isSet}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <select
              value={testUnit}
              onChange={(e) => setTestUnit(e.target.value as 'EU/mg' | 'EU/mL')}
              disabled={isSet}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              disabled={!testReading || !sampleName}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Set Test Value
            </button>
          ) : (
            <>
              <div className="flex-1 px-4 py-3 bg-green-50 border border-green-300 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 font-medium">Sample:</span>
                    <span className="text-green-900 font-bold">{sampleName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 font-medium">Test Result:</span>
                    <span className="text-green-900 font-bold">{parseFloat(testReading).toFixed(2)} {testUnit}</span>
                  </div>
                </div>
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