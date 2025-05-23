import { LoggerProvider } from '../providers/logger.ts'
import { inject, injectable } from 'tsyringe'

import type { Validation } from './types.ts'

@injectable()
export class AddressValidation implements Validation<string> {
  private readonly minLength = 3
  private readonly maxLength = 100

  constructor(@inject(LoggerProvider) private logger: LoggerProvider) {}

  validate(address: string): boolean {
    if (address.length < this.minLength || address.length > this.maxLength) {
      const log = `Endereço inválido: deve ter entre ${this.minLength} e ${this.maxLength} caracteres`
      this.logger.error(log)
      return false
    }

    return true
  }

  getErrorMessage(): string[] {
    return [
      '❌ *ENDEREÇO INVÁLIDO*',
      '',
      'Por favor, informe seu endereço completo.',
      '> Exemplo: "_Rua das Flores, n° 83, Centro_"',
    ]
  }
}
