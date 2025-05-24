import type { Validation } from './types.ts'

export class AddressValidation implements Validation {
  private readonly MIN_LENGTH = 3
  private readonly MAX_LENGTH = 100
  private readonly ADDRESS_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s,.°º-]+$/
  private errorMessage: string[] = []

  validate(address: string): boolean {
    this.errorMessage = []

    if (address.length < this.MIN_LENGTH || address.length > this.MAX_LENGTH) {
      this.errorMessage = [
        `O endereço deve ter entre ${this.MIN_LENGTH} e ${this.MAX_LENGTH} caracteres.`,
        `Você forneceu um endereço muito ${address.length < this.MIN_LENGTH ? 'curto' : 'longo'}.`,
      ]
      return false
    }

    if (!this.ADDRESS_REGEX.test(address)) {
      this.errorMessage = [
        'O endereço contém caracteres inválidos.',
        'Use apenas letras, números, espaços e símbolos como vírgula, ponto e hífen.',
      ]
      return false
    }

    return true
  }

  getError(): string[] {
    return [
      '❌ *ENDEREÇO INVÁLIDO*',
      '',
      ...this.errorMessage,
      '> Exemplo: "_Rua das Flores, n° 83, Centro_"',
    ]
  }
}
