import { injectable } from 'tsyringe'

import { FLOWS } from '@/config/enums.js'
import { mainMenu, orderMenu } from '@/templates/menus.js'
import { BaseFlow } from '../base.flow.js'

import type { FlowParams } from '@/types/flows.js'

const MESSAGE_SUCCEED = {
  TITLE: '✅ PEDIDO REGISTRADO!',
  SUBTITLE: [
    'Obrigado pela preferência! Seu pedido foi registrado e será preparado em breve.',
    'Tempo estimado de entrega: _30-45 minutos_',
  ].join('\n'),
}

const MESSAGE_CANCELED = {
  TITLE: '❌ PEDIDO CANCELADO',
  SUBTITLE: 'Você pode continuar comprando ou fechar o pedido.',
}

const OPTIONS = {
  CANCEL: 'Cancelar pedido',
  CONFIRM: 2
}

@injectable()
export class CheckoutFinishFlow extends BaseFlow {
  public async handle({ phone, message }: FlowParams) {
    const isCanceled = message === '0'

    if (!isCanceled) {
      // TODO: register order
    }

    const nextFlow = isCanceled ? FLOWS.ORDER : FLOWS.MENU
    const messageData = isCanceled ? MESSAGE_CANCELED : MESSAGE_SUCCEED
    const menu = isCanceled ? orderMenu : mainMenu

    this.state.clearData(phone)
    this.state.clearCart(phone)

    this.state.updateFlow(phone, nextFlow)

    return this.responseBuilder
      .addBold(messageData.TITLE)
      .addText(messageData.SUBTITLE)
      .addEmptyLine()
      .addMenu(menu)
      .build()
  }
}
