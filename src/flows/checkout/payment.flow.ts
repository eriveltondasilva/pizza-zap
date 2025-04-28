import { injectable } from 'tsyringe'

import { FLOWS, PAYMENT_METHODS } from '@/config/enums.js'
import { paymentMenu } from '@/templates/menus.js'
import { BaseFlow } from '../base.flow.js'

import type { FlowParams } from '@/types/flows.js'

const PAYMENT_MAP: Record<number, PAYMENT_METHODS> = {
  1: PAYMENT_METHODS.CREDIT,
  2: PAYMENT_METHODS.DEBIT,
  3: PAYMENT_METHODS.CASH,
  4: PAYMENT_METHODS.PIX,
} as const

@injectable()
export class CheckoutPaymentFlow extends BaseFlow {
  public async handle({ phone, message }: FlowParams) {
    const selectedIndex = Number.parseInt(message, 10)
    const selectedPayment = PAYMENT_MAP[selectedIndex]

    if (!selectedPayment) {
      return this.responseBuilder
        .addBold('❌ MÉTODO DE PAGAMENTO INVÁLIDO')
        .addText('Por favor, escolha uma das opções abaixo:')
        .addEmptyLine()
        .addMenu(paymentMenu)
        .build()
    }

    if (selectedPayment === PAYMENT_METHODS.CASH) {
      this.state.updateContext(phone, {
        data: { selectedPayment },
        flow: FLOWS.CHECKOUT_CHANGE,
      })

      return this.responseBuilder
        .addText('💵 Para quanto deseja troco?')
        .addQuote(`Digite o valor para troco ou "0" se não precisar.`)
        .build()
    }

    const customer = this.state.getCustomer(phone)

    this.state.updateContext(phone, {
      data: { selectedPayment, deliveryAddress: customer.address },
      flow: FLOWS.CHECKOUT_ADDRESS,
    })

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
