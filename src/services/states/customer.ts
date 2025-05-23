import { inject, injectable } from 'tsyringe'

import { isEmpty } from '../../utils/is-empty.js'
import { LoggerProvider } from '../../providers/logger.js'
import { StateManager } from './manager.js'

import type { Customer } from '../../types/entities.js'
import type { FlowState } from '../../types/flows.js'

/**
 * Serviço para gerenciamento dos dados do cliente no estado do fluxo
 */
@injectable()
export class CustomerService {
  constructor(
    @inject(StateManager) private readonly stateManager: StateManager,
    @inject(LoggerProvider) private readonly logger: LoggerProvider,
  ) {}

  /**
   * Atualiza os dados do cliente
   * @param phone - Número de telefone do usuário
   * @param currentState - Estado atual do fluxo
   * @param customerUpdates - Atualizações parciais para os dados do cliente
   * @returns Estado atualizado
   */
  public updateCustomer(phone: string, currentState: FlowState, customerUpdates: Partial<Customer>): FlowState {
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
