import { type Message, MessageType } from '@wppconnect-team/wppconnect'
import { PHONE_NUMBER } from '../config/constants.ts'

interface Validation {
  validate(message: Message): boolean
  getErrorMessage(): string
}

export class MessageValidation implements Validation {
  private readonly minLength = 1
  private readonly maxLength = 100
  private errorMessage = ''

  validate(message: Message): boolean {
    // Validação para número permitido
    if (!message.from.startsWith(PHONE_NUMBER)) {
      this.errorMessage = 'Mensagem inválida: remetente não autorizado'
      return false
    }

    // Validação para mensagens de grupo
    if (message.isGroupMsg) {
      this.errorMessage = 'Mensagem inválida: mensagens de grupo não são suportadas'
      return false
    }

    // Validação para tipo de mensagem
    if (![MessageType.CHAT, MessageType.LIST_RESPONSE].includes(message.type)) {
      this.errorMessage = 'Mensagem inválida: tipo de mensagem não suportado'
      return false
    }

    // Validação para mensagens de mídia
    if (message.isPSA || message.isMMS || message.isMedia) {
      this.errorMessage = 'Mensagem inválida: mensagens PSA, MMS ou mídia não são suportadas'
      return false
    }

    // Validação para mensagens novas
    if (!message.isNewMsg) {
      this.errorMessage = 'Mensagem inválida: mensagem não marcada como nova'
      return false
    }

    // Validação para prefixo BOT
    if (message.body?.startsWith('[BOT]')) {
      this.errorMessage = 'Mensagem inválida: mensagem começa com [BOT]'
      return false
    }

    // Validação para comprimento da mensagem
    const messageLength = message.body?.length || 0
    if (messageLength < this.minLength || messageLength > this.maxLength) {
      this.errorMessage = `Mensagem inválida: comprimento deve estar entre ${this.minLength} e ${this.maxLength}`
      return false
    }

    return true
  }

  getErrorMessage(): string {
    return this.errorMessage
  }
}
