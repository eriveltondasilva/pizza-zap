import { injectable } from 'tsyringe'

import { FLOWS } from '@/config/enums.js'
import { formatCurrency } from '@/utils/format-currency.js'
import { BaseFlow } from '../base.flow.js'

import type { FlowParams } from '@/types/flows.js'
import type { ContextData } from './types.js'

@injectable()
export class CheckoutChangeFlow extends BaseFlow {
  public async handle({ phone, message, context }: FlowParams) {
    const changeAmount = Number.parseFloat(message.replace(',', '.'))
    const data = context.data as ContextData
    const totalAmount = data.totalAmount || 0

    if (Number.isNaN(changeAmount) || changeAmount < 0) {
      return this.responseBuilder
        .addBold('❌ VALOR INVÁLIDO!')
        .addText('Por favor, digite um valor válido para o troco.')
        .addText('Ex: 50, 100 ou 0 se não precisar de troco.')
        .build()
    }

    if (changeAmount > 0 && changeAmount <= totalAmount) {
      return this.responseBuilder
        .addBold('❌ VALOR INSUFICIENTE!')
        .addText(
          `O valor para troco (${formatCurrency(changeAmount)})`,
          `deve ser maior que o total do pedido (${formatCurrency(totalAmount)}).`,
        )
        .addText('Por favor, digite um novo valor.')
        .build()
    }

    this.state.updateContext(phone, {
      data: { change: changeAmount },
      flow: FLOWS.CHECKOUT_ADDRESS,
    })

    const customer = this.state.getCustomer(phone)

    return this.responseBuilder
      .addBold('📍 ENDEREÇO DE ENTREGA')
      .addText('Encontramos o endereço em seu cadastro:')
      .addQuote(customer.address)
      .addEmptyLine()
      .addText('Deseja utilizar este endereço?')
      .addText('1️⃣ - Sim, manter este endereço')
      .addText('2️⃣ - Não, quero informar um novo endereço')
      .build()
  }
}
