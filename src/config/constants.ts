import { env } from 'node:process'

export const SESSION_NAME = env.SESSION_NAME || 'session-name'
export const PHONE_NUMBER = env.PHONE_NUMBER || ''

export const STATE_EXPIRATION_TIME = 1_000 * 60 * 60 * 24 // 24h
export const CLEANUP_INTERVAL = 1_000 * 60 * 60 * 12 // 12h
export const MAX_STATES = 1_000
