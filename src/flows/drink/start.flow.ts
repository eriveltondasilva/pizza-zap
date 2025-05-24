import { inject, injectable } from 'tsyringe'

import { ListResponseBuilder } from '../../builders/responses/list.js'
import { FLOWS } from '../../config/enums.js'
import { LoggerProvider } from '../../providers/logger.js'
import { DrinkRepository } from '../../repositories/drink.js'
import { isEmpty } from '../../utils/is-empty.js'
import { buildDrinkList } from '../../utils/list-builder.js'
import { BaseFlow } from '../base.flow.js'
import { STEP_INDICATORS } from './@drink.js'

import type { FlowParams } from '../../types/flows.js'

@injectable()
export class DrinkStartFlow extends BaseFlow {
  constructor(
    @inject(DrinkRepository) private drinkRepository: DrinkRepository,
    @inject(ListResponseBuilder) private listResponseBuilder: ListResponseBuilder,
    @inject(LoggerProvider) private logger: LoggerProvider,
  ) {
    super()
  }

  public async handle({ phone }: FlowParams) {
    const drinks = await this.drinkRepository.getAll()

    if (isEmpty(drinks)) {
      this.logger.error('No drinks found', { phone })
      this.state.resetState(phone)
      return this.responseBuilder
        .addBold('❌ ERRO NO PEDIDO')
        .addText('Desculpe, não encontramos bebidas disponíveis no momento.')
        .addText('Por favor, tente novamente mais tarde.')
        .build()
    }

    this.state.updateFlow(phone, FLOWS.DRINK_SELECTION)

    return this.listResponseBuilder
      .addCode(STEP_INDICATORS.DRINK)
      .addEmptyLine()
      .addBold('🍹 ESCOLHA SUA BEBIDA')
      .addQuote('Por favor, aperte o botão abaixo para escolher a sua bebida.')
      .addList(buildDrinkList(drinks))
      .build()
  }
}
