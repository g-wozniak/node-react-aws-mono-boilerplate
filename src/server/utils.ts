import { Colors } from '@intf/Common'
import * as chalk from 'chalk'

/**
 * Utils (server)
 * @remarks Do not include webapp specific functions
 * @description Utils function shared across Server and Api.
 */


/**
 * color
 * @param {Colors} c Color name
 * @param {string} text Some text to print
 * @description Returns coloured terminal if streamed via console.info
 */

export const color = (c: Colors, text: string): string => {
  switch (c) {
    case 'black&yellow': {
      return chalk.black(chalk.bgYellow(` ${text} `))
    }
    default: 
      return chalk[c](text)
  }
}