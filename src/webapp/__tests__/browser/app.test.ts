import { ClientFunction } from 'testcafe'
import { screen } from '@testing-library/testcafe'

import system, { closeAll } from '../../../server/core/system'
import { System } from '@intf/Server'

let app: System

const port = 4005
const hostname = `http://localhost:${port}`

fixture `Master layout`
  .page `${hostname}`
    .before(async () => {
      app = await system({config: { port: 4005 }})
    })
    .after(async () => app && await closeAll(app))

test('dummy text exists', async (t) => {
  await t.expect(screen.getByText('Registration').exists).ok()
})
