import { KeyAny } from '@intf/Common'

/**
 * Utils (shared)
 * @description Utils function shared across the system. DO NOT INCLUDE NODE SPECIFIC PACKAGES
 */

/**
 * mergeToText
 * @param {string} text Some text
 * @param {KeyAny} properties Properties to be merged i.e. { email: 'xxx', name: 'Greg' }
 * @description Merges properties given as object to text
 */
export const mergeToText = (text: string, properties: KeyAny): string => {
  let newText = text
  Object.keys(properties).forEach((key: string) => {
    const value = properties[key]
    const re = new RegExp('\\$' + key, 'gm')
    newText = newText.replace(re, value)
  })
  return newText
}

