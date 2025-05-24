import { type Message, MessageType } from '@wppconnect-team/wppconnect'
import { PHONE_NUMBER } from '../config/constants.ts'

import type { Validation } from './types.ts'

export class MessageValidation implements Validation<Message> {
  private readonly MIN_LENGTH = 1
  private readonly MAX_LENGTH = 100
  private errorMessage = ''

  validate(message: Message): boolean {
    this.errorMessage = ''

    // TODO: tire o comentário dessa validação
    // if(message.fromMe) {
    //   this.errorMessage = 'Mensagem inválida: mensagens enviadas pelo cliente não são suportadas'
    //   return false
    // }

    // Validação para número permitido
    // TODO: remova validação
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
    if (messageLength < this.MIN_LENGTH || messageLength > this.MAX_LENGTH) {
      this.errorMessage = `Mensagem inválida: comprimento deve estar entre ${this.MIN_LENGTH} e ${this.MAX_LENGTH}`
      return false
    }

    return true
  }

  getError(): string {
    return this.errorMessage
  }
}
