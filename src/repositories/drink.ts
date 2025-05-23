import type { Drink } from '../types/entities.js'
import drinks from './data/drinks-seed.json' with { type: 'json' }

export class DrinkRepository {
  async getAll(): Promise<Drink[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(drinks)
      }, 1000)
    })
  }

  //   async getDrinkById(id: number) {
  //     return await prisma.drink.findUnique({
  //       where: { id },
  //     })
  //   }

  //   async createDrink(data: Prisma.DrinkCreateInput) {
  //     return await prisma.drink.create({ data })
  //   }
}
