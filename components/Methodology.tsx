'use client'

export function Methodology() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Calculation Methodology</h3>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg">
            <h4 className="text-xl font-semibold text-indigo-900 mb-4">Core Formula</h4>
            <div className="bg-white p-4 rounded-lg border-2 border-indigo-200">
              <p className="text-2xl font-mono text-center text-indigo-700 font-bold">
                Endotoxin Limit = K / M
              </p>
            </div>
            <div className="mt-4 space-y-2 text-gray-700">
              <p><strong>K</strong> = Threshold pyrogenic dose (EU/kg)</p>
              <p><strong>M</strong> = Maximum dose per kg body weight per hour</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h5 className="font-semibold text-lg mb-3 text-gray-900">K Values</h5>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between">
                  <span>Standard routes:</span>
                  <span className="font-mono font-bold">5 EU/kg</span>
                </li>
                <li className="flex justify-between">
                  <span>Intrathecal route:</span>
                  <span className="font-mono font-bold">0.2 EU/kg</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h5 className="font-semibold text-lg mb-3 text-gray-900">Units</h5>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between">
                  <span>EU:</span>
                  <span className="font-mono">Endotoxin Units</span>
                </li>
                <li className="flex justify-between">
                  <span>1 EU:</span>
                  <span className="font-mono">= 1 IU</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Calculation Steps</h4>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">1</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold mb-1">Determine Input Parameters</h5>
                  <p className="text-gray-600">Select animal model, dose, frequency, and route of administration</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">2</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold mb-1">Convert Dose if Necessary</h5>
                  <p className="text-gray-600">For mg/kg or mL/kg doses, multiply by animal weight to get total dose</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">3</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold mb-1">Convert to Hourly Dose</h5>
                  <p className="text-gray-600">For daily doses, divide by 24 to get hourly dose</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">4</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold mb-1">Calculate M</h5>
                  <p className="text-gray-600">Divide hourly dose by animal weight: M = dose/hour ÷ weight(kg)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">5</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold mb-1">Calculate Endotoxin Limit</h5>
                  <p className="text-gray-600">Apply formula: Limit = K ÷ M</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-yellow-900 mb-2">Important Considerations</h4>
            <ul className="space-y-2 text-yellow-800">
              <li>• The threshold pyrogenic dose of 5 EU/kg is assumed for all preclinical species</li>
              <li>• Results are expressed in EU/mg or EU/mL based on dose unit</li>
              <li>• Formulations must contain less than the calculated limit for safe administration</li>
              <li>• Always use the Limulus Amebocyte Lysate (LAL) test for endotoxin measurement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}