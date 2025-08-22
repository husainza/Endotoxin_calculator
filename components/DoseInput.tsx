'use client'

import type { DoseUnit, DoseFrequency, RouteOfAdministration } from '@/lib/calculations'

interface DoseInputProps {
  dose: string
  doseUnit: DoseUnit
  frequency: DoseFrequency
  route: RouteOfAdministration
  onDoseChange: (dose: string) => void
  onDoseUnitChange: (unit: DoseUnit) => void
  onFrequencyChange: (frequency: DoseFrequency) => void
  onRouteChange: (route: RouteOfAdministration) => void
}

export function DoseInput({
  dose,
  doseUnit,
  frequency,
  route,
  onDoseChange,
  onDoseUnitChange,
  onFrequencyChange,
  onRouteChange
}: DoseInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dose Amount
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={dose}
            onChange={(e) => onDoseChange(e.target.value)}
            placeholder="Enter dose"
            step="any"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={doseUnit}
            onChange={(e) => onDoseUnitChange(e.target.value as DoseUnit)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="mg">mg</option>
            <option value="mL">mL</option>
            <option value="mg/kg">mg/kg</option>
            <option value="mL/kg">mL/kg</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dosing Frequency
        </label>
        <select
          value={frequency}
          onChange={(e) => onFrequencyChange(e.target.value as DoseFrequency)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="hourly">Per Hour</option>
          <option value="daily">Per Day (24 hours)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Route of Administration
        </label>
        <select
          value={route}
          onChange={(e) => onRouteChange(e.target.value as RouteOfAdministration)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="standard">Standard (K = 5 EU/kg)</option>
          <option value="intrathecal">Intrathecal (K = 0.2 EU/kg)</option>
        </select>
      </div>
    </div>
  )
}