import { inject, injectable } from 'tsyringe'

import { FLOWS } from '../../config/enums.js'
import { AddressValidation } from '../../validations/address-validation.js'
import { BaseFlow } from '../base.flow.js'

import type { FlowParams } from '../../types/flows.js'
import type { ContextData } from './@registration.js'

@injectable()
export class RegistrationAddressFlow extends BaseFlow {
  constructor(@inject(AddressValidation) private addressValidation: AddressValidation) {
    super()
  }

  public async handle({ context, message: address, phone }: FlowParams) {
    if (!this.addressValidation.validate(address)) {
      return this.responseBuilder.addText(...this.addressValidation.getError()).build()
    }

    this.state.updateContext(phone, {
      data: { address },
      flow: FLOWS.REGISTRATION_FINISH,
    })

    const { name } = context.data as ContextData

    return this.responseBuilder
      .addBold('✅ CONFIRMAÇÃO DE CADASTRO')
      .addText('Nome do cliente:', name)
      .addText('Endereço:', address)
      .addEmptyLine()
      .addText('Deseja confirmar seu pedido?')
      .addText('1️⃣ - Confirmar ✅')
      .addText('2️⃣ - Cancelar ❌')
      .build()
  }
}
