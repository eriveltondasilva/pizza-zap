import { inject, singleton } from 'tsyringe'

import {
  CartService,
  ContextService,
  CustomerService,
  StateManager,
} from '@/services/states/index.js'

import type { FLOWS } from '@/config/enums.js'
import type { CartItem, Customer } from '@/types/entities.js'
import type { FlowContext, FlowData, FlowState } from '@/types/flows.js'

/**
 * Facade para gerenciamento de estado do fluxo da aplicação.
 * Centraliza acesso a todos os serviços de estado.
 */
@singleton()
export class StateFacade {
  constructor(
    @inject(CartService) private readonly cartService: CartService,
    @inject(ContextService) private readonly contextService: ContextService,
    @inject(CustomerService) private readonly customerService: CustomerService,
    @inject(StateManager) private readonly stateManager: StateManager,
  ) {}

  //# GERENCIAMENTO DE ESTADO

  /**
   * Obtém o estado atual do fluxo para um número de telefone
   * @param phone - Número de telefone do usuário
   */
  public getState(phone: string): FlowState {
    return this.stateManager.get(phone)
  }

  /**
   * Verifica se existe um estado ativo para um número de telefone
   * @param phone - Número de telefone do usuário
   */
  public hasState(phone: string): boolean {
    return this.stateManager.has(phone)
  }

  /**
   * Reinicia o estado para um número de telefone
   * @param phone - Número de telefone do usuário
   */
  public resetState(phone: string): FlowState {
    return this.stateManager.reset(phone)
  }

  /**
   * Remove o estado para um número de telefone
   * @param phone - Número de telefone do usuário
   */
  public deleteState(phone: string): boolean {
    return this.stateManager.delete(phone)
  }

  /**
   * Remove todos os estados armazenados
   */
  public clearAllStates(): void {
    this.stateManager.clearAllStates()
  }

  //# GERENCIAMENTO DE CONTEXTO

  //* CONTEXTO

  /**
   * Obtém o contexto atual para um número de telefone
   * @param phone - Número de telefone do usuário
   */
  public getContext(phone: string): FlowContext {
    const { context } = this.getState(phone)
    return context
  }

  /**
   * Atualiza o contexto para um número de telefone
   * @param phone - Número de telefone do usuário
   * @param context - Dados parciais do contexto a serem atualizados
   */
  public updateContext(phone: string, context: Partial<FlowContext>): FlowState {
    const state = this.getState(phone)
    return this.contextService.updateContext(phone, state, context)
  }

  //* DATA

  /**
   * Atualiza os dados do contexto para um número de telefone
   * @param phone - Número de telefone do usuário
   * @param data - Novos dados
   */
  public updateData(phone: string, data: FlowData): FlowState {
    const state = this.getState(phone)
    return this.contextService.updateData(phone, state, data)
  }

  /**
   * Limpa os dados do contexto para um número de telefone
   * @param phone - Número de telefone do usuário
   */
  public clearData(phone: string): FlowState {
    const state = this.getState(phone)
    return this.contextService.clearData(phone, state)
  }

  //* FLOW

  /**
   * Atualiza o fluxo atual para um número de telefone
   * @param phone - Número de telefone do usuário
   * @param flow - Novo fluxo
   */
  public updateFlow(phone: string, flow: FLOWS): FlowState {
    const state = this.getState(phone)
    return this.contextService.updateFlow(phone, state, flow)
  }

  //#  GERENCIAMENTO DE CLIENTE

  /**
   * Obtém os dados do cliente para um número de telefone
   * @param phone - Número de telefone do usuário
   */
  public getCustomer(phone: string): Customer {
    const { customer } = this.getState(phone)
    return customer
  }

  /**
   * Atualiza os dados do cliente para um número de telefone
   * @param phone - Número de telefone do usuário
   * @param customer - Dados parciais do cliente a serem atualizados
   */
  public updateCustomer(phone: string, customer: Partial<Customer>): FlowState {
    const state = this.getState(phone)
    return this.customerService.updateCustomer(phone, state, customer)
  }

  //# GERENCIAMENTO DE CARRINHO

  /**
   * Obtém o carrinho para um número de telefone
   * @param phone - Número de telefone do usuário
   */
  public getCart(phone: string): CartItem[] {
    const { cart } = this.getState(phone)
    return cart
  }

  /**
   * Adiciona um item ao carrinho para um número de telefone
   * @param phone - Número de telefone do usuário
   * @param item - Item a ser adicionado ao carrinho
   */
  public addToCart(phone: string, item: CartItem): FlowState {
    const state = this.getState(phone)
    return this.cartService.addToCart(phone, state, item)
  }

  /**
   * Remove um item do carrinho para um número de telefone
   * @param phone - Número de telefone do usuário
   * @param index - Índice do item a ser removido
   */
  public removeFromCart(phone: string, index: number): FlowState {
    const state = this.getState(phone)
    return this.cartService.removeFromCart(phone, state, index)
  }

  /**
   * Limpa o carrinho para um número de telefone
   * @param phone - Número de telefone do usuário
   */
  public clearCart(phone: string): FlowState {
    const state = this.getState(phone)
    return this.cartService.clearCart(phone, state)
  }

  // public getCartTotal(phone: string): number {
  //   const state = this.getState(phone)
  //   return this.cartService.getCartTotal(state)
  // }
}
