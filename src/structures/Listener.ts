import { ClientEvents } from 'discord.js'
import { Base, BaseContext } from './'

export interface ListenerOptions {
  event: string
  once?: boolean
}

export abstract class Listener<K extends keyof ClientEvents> extends Base {
  readonly event: string
  readonly once: boolean
  private _listener: (...params: unknown[]) => void

  constructor(
    options: ListenerOptions,
    ctx: BaseContext
  ) {
    super(ctx)

    this.event = options.event
    this.once = options.once ?? false

    this._listener = this.once
      ? this._invokeOnce.bind(this)
      : this._invoke.bind(this)
  }

  async onLoad(): Promise<void> {
    const maxListeners = this.client.getMaxListeners()
    
    if (this.client.listenerCount(this.event) >= maxListeners) {
      this.client.setMaxListeners(maxListeners + 1)
    }

    this.client[this.once ? 'once' : 'on'](
      this.event, this._listener)

    await super.onLoad()
  }

  private async _invoke(
    ...params: unknown[]
  ): Promise<void> {
    try {
      await this.invoke(
        ...(params as K extends keyof ClientEvents ? ClientEvents[K] : unknown[])
      )
    } catch(err) {
      console.error((err as Error).message)
    }
  }

  private async _invokeOnce(
    ...params: unknown[]
  ): Promise<void> {
    await this._invoke(...params)
    await this.cache.unload(this)
  }

  abstract invoke(
    ...params: K extends keyof ClientEvents ? ClientEvents[K] : unknown[]
  ): Promise<any>
}

