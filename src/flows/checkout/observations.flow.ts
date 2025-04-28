import { injectable } from 'tsyringe'

import { FLOWS } from '@/config/enums.js'
import { formatCurrency } from '@/utils/format-currency.js'
import { BaseFlow } from '../base.flow.js'

import type { FlowParams } from '@/types/flows.js'
import type { ContextData } from './types.js'

@injectable()
export class CheckoutObservationsFlow extends BaseFlow {
  public async handle({ phone, message, context }: FlowParams) {
    const data = context.data as ContextData
    const observations = message === '0' ? undefined : message

    this.state.updateContext(phone, {
      data: { observations },
      flow: FLOWS.CHECKOUT_FINISH,
    })

    const formattedTotal = formatCurrency(data.totalAmount || 0)
    const formattedChange = data.change ? formatCurrency(data.change) : 'Não necessário'

    return this.responseBuilder
      .addMono()
      .addText('# CONFIRMAÇÃO DO PEDIDO')
      .addLine()
      .addText('Total:', formattedTotal)
      .addText('Pagamento:', data.selectedPayment || 'Não informado')
      .addText('Troco para:', formattedChange)
      .addText('Endereço:', data?.deliveryAddress || 'Não informado')
      .addEmptyLine()
      .addText('Observações:', observations || 'nenhuma')
      .addLine()
      .addMono()
      .addText('Deseja confirmar seu pedido?')
      .addText('1️⃣ - Confirmar ✅')
      .addText('0️⃣ - Cancelar ❌')
      .build()
  }
}
