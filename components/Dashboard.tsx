'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Calculator } from './Calculator'
import { ReferenceTables } from './ReferenceTables'
import { About } from './About'
import { Methodology } from './Methodology'

export function Dashboard() {
  const [activeSection, setActiveSection] = useState('calculator')

  const renderContent = () => {
    switch (activeSection) {
      case 'calculator':
        return <Calculator />
      case 'reference':
        return <ReferenceTables />
      case 'about':
        return <About />
      case 'methodology':
        return <Methodology />
      default:
        return <Calculator />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      {/* Main Content Area */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* Top Header Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {activeSection === 'calculator' && 'Endotoxin Limit Calculator'}
              {activeSection === 'reference' && 'Reference Tables'}
              {activeSection === 'about' && 'About This Tool'}
              {activeSection === 'methodology' && 'Calculation Methodology'}
            </h2>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}