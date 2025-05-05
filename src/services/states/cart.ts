import { isEmpty } from '@/utils/is-empty.js'
import { inject, injectable } from 'tsyringe'

import { LoggerProvider } from '@/providers/logger.js'
import { StateManager } from './manager.js'

import type { CartItem } from '@/types/entities.js'
import type { FlowState } from '@/types/flows.js'

/**
 * Serviço responsável por gerenciar o estado do carrinho de compras.
 */
@injectable()
export class CartService {
  constructor(
    @inject(StateManager) private readonly stateManager: StateManager,
    @inject(LoggerProvider) private readonly logger: LoggerProvider,
  ) {}

  /**
   * Adiciona um item ao carrinho
   * @param phone - Número de telefone do usuário
   * @param currentState - Estado atual do fluxo
   * @param item - Item a ser adicionado
   * @returns Estado atualizado
   */
  public addToCart(phone: string, currentState: FlowState, item: CartItem): FlowState {
    if (isEmpty(item)) {
      this.logger.warn('Tentativa de adicionar item vazio ao carrinho')
      return currentState
    }

    const updatedState = {
      ...currentState,
      cart: [...(currentState.cart || []), item],
    }

    this.stateManager.set(phone, updatedState)
    this.logger.debug('Item adicionado ao carrinho', { item })

    return updatedState
  }

  /**
   * Remove um item do carrinho pelo índice
   * @param phone - Número de telefone do usuário
   * @param currentState - Estado atual do fluxo
   * @param itemIndex - Índice do item a ser removido
   * @returns Estado atualizado
   */
  public removeFromCart(phone: string, currentState: FlowState, itemIndex: number): FlowState {
    const currentCart = currentState.cart || []

    if (itemIndex < 0 || itemIndex >= currentCart.length) {
      this.logger.warn('Tentativa de remover item do carrinho com índice inválido', {
        index: itemIndex,
      })
      return currentState
    }

    const newCart = [...currentCart]
    const removedItem = newCart.splice(itemIndex, 1).at(0)

    const updatedState = {
      ...currentState,
      cart: newCart,
    }

    this.stateManager.set(phone, updatedState)
    this.logger.debug('Item removido do carrinho', { itemIndex, removedItem })

    return updatedState
  }

  /**
   * Limpa todos os itens do carrinho
   * @param phone - Número de telefone do usuário
   * @param currentState - Estado atual do fluxo
   * @returns Estado atualizado
   */
  public clearCart(phone: string, currentState: FlowState): FlowState {
    const updatedState = {
      ...currentState,
      cart: [],
    }

    this.stateManager.set(phone, updatedState)
    this.logger.debug('Carrinho limpo', {
      itemsRemoved: currentState.cart?.length || 0,
    })

    return updatedState
  }

  //   public getCartTotal(state: FlowState): number {
  //     return state.cart.reduce((total, item) => {
  //       const itemTotal = (item.price || 0) * (item.quantity || 1)
  //       const extrasTotal = item.extras?.reduce((sum, extra) => sum + (extra.price || 0), 0) || 0
  //       return total + itemTotal + extrasTotal
  //     }, 0)
  //   }
}
