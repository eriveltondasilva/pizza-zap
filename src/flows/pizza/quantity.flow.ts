import { inject, injectable } from 'tsyringe'

import { ListResponseBuilder } from '../../builders/responses/list.js'
import { FLOWS } from '../../config/enums.js'
import { LoggerProvider } from '../../providers/logger.js'
import { CrustRepository } from '../../repositories/crust.js'
import { isEmpty } from '../../utils/is-empty.js'
import { buildCrustList } from '../../utils/list-builder.js'
import { isValidQuantity } from '../../utils/validations.js'
import { BaseFlow } from '../base.flow.js'
import { STEP_INDICATORS } from './@pizza.js'

import type { FlowParams } from '../../types/flows.js'

@injectable()
export class PizzaQuantityFlow extends BaseFlow {
  constructor(
    @inject(CrustRepository) private readonly crustRepository: CrustRepository,
    @inject(ListResponseBuilder) private readonly listResponseBuilder: ListResponseBuilder,
    @inject(LoggerProvider) private readonly logger: LoggerProvider,
  ) {
    super()
  }

  public async handle({ phone, message }: FlowParams) {
    const quantity = Number.parseInt(message, 10)

    if (!isValidQuantity(quantity)) {
      return this.responseBuilder
        .addBold('❌ QUANTIDADE INVÁLIDA')
        .addText('Por favor, digite um número entre 1 e 10.')
        .build()
    }

    this.state.updateContext(phone, {
      data: { quantity },
      flow: FLOWS.PIZZA_CRUST,
    })

    const crusts = await this.crustRepository.getAll()

    if (isEmpty(crusts)) {
      this.logger.error('No crusts found', { phone })
      this.state.resetState(phone)
      return this.responseBuilder
        .addBold('❌ ERRO NO PEDIDO')
        .addText('Desculpe, não encontramos bordas disponíveis no momento.')
        .addText('Por favor, tente novamente mais tarde.')
        .build()
    }

    return this.listResponseBuilder
      .addCode(STEP_INDICATORS.CRUST)
      .addEmptyLine()
      .addBold('🍕 ESCOLHA A BORDA DA SUA PIZZA')
      .addQuote('Por favor, aperte o botão abaixo para escolher a borda da sua pizza.')
      .addList(buildCrustList(crusts))
      .build()
  }
}
