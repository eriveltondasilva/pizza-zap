import { singleton } from 'tsyringe'
import type { FlowState } from '../../types/index.js'

interface IStateStore {
  get(phone: string): FlowState | undefined
  set(phone: string, state: FlowState): void
  has(phone: string): boolean
  delete(phone: string): boolean
  clearAll(): void
  getSize(): number
  getAllEntries(): [string, FlowState][]
}

/** Classe responsável por armazenar e gerenciar o estado do fluxo de negócios. */
@singleton()
export class StateStore implements IStateStore {
  private readonly stateStore = new Map<string, FlowState>()

  public get(phone: string): FlowState | undefined {
    if (!phone) return undefined
    return this.stateStore.get(phone)
  }

  public set(phone: string, state: FlowState): void {
    if (!phone) return
    this.stateStore.set(phone, state)
  }

  public has(phone: string): boolean {
    if (!phone) return false
    return this.stateStore.has(phone)
  }

  public delete(phone: string): boolean {
    if (!phone) return false
    return this.stateStore.delete(phone)
  }

  public clearAll(): void {
    this.stateStore.clear()
  }

  public getSize(): number {
    return this.stateStore.size
  }

  public getAllEntries(): [string, FlowState][] {
    return Array.from(this.stateStore.entries())
  }
}
