import { injectable } from 'tsyringe'

import { FLOWS } from '@/config/enums.js'
import { mainMenu, orderMenu } from '@/templates/menus.js'
import { BaseFlow } from '../base.flow.js'

import type { FlowParams } from '@/types/flows.js'

@injectable()
export class CheckoutFinishFlow extends BaseFlow {
  public async handle({ phone, message }: FlowParams) {
    const isCanceled = message === '0'

    this.state.clearCart(phone)
    this.state.clearData(phone)

    if (!isCanceled) {
      this.state.updateFlow(phone, FLOWS.ORDER)
      return this.responseBuilder
        .addBold('❌ PEDIDO CANCELADO')
        .addText('Você pode continuar comprando ou fechar o pedido.')
        .addEmptyLine()
        .addMenu(orderMenu)
        .build()
    }

    this.state.updateFlow(phone, FLOWS.MENU)

    return this.responseBuilder
      .addBold('✅ PEDIDO REGISTRADO!')
      .addText('Obrigado pela preferência!', 'Seu pedido foi registrado e será preparado em breve.')
      .addEmptyLine()
      .addText('Tempo estimado de entrega: _30-45 minutos_')
      .addEmptyLine()
      .addMenu(mainMenu)
      .build()
  }
}
