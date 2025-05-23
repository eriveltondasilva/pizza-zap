import { injectable } from 'tsyringe'

import { FLOWS } from '../../config/enums.js'
import { formatCurrency } from '../../utils/format-currency.js'
import { BaseFlow } from '../base.flow.js'
import { type ContextData, STEP_INDICATORS } from './@pizza.js'

import type { Flavor } from '../../types/entities.js'
import type { FlowParams } from '../../types/flows.js'

type OrderData = ContextData & {
  crustPrice: number
  pizzaPrice: number
}

@injectable()
export class PizzaNotesFlow extends BaseFlow {
  public async handle({ phone, message, context }: FlowParams) {
    const data = context.data as ContextData
    const isValidOrder = Boolean(data.selectedFlavors?.length > 0 && data.selectedCrust.name && data.quantity)

    if (!isValidOrder) {
      this.state.resetState(phone)
      return this.responseBuilder
        .addBold('❌ ERRO NO PEDIDO')
        .addText('Não foi possível processar seu pedido devido a dados incompletos.')
        .addText('Por favor, inicie seu pedido novamente.')
        .build()
    }

    const notes = message === '0' ? undefined : message
    const orderCalculation = this.calculateOrder(data)

    this.state.updateContext(phone, {
      data: {
        unitPrice: orderCalculation.unitPrice,
        subtotal: orderCalculation.subtotal,
        notes,
      },
      flow: FLOWS.PIZZA_FINISH,
    })

    return this.buildOrderSummary({ ...data, ...orderCalculation, notes })
  }

  private calculateAverageFlavorsPrice(flavors: Flavor[]) {
    if (flavors.length === 0) return 0
    const totalPrice = flavors.reduce((total, flavor) => total + Number(flavor.price || 0), 0)
    return totalPrice / flavors.length
  }

  private calculateOrder({ selectedFlavors, selectedCrust, quantity }: ContextData) {
    const pizzaPrice = this.calculateAverageFlavorsPrice(selectedFlavors)
    const crustPrice = Number(selectedCrust.price || 0)
    const unitPrice = pizzaPrice + crustPrice
    const subtotal = unitPrice * quantity

    return { crustPrice, pizzaPrice, unitPrice, subtotal }
  }

  private buildOrderSummary(order: OrderData) {
    const flavorName = order.selectedFlavors.map((flavor) => flavor.name).join(' + ')
    const formattedCrustPrice = order.crustPrice === 0 ? 'grátis' : formatCurrency(order.crustPrice)

    return this.responseBuilder
      .addCode(STEP_INDICATORS.FINISH)
      .addMono()
      .addText('# RESUMO DO PEDIDO')
      .addLine()
      .addText('Sabor:', flavorName, `(${formatCurrency(order.pizzaPrice)})`)
      .addText('Borda:', order.selectedCrust.name, `(${formattedCrustPrice})`)
      .addEmptyLine()
      .addText('Quantidade:', order.quantity.toString())
      .addText('Preço Unit.:', formatCurrency(order.unitPrice))
      .addText('Total:', formatCurrency(order.subtotal))
      .addEmptyLine()
      .addText('Observação:', order.notes || 'nenhuma')
      .addLine()
      .addMono()
      .addText('Deseja confirmar seu pedido?')
      .addText('1️⃣ - Sim, confirmar meu pedido ✅')
      .addText('2️⃣ - Não, cancelar o pedido ❌')
      .build()
  }
}
