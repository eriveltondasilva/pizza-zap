//# TODO: removendo as validações para a pasta src\validations e refatorando para classes
import { container } from 'tsyringe'

import { VALIDATION } from '../config/enums.ts'
import { LoggerProvider } from '../providers/logger.ts'

const logger = container.resolve(LoggerProvider)

export function isValidQuantity(quantity: number): boolean {
  if (!Number.isFinite(quantity)) {
    logger.warn('Quantity validation failed: quantity is not a number', { quantity })
    return false
  }

  if (quantity < VALIDATION.QUANTITY_MIN || quantity > VALIDATION.QUANTITY_MAX) {
    logger.warn(
      `Quantity validation failed: quantity must be between (${VALIDATION.QUANTITY_MIN} - ${VALIDATION.QUANTITY_MAX})`,
      { quantity },
    )
    return false
  }

  return true
}
