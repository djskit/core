import type { Client } from './'

export interface BaseContext {
  name: string
  path: string
  client: Client
}

export class Base {
  readonly name: string
  readonly path: string
  readonly client: Client

  constructor(ctx: BaseContext) {
    this.name = ctx.name
    this.path = ctx.path

    this.client = ctx.client
  }

  async onLoad(): Promise<void> {}
  async onUnload(): Promise<void> {}
}

