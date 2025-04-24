import customers from './data/customers-seed.json' with { type: 'json' }

export class CustomerRepository {
  async findByPhone(phone: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(customers.find((customer) => customer.phone === phone))
      }, 1000)
    })
  }

  // async create(data: Prisma.CustomerCreateInput) {
  //   return await prisma.customer.create({
  //     data,
  //   })
  // }

  // async update(phone: string, data: Prisma.CustomerUpdateInput) {
  //   return await prisma.customer.update({
  //     where: { phone },
  //     data,
  //   })
  // }
}
