import { inject, singleton } from 'tsyringe'

import { STATE_EXPIRATION_TIME } from '../../config/constants.js'
import { FLOWS } from '../../config/enums.js'
import { LoggerProvider } from '../../providers/logger.js'
import { isEmpty } from '../../utils/is-empty.js'
import { StateStore } from './store.js'

import type { FlowState } from '../../types/flows.js'

const Messages = {
  EXPIRED: 'Estado expirado, inicializando novo estado',
  NOT_INITIALIZED: 'Estado não encontrado, inicializando estado inicial',
  RESET: 'Estado reiniciado para usuário',
  DELETED: 'Estado removido para usuário',
}

interface IStateManager {
  get(phone: string): FlowState
  set(phone: string, currentState: FlowState): void
  delete(phone: string): boolean
  reset(phone: string): FlowState
  clearAllStates(): void
  has(phone: string): boolean
  getSize(): number
  getAllEntries(): [string, FlowState][]
  isStateExpired(state: FlowState): boolean
}

/** Gerenciador principal para os estados de fluxo */
@singleton()
export class StateManager implements IStateManager {
  constructor(
    @inject(LoggerProvider) private logger: LoggerProvider,
    @inject(StateStore) private stateStore: StateStore,
  ) {}

  public get(phone: string): FlowState {
    const state = this.stateStore.get(phone)

    if (!state) {
      this.logger.debug(Messages.NOT_INITIALIZED, { phone })
      return this.initializeState(phone)
    }

    if (this.isStateExpired(state)) {
      this.logger.debug(Messages.EXPIRED, { phone })
      return this.initializeState(phone)
    }

    return state
  }

  public set(phone: string, currentState: FlowState): void {
    if (isEmpty(currentState)) {
      this.logger.warn('Tentativa de definir estado vazio', { phone })
      return
    }

    const updatedState = {
      ...currentState,
      lastInteraction: new Date(),
    }

    this.stateStore.set(phone, updatedState)
  }

  public delete(phone: string): boolean {
    const isDeleted = this.stateStore.delete(phone)
    if (isDeleted) this.logger.debug(Messages.DELETED, { phone })

    return isDeleted
  }

  public reset(phone: string): FlowState {
    this.delete(phone)
    this.logger.debug(Messages.RESET, { phone })
    return this.initializeState(phone)
  }

  public clearAllStates(): void {
    this.stateStore.clearAll()
    this.logger.info('🗑️ Todos os estados foram removidos')
  }

  public has(phone: string): boolean {
    const state = this.stateStore.get(phone)
    return Boolean(state && !this.isStateExpired(state))
  }

  public getSize(): number {
    return this.stateStore.getSize()
  }

  public getAllEntries(): [string, FlowState][] {
    return this.stateStore.getAllEntries()
  }

  public isStateExpired(state: FlowState): boolean {
    if (!state?.lastInteraction) return true

    const currentTime = Date.now()
    const lastInteractionTime = state.lastInteraction.getTime()

    return currentTime - lastInteractionTime > STATE_EXPIRATION_TIME
  }

//#
  private initializeState(phone: string): FlowState {
    const initialState: FlowState = {
      context: {
        flow: FLOWS.WELCOME,
        data: {},
        history: [],
      },
      customer: {
        name: '',
        address: '',
        phone,
      },
      cart: [],
      lastInteraction: new Date(),
    }

    this.stateStore.set(phone, initialState)
    return initialState
  }
}
