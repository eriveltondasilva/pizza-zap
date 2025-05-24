import type { Whatsapp } from '@wppconnect-team/wppconnect'
import { injectable } from 'tsyringe'

import type { ISender, ResponseContent } from '../../types/index.js'

@injectable()
export class TextSenderService implements ISender {
  public async send(client: Whatsapp, phone: string, content: ResponseContent) {
    await client.sendText(phone, `[BOT]\n${content.text}`)
  }

  public async sendError(client: Whatsapp, phone: string) {
    await this.send(client, phone, {
      text: '❌ Ocorreu um erro ao processar a mensagem. Por favor, tente novamente mais tarde.',
    })
  }
}
