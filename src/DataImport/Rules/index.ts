import counter from "./counter"
import omit from "./omit"
import variable from "./variable"

export type TDataImportCounter =  Record<string, number>
export type TDataImportRules = IDataImportRuleCounter | IDataImportRuleOmitRow | IDataImportRuleVariable

export type TDataImportDataRow = unknown[]

export enum DataImportRuleMatch {
  All = 'all',
  AtLeastOne = 'atleastone',
  None = 'None'
}

export enum DataImportRuleType {
  Counter = 'counter',
  NoDuplicates = 'noduplicates',
  Omit = 'omit',
  Variable = 'variable'
}

export interface IDataImportRuleCondition {
  column: any
  condition: string
  value: any
}

export interface IDataImportRuleCounter extends IDataImportRule {
  action: 'increaseby' | 'resetto'
  conditions: IDataImportRuleCondition[]
  match: 'all' | 'atleastone' | 'none'
  name: string
  value: number
}

export interface IDataImportRuleOmitRowCondition {
  column: number
  condition: string
  value: any
}

export interface IDataImportRule {
  enabled: boolean
  type: DataImportRuleType
}

export interface IDataImportRuleOmitRow extends IDataImportRule {
  conditions: IDataImportRuleOmitRowCondition[]
  match: string
}

export interface IDataImportRuleVariable extends IDataImportRule {
  column: number
  conditions: IDataImportRuleOmitRowCondition[]
  match: string
  name: string
}

export interface IDataImportRuleExecArgs  {
  variables: Record<string,number | string>
}

export class DataImportRule {  
  private _enabled: boolean
  private _type: DataImportRuleType
  constructor(type:DataImportRuleType){
    this._type = type
  }
  exec(row: TDataImportDataRow, args?:IDataImportRuleExecArgs): unknown {
    console.warn('DataImportRule::execute() is not implemeted')
    return undefined
  }

  get enabled(): boolean {
    return this._enabled
  }
  set enabled(on: boolean){
    this._enabled = on
  }

  get type(): DataImportRuleType{
    return this._type
  }
}

export enum DataImportRuleCounterAction {
  IncreaseBy = 'increaseby',
  ResetTo = 'resetto'
}


class DataImportRuleWithConditions extends DataImportRule {
  private _conditions: IDataImportRuleCondition[]
  private _match: DataImportRuleMatch
  constructor(type: DataImportRuleType) {
    super(type)
    this._conditions = []
    this._match = DataImportRuleMatch.All
  }

  exec(row: TDataImportDataRow, args?:IDataImportRuleExecArgs): unknown {
    return this.matches(row)
  }

  matches (row: TDataImportDataRow): boolean {
    if (!this.enabled) {
      return true
    }
    let conditions = []
    let match = 'all'
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    if (this.type === DataImportRuleType.Counter) {
      conditions = (this as unknown as DataImportRuleCounter).conditions
      match = (this as unknown as DataImportRuleCounter).match
    } else if (this.type === DataImportRuleType.Omit) {
      conditions = (this as DataImportRuleOmit).conditions
      match = (this as DataImportRuleOmit).match
    } else if (this.type === DataImportRuleType.Variable) {
      conditions = (this as DataImportRuleVariable).conditions
      match = (this as DataImportRuleVariable).match
    }
    let matches = 0
    for (const item of conditions){
      if (item.condition === 'eq' && row[item.column] === item.value){
        matches++
      } else if (item.condition === 'neq' && row[item.column] !== item.value){
        matches++
      }
    }
    if (match === 'all'){
      return matches === conditions.length
    } else if (match === 'atleastone'){
      return matches > 0
    } else if (match === 'none'){
      return matches == 0
    }
    return true
  
    return false
  }

  get conditions(): IDataImportRuleCondition[] {
    return this._conditions
  }

  get match(): DataImportRuleMatch {
    return this._match
  }
  set match(val: DataImportRuleMatch) {
    this._match = val
  }

  get name() : string {
    return this.name
  }
}

class DataImportRuleCounter extends DataImportRuleWithConditions {
  private _action: DataImportRuleCounterAction
  private _name: string
  private _value: number

  constructor(name: string){
    super(DataImportRuleType.Counter)
    this._action = DataImportRuleCounterAction.ResetTo
    this._name = name
    this._value = 0
  }

  exec(row: any, args: IDataImportRuleExecArgs): unknown {
    if (!this.enabled) {
      return
    }
    if (this.matches(row)) {
      if (this._action === 'increaseby') {
        counter[this._name] = (counter[this._name] || 0) + this._value
      } else if (this._action === 'resetto') {
        counter[this._name] = this._value
      }
    }
   return undefined
  }

  get action() : DataImportRuleCounterAction {
    return this._action
  }

  get name(): string {
    return this._name
  }
  set name(val: string){
    this._name = val
  }

  get value(): number {
    return this._value
  }
  set value(val: number){
    this._value = val
  }
}

class DataImportRuleOmit extends DataImportRuleWithConditions {
  constructor(){
    super(DataImportRuleType.Omit)
  }
}

class DataImportRuleVariable extends DataImportRuleWithConditions {
  constructor(){
    super(DataImportRuleType.Omit)
  }
}

export default {
  DataImportRuleCounter,
  DataImportRuleOmit,
  DataImportRuleVariable,
  counter,
  omit,
  variable
}
