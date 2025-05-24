import { injectable } from 'tsyringe'

import { FLOWS } from '../../config/enums.js'
import { formatCurrency } from '../../utils/format-currency.js'
import { BaseFlow } from '../base.flow.js'
import { type ContextData, STEP_INDICATORS } from './@checkout.js'

import type { FlowParams } from '../../types/flows.js'

@injectable()
export class CheckoutChangeFlow extends BaseFlow {
  public async handle({ phone, message, context }: FlowParams) {
    const changeAmount = Number.parseFloat(message.replace(',', '.'))
    const { totalAmount } = context.data as ContextData

    if (Number.isNaN(changeAmount) || changeAmount < 0) {
      return this.buildInvalidAmountResponse()
    }

    if (changeAmount <= totalAmount) {
      return this.buildInsufficientChangeResponse(changeAmount, totalAmount)
    }

    return this.proceedToAddressStep(phone, changeAmount)
  }

  //#
  private buildInvalidAmountResponse() {
    return this.responseBuilder
      .addBold('❌ VALOR INVÁLIDO!')
      .addText('Por favor, digite um valor válido para o troco.')
      .addText('Ex: 50, 100 ou 0 se não precisar de troco.')
      .build()
  }

  private buildInsufficientChangeResponse(change: number, total: number) {
    return this.responseBuilder
      .addBold('❌ TROCO INSUFICIENTE!')
      .addText('O valor do troco deve ser maior que o valor total da compra.')
      .addText('Troco:', formatCurrency(change))
      .addText('Valor total:', formatCurrency(total))
      .addEmptyLine()
      .addText('Por favor, digite um novo valor para troco.')
      .build()
  }

  private proceedToAddressStep(phone: string, change: number) {
    const customer = this.state.getCustomer(phone)

    this.state.updateContext(phone, {
      data: { change, deliveryAddress: customer.address },
      flow: FLOWS.CHECKOUT_ADDRESS,
    })

    return this.responseBuilder
      .addCode(STEP_INDICATORS.ADDRESS)
      .addEmptyLine()
      .addBold('📍 ENDEREÇO DE ENTREGA')
      .addText('Encontramos o endereço abaixo em seu cadastro:')
      .addQuote(customer.address)
      .addEmptyLine()
      .addText('Deseja utilizar este endereço?')
      .addText('1️⃣ - Sim, manter este endereço')
      .addText('2️⃣ - Não, quero informar um novo endereço')
      .build()
  }
}
