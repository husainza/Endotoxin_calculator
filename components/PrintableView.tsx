'use client'

import type { CalculationResult, AnimalModel } from '@/lib/calculations'

interface TestReading {
  id: string
  sampleName: string
  value: number
  unit: 'EU/mg' | 'EU/mL'
}

interface PrintableViewProps {
  result: CalculationResult | null
  animal: AnimalModel
  dose: string
  doseUnit: string
  frequency: string
  route: string
  testValue: number | null
  testUnit: string
  sampleName: string
  multipleReadings?: TestReading[]
}

export function PrintableView({
  result,
  animal,
  dose,
  doseUnit,
  frequency,
  route,
  testValue,
  testUnit,
  sampleName,
  multipleReadings
}: PrintableViewProps) {
  if (!result) return null

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const isMultiple = multipleReadings && multipleReadings.length > 1

  return (
    <div className="print-only">
      {/* Print Header */}
      <div className="print-header">
        <h1 className="text-2xl font-bold">Endotoxin Limit Calculation Report</h1>
        <p className="text-sm mt-2">{date}</p>
      </div>

      {/* Sample Information */}
      {(sampleName || isMultiple) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Sample Information</h2>
          {isMultiple ? (
            <p>Multiple Samples: {multipleReadings.length} samples tested</p>
          ) : (
            <p>Sample ID: {sampleName || 'Not specified'}</p>
          )}
        </div>
      )}

      {/* Calculation Parameters */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Calculation Parameters</h2>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="font-medium">Animal Model:</td>
              <td>{animal.name} ({animal.weight} kg)</td>
            </tr>
            <tr>
              <td className="font-medium">Dose:</td>
              <td>{dose} {doseUnit} {frequency === 'daily' ? 'per day' : 'per hour'}</td>
            </tr>
            <tr>
              <td className="font-medium">Route:</td>
              <td>{route === 'intrathecal' ? 'Intrathecal' : 'Standard'}</td>
            </tr>
            <tr>
              <td className="font-medium">K Value:</td>
              <td>{result.K} EU/kg</td>
            </tr>
            <tr>
              <td className="font-medium">M Value:</td>
              <td>{result.M.toFixed(4)} {doseUnit.replace('/kg', '')}/kg/h</td>
            </tr>
            <tr>
              <td className="font-medium">Endotoxin Limit:</td>
              <td className="font-bold">{result.endotoxinLimit.toFixed(2)} {result.unit}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Test Results */}
      {testValue !== null && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Test Results</h2>
          {isMultiple ? (
            <table className="w-full">
              <thead>
                <tr>
                  <th>Sample</th>
                  <th>Test Value</th>
                  <th>% of Limit</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {multipleReadings.map((reading) => {
                  const pass = reading.value <= result.endotoxinLimit
                  const percentage = (reading.value / result.endotoxinLimit) * 100
                  return (
                    <tr key={reading.id}>
                      <td>{reading.sampleName}</td>
                      <td>{reading.value.toFixed(2)} {reading.unit}</td>
                      <td>{percentage.toFixed(1)}%</td>
                      <td className={pass ? 'text-green-600' : 'text-red-600'}>
                        {pass ? 'Below' : 'Above'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-medium">Test Value:</td>
                  <td>{testValue.toFixed(2)} {testUnit}</td>
                </tr>
                <tr>
                  <td className="font-medium">Endotoxin Limit:</td>
                  <td>{result.endotoxinLimit.toFixed(2)} {result.unit}</td>
                </tr>
                <tr>
                  <td className="font-medium">% of Limit:</td>
                  <td>{((testValue / result.endotoxinLimit) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td className="font-medium">Result:</td>
                  <td className={testValue <= result.endotoxinLimit ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {testValue <= result.endotoxinLimit ? 'Below USP Limit' : 'Above USP Limit'}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="print-footer">
        <p className="text-xs">
          Calculation based on Malyala & Singh (2007) | USP {'<85>'} Bacterial Endotoxins Test
        </p>
      </div>
    </div>
  )
}