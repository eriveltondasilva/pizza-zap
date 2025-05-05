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
  CONFIRM: 1,
  CANCEL: 2,
}

@injectable()
export class CheckoutFinishFlow extends BaseFlow {
  public async handle({ phone, message }: FlowParams) {
    const selectedOption = Number.parseInt(message, 10)
    const isConfirmed = selectedOption === OPTIONS.CONFIRM

    if (!Object.values(OPTIONS).includes(selectedOption)) {
      return this.responseBuilder
        .addText('❌ OPÇÃO INVÁLIDA')
        .addEmptyLine()
        .addText('Deseja confirmar seu pedido?')
        .addText('1️⃣ - Sim, confirmar meu pedido ✅')
        .addText('2️⃣ - Não, cancelar o pedido ❌')
        .build()
    }

    if (isConfirmed) {
      // TODO: register order
    }

    const nextFlow = isConfirmed ? FLOWS.MENU : FLOWS.ORDER
    const messageData = isConfirmed ? MESSAGE_SUCCEED : MESSAGE_CANCELED
    const menu = isConfirmed ? mainMenu : orderMenu

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
