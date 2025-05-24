import type { Validation } from './types.ts'

export class NameValidation implements Validation<string> {
  private readonly MIN_LENGTH = 3
  private readonly MAX_LENGTH = 100
  private readonly NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/
  private errorMessage: string[] = []

  validate(name: string): boolean {
    this.errorMessage = []

    if (name.length < this.MIN_LENGTH || name.length > this.MAX_LENGTH) {
      this.errorMessage = [
        `O nome deve ter entre ${this.MIN_LENGTH} e ${this.MAX_LENGTH} caracteres.`,
        `Você forneceu um nome muito ${name.length < this.MIN_LENGTH ? 'curto' : 'longo'}.`,
      ]
      return false
    }

    if (!this.NAME_REGEX.test(name)) {
      this.errorMessage = [
        'O nome deve conter apenas letras e espaços.',
        'Por favor, remova números e caracteres especiais.',
      ]
      return false
    }

    if (name.trim().split(/\s+/).length < 2) {
      this.errorMessage = [
        'Por favor, informe seu nome completo com nome e sobrenome.',
        'Precisamos do seu nome completo para o cadastro.',
      ]
      return false
    }

    return true
  }

  getError(): string[] {
    // biome-ignore format: this is a multiline string
    return [
      '❌ *NOME INVÁLIDO*',
      '',
      ...this.errorMessage,
      '> Exemplo: "_João da Silva_"'
    ]
  }
}
