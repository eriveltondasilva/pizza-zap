import type { Whatsapp } from '@wppconnect-team/wppconnect'

export interface ISender {
  send(client: Whatsapp, phone: string, content: ResponseContent): void
}
