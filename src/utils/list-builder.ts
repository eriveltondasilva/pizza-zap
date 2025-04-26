import { formatCurrency } from './format-currency.js'

import type { Crust, Drink, Flavor } from '@/types/entities.js'
import type { ResponseList } from '@/types/responses.js'

type ListItem = {
  name: string
  price: number
  description?: string
  category?: string
}

const buildId = (index: number) => String(index + 1)
const buildTitle = (id: string, name: string, price: string) => `${id} - ${name} (${price})`
const buildPrice = (price: number) => (price === 0 ? 'grátis' : formatCurrency(price))

function buildListItem(item: ListItem, index: number, defaultCategory = '') {
  if (!item || typeof item !== 'object')
    throw new Error('Item inválido fornecido para buildListItem')

  const rowId = buildId(index)
  const price = buildPrice(Number(item.price) || 0)
  const title = buildTitle(rowId, item.name, price)

  return {
    rowId,
    title,
    description: item.description || '',
    category: item.category || defaultCategory,
  }
}

export function buildFlavorList(flavors: Flavor[]): ResponseList[] {
  return flavors.map((flavor, index) => buildListItem(flavor, index))
}

export function buildCrustList(crusts: Crust[]): ResponseList[] {
  return crusts.map((crust, index) => buildListItem(crust, index, 'bordas'))
}

export function buildDrinkList(drinks: Drink[]): ResponseList[] {
  return drinks.map((drink, index) => buildListItem(drink, index, 'bebidas'))
}
