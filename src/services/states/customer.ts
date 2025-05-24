import { inject, injectable } from 'tsyringe'

import { LoggerProvider } from '../../providers/logger.js'
import { isEmpty } from '../../utils/is-empty.js'
import { StateManager } from './manager.js'

import type { Customer, FlowState } from '../../types/index.js'

interface ICustomerService {
  updateCustomer(
    phone: string,
    currentState: FlowState,
    customerUpdates: Partial<Customer>,
  ): FlowState
}

/** Serviço para gerenciamento dos dados do cliente no estado do fluxo */
@injectable()
export class CustomerService implements ICustomerService {
  constructor(
    @inject(StateManager) private stateManager: StateManager,
    @inject(LoggerProvider) private logger: LoggerProvider,
  ) {}

  public updateCustomer(
    phone: string,
    currentState: FlowState,
    customerUpdates: Partial<Customer>,
  ): FlowState {
    this.validateCurrentState(phone, currentState)
    this.validateCustomerUpdates(phone, customerUpdates)

    const updatedState = {
      ...currentState,
      customer: {
        ...currentState.customer,
        ...customerUpdates,
      },
    }

    this.stateManager.set(phone, updatedState)
    this.logger.debug('Dados do cliente atualizados', {
      fields: Object.keys(customerUpdates),
    })

    return updatedState
  }

  private validateCustomerUpdates(phone: string, customerUpdates: Partial<Customer>): void {
    if (isEmpty(customerUpdates)) {
      this.logger.warn('Tentativa de atualizar cliente com dados vazios', { phone })
      return
    }
  }

  private validateCurrentState(phone: string, currentState: FlowState): void {
    if (isEmpty(currentState)) {
      this.logger.warn('Tentativa de atualizar cliente sem estado', { phone })
      return
    }
  }
}
