import { inject, injectable } from 'tsyringe'

import { FLOWS } from '../../config/enums.js'
import { AddressValidation } from '../../validations/address-validation.ts'
import { BaseFlow } from '../base.flow.js'
import { type ContextData, STEP_INDICATORS } from './@checkout.js'

import type { FlowParams } from '../../types/flows.js'

const OPTIONS = {
  KEEP_ADDRESS: 1,
  UPDATE_ADDRESS: 2,
}

@injectable()
export class CheckoutAddressFlow extends BaseFlow {
  constructor(@inject(AddressValidation) private addressValidation: AddressValidation) {
    super()
  }

  public async handle({ phone, message, context }: FlowParams) {
    const { isUpdatingAddress } = context.data as ContextData

    if (isUpdatingAddress) return this.handleAddressInput(phone, message)

    return this.handleOptionSelection(phone, message)
  }

  //#
  private handleAddressInput(phone: string, message: string) {
    if (!this.addressValidation.validate(message)) {
      return this.responseBuilder.addText(...this.addressValidation.getError()).build()
    }

    this.state.updateContext(phone, {
      data: { isUpdatingAddress: false, deliveryAddress: message },
      flow: FLOWS.CHECKOUT_OBSERVATIONS,
    })

    return this.buildObservationsResponse()
  }

  private handleOptionSelection(phone: string, message: string) {
    const selectedOption = Number(message)

    if (selectedOption === OPTIONS.KEEP_ADDRESS) {
      this.state.updateFlow(phone, FLOWS.CHECKOUT_OBSERVATIONS)

      return this.buildObservationsResponse()
    }

    if (selectedOption === OPTIONS.UPDATE_ADDRESS) {
      this.state.updateData(phone, { isUpdatingAddress: true })

      return this.responseBuilder
        .addText('📍 Digite seu endereço completo:')
        .addQuote('Exemplo: Rua das Flores, 123 - Bairro Jardim, Cidade - Complemento, CEP')
        .build()
    }

    return this.buildInvalidOptionResponse()
  }

  private buildObservationsResponse() {
    return this.responseBuilder
      .addCode(STEP_INDICATORS.ADDRESS)
      .addEmptyLine()
      .addText('Deseja adicionar alguma observação ao seu pedido?')
      .addQuote('Exemplo: Campainha não funciona, ligar ao chegar, etc.')
      .addEmptyLine()
      .addText('0️⃣ - Não desejo adicionar observações')
      .build()
  }

  private buildInvalidOptionResponse() {
    return this.responseBuilder
      .addBold('❌ OPÇÃO INVÁLIDA')
      .addText('Por favor, escolha uma das opções disponíveis:')
      .addText('1️⃣ - Sim, manter este endereço')
      .addText('2️⃣ - Não, quero informar um novo endereço')
      .build()
  }
}
