import { FLOWS } from '@/config/enums.js'
import { BaseFlow } from '../base.flow.js'

import type { FlowParams } from '@/types/flows.js'
import type { ContextData } from './types.js'

export class CheckoutAddressFlow extends BaseFlow {
  public async handle({ phone, message, context }: FlowParams) {
    const isConfirmed = message === '1'
    const data = context.data as ContextData

    if (!isConfirmed) {
      this.state.updateData(phone, { deliveryAddress: null })
      return this.responseBuilder
        .addText('📍 Digite seu endereço completo:')
        .addQuote('Ex: Rua das Flores, 123 - Bairro Jardim, Cidade - Complemento, CEP')
        .build()
    }

    if (message.length < 10) {
      return this.responseBuilder
        .addBold('❌ ENDEREÇO MUITO CURTO!')
        .addText('Por favor, digite um endereço completo para entrega.')
        .addQuote('Ex: Rua das Flores, 123 - Bairro Jardim, Cidade - Complemento, CEP')
        .build()
    }

    this.state.updateContext(phone, {
      flow: FLOWS.CHECKOUT_OBSERVATIONS,
    })

    return this.responseBuilder
      .addText('Deseja adicionar alguma observação ao seu pedido?')
      .addQuote('Exemplo: Campainha não funciona, ligar ao chegar, etc.')
      .addEmptyLine()
      .addText('0️⃣ - Não desejo adicionar observações')
      .build()
  }
}
