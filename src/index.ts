import 'reflect-metadata'
import { container } from 'tsyringe'

import { setupGracefulShutdown } from './graceful-shutdown.ts'
import { LoggerProvider } from './providers/logger.ts'
import { WhatsappBot } from './whatsapp-bot.ts'

async function bootstrap(): Promise<void> {
  const logger = container.resolve(LoggerProvider)
  logger.info('🟢 Iniciando aplicação...')

  try {
    const whatsappBot = container.resolve(WhatsappBot)
    setupGracefulShutdown(whatsappBot, logger)

    await whatsappBot.initialize()
  } catch (error) {
    logger.error('Falha na validação de configurações', error)
    process.exit(1)
  }
}

bootstrap()
