import { escape } from 'html-escaper'
import flatten from 'flat'
import LexicographicalOrder from '../LexicographicalOrder'

export interface IDataMapping {
  readonly type: string
}

export interface ITransformValueFunction {
  readonly type: string
  readonly varname: string
}

export interface ITransformValueReplace extends ITransformValueFunction {
  readonly newValue: string
  readonly regExp?: boolean
  readonly searchValue: string
}

export interface ITransformValueSplit extends ITransformValueFunction {
  index: number
  limit: number,
  separator: string | RegExp
}

class ValueTransformation {
  private _functions: (ITransformValueFunction | ITransformValueReplace | ITransformValueSplit)[]
  private _variables: Record<string, unknown>
  constructor() {
    this._functions = []
    this._variables = {}
  }

  at(index: number): ITransformValueFunction | ITransformValueReplace | ITransformValueSplit {
    return this._functions[index]
  }

  lowercase() {
    this._functions.push({ type: 'lowercase', varname: 'value' })
  }

  remove(index: number) {
    this._functions.splice(index, 1)
  }

  replace(searchValue: string, newValue: string, regExp?: boolean) {
    this._functions.push({
      newValue: newValue,
      regExp: regExp === undefined ? false : regExp,
      searchValue: searchValue,
      type: 'replace',
      varname: 'value'
    })
  }

  uppercase() {
    this._functions.push({ type: 'uppercase', varname: 'value' })
  }

  split(separator: string | RegExp, index: number, limit?: number, varname?: string)
  split(separator: string | RegExp, index: number, limit?: number)
  split(separator: string | RegExp, index: number, limit?: number, varname?: string) {
    this._functions.push({
      index: 0,
      limit: limit,
      separator: separator,
      type: 'split',
      varname: 'value'
    })
  }

  transform(value) {
    this._variables.value = value
    for (const fn of this._functions) {
      if (fn.type === 'replace') {
        const opts = fn as ITransformValueReplace
        this._variables.value = (this._variables[fn.varname] as string).replace(opts.searchValue, opts.newValue)
      } else if (fn.type === 'split') {
        const opts = fn as ITransformValueSplit
        const regex = new RegExp(opts.separator, 'gm')
        const l = (this._variables[fn.varname] as string).split(regex)
        if (opts.index < l.length) {
          this._variables[opts.varname] = l[opts.index]
        }
      } else if (fn.type === 'lowercase') {
        this._variables.value = (this._variables[fn.varname] as string).toLowerCase()
      } else if (fn.type === 'uppercase') {
        this._variables.value = (this._variables[fn.varname] as string).toUpperCase()
      }
    }
    return this._variables.value
  }

  get functions() {
    return this._functions
  }
}

function sanitizedObjectKeys(data) {
  if (Array.isArray(data)) {
    const keys = []
    for (const item of data) {
      const o = flatten(item)
      for (const key of Object.keys(o)) {
        if (!keys.some(x => x === key)) {
          keys.push(key)
        }
      }
    }
    return keys
  } else {
    const o = flatten(data)
    return Object.keys(o)
  }
}

function mapColumns(row: any, mappings: any, values: Record<string, any>): any {
  const vals = {}
  for (let i = 0; i < mappings.length; i++) {
    const mapping = mappings[i]
    if (mapping.map === 'setvalue') {
      let v = mapping.value
      if (v) {
        v = LexicographicalOrder.NumberFactory.build(v, values)
      }
      vals[mapping.attr.id] = v
    } else if (mapping.map === 'tablecolumn') {
      const col = this.mappableColumns.find(x => x.label === mapping.value)
      vals[mapping.attr.id] = row[col.value]
    } else {
      if (mapping.attr.properties) {
        vals[mapping.attr.id] = mapping.attr.properties.default
      }
    }
  }
  return vals
}

function plainText2html(text: string): string {
  return escape(text).replace(/\n/g, '<br>')
}

import checkData from './checkData'
import Rules from './Rules'
export default {
  checkData,
  mapColumns,
  sanitizedObjectKeys,
  plainText2html,
  Rules,
  ValueTransformation
}