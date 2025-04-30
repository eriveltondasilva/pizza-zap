import type { Message } from '@wppconnect-team/wppconnect'
import { inject, injectable } from 'tsyringe'

import { MESSAGE_TYPES } from '@/config/enums.js'
import { ConversationManager } from '@/core/conversation-manager.js'
import { ListSenderService, TextSenderService } from '@/services/senders/index.js'
import { MessageValidation } from '@/validations/message-validation.js'
import { LoggerProvider, WhatsappClientProvider } from './providers/index.js'

import type { ISender } from '@/types/interfaces.js'

interface IWhatsappBot {
  initialize(): Promise<void>
  shutdown(): Promise<void>
}

@injectable()
export class WhatsappBot implements IWhatsappBot {
  constructor(
    @inject(WhatsappClientProvider) private readonly client: WhatsappClientProvider,
    @inject(TextSenderService) private readonly textMessageSender: TextSenderService,
    @inject(ListSenderService) private readonly listMessageSender: ListSenderService,
    @inject(ConversationManager) private readonly conversation: ConversationManager,
    @inject(MessageValidation) private readonly messageValidation: MessageValidation,
    @inject(LoggerProvider) private readonly logger: LoggerProvider,
  ) {}

  public async initialize(): Promise<void> {
    try {
      const client = await this.client.getClient()
      // TODO: Remove onAnyMessage
      client.onAnyMessage((message) => this.processMessage(message))
      this.logger.info('🤖 WhatsApp bot initialized successfully')
    } catch (error) {
      this.logger.error('Failed to initialize bot', error)
      throw error
    }
  }

  public async shutdown(): Promise<void> {
    try {
      this.logger.info('🤖 WhatsApp bot shutdown successfully')
      this.client.closeClient()
    } catch (error) {
      this.logger.error('Failed to shutdown bot', error)
      throw error
    }
  }

  //#
  private async processMessage(message: Message): Promise<void> {
    if (!this.messageValidation.validate(message)) {
      this.logger.warn(this.messageValidation.getErrorMessage(), {
        from: message.from,
      })
      return
    }

    this.logger.info(`#️⃣ ${this.constructor.name}`, { from: message.from, body: message.body })
    const client = await this.client.getClient()

    try {
      const { type, content } = await this.conversation.handle(message.from, message.body as string)

      const senderMap: Record<MESSAGE_TYPES, ISender> = {
        [MESSAGE_TYPES.TEXT]: this.textMessageSender,
        [MESSAGE_TYPES.LIST]: this.listMessageSender,
      }
      const messageSender = senderMap[type]

      if (!messageSender) throw new Error(`Tipo de mensagem não suportado: ${type}`)

      await messageSender.send(client, message.from, content)
      this.logger.info('✉️ Mensagem enviada:', { type })
    } catch (error) {
      this.logger.error('Erro no processamento da mensagem:', error)
      await this.textMessageSender.sendErrorMessage(client, message.from)
    }
  }
}
