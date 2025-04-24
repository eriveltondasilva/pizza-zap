import type { Message } from '@wppconnect-team/wppconnect'
import { inject, injectable } from 'tsyringe'

import { ListSenderService, TextSenderService } from '@/services/senders/index.js'
import { LoggerProvider, WhatsappClientProvider } from './providers/index.js'

interface IWhatsappBot {
  initialize(): Promise<void>
  shutdown(): Promise<void>
}

@injectable()
export class WhatsappBot implements IWhatsappBot {
  constructor(
    @inject(WhatsappClientProvider)
    private readonly client: WhatsappClientProvider,
    @inject(TextSenderService)
    private readonly textMessageSender: TextSenderService,
    @inject(ListSenderService)
    private readonly listMessageSender: ListSenderService,
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
  private async processMessage({ from, body }: Message): Promise<void> {
    this.logger.info(`#️⃣ ${this.constructor.name}`, { from, body })

    if (body !== 'Hello') return

    const client = await this.client.getClient()
    const { type, content } = { type: 'list', content: 'Hello' }
    const sender = type === 'text' ? this.textMessageSender : this.listMessageSender

    await sender.send(client, from, { text: 'Hello', list: [] })
    //
  }
}
