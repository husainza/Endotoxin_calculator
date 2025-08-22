'use client'

import React, { useState } from 'react'

interface TestEvaluationProps {
  endotoxinLimit: number
  unit: string
  presetTestValue?: number
}

export function TestEvaluation({ endotoxinLimit, unit, presetTestValue }: TestEvaluationProps) {
  const [testReading, setTestReading] = useState<string>(presetTestValue?.toString() || '')
  const [evaluation, setEvaluation] = useState<{
    pass: boolean
    percentage: number
    margin: number
  } | null>(null)

  // Auto-evaluate if preset value is provided
  React.useEffect(() => {
    if (presetTestValue !== undefined && presetTestValue !== null) {
      const pass = presetTestValue <= endotoxinLimit
      const percentage = (presetTestValue / endotoxinLimit) * 100
      const margin = endotoxinLimit - presetTestValue

      setEvaluation({
        pass,
        percentage,
        margin
      })
    }
  }, [presetTestValue, endotoxinLimit])

  const handleEvaluate = () => {
    const reading = parseFloat(testReading)
    if (isNaN(reading) || reading < 0) {
      alert('Please enter a valid test reading')
      return
    }

    const pass = reading <= endotoxinLimit
    const percentage = (reading / endotoxinLimit) * 100
    const margin = endotoxinLimit - reading

    setEvaluation({
      pass,
      percentage,
      margin
    })
  }

  const getStatusColor = () => {
    if (!evaluation) return 'gray'
    if (evaluation.pass) {
      if (evaluation.percentage <= 50) return 'green'
      if (evaluation.percentage <= 80) return 'yellow'
      return 'orange'
    }
    return 'red'
  }

  const getStatusMessage = () => {
    if (!evaluation) return ''
    if (evaluation.pass) {
      if (evaluation.percentage <= 50) return 'Excellent - Well below limit'
      if (evaluation.percentage <= 80) return 'Good - Within safe range'
      return 'Caution - Approaching limit'
    }
    return 'Failed - Exceeds limit'
  }

  return (
    <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Test Evaluation Results
      </h3>

      <div className="space-y-4">
        {!presetTestValue && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Test Reading
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={testReading}
                  onChange={(e) => setTestReading(e.target.value)}
                  placeholder={`Enter endotoxin level`}
                  step="any"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-gray-700">
                  {unit}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter the endotoxin level detected in your sample
              </p>
            </div>

            <button
              onClick={handleEvaluate}
              disabled={!testReading}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Evaluate Test Result
            </button>
          </>
        )}

        {evaluation && (
          <div className={`mt-4 p-4 rounded-lg border-2 ${
            evaluation.pass 
              ? evaluation.percentage <= 50 
                ? 'bg-green-50 border-green-300' 
                : evaluation.percentage <= 80
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-orange-50 border-orange-300'
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-2xl font-bold ${
                evaluation.pass 
                  ? evaluation.percentage <= 50 
                    ? 'text-green-700' 
                    : evaluation.percentage <= 80
                      ? 'text-yellow-700'
                      : 'text-orange-700'
                  : 'text-red-700'
              }`}>
                {evaluation.pass ? 'PASS' : 'FAIL'}
              </span>
              <span className={`text-lg font-semibold ${
                evaluation.pass 
                  ? evaluation.percentage <= 50 
                    ? 'text-green-600' 
                    : evaluation.percentage <= 80
                      ? 'text-yellow-600'
                      : 'text-orange-600'
                  : 'text-red-600'
              }`}>
                {evaluation.percentage.toFixed(1)}% of limit
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Test Reading:</span>
                <span className="font-semibold">{parseFloat(testReading).toFixed(2)} {unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Endotoxin Limit:</span>
                <span className="font-semibold">{endotoxinLimit.toFixed(2)} {unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {evaluation.pass ? 'Safety Margin:' : 'Exceeded By:'}
                </span>
                <span className={`font-semibold ${
                  evaluation.pass ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(evaluation.margin).toFixed(2)} {unit}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-300">
              <p className={`text-sm font-medium ${
                evaluation.pass 
                  ? evaluation.percentage <= 50 
                    ? 'text-green-700' 
                    : evaluation.percentage <= 80
                      ? 'text-yellow-700'
                      : 'text-orange-700'
                  : 'text-red-700'
              }`}>
                {getStatusMessage()}
              </p>
              {evaluation.pass && evaluation.percentage > 80 && (
                <p className="text-xs text-orange-600 mt-1">
                  Warning: Consider retesting or additional purification
                </p>
              )}
              {!evaluation.pass && (
                <p className="text-xs text-red-600 mt-1">
                  Action Required: Sample requires further purification to reduce endotoxin levels
                </p>
              )}
            </div>

            {/* Visual Progress Bar */}
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-gray-600">
                      Endotoxin Level
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold inline-block ${
                      evaluation.pass ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {evaluation.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-4 mb-1 text-xs flex rounded-full bg-gray-200">
                  <div
                    style={{ width: `${Math.min(evaluation.percentage, 100)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                      evaluation.pass 
                        ? evaluation.percentage <= 50 
                          ? 'bg-green-500' 
                          : evaluation.percentage <= 80
                            ? 'bg-yellow-500'
                            : 'bg-orange-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100% (Limit)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}