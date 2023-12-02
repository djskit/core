import {
  ChatInputApplicationCommandData, 
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction
} from 'discord.js'

import { Base, BaseContext } from './'

export interface CommandOptions extends ChatInputApplicationCommandData {
}

export interface CommandData<T> {
  interaction: T
}

export abstract class Command extends Base {
  private readonly data: CommandOptions

  constructor(
    data: CommandOptions,
    context: BaseContext
  ) {
    super(context)

    this.data = data
  }

  async chatInput?(
    data: CommandData<ChatInputCommandInteraction>
  ): Promise<void> 

  async contextMenu?(
    data: CommandData<ContextMenuCommandInteraction>
  ): Promise<void>

  toJSON(): ChatInputApplicationCommandData {
    return { ...this.data }
  }
}

