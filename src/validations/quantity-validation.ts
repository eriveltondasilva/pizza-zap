import type { Validation } from './types.ts'

export class QuantityValidation implements Validation<number> {
  private readonly MIN_VALUE = 1
  private readonly MAX_VALUE = 10
  private errorMessage: string[] = []

  validate(quantity: number): boolean {
    if (!Number.isFinite(quantity)) {
      this.errorMessage = [
        'A quantidade deve ser um número válido.',
        'Por favor, digite apenas números.',
      ]
      return false
    }

    if (quantity < this.MIN_VALUE || quantity > this.MAX_VALUE) {
      this.errorMessage = [
        `A quantidade deve estar entre ${this.MIN_VALUE} e ${this.MAX_VALUE}.`,
        `Você forneceu uma quantidade ${quantity < this.MIN_VALUE ? 'muito pequena' : 'muito grande'}.`,
      ]
      return false
    }

    return true
  }

  getError(): string[] {
    // biome-ignore format: this is a multiline string
    return [
      '❌ *QUANTIDADE INVÁLIDA*',
      '',
      ...this.errorMessage,
      `> Exemplo: "_${this.MIN_VALUE}_" ou "_${Math.floor((this.MIN_VALUE + this.MAX_VALUE) / 2)}_"`
    ]
  }
}
