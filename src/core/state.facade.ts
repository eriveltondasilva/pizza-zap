import { inject, singleton } from 'tsyringe'

import {
  CartService,
  ContextService,
  CustomerService,
  StateManager,
} from '../services/states/index.js'

import type { FLOWS } from '../config/enums.js'
import type { CartItem, Customer } from '../types/entities.js'
import type { FlowContext, FlowData, FlowState } from '../types/flows.js'

export interface IStateFacade {
  // GERENCIAMENTO DE ESTADO
  getState(phone: string): FlowState
  hasState(phone: string): boolean
  resetState(phone: string): FlowState
  deleteState(phone: string): boolean
  clearAllStates(): void

  // GERENCIAMENTO DE CONTEXTO
  getContext(phone: string): FlowContext
  updateContext(phone: string, context: Partial<FlowContext>): FlowState

  // DATA
  updateData(phone: string, data: FlowData): FlowState
  clearData(phone: string): FlowState

  // FLOW
  updateFlow(phone: string, flow: FLOWS): FlowState

  // GERENCIAMENTO DE CLIENTE
  getCustomer(phone: string): Customer
  updateCustomer(phone: string, customer: Partial<Customer>): FlowState

  // GERENCIAMENTO DE CARRINHO
  getCart(phone: string): CartItem[]
  addToCart(phone: string, item: CartItem): FlowState
  removeFromCart(phone: string, index: number): FlowState
  clearCart(phone: string): FlowState
}

/** Facade para gerenciamento de estado do fluxo da aplicação */
@singleton()
export class StateFacade implements IStateFacade {
  constructor(
    @inject(CartService) private cartService: CartService,
    @inject(ContextService) private contextService: ContextService,
    @inject(CustomerService) private customerService: CustomerService,
    @inject(StateManager) private stateManager: StateManager,
  ) {}

  //# GERENCIAMENTO DE ESTADO
  public getState(phone: string): FlowState {
    return this.stateManager.get(phone)
  }

  public hasState(phone: string): boolean {
    return this.stateManager.has(phone)
  }

  public resetState(phone: string): FlowState {
    return this.stateManager.reset(phone)
  }

  public deleteState(phone: string): boolean {
    return this.stateManager.delete(phone)
  }

  public clearAllStates(): void {
    this.stateManager.clearAllStates()
  }

  //# GERENCIAMENTO DE CONTEXTO

  //* CONTEXTO

  public getContext(phone: string): FlowContext {
    const { context } = this.getState(phone)
    return context
  }

  public updateContext(phone: string, context: Partial<FlowContext>): FlowState {
    const state = this.getState(phone)
    return this.contextService.updateContext(phone, state, context)
  }

  //* DATA

  public updateData(phone: string, data: FlowData): FlowState {
    const state = this.getState(phone)
    return this.contextService.updateData(phone, state, data)
  }

  public clearData(phone: string): FlowState {
    const state = this.getState(phone)
    return this.contextService.clearData(phone, state)
  }

  //* FLOW

  public updateFlow(phone: string, flow: FLOWS): FlowState {
    const state = this.getState(phone)
    return this.contextService.updateFlow(phone, state, flow)
  }

  //#  GERENCIAMENTO DE CLIENTE

  public getCustomer(phone: string): Customer {
    const { customer } = this.getState(phone)
    return customer
  }

  public updateCustomer(phone: string, customer: Partial<Customer>): FlowState {
    const state = this.getState(phone)
    return this.customerService.updateCustomer(phone, state, customer)
  }

  //# GERENCIAMENTO DE CARRINHO

  public getCart(phone: string): CartItem[] {
    const { cart } = this.getState(phone)
    return cart
  }

  public addToCart(phone: string, item: CartItem): FlowState {
    const state = this.getState(phone)
    return this.cartService.addToCart(phone, state, item)
  }

  public removeFromCart(phone: string, index: number): FlowState {
    const state = this.getState(phone)
    return this.cartService.removeFromCart(phone, state, index)
  }

  public clearCart(phone: string): FlowState {
    const state = this.getState(phone)
    return this.cartService.clearCart(phone, state)
  }

  // public getCartTotal(phone: string): number {
  //   const state = this.getState(phone)
  //   return this.cartService.getCartTotal(state)
  // }
}
