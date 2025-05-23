import { singleton } from 'tsyringe'

import type { FlowState } from '../../types/flows.js'

/**
 * Classe responsável por armazenar e gerenciar o estado do fluxo de negócios.
 */
@singleton()
export class StateStore {
  private readonly stateStore = new Map<string, FlowState>()

  /**
   * Obtém o estado para um número de telefone
   * @param phone - Número de telefone do usuário
   * @returns Estado do fluxo ou undefined se não existir
   */
  public get(phone: string): FlowState | undefined {
    if (!phone) return undefined
    return this.stateStore.get(phone)
  }

  /**
   * Define ou atualiza o estado para um número de telefone
   * @param phone - Número de telefone do usuário
   * @param state - Estado a ser armazenado
   */
  public set(phone: string, state: FlowState): void {
    if (!phone) return
    this.stateStore.set(phone, state)
  }

  /**
   * Verifica se existe um estado para um número de telefone
   * @param phone - Número de telefone do usuário
   * @returns Verdadeiro se existe um estado
   */
  public has(phone: string): boolean {
    if (!phone) return false
    return this.stateStore.has(phone)
  }

  /**
   * Remove o estado para um número de telefone
   * @param phone - Número de telefone do usuário
   * @returns Verdadeiro se o estado foi removido com sucesso
   */
  public delete(phone: string): boolean {
    if (!phone) return false
    return this.stateStore.delete(phone)
  }

  /**
   * Limpa todos os estados armazenados
   */
  public clearAll(): void {
    this.stateStore.clear()
  }

  /**
   * Retorna o número total de estados armazenados
   * @returns Número de estados
   */
  public getSize(): number {
    return this.stateStore.size
  }

  /**
   * Retorna todos os estados armazenados
   * @returns Array de pares [telefone, estado]
   */
  public getAllEntries(): [string, FlowState][] {
    return Array.from(this.stateStore.entries())
  }
}
