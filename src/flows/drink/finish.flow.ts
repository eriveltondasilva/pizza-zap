// TODO: Implement drink confirm flow
import { injectable } from 'tsyringe'

import { FLOWS, ITEM_TYPES } from '@/config/enums.js'
import { orderMenu } from '@/templates/menus.js'
import { BaseFlow } from '../base.flow.js'

import type { CartItem } from '@/types/entities.js'
import type { FlowParams } from '@/types/flows.js'
import type { ContextData } from './@drink.js'

const MESSAGES = {
  CANCELED: '❌ PEDIDO CANCELADO',
  SUCCESS: '✅ Bebida adicionada ao carrinho com sucesso.',
}

const OPTIONS = {
  CANCEL: 1,
  CONFIRM: 2,
}

@injectable()
export class DrinkFinishFlow extends BaseFlow {
  public async handle({ message, phone, context }: FlowParams) {
    const selectedOption = Number(message)

    if (!Object.values(OPTIONS).includes(selectedOption)) {
      return this.responseBuilder
        .addText('❌ OPÇÃO INVÁLIDA')
        .addEmptyLine()
        .addText('Deseja confirmar seu pedido?')
        .addText('1️⃣ - Sim, confirmar meu pedido ✅')
        .addText('2️⃣ - Não, cancelar o pedido ❌')
        .build()
    }

    if (selectedOption === OPTIONS.CONFIRM) {
      const data = context.data as ContextData
      const cartItem = this.createCartItem(data)
      this.state.addToCart(phone, cartItem)
    }

    this.state.clearData(phone)
    this.state.updateFlow(phone, FLOWS.ORDER)

    return this.responseBuilder
      .addText(selectedOption === OPTIONS.CONFIRM ? MESSAGES.SUCCESS : MESSAGES.CANCELED)
      .addEmptyLine()
      .addMenu(orderMenu)
      .build()
  }

  //#
  private createCartItem(item: ContextData): CartItem {
    return {
      type: ITEM_TYPES.DRINK,
      name: item.selectedDrink.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
      details: {
        drink: item.selectedDrink,
      },
    }
  }
}
