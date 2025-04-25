import type { Crust } from '@/types/entities.js'
import crusts from './data/crusts-seed.json' with { type: 'json' }

export class CrustRepository {
  async getAll(): Promise<Crust[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(crusts)
      }, 1000)
    })
  }
}
