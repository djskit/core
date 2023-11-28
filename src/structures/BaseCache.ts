import { basename, join } from 'path'
import { readdir, lstat } from 'fs/promises'
import type { Base, BaseContext } from './Base'
import { Client } from './Client'

type Ctor<T, P> = new (...params: P[]) => T

export interface BaseCacheOptions {
  name: string
  path: string
}

export class BaseCache extends Map<string, Base> {
  readonly name: string
  readonly path: string
  readonly client: Client

  constructor(options: BaseCacheOptions, client: Client) {
    super()

    this.name = options.name
    this.path = options.path
    this.client = client
  }

  async loadAll(): Promise<void> {
    await this.loadPath(this.path)

    const promises: Promise<Base>[] = []

    for (const base of this.values()) {
      promises.push(
        this.load(base))
    }

    await Promise.all(promises)
  }

  async load(base: Base): Promise<Base> {
    await base.onLoad()

    const previous = this.get(base.name)

    if (previous) {
      await this.unload(previous)
    }

    this.set(base.name, base)

    return base
  }

  async unloadAll(): Promise<void> {
    const promises: Promise<Base>[] = []

    for (const base of this.values()) {
      promises.push(
        this.unload(base))
    }

    await Promise.all(promises)
  }

  async unload(base: Base): Promise<Base> {
    await base.onUnload()

    this.delete(base.name)

    return base
  }

  async loadPath(_path: string): Promise<BaseCache> {
    const items = await readdir(_path)

    for (const item of items) {
      const path = join(_path, item)
      const name = basename(path)
      const stat = await lstat(path)

      if (stat.isDirectory()) {
        await this.loadPath(path)
        
        break
      }

      for await (const ctor of this.preload(path)) {
        const client = this.client

        const base = new ctor({
          name, path, client, cache: this
        })

        await this.load(base)
      }
      
    }

    return this
  }

  private async *preload(
    path: string
  ): AsyncGenerator<Ctor<Base, BaseContext>> {
    const file = require(path)
    delete require.cache[require.resolve(path)]

    for (const ctor of Object.values(file)) {
      yield ctor as Ctor<Base, BaseContext>
    }
  }

  async onLoad(): Promise<void> {}
  async onUnload(): Promise<void> {}
}

