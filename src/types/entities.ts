import type { ITEM_TYPES } from '../config/enums.ts'

export type Flavor = {
  id?: string
  name: string
  description: string
  category: string
  price: number
  isActive: boolean
}

export type Drink = {
  name: string
  description: string
  price: number
  isActive: boolean
}

export type Crust = {
  name: string
  price: number
  isActive: boolean
}

export type Customer = {
  name: string
  phone: string
  address: string
}

export type CartItem = {
  type: ITEM_TYPES
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
  details: {
    //* Pizza
    flavors?: Flavor[]
    crust?: Crust
    notes?: string
    //* Drink
    drink?: Drink
  }
}
