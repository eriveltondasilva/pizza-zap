import crusts from './data/crusts-seed.json' with { type: 'json' }

export class CrustRepository {
  async getAllCrusts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(crusts)
      }, 1000)
    })
  }
}
