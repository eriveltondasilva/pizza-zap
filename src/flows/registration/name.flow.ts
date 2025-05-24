import { inject, injectable } from 'tsyringe'

import { FLOWS } from '../../config/enums.js'
import { NameValidation } from '../../validations/name-validation.js'
import { BaseFlow } from '../base.flow.js'

import type { FlowParams } from '../../types/flows.js'

@injectable()
export class RegistrationNameFlow extends BaseFlow {
  constructor(@inject(NameValidation) private nameValidation: NameValidation) {
    super()
  }

  public async handle({ message: name, phone }: FlowParams) {
    if (!this.nameValidation.validate(name)) {
      return this.responseBuilder.addText(...this.nameValidation.getError()).build()
    }

    this.state.updateContext(phone, {
      data: { name },
      flow: FLOWS.REGISTRATION_ADDRESS,
    })

    return this.responseBuilder
      .addText('Olá,', name.split(' ')[0])
      .addText('Agora me diga onde vamos entregar suas delícias?')
      .addEmptyLine()
      .addText('Por favor, informe seu nome completo.')
      .addQuote('Exemplo: "_Rua das Flores, n° 83, Centro_"')
      .build()
  }
}
