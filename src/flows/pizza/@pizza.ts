import type { Crust, Flavor } from '../../types/entities.js'

export type ContextData = {
  selectedFlavors: Flavor[]
  selectedCrust: Crust
  isSingleFlavor: boolean
  quantity: number
  unitPrice: number
  subtotal: number
  notes: string
}

export const STEP_INDICATORS = {
  FLAVOR: 'Etapa: 1/5',
  QUANTITY: 'Etapa: 2/5',
  CRUST: 'Etapa: 3/5',
  NOTES: 'Etapa: 4/5',
  FINISH: 'Etapa: 5/5',
} as const
