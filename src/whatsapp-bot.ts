import type { Message } from '@wppconnect-team/wppconnect'
import { inject, injectable } from 'tsyringe'

import { LoggerProvider, WhatsappClientProvider } from './providers/index.js'

@injectable()
export class WhatsappBot {
  constructor(
    @inject(WhatsappClientProvider)
    private readonly client: WhatsappClientProvider,
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
    await client.sendText(
      from,
      '[BOT] Olá, eu sou o Bot do Erivelton. Como posso te ajudar?',
    )
    await client.sendListMessage(from, {
      buttonText: 'Click here',
      description: '[BOT] Choose one option',
      sections: [
        {
          title: 'Section 1',
          rows: [
            {
              rowId: 'my_custom_id',
              title: 'Test 1',
              description: 'Description 1',
            },
            {
              rowId: '2',
              title: 'Test 2',
              description: 'Description 2',
            },
          ],
        },
      ],
    })
  }
}
