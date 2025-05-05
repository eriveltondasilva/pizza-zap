import { injectable } from 'tsyringe'

import { FLOWS } from '@/config/enums.js'
import { formatCurrency } from '@/utils/format-currency.js'
import { isValidQuantity } from '@/utils/validations.js'
import { BaseFlow } from '../base.flow.js'
import { type ContextData, STEP_INDICATORS } from './@drink.js'

import type { FlowParams } from '@/types/flows.js'

@injectable()
export class DrinkQuantityFlow extends BaseFlow {
  public async handle({ phone, message, context }: FlowParams) {
    const quantity = Number.parseInt(message, 10)

    if (!isValidQuantity(quantity)) {
      return this.responseBuilder
        .addBold('❌ QUANTIDADE INVÁLIDA!')
        .addText('Por favor, digite um número entre 1 e 10.')
        .build()
    }

    const data = context.data as ContextData
    const isValidOrder = Boolean(data.selectedDrink.name && data.quantity)

    if (!isValidOrder) {
      this.state.resetState(phone)
      return this.responseBuilder
        .addBold('❌ ERRO NO PEDIDO')
        .addText('Não foi possível processar seu pedido devido a dados incompletos.')
        .addText('Por favor, inicie seu pedido novamente.')
        .build()
    }

    const orderCalculation = this.calculateOrder({ ...data, quantity })

    this.state.updateContext(phone, {
      data: {
        unitPrice: orderCalculation.unitPrice,
        subtotal: orderCalculation.subtotal,
        quantity,
      },
      flow: FLOWS.DRINK_FINISH,
    })

    return this.responseBuilder
      .addCode(STEP_INDICATORS.FINISH)
      .addMono()
      .addText('# RESUMO DO PEDIDO')
      .addLine()
      .addText('Bebida:', data.selectedDrink.name)
      .addEmptyLine()
      .addText('Quantidade:', data.quantity.toString())
      .addText('Preço Unit.:', formatCurrency(data.selectedDrink.price))
      .addText('Total:', formatCurrency(data.subtotal))
      .addLine()
      .addMono()
      .addText('Deseja confirmar seu pedido?')
      .addText('1️⃣ - Sim, confirmar meu pedido ✅')
      .addText('2️⃣ - Não, cancelar o pedido ❌')
      .build()
  }

  //#
  private calculateOrder({ selectedDrink, quantity }: ContextData) {
    const unitPrice = Number(selectedDrink.price) || 0
    const subtotal = unitPrice * quantity
    return { unitPrice, subtotal }
  }
}
