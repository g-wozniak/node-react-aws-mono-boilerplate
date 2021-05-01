import { ApiError } from '../../core'

/* Custom error: ApiError */

describe('→ Custom error: `ApiError`', () => {

  it('→ returns valid JSON result without custom data', () => {
    const msg = 'this is test'
    const e = new ApiError(400, msg)
    expect(e.code).toEqual(400)
    expect(e.name).toEqual('ApiError')
    expect(e.data).toEqual(undefined)
    expect(e.message).toEqual(msg)
    expect(e.getResponse()).toEqual({
      code: 400,
      message: msg
    })
  })

  it('→ returns valid JSON result with custom data', () => {
    const data = { test: 123 }
    const e = new ApiError(400, 'Test', data)
    expect(e.getResponse()).toEqual({
      code: 400,
      message: 'Test',
      data
    })
    expect(e.data).toEqual(data)
  })

})
