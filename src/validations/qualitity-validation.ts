import { LoggerProvider } from '@/providers/logger.js'
import { inject, injectable } from 'tsyringe'

import type { Validation } from './types.js'

@injectable()
export class QuantityValidation implements Validation<number> {
  private readonly minValue = 1
  private readonly maxValue = 10

  constructor(@inject(LoggerProvider) private logger: LoggerProvider) {}

  validate(quantity: number): boolean {
    if (!Number.isFinite(quantity)) {
      const log = 'Quantidade inválida: não é um número'
      this.logger.error(log)
      return false
    }

    if (quantity < this.minValue || quantity > this.maxValue) {
      const log = `Quantidade inválida: deve estar entre ${this.minValue} e ${this.maxValue}`
      this.logger.error(log)
      return false
    }

    return true
  }

  getErrorMessage(): string[] {
    return ['❌ *QUANTIDADE INVÁLIDA*', 'Por favor, digite um número entre 1 e 10.']
  }
}
