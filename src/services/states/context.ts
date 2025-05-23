import { inject, injectable } from 'tsyringe'

import { LoggerProvider } from '../../providers/logger.js'
import { StateManager } from './manager.js'
import type { FLOWS } from '../../config/enums.js'
import type { FlowContext, FlowState } from '../../types/flows.js'
import { isEmpty } from '../../utils/is-empty.js'

/**
 * Serviço para gerenciamento do contexto no estado do fluxo
 */
@injectable()
export class ContextService {
  private readonly MAX_HISTORY_LENGTH = 10

  constructor(
    @inject(StateManager) private readonly stateManager: StateManager,
    @inject(LoggerProvider) private readonly logger: LoggerProvider,
  ) {}

  /**
   * Atualiza o contexto do fluxo
   * @param phone - Número de telefone do usuário
   * @param currentState - Estado atual do fluxo
   * @param contextUpdates - Atualizações parciais para o contexto
   * @returns Estado atualizado
   */
  public updateContext(phone: string, currentState: FlowState, contextUpdates: Partial<FlowContext>): FlowState {
    if (isEmpty(contextUpdates)) {
      this.logger.warn('Tentativa de atualizar contexto com dados vazios')
      return currentState
    }

    const history = this.updateHistory(currentState, contextUpdates)

    const updatedState = {
      ...currentState,
      context: {
        ...currentState.context,
        ...contextUpdates,
        history,
        data: {
          ...currentState.context.data,
          ...contextUpdates.data,
        },
      },
    }

    this.stateManager.set(phone, updatedState)
    this.logger.debug('Contexto atualizado', {
      fields: Object.keys(contextUpdates),
      data: updatedState.context.data || {},
    })

    return updatedState
  }

  /**
   * Atualiza o fluxo atual
   * @param phone - Número de telefone do usuário
   * @param currentState - Estado atual do fluxo
   * @param flow - Novo fluxo
   * @returns Estado atualizado
   */
  public updateFlow(phone: string, currentState: FlowState, flow: FLOWS): FlowState {
    if (!flow) {
      this.logger.warn('Tentativa de atualizar fluxo com valor inválido')
      return currentState
    }
    return this.updateContext(phone, currentState, { flow })
  }

  /**
   * Atualiza os dados do contexto
   * @param phone - Número de telefone do usuário
   * @param currentState - Estado atual do fluxo
   * @param data - Novos dados para o contexto
   * @returns Estado atualizado
   */
  public updateData(phone: string, currentState: FlowState, data: FlowContext['data']): FlowState {
    if (isEmpty(data)) {
      this.logger.warn('Tentativa de atualizar dados do contexto com dados vazios')
      return currentState
    }
    return this.updateContext(phone, currentState, { data })
  }

  /**
   * Limpa os dados do contexto mantendo as outras propriedades
   * @param phone - Número de telefone do usuário
   * @param currentState - Estado atual do fluxo
   * @returns Estado atualizado
   */
  public clearData(phone: string, currentState: FlowState): FlowState {
    const updatedState = {
      ...currentState,
      context: {
        ...currentState.context,
        data: {},
      },
    }

    this.stateManager.set(phone, updatedState)
    this.logger.debug('Dados do contexto limpos')

    return updatedState
  }

  /**
   * Atualiza o histórico de fluxos quando o fluxo muda
   * @private
   * @param currentState - Estado atual do fluxo
   * @param contextUpdates - Atualizações para o contexto
   * @returns Histórico atualizado
   */
  private updateHistory(currentState: FlowState, contextUpdates: Partial<FlowContext>): string[] {
    const currentContext = currentState.context
    const currentHistory = currentContext.history || []
    const previousFlow = currentContext.flow
    const newFlow = contextUpdates.flow

    if (!newFlow || newFlow === previousFlow) return currentHistory

    const newHistory = previousFlow ? [previousFlow, ...currentHistory] : [...currentHistory]
    return newHistory.slice(0, this.MAX_HISTORY_LENGTH)
  }
}
