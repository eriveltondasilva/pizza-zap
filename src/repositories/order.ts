// src/repositories/order.repository.ts
// import { injectable } from 'tsyringe'
// import { prisma } from '@/lib/prisma.js'

// import type { CartItem, PaymentMethod } from '@/types/entities.js'

// interface CreateOrderParams {
//   items: CartItem[]
//   paymentMethod: PaymentMethod
//   address: string
//   observations?: string
//   totalAmount: number
//   change?: number
//   phone: string
// }

// @injectable()
// export class OrderRepository {
//   public async createOrder(params: CreateOrderParams) {
//     const { items, paymentMethod, address, observations, totalAmount, change, phone } = params

//     return prisma.order.create({
//       data: {
//         status: 'PENDING',
//         totalAmount,
//         change,
//         address,
//         observations,
//         phone,
//         paymentMethodId: paymentMethod.id,
//         items: {
//           create: items.map(item => ({
//             name: item.name,
//             quantity: item.quantity,
//             unitPrice: item.unitPrice,
//             subtotal: item.subtotal,
//             type: item.type,
//             details: item.details,
//           })),
//         },
//       },
//     })
//   }
// }
