'use client'

import React from 'react'
import { referenceTablesMg, referenceTablesMl } from '@/lib/calculations'

export function ReferenceTables() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Quick Reference Tables
        </h2>
        <p className="text-gray-600 mb-6">Common endotoxin limits from Malyala and Singh (2007)</p>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Table 1: Endotoxin Limits for Drugs in mg/kg</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Animal Model
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                    Dose 1
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                    Dose 2
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                    Dose 3
                  </th>
                </tr>
                <tr>
                  <th className="px-6 py-1 text-left text-xs font-medium text-gray-500"></th>
                  <th className="px-3 py-1 text-center text-xs font-medium text-gray-500">mg/h</th>
                  <th className="px-3 py-1 text-center text-xs font-medium text-gray-500">EU/mg</th>
                  <th className="px-3 py-1 text-center text-xs font-medium text-gray-500">mg/h</th>
                  <th className="px-3 py-1 text-center text-xs font-medium text-gray-500">EU/mg</th>
                  <th className="px-3 py-1 text-center text-xs font-medium text-gray-500">mg/h</th>
                  <th className="px-3 py-1 text-center text-xs font-medium text-gray-500">EU/mg</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(referenceTablesMg).map(([animal, doses]) => (
                  <tr key={animal}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {animal}
                    </td>
                    {doses.map(([dose, limit], idx) => (
                      <React.Fragment key={idx}>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {dose}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-semibold">
                          {limit}
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Table 2: Endotoxin Limits for Drugs in mL/kg</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Animal Model
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                    Dose 1
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                    Dose 2
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                    Dose 3
                  </th>
                </tr>
                <tr>
                  <th className="px-6 py-1 text-left text-xs font-medium text-gray-500"></th>
                  <th className="px-3 py-1 text-center text-xs font-medium text-gray-500">mL/h</th>
                  <th className="px-3 py-1 text-center text-xs font-medium text-gray-500">EU/mL</th>
                  <th className="px-3 py-1 text-center text-xs font-medium text-gray-500">mL/h</th>
                  <th className="px-3 py-1 text-center text-xs font-medium text-gray-500">EU/mL</th>
                  <th className="px-3 py-1 text-center text-xs font-medium text-gray-500">mL/h</th>
                  <th className="px-3 py-1 text-center text-xs font-medium text-gray-500">EU/mL</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(referenceTablesMl).map(([animal, doses]) => (
                  <tr key={animal}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {animal}
                    </td>
                    {doses.map(([dose, limit], idx) => (
                      <React.Fragment key={idx}>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {dose}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-semibold">
                          {limit}
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}