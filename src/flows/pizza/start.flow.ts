import { isEmpty } from '@/utils/is-empty.js'
import { inject, injectable } from 'tsyringe'

import { ListResponseBuilder } from '@/builders/responses/list.js'
import { FLOWS } from '@/config/enums.js'
import { LoggerProvider } from '@/providers/logger.js'
import { FlavorRepository } from '@/repositories/flavor.js'
import { buildFlavorList } from '@/utils/list-builder.js'
import { BaseFlow } from '../base.flow.js'
import { STEP_INDICATORS } from './@pizza.js'

import type { FlowParams } from '@/types/flows.js'

const MESSAGES = {
  SINGLE_FLAVOR: '🍕 ESCOLHA O SABOR DA SUA PIZZA',
  HALF_FLAVOR: '🍕 ESCOLHA O 1° SABOR DA SUA PIZZA',
}

@injectable()
export class PizzaStartFlow extends BaseFlow {
  constructor(
    @inject(FlavorRepository) private readonly flavorRepository: FlavorRepository,
    @inject(ListResponseBuilder) private readonly listResponseBuilder: ListResponseBuilder,
    @inject(LoggerProvider) private readonly logger: LoggerProvider,
  ) {
    super()
  }

  public async handle({ phone, message }: FlowParams) {
    const flavors = await this.flavorRepository.getAll()
    const isSingleFlavor = message === '1'

    if (isEmpty(flavors)) {
      this.logger.error('No flavors found', { phone })
      this.state.resetState(phone)
      return this.responseBuilder
        .addBold('❌ ERRO NO PEDIDO')
        .addText('Desculpe, não encontramos sabores disponíveis no momento.')
        .addText('Por favor, tente novamente mais tarde.')
        .build()
    }

    this.state.updateContext(phone, {
      data: { isSingleFlavor },
      flow: FLOWS.PIZZA_FLAVOR,
    })

    return this.listResponseBuilder
      .addCode(STEP_INDICATORS.FLAVOR)
      .addEmptyLine()
      .addBold(isSingleFlavor ? MESSAGES.SINGLE_FLAVOR : MESSAGES.HALF_FLAVOR)
      .addQuote('Por favor, aperte o botão abaixo para escolher o sabor da sua pizza.')
      .addList(buildFlavorList(flavors))
      .build()
  }
}
