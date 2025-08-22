'use client'

import { jsPDF } from 'jspdf'
import type { CalculationResult, AnimalModel } from '@/lib/calculations'

interface ExportReportProps {
  sampleName: string
  testValue: number
  testUnit: string
  endotoxinLimit: number
  animal: AnimalModel
  dose: number
  doseUnit: string
  frequency: string
  route: string
  result: CalculationResult
}

export function ExportReport({
  sampleName,
  testValue,
  testUnit,
  endotoxinLimit,
  animal,
  dose,
  doseUnit,
  frequency,
  route,
  result
}: ExportReportProps) {
  const generatePDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPosition = margin

    // Helper function to add centered text
    const addCenteredText = (text: string, y: number, fontSize: number = 12, bold: boolean = false) => {
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      const textWidth = doc.getTextWidth(text)
      const x = (pageWidth - textWidth) / 2
      doc.text(text, x, y)
    }

    // Title
    addCenteredText('ENDOTOXIN LIMIT EVALUATION REPORT', yPosition, 18, true)
    yPosition += 15

    // Date
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    addCenteredText(date, yPosition, 10)
    yPosition += 15

    // Separator line
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 10

    // Sample Information Section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('SAMPLE INFORMATION', margin, yPosition)
    yPosition += 10

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(`Sample Name/ID: ${sampleName}`, margin + 5, yPosition)
    yPosition += 7
    doc.text(`Test Result: ${testValue.toFixed(2)} ${testUnit}`, margin + 5, yPosition)
    yPosition += 7
    doc.text(`Date Tested: ${date}`, margin + 5, yPosition)
    yPosition += 12

    // Calculation Parameters Section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('CALCULATION PARAMETERS', margin, yPosition)
    yPosition += 10

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(`Animal Model: ${animal.name} (${animal.weight} kg)`, margin + 5, yPosition)
    yPosition += 7
    doc.text(`Dose: ${dose} ${doseUnit}`, margin + 5, yPosition)
    yPosition += 7
    doc.text(`Frequency: ${frequency === 'daily' ? 'Per day (24 hours)' : 'Per hour'}`, margin + 5, yPosition)
    yPosition += 7
    doc.text(`Route: ${route === 'intrathecal' ? 'Intrathecal' : 'Standard'}`, margin + 5, yPosition)
    yPosition += 12

    // Calculation Details Section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('CALCULATION DETAILS', margin, yPosition)
    yPosition += 10

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(`K (Threshold Pyrogenic Dose): ${result.K} EU/kg`, margin + 5, yPosition)
    yPosition += 7
    doc.text(`M (Dose per kg per hour): ${result.M.toFixed(4)} ${doseUnit.replace('/kg', '')}/kg/h`, margin + 5, yPosition)
    yPosition += 7
    doc.text(`Calculated Endotoxin Limit: ${endotoxinLimit.toFixed(2)} ${result.unit}`, margin + 5, yPosition)
    yPosition += 15

    // Evaluation Result Section
    const pass = testValue <= endotoxinLimit
    const percentage = (testValue / endotoxinLimit) * 100
    const margin_value = endotoxinLimit - testValue

    // Result Box
    doc.setFillColor(pass ? 220 : 255, pass ? 255 : 220, pass ? 220 : 220)
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 35, 'F')
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(pass ? 0 : 255, pass ? 128 : 0, 0)
    doc.text('EVALUATION RESULT', margin + 5, yPosition + 5)
    
    doc.setFontSize(20)
    doc.text(pass ? 'BELOW USP LIMIT' : 'ABOVE USP LIMIT', margin + 5, yPosition + 15)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text(`${percentage.toFixed(1)}% of limit`, margin + 5, yPosition + 25)
    
    yPosition += 40

    // Summary Section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('SUMMARY', margin, yPosition)
    yPosition += 10

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    
    if (pass) {
      doc.text(`The sample "${sampleName}" has an endotoxin level of ${testValue.toFixed(2)} ${testUnit},`, margin + 5, yPosition)
      yPosition += 7
      doc.text(`which is BELOW the USP limit of ${endotoxinLimit.toFixed(2)} ${result.unit}.`, margin + 5, yPosition)
      yPosition += 7
      doc.text(`Safety Margin: ${Math.abs(margin_value).toFixed(2)} ${result.unit} (${(100 - percentage).toFixed(1)}% below limit)`, margin + 5, yPosition)
      yPosition += 10
      
      if (percentage > 80) {
        doc.setTextColor(255, 140, 0)
        doc.text('CAUTION: Sample is approaching the endotoxin limit.', margin + 5, yPosition)
        yPosition += 7
        doc.text('Consider additional purification or retesting.', margin + 5, yPosition)
      } else if (percentage <= 50) {
        doc.setTextColor(0, 128, 0)
        doc.text('EXCELLENT: Sample is well below the endotoxin limit.', margin + 5, yPosition)
      } else {
        doc.setTextColor(0, 100, 0)
        doc.text('GOOD: Sample is within safe range.', margin + 5, yPosition)
      }
    } else {
      doc.setTextColor(255, 0, 0)
      doc.text(`The sample "${sampleName}" has an endotoxin level of ${testValue.toFixed(2)} ${testUnit},`, margin + 5, yPosition)
      yPosition += 7
      doc.text(`which EXCEEDS the USP limit of ${endotoxinLimit.toFixed(2)} ${result.unit}.`, margin + 5, yPosition)
      yPosition += 7
      doc.text(`Exceeded By: ${Math.abs(margin_value).toFixed(2)} ${result.unit} (${(percentage - 100).toFixed(1)}% over limit)`, margin + 5, yPosition)
      yPosition += 10
      doc.text('NOTE: Sample exceeds the USP endotoxin limit.', margin + 5, yPosition)
    }
    
    // Footer
    doc.setTextColor(128, 128, 128)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const footerY = doc.internal.pageSize.getHeight() - 15
    doc.text('Generated by Endotoxin Calculator - Based on Malyala & Singh (2007)', margin, footerY)
    doc.text(`Page 1 of 1`, pageWidth - margin - 20, footerY)
    
    // Add separator line above footer
    doc.setLineWidth(0.3)
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5)

    // Save the PDF
    const fileName = `Endotoxin_Report_${sampleName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

  return (
    <button
      onClick={generatePDF}
      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md flex items-center justify-center gap-2 no-print"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export PDF Report
    </button>
  )
}