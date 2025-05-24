import { type CreateOptions, type Whatsapp, create } from '@wppconnect-team/wppconnect'
import { inject, singleton } from 'tsyringe'

import { PHONE_NUMBER, SESSION_NAME } from '../config/constants.js'
import { LoggerProvider } from './logger.js'

interface IWhatsappClientProvider {
  getClient(): Promise<Whatsapp>
  closeClient(): Promise<void>
}

@singleton()
export class WhatsappClientProvider implements IWhatsappClientProvider {
  private client: Whatsapp | null = null
  private readonly clientOptions: CreateOptions

  constructor(@inject(LoggerProvider) private logger: LoggerProvider) {
    this.clientOptions = {
      session: SESSION_NAME,
      phoneNumber: PHONE_NUMBER,
      disableWelcome: true,
    }
  }

  public async getClient(): Promise<Whatsapp> {
    if (!this.client) {
      this.client = await this.createClient()
    }

    this.logger.debug('Cliente recuperado com sucesso')
    return this.client
  }

  public async closeClient(): Promise<void> {
    if (!this.client) {
      this.logger.warn('Nenhum cliente para fechar - cliente não inicializado')
      return
    }

    await this.client.close()
    this.client = null
  }

  //#
  private async createClient(): Promise<Whatsapp> {
    try {
      const client = await create(this.clientOptions)
      this.logger.info('Cliente inicializado com sucesso')

      return client
    } catch (error) {
      this.logger.error('Falha ao inicializar cliente', error)
      throw error
    }
  }
}
