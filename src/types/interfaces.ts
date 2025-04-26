import type { Whatsapp } from '@wppconnect-team/wppconnect'
import type { FlowParams, FlowResponse } from './flows.js'
import type { ResponseContent } from './responses.js'

export interface IFlow {
  handle(params: FlowParams): FlowResponse | Promise<FlowResponse>
}

export interface ISender {
  send(client: Whatsapp, phone: string, content: ResponseContent): Promise<void>
}
