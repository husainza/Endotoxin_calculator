'use client'

interface TestReading {
  id: string
  sampleName: string
  value: number
  unit: 'EU/mg' | 'EU/mL'
}

interface MultipleTestEvaluationProps {
  readings: TestReading[]
  endotoxinLimit: number
  unit: string
}

export function MultipleTestEvaluation({ readings, endotoxinLimit, unit }: MultipleTestEvaluationProps) {
  const allPass = readings.every(r => r.value <= endotoxinLimit)
  const somePass = readings.some(r => r.value <= endotoxinLimit)
  const passingCount = readings.filter(r => r.value <= endotoxinLimit).length
  const failingCount = readings.length - passingCount
  

  return (
    <div className="mt-6 space-y-4">
      {/* Overall Summary */}
      <div className={`p-4 rounded-lg border-2 ${
        allPass ? 'bg-green-50 border-green-300' : 
        somePass ? 'bg-yellow-50 border-yellow-300' : 
        'bg-red-50 border-red-300'
      }`}>
        <h3 className="text-lg font-bold mb-2 flex items-center">
          {allPass ? (
            <>
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800">All Samples Below USP Limit</span>
            </>
          ) : somePass ? (
            <>
              <svg className="w-6 h-6 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-yellow-800">Mixed Results</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">All Samples Above USP Limit</span>
            </>
          )}
        </h3>
        <div className="text-sm">
          <p className={allPass ? 'text-green-700' : somePass ? 'text-yellow-700' : 'text-red-700'}>
            <strong>Summary:</strong> {passingCount} of {readings.length} samples are below the USP limit of {endotoxinLimit.toFixed(2)} {unit}
          </p>
          {failingCount > 0 && (
            <p className="text-red-700 mt-1">
              <strong>Note:</strong> {failingCount} sample{failingCount > 1 ? 's exceed' : ' exceeds'} the USP limit
            </p>
          )}
        </div>
      </div>

      {/* Individual Sample Results */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-semibold text-gray-800">Individual Sample Results</h4>
        </div>
        <div className="divide-y divide-gray-200">
          {readings.map((reading) => {
            const pass = reading.value <= endotoxinLimit
            const percentage = (reading.value / endotoxinLimit) * 100
            const margin = endotoxinLimit - reading.value

            return (
              <div key={reading.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-800">
                        {reading.sampleName}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        pass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {pass ? 'Below' : 'Above'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Test Value:</span>
                        <p className="font-medium">{reading.value.toFixed(2)} {reading.unit}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Limit:</span>
                        <p className="font-medium">{endotoxinLimit.toFixed(2)} {unit}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">% of Limit:</span>
                        <p className={`font-medium ${
                          percentage > 100 ? 'text-red-600' : 
                          percentage > 80 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Margin:</span>
                        <p className={`font-medium ${pass ? 'text-green-600' : 'text-red-600'}`}>
                          {pass ? '+' : ''}{margin.toFixed(2)} {unit}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar visualization */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 relative">
                        <div 
                          className={`h-2 rounded-full ${
                            pass ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                        {percentage > 100 && (
                          <div className="absolute right-0 top-0 h-2 bg-red-600 rounded-r-full" 
                            style={{ width: `${Math.min(percentage - 100, 100)}%` }}
                          />
                        )}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                        {percentage > 100 && <span className="text-red-600">{percentage.toFixed(0)}%</span>}
                      </div>
                    </div>

                    {/* Recommendations */}
                    {!pass && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                        Exceeds USP limit by {Math.abs(margin).toFixed(2)} {unit} ({(percentage - 100).toFixed(1)}%)
                      </div>
                    )}
                    {pass && percentage > 80 && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
                        Caution: Approaching USP limit ({percentage.toFixed(1)}% of maximum)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}