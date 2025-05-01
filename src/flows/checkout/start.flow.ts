import { injectable } from 'tsyringe'

import { FLOWS } from '@/config/enums.js'
import { orderMenu, paymentMenu } from '@/templates/menus.js'
import { formatCurrency } from '@/utils/format-currency.js'
import { BaseFlow } from '../base.flow.js'

import type { CartItem } from '@/types/entities.js'
import type { FlowParams } from '@/types/flows.js'
import { STEP_INDICATORS } from './@checkout.js'

@injectable()
export class CheckoutStartFlow extends BaseFlow {
  public async handle({ phone }: FlowParams) {
    const cart = this.state.getCart(phone)

    if (cart.length === 0) {
      return this.handleEmptyCart(phone)
    }

    const cartSummary = this.createCartSummary(cart)
    const totalAmount = this.calculateTotal(cart)
    const formattedTotal = formatCurrency(totalAmount)

    this.state.updateContext(phone, {
      data: { totalAmount },
      flow: FLOWS.CHECKOUT_PAYMENT,
    })

    return this.responseBuilder
      .addCode(STEP_INDICATORS.SUMMARY)
      .addMono()
      .addText('# RESUMO DO PEDIDO')
      .addLine()
      .addBulletList(cartSummary)
      .addEmptyLine()
      .addText('Total:', formattedTotal)
      .addLine()
      .addMono()
      .addMenu(paymentMenu)
      .build()
  }

  //#
  private calculateTotal(cart: CartItem[]): number {
    return cart.reduce((total, item) => total + item.subtotal, 0)
  }

  private createCartSummary(cart: CartItem[]): string[] {
    return cart.map((item) => `${item.quantity}x ${item.name} = ${formatCurrency(item.subtotal)}\n`)
  }

  private handleEmptyCart(phone: string) {
    this.state.updateFlow(phone, FLOWS.ORDER)
    return this.responseBuilder
      .addBold('❌ CARRINHO VAZIO')
      .addText(
        'Seu carrinho está vazio.',
        'Por favor, adicione itens ao carrinho antes de finalizar o pedido.',
      )
      .addEmptyLine()
      .addMenu(orderMenu)
      .build()
  }
}
