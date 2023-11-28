import { join } from 'path'
import { BaseCache } from '../structures/BaseCache'
import { Client } from '../structures/Client'

export class ListenerCache extends BaseCache {
  constructor(client: Client) {
    super({
      name: 'listener-cache',
      path: join(process.cwd(), 'src', 'listeners')
    }, client)
  }
}

