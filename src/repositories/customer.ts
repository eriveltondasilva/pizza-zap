import type { Customer } from '@/types/entities.js'
import customers from './data/customers-seed.json' with { type: 'json' }

export class CustomerRepository {
  async findByPhone(phone: string): Promise<Customer | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(customers.find((customer) => customer.phone === phone))
      }, 1000)
    })
  }

  async create(data: Customer) {
    return customers[1]
  }

  // async update(phone: string, data: Prisma.CustomerUpdateInput) {
  //   return await prisma.customer.update({
  //     where: { phone },
  //     data,
  //   })
  // }
}
