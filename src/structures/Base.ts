import type { BaseCache, Client } from './'

export interface BaseContext {
  name: string
  path: string
  cache: BaseCache
  client: Client
}

export class Base {
  readonly name: string
  readonly path: string
  readonly cache: BaseCache
  readonly client: Client

  constructor(ctx: BaseContext) {
    this.name = ctx.name
    this.path = ctx.path
    this.cache = ctx.cache

    this.client = ctx.client
  }
  
  async reload(): Promise<void> {
    await this.cache.load(this)
  }

  async unload(): Promise<void> {
    await this.cache.unload(this)
  }

  async onLoad(): Promise<void> {}
  async onUnload(): Promise<void> {}
}

