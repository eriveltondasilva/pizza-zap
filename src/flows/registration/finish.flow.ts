import { inject, injectable } from 'tsyringe'

import { FLOWS } from '../../config/enums.js'
import { LoggerProvider } from '../../providers/logger.js'
import { CustomerRepository } from '../../repositories/customer.js'
import { mainMenu } from '../../templates/menus.js'
import { BaseFlow } from '../base.flow.js'

import type { FlowParams } from '../../types/flows.js'
import type { ContextData } from './@registration.js'

@injectable()
export class RegistrationFinishFlow extends BaseFlow {
  constructor(
    @inject(LoggerProvider) private readonly logger: LoggerProvider,
    @inject(CustomerRepository) private readonly customerRepository: CustomerRepository,
  ) {
    super()
  }

  public async handle({ context, message, phone }: FlowParams) {
    const isCanceled = message === '0'

    if (isCanceled) {
      this.state.deleteState(phone)
      return this.responseBuilder
        .addBold('❌ CADASTRO CANCELADO')
        .addText(
          'Infelizmente, você precisará de um cadastro para fazer um pedido.',
          'Tente novamente mais tarde.',
        )
        .build()
    }

    const { name, address } = context.data as ContextData
    if (!name || !address) throw new Error('Dados de cadastro incompletos')

    const newCustomer = this.customerRepository.create({ name, address, phone })
    this.logger.ok('Novo cliente registrado com sucesso', { newCustomer })

    this.state.updateCustomer(phone, { name, address })
    this.state.updateFlow(phone, FLOWS.MENU)
    this.state.clearData(phone)

    const firstName = name.split(' ')[0]

    return this.responseBuilder
      .addText('🎉 Cadastro concluído com sucesso,', firstName)
      .addText('Agora, vamos ao que interessa: _*escolher algo gostoso*_ 😋🍕')
      .addEmptyLine()
      .addMenu(mainMenu)
      .build()
  }
}
