'use client'

export function About() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">About the Endotoxin Calculator</h3>
        
        <div className="prose prose-lg text-gray-700 space-y-4">
          <p>
            This calculator is designed to help researchers determine acceptable endotoxin limits for 
            various animal models used in preclinical pharmaceutical research. It implements the 
            methodology described by Malyala and Singh in their 2007 Journal of Pharmaceutical Sciences publication.
          </p>
          
          <h4 className="text-xl font-semibold mt-6 mb-3">Purpose</h4>
          <p>
            Endotoxin contamination in pharmaceutical formulations can lead to pyrogenic responses 
            in test subjects, potentially confounding research results. This tool helps ensure that 
            formulations meet appropriate safety standards for preclinical studies.
          </p>
          
          <h4 className="text-xl font-semibold mt-6 mb-3">Key Features</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>Calculates endotoxin limits based on USP guidelines</li>
            <li>Supports multiple animal models with preset weights</li>
            <li>Allows custom species and body weight input</li>
            <li>Handles various dose units including mg/kg and mL/kg</li>
            <li>Provides step-by-step calculation breakdown</li>
            <li>Includes reference tables for common doses</li>
          </ul>
          
          <h4 className="text-xl font-semibold mt-6 mb-3">Compliance</h4>
          <p>
            This calculator follows the United States Pharmacopeia (USP) guidelines for bacterial 
            endotoxin testing and uses the standard formula K/M where K is the threshold pyrogenic 
            dose and M is the maximum dose per kg body weight per hour.
          </p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8">
        <h4 className="text-xl font-semibold text-gray-900 mb-4">Important Notes</h4>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>This tool is for preclinical research purposes only</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>Always verify calculations against current regulatory requirements</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>Consult with quality assurance teams for critical applications</span>
          </li>
        </ul>
      </div>
    </div>
  )
}