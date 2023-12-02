import {
    ChatInputCommandInteraction,
  ClientOptions,
  Client as DClient,
  ClientEvents as DClientEvents,
  IntentsBitField,
  Partials
} from 'discord.js'

import { ListenerCache } from '../managers/ListenerCache'
import { BaseCache, Command } from './'

function defaultOptions(): ClientOptions {
  return {
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildIntegrations,
      IntentsBitField.Flags.GuildPresences,
      IntentsBitField.Flags.GuildScheduledEvents
    ],
    partials: [
      Partials.User,
      Partials.Channel,
      Partials.GuildMember,
      Partials.ThreadMember,
      Partials.GuildScheduledEvent
    ]
  }
}

export class Client extends DClient<true> {
  caches: Map<string, BaseCache>

  constructor(
    options: ClientOptions = defaultOptions()
  ) {
    super(options)

    this.caches = new Map()
  }

  public async login(token: string): Promise<string> {
    const listenerCache = new ListenerCache(this)
    
    this.caches
      .set(listenerCache.name, listenerCache)

    for (const cache of this.caches.values()) {
      await cache.loadAll()
    }

    await super.login(token)

    return token
  }
}

export interface ChatInputCommandPayload {
  command: Command
  interaction: ChatInputCommandInteraction
}

declare module 'discord.js' {
  interface ClientEvents extends DClientEvents {
    chatInputCommand: [data: ChatInputCommandPayload]
  }
}

