import type { Whatsapp } from '@wppconnect-team/wppconnect'
import type { FlowParams, FlowResponse } from './flows.ts'
import type { ResponseContent } from './responses.ts'

export interface IFlow {
  handle(params: FlowParams): FlowResponse | Promise<FlowResponse>
}

export interface ISender {
  send(client: Whatsapp, phone: string, content: ResponseContent): Promise<void>
}
