import 'reflect-metadata'
import { container } from 'tsyringe'

import { LoggerProvider } from '@/providers/logger.js'
import { setupGracefulShutdown } from './graceful-shutdown.js'
import { WhatsappBot } from './whatsapp-bot.js'

async function bootstrap(): Promise<void> {
  const logger = container.resolve(LoggerProvider)
  logger.info('🟢 Iniciando aplicação...')

  try {
    const bot = container.resolve(WhatsappBot)
    setupGracefulShutdown(bot, logger)

    await bot.initialize()
  } catch (error) {
    logger.error('Falha na validação de configurações', error)
    process.exit(1)
  }
}

bootstrap()
