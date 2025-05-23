import { injectable } from 'tsyringe'

import { FLOWS } from '../../config/enums.js'
import { isValidAddress } from '../../utils/validations.js'
import { BaseFlow } from '../base.flow.js'

import type { FlowParams } from '../../types/flows.js'
import type { ContextData } from './@registration.js'

@injectable()
export class RegistrationAddressFlow extends BaseFlow {
  public async handle({ context, message: address, phone }: FlowParams) {
    if (!isValidAddress(address)) {
      return this.responseBuilder
        .addBold('❌ ENDEREÇO INVÁLIDO')
        .addEmptyLine()
        .addText('Por favor, informe seu endereço completo.')
        .addQuote('Exemplo: "_Rua das Flores, n° 83, Centro_"')
        .build()
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
