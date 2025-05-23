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

/**
 * Gerenciador principal para os estados de fluxo
 */
@singleton()
export class StateManager {
  constructor(
    @inject(LoggerProvider) private readonly logger: LoggerProvider,
    @inject(StateStore) private readonly stateStore: StateStore,
  ) {}

  /**
   * Obtém o estado para um número de telefone, inicializando se necessário
   * @param phone - Número de telefone do usuário
   * @returns Estado atual ou novo estado inicializado
   */
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

  /**
   * Define ou atualiza o estado para um número de telefone
   * @param phone - Número de telefone do usuário
   * @param currentState - Estado a ser armazenado
   */
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

  /**
   * Remove o estado para um número de telefone
   * @param phone - Número de telefone do usuário
   * @returns Verdadeiro se o estado foi removido com sucesso
   */
  public delete(phone: string): boolean {
    const isDeleted = this.stateStore.delete(phone)
    if (isDeleted) this.logger.debug(Messages.DELETED, { phone })

    return isDeleted
  }

  /**
   * Reinicia o estado para um número de telefone
   * @param phone - Número de telefone do usuário
   * @returns Novo estado inicializado
   */
  public reset(phone: string): FlowState {
    this.delete(phone)
    this.logger.debug(Messages.RESET, { phone })
    return this.initializeState(phone)
  }

  /**
   * Remove todos os estados armazenados
   */
  public clearAllStates(): void {
    this.stateStore.clearAll()
    this.logger.info('🗑️ Todos os estados foram removidos')
  }

  /**
   * Verifica se existe um estado ativo para um número de telefone
   * @param phone - Número de telefone do usuário
   * @returns Verdadeiro se existe um estado ativo
   */
  public has(phone: string): boolean {
    const state = this.stateStore.get(phone)
    return Boolean(state && !this.isStateExpired(state))
  }

  /**
   * Retorna o número total de estados armazenados
   * @returns Número de estados
   */
  public getSize(): number {
    return this.stateStore.getSize()
  }

  /**
   * Retorna todos os estados armazenados
   * @returns Array de pares [telefone, estado]
   */
  public getAllEntries(): [string, FlowState][] {
    return this.stateStore.getAllEntries()
  }

  /**
   * Verifica se um estado está expirado com base no tempo de inatividade
   * @param state - Estado a ser verificado
   * @returns Verdadeiro se o estado estiver expirado
   */
  public isStateExpired(state: FlowState): boolean {
    if (!state?.lastInteraction) return true

    const currentTime = Date.now()
    const lastInteractionTime = state.lastInteraction.getTime()

    return currentTime - lastInteractionTime > STATE_EXPIRATION_TIME
  }

  /**
   * Inicializa um novo estado para um número de telefone
   * @private
   * @param phone - Número de telefone do usuário
   * @returns Estado inicializado
   */
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
