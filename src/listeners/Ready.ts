import { BaseContext } from '../structures'
import { Listener } from '../structures'

export class Ready extends Listener<'ready'> {
  constructor(context: BaseContext) {
    super({
      event: 'ready',
      once: true
    }, context)
  }

  async invoke() {
    console.log(
      'Ready in ' + this.client.user.username)
  }
}

