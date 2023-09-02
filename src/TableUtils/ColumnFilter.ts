import { AutoFilter, IAutoFilter } from "./AutoFilter"
import { INumberFilter, NumberFilter } from "./NumberFilter"
import { ITextFilter, TextFilter } from "./TextFilter"

export enum FilterConditionOperator {
  contains = 'contains',
  containsNot = 'containsnot',
  endsNotWith = 'endsnotwith',
  endsWith = 'endswith',
  equalTo = 'eq',
  greaterThan = 'gt',
  greaterThanOrEqual = 'ge',
  includes = 'includes',
  lessThan = 'lt',
  lessThanOrEqual = 'le',
  notEqualTo = 'ne',
  none = '<none>',
  startsWith = 'startswith',
  startsNotWith = 'startsnotwith',
}

export type ColumnFilters = AutoFilter | NumberFilter | TextFilter
export enum FilterOperator {
  AND = 'and',
  OR = 'or'
}

export enum FilterType {
  AUTO = 'auto',
  NUMBER = 'number',
  TEXT = 'text'
}

export interface IColumnFilter {
  readonly name: string
  operator: FilterOperator
  type: FilterType
}

export interface IColumnFilterCondition {
  value: unknown | unknown[],
  operator: FilterConditionOperator
}

export class ColumnFilterCondition {
  private _operator: FilterConditionOperator
  private _value: unknown
  constructor()
  constructor(condition: IColumnFilterCondition)
  constructor(operator: FilterConditionOperator, value: unknown)
  constructor(condition?: IColumnFilterCondition | FilterConditionOperator, value?: unknown) {
    if (arguments.length === 0) {
      this._operator = FilterConditionOperator.none
      this._value = null
    } else if (arguments.length === 2) {
      this._operator = (condition as FilterConditionOperator)
      this._value = value
    } else {
      this._operator = (condition as IColumnFilterCondition).operator
      this._value = (condition as IColumnFilterCondition).value
    }
  }

  match(val: unknown, options?: { insensitive?: boolean, mapping?: Map<string | number, unknown> }): boolean {
    let v = typeof val === 'string' ? options.insensitive ? (this._value as string).toLowerCase() : this._value : this._value
    if (options.mapping !== undefined) {
      if (Array.isArray(v)) {
        v = v.map(x => {
          const m = options.mapping.get(x as string)
          return m === undefined ? x : m
        })
      } else {
        const m = options.mapping.get(v as string)
        if (m !== undefined) {
          v = m
        }
      }
    }
    switch (this._operator) {
      case FilterConditionOperator.contains:
        return (val as string).includes(v as string)
      case FilterConditionOperator.containsNot:
        return !(val as string).includes(v as string)
      case FilterConditionOperator.endsNotWith:
        return !(val as string).endsWith(v as string)
      case FilterConditionOperator.endsWith:
        return (val as string).endsWith(v as string)
      case FilterConditionOperator.equalTo:
        return val === v
      case FilterConditionOperator.greaterThan:
        return val > v
      case FilterConditionOperator.greaterThanOrEqual:
        return val >= v
      case FilterConditionOperator.includes:
        if (!Array.isArray(v)) {
          return false
        }
        return v.includes(val)
      case FilterConditionOperator.lessThan:
        return val < v
      case FilterConditionOperator.lessThanOrEqual:
        return val <= v
      case FilterConditionOperator.notEqualTo:
        return val !== v
      case FilterConditionOperator.startsNotWith:
        return !(val as string).startsWith(v as string)
      case FilterConditionOperator.startsWith:
        return (val as string).startsWith(v as string)
      default:
        return true
    }
  }

  toRegExp(): RegExp {
    switch (this._operator) {
      case FilterConditionOperator.contains:
        return RegExp(`${this._value}`, 'gim')
      case FilterConditionOperator.endsWith:
        return new RegExp(`${this._value}$`, 'gim')
      case FilterConditionOperator.endsNotWith:
        return new RegExp(`.*(?<!${this._value})$`, 'gim')
      case FilterConditionOperator.startsWith:
        return new RegExp(`^${this._value}`, 'gim')
      case FilterConditionOperator.startsNotWith:
        return new RegExp(`^(?!${this._value}).+, 'gim'`)
      default:
        return /\*/gmi
    }
  }

  get operator(): FilterConditionOperator {
    return this._operator
  }
  set operator(val: FilterConditionOperator) {
    this._operator = val
  }

  get value(): unknown {
    return this._value
  }
  set value(val: unknown) {
    this._value = val
  }

}

export class ColumnFilter {
  private _conditions: ColumnFilterCondition[]
  protected _mapping: Map<string | number, unknown>
  private _name: string
  private _operator: FilterOperator
  private _type: FilterType
  constructor(name: string, type: FilterType) {
    this._conditions = [new ColumnFilterCondition(), new ColumnFilterCondition()]
    this._name = name
    this._operator = FilterOperator.AND
    this._type = type
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  match(val): boolean {
    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options(rows): unknown[] {
    return []
  }

  serialize(): string {
    return JSON.stringify(this.toJSON())
  }

  toJSON(): IAutoFilter | INumberFilter | ITextFilter {
    if (this._type === FilterType.NUMBER || this._type === FilterType.TEXT) {
      return {
        conditions: this.conditions.map(x => {
          return {
            operator: x.operator,
            value: x.value
          }
        }) as IColumnFilterCondition[],
        name: this.name,
        operator: this.operator,
        type: this.type
      }
    }
    return {
      value: this._conditions[0].value,
      mapping: this._mapping,
      name: this.name,
      operator: this.operator,
      type: this.type
    } as IAutoFilter
  }

  toRegExp(): RegExp[] {
    const rx = []
    for (const c of this._conditions) {
      if (c.operator !== FilterConditionOperator.none) {
        rx.push(c.toRegExp())
      }
    }
    return rx
  }

  get conditions(): ColumnFilterCondition[] {
    return this._conditions
  }
  set conditions(val: ColumnFilterCondition[]) {
    this._conditions = val
  }

  get isActive(): boolean {
    return this._conditions.some(x => x.operator !== FilterConditionOperator.none)
  }

  get name(): string {
    return this._name
  }
  get operator(): FilterOperator {
    return this._operator
  }
  set operator(val: FilterOperator) {
    this._operator = val
  }
  get type(): FilterType {
    return this._type
  }
}



