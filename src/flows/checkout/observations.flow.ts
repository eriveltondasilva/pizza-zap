import { injectable } from 'tsyringe'

import { FLOWS } from '../../config/enums.js'
import { formatCurrency } from '../../utils/format-currency.js'
import { BaseFlow } from '../base.flow.js'

import type { FlowParams } from '../../types/flows.js'
import { type ContextData, STEP_INDICATORS } from './@checkout.js'

@injectable()
export class CheckoutObservationsFlow extends BaseFlow {
  public async handle({ phone, message, context }: FlowParams) {
    const observations = message === '0' ? undefined : message
    const data = context.data as ContextData

    this.state.updateContext(phone, {
      data: { observations },
      flow: FLOWS.CHECKOUT_FINISH,
    })

    return this.responseBuilder
      .addCode(STEP_INDICATORS.FINISH)
      .addMono()
      .addText('# CONFIRMAÇÃO DO PEDIDO')
      .addLine()
      .addText('Total:', formatCurrency(data.totalAmount))
      .addText('Pagamento:', data.selectedPayment)
      .addText('Troco para:', data.change ? formatCurrency(data.change) : 'Não necessário')
      .addText('Endereço:', data.deliveryAddress)
      .addEmptyLine()
      .addText('Observações:', observations || 'nenhuma')
      .addLine()
      .addMono()
      .addText('Deseja confirmar seu pedido?')
      .addText('1️⃣ - Sim, confirmar meu pedido ✅')
      .addText('2️⃣ - Não, cancelar o pedido ❌')
      .build()
  }
}
