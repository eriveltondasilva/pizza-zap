import { ITEM_TYPES } from '@/config/enums.js'
import { injectable } from 'tsyringe'

import { FLOWS } from '@/config/enums.js'
import { orderMenu } from '@/templates/menus.js'
import { BaseFlow } from '../base.flow.js'

import type { CartItem } from '@/types/entities.js'
import type { FlowParams } from '@/types/flows.js'
import type { ContextData } from './@pizza.js'

const MESSAGES = {
  CANCELED: '❌ PEDIDO CANCELADO',
  SUCCESS: '✅ Pizza adicionada ao carrinho com sucesso.',
}

const OPTIONS = {
  CANCEL: 1,
  CONFIRM: 2,
}

@injectable()
export class PizzaFinishFlow extends BaseFlow {
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
      const contextData = context.data as ContextData
      const cartItem = this.createCartItem(contextData)
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
    const itemName = this.createItemName(item.selectedFlavors, item.selectedCrust)

    return {
      type: ITEM_TYPES.PIZZA,
      name: itemName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
      details: {
        crust: item.selectedCrust,
        flavors: item.selectedFlavors,
        notes: item.notes,
      },
    }
  }

  private createItemName(
    selectedFlavors: ContextData['selectedFlavors'],
    selectedCrust: ContextData['selectedCrust'],
  ) {
    return `Pizza ${selectedFlavors.map((flavor) => flavor.name).join(' + ')} (borda ${selectedCrust.name})`
  }
}
