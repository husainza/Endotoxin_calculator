'use client'

import { useState, useEffect } from 'react'
import { animalModels, type AnimalModel } from '@/lib/calculations'

interface AnimalSelectorProps {
  selectedAnimal: AnimalModel
  onAnimalChange: (animal: AnimalModel) => void
}

export function AnimalSelector({ selectedAnimal, onAnimalChange }: AnimalSelectorProps) {
  const [customSpecies, setCustomSpecies] = useState('')
  const [customWeight, setCustomWeight] = useState('')

  useEffect(() => {
    if (selectedAnimal.isCustom && customSpecies && customWeight) {
      const weight = parseFloat(customWeight)
      if (!isNaN(weight) && weight > 0) {
        onAnimalChange({
          name: customSpecies,
          weight: weight,
          isCustom: true
        })
      }
    }
  }, [customSpecies, customWeight, selectedAnimal.isCustom, onAnimalChange])

  const handleAnimalSelect = (value: string) => {
    const animal = animalModels.find(a => a.name === value)
    if (animal) {
      if (animal.isCustom) {
        onAnimalChange({
          ...animal,
          name: customSpecies || 'Custom',
          weight: parseFloat(customWeight) || 0
        })
      } else {
        onAnimalChange(animal)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Animal Model or Enter Custom
        </label>
        <select
          value={selectedAnimal.isCustom ? 'Custom' : selectedAnimal.name}
          onChange={(e) => handleAnimalSelect(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {animalModels.map((animal) => (
            <option key={animal.name} value={animal.name}>
              {animal.name} {!animal.isCustom && `(${animal.weight} kg)`}
            </option>
          ))}
        </select>
      </div>

      {selectedAnimal.isCustom && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Species Name
            </label>
            <input
              type="text"
              value={customSpecies}
              onChange={(e) => setCustomSpecies(e.target.value)}
              placeholder="e.g., Guinea Pig, Hamster, Dog"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Weight (kg)
            </label>
            <input
              type="number"
              value={customWeight}
              onChange={(e) => setCustomWeight(e.target.value)}
              placeholder="Enter weight in kg"
              step="any"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter the average body weight for this species in kilograms
            </p>
          </div>
        </div>
      )}
    </div>
  )
}