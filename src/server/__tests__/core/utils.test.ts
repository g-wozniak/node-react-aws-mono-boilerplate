import { KeyAny } from '@intf/Common'
import * as utils from '../../../utils'

describe('→ Common utils', () => {
  
  describe('→ mergeToText', () => {

    it('→ replaces patterns with values', () => {
      const text = 'This is $word1 and $word2'
      const properties: KeyAny = {
        word1: 'a text',
        word2: 'with variables'
      }
      expect(utils.mergeToText(text, properties)).toEqual('This is a text and with variables')
    })

    it('→ does nothing if property is not set', () => {
      const text = 'This is $word1'
      const properties: KeyAny = {
        word2: 'do not change'
      }
      expect(utils.mergeToText(text, properties)).toEqual(text)
    })

    it('→ does nothing if there is no `$` sign next to the variable name', () => {
      const text = 'This is word1'
      const properties: KeyAny = {
        word1: 'do not change'
      }
      expect(utils.mergeToText(text, properties)).toEqual(text)
    })

  })

})
