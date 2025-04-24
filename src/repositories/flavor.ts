import flavors from './data/flavors-seed.json' with { type: 'json' }

export class FlavorRepository {
  async getAllFlavors() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(flavors)
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
