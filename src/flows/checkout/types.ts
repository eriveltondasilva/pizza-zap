import type { PAYMENT_METHODS } from '@/config/enums.js'

// export type ContextData = {
//   paymentMethod: PAYMENT_METHODS
//   totalAmount: number
//   needsChange?: boolean
//   changeAmount?: number
// }

export type ContextData = {
  selectedPayment?: PAYMENT_METHODS
  deliveryAddress?: string
  totalAmount?: number
  change?: number
  observations?: string
}
