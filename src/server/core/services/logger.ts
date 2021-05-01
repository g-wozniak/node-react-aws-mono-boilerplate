import * as chalk from 'chalk'
import * as _ from 'lodash'
import { v4 as uuid } from 'uuid'

import { LogTypeWarning, LogTypeError, LogTypeInfo, Log } from '@intf/Core'
import { LogTypes } from '../../properties'

const colors = {}
colors[LogTypes.error] = (str: string) => chalk.white(chalk.bgRed(` ${str} `))
colors[LogTypes.info] = (str: string) => chalk.black(chalk.bgMagenta(` ${str} `))
colors[LogTypes.warning] = (str: string) => chalk.black(chalk.bgYellow(` ${str} `))


// TODO: parse payloads if there are no big chunks (data:application...)
export const extract = (body?: unknown): string | undefined => {
  return _.isPlainObject(body)
    ? JSON.stringify(body)
    : Array.isArray(body)
      ? body.join(', ')
      : body && _.isString(body) ? body : undefined
}

class LoggerService {

  private _types: string[] = []

  private _correlation: string

  private _format: string

  get correlation(): string {
    return this._correlation
  }

  set correlation(id: string) {
    this._correlation = id
  }

  get types(): string[] {
    return this._types
  }

  public constructor(types: string[] = [], format: string | undefined = 'console') {
    this._types = types
    this._format = format
    this.correlation = uuid()
  }

  public warning({ message }: LogTypeWarning): void {
    const type = LogTypes.warning
    if (this.types.includes(type)) {
      this.print({
        type,
        date: new Date().toISOString(),
        correlation: this.correlation,
        message
      })
    }
  }

  public error({ message, stack }: LogTypeError): void {
    const type = LogTypes.error
    if (this.types.includes(type)) { 
      this.print({
        type,
        date: new Date().toISOString(),
        correlation: this.correlation,
        message,
        stack
      })
    }
  }

  public info({ category, message, body }: LogTypeInfo): void {
    const type = LogTypes.info
    if (this.types.includes(type)) {
      this.print({
        type,
        category: category || 'custom',
        date: new Date().toISOString(),
        correlation: this.correlation,
        message,
        body
      })
    }
  }

  private print(log: Log): void {
    if (this._format === 'console') {
      const logCategory = log.category ? chalk.black(chalk.bgYellow(` ${log.category} `)) : ''
      const message = chalk.gray(log.message)
      const llf = colors[log.type](log.type.toUpperCase())
      console.info(`${chalk.gray(log.date)}\n${llf} ${logCategory} ${chalk.white(` ${this.correlation} `)}\n${message}\n`)
      if (!_.isEmpty(log.body)) {
        console.info(chalk.greenBright(extract(log.body)))
      }
    } else {
      // Cloudwatch
      const category = log.category || ''
      const body = log.body ? extract(log.body) : ''
      console.info(`${log.type} ${category} ${log.correlation} ${log.message} ${body}`)
    }
  }

}

export default LoggerService