import { inject, injectable } from 'tsyringe'
import { LoggerProvider } from '../providers/logger.ts'

import type { Validation } from './types.ts'

@injectable()
export class NameValidation implements Validation<string> {
  private readonly minLength = 3
  private readonly maxLength = 20

  constructor(@inject(LoggerProvider) private logger: LoggerProvider) {}

  validate(name: string): boolean {
    if (name.length < this.minLength || name.length > this.maxLength) {
      const log = `Nome inválido: deve ter entre ${this.minLength} e ${this.maxLength} caracteres`
      this.logger.error(log)
      return false
    }

    return true
  }

  getErrorMessage(): string[] {
    return [
      '❌ *NOME INVÁLIDO*',
      '',
      'Por favor, informe seu nome completo.',
      '> Exemplo: "_João da Silva_"',
    ]
  }
}
