# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Endotoxin Limit Calculator based on Malyala and Singh (2007) methodology for preclinical research formulations. The calculator helps researchers determine acceptable endotoxin limits for various animal models used in pharmaceutical research.

## Technology Stack
- **Framework**: Next.js 14+ with TypeScript
- **Deployment**: Vercel
- **Styling**: Tailwind CSS (recommended)
- **State Management**: React hooks

## Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## Calculation Methodology
Based on the USP formula K/M where:
- K = threshold pyrogenic dose (5 EU/kg for non-intrathecal routes)
- M = maximum dose per kg body weight per hour
- Endotoxin Limit = K/M (expressed in EU/mg or EU/mL)

### Key Animal Models and Body Weights
- Mouse: 0.03 kg
- Gerbil: 0.09 kg
- Rat: 0.45 kg
- Rabbit: 4 kg
- Monkey: 8 kg
- Baboon: 12 kg

## Core Features to Implement
1. **Input Parameters**:
   - Animal model selection
   - Dose amount (mg or mL)
   - Dosing frequency (per hour or daily)
   - Route of administration

2. **Calculations**:
   - Calculate M value based on dose and animal weight
   - Apply K/M formula
   - Display results in EU/mg and EU/mL

3. **Reference Tables**:
   - Quick lookup for common doses (Tables 2 & 3 from paper)
   - Custom calculation for non-standard doses

## Project Structure
```
/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main calculator page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Calculator.tsx     # Main calculator component
│   ├── AnimalSelector.tsx # Animal model selection
│   ├── DoseInput.tsx      # Dose input fields
│   └── ResultsDisplay.tsx # Calculation results
├── lib/                   # Utility functions
│   └── calculations.ts    # Endotoxin limit calculations
└── public/               # Static assets