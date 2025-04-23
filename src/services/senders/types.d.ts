import type { Whatsapp } from '@wppconnect-team/wppconnect'

export interface ISender {
  send(client: Whatsapp, hone: string, content: ResponseContent): void
}
