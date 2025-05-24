import { inject, injectable } from 'tsyringe'

import { LoggerProvider } from '../../providers/logger.js'
import { isEmpty } from '../../utils/is-empty.js'
import { StateManager } from './manager.js'

import type { FlowState, CartItem } from '../../types/index.js'

interface ICartService {
  addToCart(phone: string, currentState: FlowState, item: CartItem): FlowState
  removeFromCart(phone: string, currentState: FlowState, itemIndex: number): FlowState
  clearCart(phone: string, currentState: FlowState): FlowState
  // getCartTotal(state: FlowState): number // Método comentado no código original
}

/** Serviço responsável por gerenciar o estado do carrinho de compras. */
@injectable()
export class CartService implements ICartService {
  constructor(
    @inject(StateManager) private stateManager: StateManager,
    @inject(LoggerProvider) private logger: LoggerProvider,
  ) {}

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
