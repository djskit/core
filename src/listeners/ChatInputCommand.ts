import { CacheType, Interaction } from 'discord.js'
import { BaseContext, Command, Listener } from '../structures'

export class InteractionCreate extends Listener<'chatInputCommand'> {
  constructor(context: BaseContext) {
    super({
      event: 'chatInputCommand'
    }, context)
  }

  async invoke(interaction: Interaction<CacheType>): Promise<void> {
    if (interaction.isChatInputCommand()) {
      const commandCache = this.client.caches
        .get('command-cache')

      if (!commandCache) return

      const command = commandCache
        .get(interaction.commandName) as Command

      if (!command) return

      this.client.emit('chatInputCommand',
        { command, interaction })
    }
  }
}

