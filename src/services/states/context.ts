import { inject, injectable } from 'tsyringe'

import { LoggerProvider } from '../../providers/logger.js'
import { isEmpty } from '../../utils/is-empty.js'
import { StateManager } from './manager.js'

import type { FLOWS } from '../../config/enums.js'
import type { FlowContext, FlowState } from '../../types/flows.js'

interface IContextService {
  updateContext(
    phone: string,
    currentState: FlowState,
    contextUpdates: Partial<FlowContext>,
  ): FlowState
  updateFlow(phone: string, currentState: FlowState, flow: FLOWS): FlowState
  updateData(phone: string, currentState: FlowState, data: FlowContext['data']): FlowState
  clearData(phone: string, currentState: FlowState): FlowState
}

/** Serviço para gerenciamento do contexto no estado do fluxo */
@injectable()
export class ContextService implements IContextService {
  private readonly MAX_HISTORY_LENGTH = 10

  constructor(
    @inject(StateManager) private stateManager: StateManager,
    @inject(LoggerProvider) private logger: LoggerProvider,
  ) {}

  public updateContext(
    phone: string,
    currentState: FlowState,
    contextUpdates: Partial<FlowContext>,
  ): FlowState {
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

  public updateFlow(phone: string, currentState: FlowState, flow: FLOWS): FlowState {
    if (!flow) {
      this.logger.warn('Tentativa de atualizar fluxo com valor inválido')
      return currentState
    }
    return this.updateContext(phone, currentState, { flow })
  }

  public updateData(phone: string, currentState: FlowState, data: FlowContext['data']): FlowState {
    if (isEmpty(data)) {
      this.logger.warn('Tentativa de atualizar dados do contexto com dados vazios')
      return currentState
    }
    return this.updateContext(phone, currentState, { data })
  }

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

  //#
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
