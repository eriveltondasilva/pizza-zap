import type { PAYMENT_METHODS } from '@/config/enums.js'

// export type ContextData = {
//   paymentMethod: PAYMENT_METHODS
//   totalAmount: number
//   needsChange?: boolean
//   changeAmount?: number
// }

export type ContextData = {
  selectedPayment: PAYMENT_METHODS
  deliveryAddress: string
  totalAmount: number
  change?: number
  observations?: string
}

export const STEP_INDICATORS = {
  SUMMARY: 'Etapa: 1/4',
  PAYMENT: 'Etapa: 2/4',
  ADDRESS: 'Etapa: 3/4',
  FINISH: 'Etapa: 4/4',
} as const