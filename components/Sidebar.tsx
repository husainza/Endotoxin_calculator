'use client'

import { useState } from 'react'

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: 'calculator', label: 'Calculator', icon: '🧮' },
    { id: 'reference', label: 'Reference Tables', icon: '📊' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
    { id: 'methodology', label: 'Methodology', icon: '📚' },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'} transition-transform duration-300 fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white shadow-2xl z-40`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl">🧪</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Endotoxin Calculator</h1>
              <p className="text-xs text-indigo-200">Preclinical Research Tool</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id)
                  setIsCollapsed(true)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-white/20 shadow-lg transform scale-105'
                    : 'hover:bg-white/10'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-12 p-4 bg-white/10 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Reference</h3>
            <p className="text-xs text-indigo-200">
              Based on Malyala & Singh J Pharm Sci 2007
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="text-xs text-indigo-200 space-y-1">
            <p>Version 1.0.0</p>
            <p>© 2025 Aera Therapeutics</p>
            <p>Developed by Husain Attarwala, PhD</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  )
}