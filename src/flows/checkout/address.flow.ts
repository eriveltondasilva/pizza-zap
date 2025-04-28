import { injectable } from 'tsyringe'

import { FLOWS } from '@/config/enums.js'
import { BaseFlow } from '../base.flow.js'

import type { FlowParams } from '@/types/flows.js'
import { type ContextData, STEP_INDICATORS } from './types.js'

@injectable()
export class CheckoutAddressFlow extends BaseFlow {
  public async handle({ phone, message, context }: FlowParams) {
    const { isUpdatingAddress } = context.data as ContextData
    const selectedOption = Number(message)

    if (selectedOption === 1 && !isUpdatingAddress) {
      this.state.updateFlow(phone, FLOWS.CHECKOUT_OBSERVATIONS)

      return this.responseBuilder
        .addText('Deseja adicionar alguma observação ao seu pedido?')
        .addQuote('Exemplo: Campainha não funciona, ligar ao chegar, etc.')
        .addEmptyLine()
        .addText('0️⃣ - Não desejo adicionar observações')
        .build()
    }

    if (selectedOption === 2 && !isUpdatingAddress) {
      this.state.updateData(phone, { isUpdatingAddress: true })

      return this.responseBuilder
        .addText('📍 Digite seu endereço completo:')
        .addQuote('Exemplo: Rua das Flores, 123 - Bairro Jardim, Cidade - Complemento, CEP')
        .build()
    }

    if (isUpdatingAddress && message.length < 10) {
      return this.responseBuilder
        .addBold('❌ ENDEREÇO MUITO CURTO!')
        .addText('Por favor, digite um endereço completo para entrega.')
        .addQuote('Ex: Rua das Flores, 123 - Bairro Jardim, Cidade - Complemento, CEP')
        .build()
    }

    if (isUpdatingAddress) {
      this.state.updateContext(phone, {
        data: { isUpdatingAddress: false, deliveryAddress: message },
        flow: FLOWS.CHECKOUT_OBSERVATIONS,
      })

      return this.responseBuilder
        .addCode(STEP_INDICATORS.ADDRESS)
        .addEmptyLine()
        .addText('Deseja adicionar alguma observação ao seu pedido?')
        .addQuote('Exemplo: Campainha não funciona, ligar ao chegar, etc.')
        .addEmptyLine()
        .addText('0️⃣ - Não desejo adicionar observações')
        .build()
    }

    return this.responseBuilder
      .addBold('❌ OPÇÃO INVÁLIDA')
      .addText('Por favor, escolha uma das opções disponíveis:')
      .addText('1️⃣ - Sim, manter este endereço')
      .addText('2️⃣ - Não, quero informar um novo endereço')
      .build()
  }
}
