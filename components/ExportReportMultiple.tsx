'use client'

import { jsPDF } from 'jspdf'
import type { CalculationResult, AnimalModel } from '@/lib/calculations'

interface TestReading {
  id: string
  sampleName: string
  value: number
  unit: 'EU/mg' | 'EU/mL'
}

interface ExportReportMultipleProps {
  readings: TestReading[]
  endotoxinLimit: number
  animal: AnimalModel
  dose: number
  doseUnit: string
  frequency: string
  route: string
  result: CalculationResult
}

export function ExportReportMultiple({
  readings,
  endotoxinLimit,
  animal,
  dose,
  doseUnit,
  frequency,
  route,
  result
}: ExportReportMultipleProps) {
  const generatePDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin
    let pageNumber = 1

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        doc.addPage()
        yPosition = margin
        pageNumber++
        addPageNumber()
        return true
      }
      return false
    }

    // Helper function to add page number
    const addPageNumber = () => {
      doc.setTextColor(128, 128, 128)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(`Page ${pageNumber}`, pageWidth - margin - 20, pageHeight - 10)
    }

    // Helper function to add centered text
    const addCenteredText = (text: string, y: number, fontSize: number = 12, bold: boolean = false) => {
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      const textWidth = doc.getTextWidth(text)
      const x = (pageWidth - textWidth) / 2
      doc.text(text, x, y)
    }

    // Title
    doc.setTextColor(0, 0, 0)
    addCenteredText('ENDOTOXIN LIMIT EVALUATION REPORT', yPosition, 18, true)
    yPosition += 10
    addCenteredText('MULTIPLE SAMPLES ANALYSIS', yPosition, 14, true)
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

    // Test Summary Section
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('TEST SUMMARY', margin, yPosition)
    yPosition += 10

    const passingCount = readings.filter(r => r.value <= endotoxinLimit).length
    const failingCount = readings.length - passingCount
    const passRate = (passingCount / readings.length) * 100
    const maxValue = Math.max(...readings.map(r => r.value))

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(`Total Samples Tested: ${readings.length}`, margin + 5, yPosition)
    yPosition += 7
    doc.text(`Samples Passing: ${passingCount} (${passRate.toFixed(1)}%)`, margin + 5, yPosition)
    yPosition += 7
    doc.text(`Samples Failing: ${failingCount} (${(100 - passRate).toFixed(1)}%)`, margin + 5, yPosition)
    yPosition += 12

    // Calculation Parameters Section
    checkNewPage(60)
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
    yPosition += 7
    doc.text(`K (Threshold Pyrogenic Dose): ${result.K} EU/kg`, margin + 5, yPosition)
    yPosition += 7
    doc.text(`M (Dose per kg per hour): ${result.M.toFixed(4)} ${doseUnit.replace('/kg', '')}/kg/h`, margin + 5, yPosition)
    yPosition += 7
    doc.text(`Calculated Endotoxin Limit: ${endotoxinLimit.toFixed(2)} ${result.unit}`, margin + 5, yPosition)
    yPosition += 15

    // Individual Sample Results Section
    checkNewPage(30 + readings.length * 25)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('INDIVIDUAL SAMPLE RESULTS', margin, yPosition)
    yPosition += 10

    // Calculate max safe dose for each sample
    const calculateMaxSafeDose = (testValue: number) => {
      const K = route === 'intrathecal' ? 0.2 : 5
      const maxM = K / testValue
      
      let maxSafeDose: number
      if (doseUnit === 'mg/kg' || doseUnit === 'mL/kg') {
        maxSafeDose = frequency === 'daily' ? maxM * 24 : maxM
      } else {
        const maxHourlyDose = maxM * animal.weight
        maxSafeDose = frequency === 'daily' ? maxHourlyDose * 24 : maxHourlyDose
      }
      return maxSafeDose
    }

    // Table header
    doc.setFillColor(240, 240, 240)
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('Sample ID', margin + 2, yPosition)
    doc.text('Test Value', margin + 40, yPosition)
    doc.text('Limit', margin + 70, yPosition)
    doc.text('% of Limit', margin + 95, yPosition)
    doc.text('Max Safe Dose', margin + 125, yPosition)
    doc.text('Result', margin + 165, yPosition)
    yPosition += 10

    // Table rows
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    readings.forEach((reading, index) => {
      checkNewPage(15)
      const pass = reading.value <= endotoxinLimit
      const percentage = (reading.value / endotoxinLimit) * 100
      const maxSafeDose = calculateMaxSafeDose(reading.value)
      
      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250)
        doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F')
      }
      
      doc.setTextColor(0, 0, 0)
      doc.text(reading.sampleName, margin + 2, yPosition)
      doc.text(`${reading.value.toFixed(2)} ${reading.unit}`, margin + 40, yPosition)
      doc.text(`${endotoxinLimit.toFixed(2)} ${result.unit}`, margin + 70, yPosition)
      doc.text(`${percentage.toFixed(1)}%`, margin + 95, yPosition)
      doc.text(`${maxSafeDose.toFixed(3)} ${doseUnit}`, margin + 125, yPosition)
      
      // Color code the result
      if (pass) {
        doc.setTextColor(0, 128, 0)
        doc.text('PASS', margin + 165, yPosition)
      } else {
        doc.setTextColor(255, 0, 0)
        doc.text('FAIL', margin + 165, yPosition)
      }
      
      yPosition += 8
    })
    yPosition += 10

    // Overall Evaluation Result
    checkNewPage(50)
    const allPass = readings.every(r => r.value <= endotoxinLimit)
    const somePass = readings.some(r => r.value <= endotoxinLimit)
    
    doc.setFillColor(allPass ? 220 : somePass ? 255 : 255, allPass ? 255 : somePass ? 255 : 220, allPass ? 220 : somePass ? 220 : 220)
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 35, 'F')
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(allPass ? 0 : somePass ? 255 : 255, allPass ? 128 : somePass ? 140 : 0, 0)
    doc.text('OVERALL EVALUATION', margin + 5, yPosition + 5)
    
    doc.setFontSize(20)
    doc.text(allPass ? 'ALL PASS' : somePass ? 'MIXED RESULTS' : 'ALL FAIL', margin + 5, yPosition + 15)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text(`${passingCount} of ${readings.length} samples meet acceptance criteria`, margin + 5, yPosition + 25)
    yPosition += 40

    // Recommendations Section
    checkNewPage(60)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('RECOMMENDATIONS', margin, yPosition)
    yPosition += 10

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    
    if (allPass) {
      doc.setTextColor(0, 100, 0)
      doc.text('All samples meet the endotoxin limit requirements.', margin + 5, yPosition)
      yPosition += 7
      doc.text('The batch is suitable for use at the specified dose.', margin + 5, yPosition)
      
      if (maxValue / endotoxinLimit > 0.8) {
        yPosition += 10
        doc.setTextColor(255, 140, 0)
        doc.text('CAUTION: Some samples are approaching the limit (>80%).', margin + 5, yPosition)
        yPosition += 7
        doc.text('Consider process optimization to increase safety margin.', margin + 5, yPosition)
      }
    } else if (somePass) {
      doc.setTextColor(255, 140, 0)
      doc.text('Mixed results require careful evaluation:', margin + 5, yPosition)
      yPosition += 7
      doc.text(`- ${passingCount} samples can proceed to next stage`, margin + 5, yPosition)
      yPosition += 7
      doc.text(`- ${failingCount} samples require additional purification`, margin + 5, yPosition)
      yPosition += 7
      doc.text('Consider segregating passing and failing samples.', margin + 5, yPosition)
    } else {
      doc.setTextColor(255, 0, 0)
      doc.text('All samples exceed the endotoxin limit.', margin + 5, yPosition)
      yPosition += 7
      doc.text('ACTION REQUIRED:', margin + 5, yPosition)
      yPosition += 7
      doc.text('1. Implement additional purification steps', margin + 5, yPosition)
      yPosition += 7
      doc.text('2. Consider dose reduction if clinically acceptable', margin + 5, yPosition)
      yPosition += 7
      doc.text('3. Re-test after purification', margin + 5, yPosition)
    }

    // Compliance Statement
    yPosition += 15
    checkNewPage(40)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('CALCULATION METHOD', margin, yPosition)
    yPosition += 8
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('This evaluation was performed in accordance with USP <85> Bacterial Endotoxins Test', margin + 5, yPosition)
    yPosition += 6
    doc.text('guidelines and the calculation method described in Malyala & Singh (2007).', margin + 5, yPosition)

    // Footer on last page
    doc.setTextColor(128, 128, 128)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const footerY = pageHeight - 15
    doc.text('Generated by Endotoxin Calculator - Based on Malyala & Singh (2007)', margin, footerY)
    addPageNumber()
    
    // Add separator line above footer
    doc.setLineWidth(0.3)
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5)

    // Save the PDF
    const fileName = `Endotoxin_Report_Multiple_${readings.length}_Samples_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
  }

  return (
    <button
      onClick={generatePDF}
      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export Compliance Report ({readings.length} Samples)
    </button>
  )
}