export enum FilterConditionOperator {
  contains = 'contains',
  containsNot = 'containsnot',
  endsNotWith = 'endsnotwith',
  endsWith = 'endswith',
  equalTo = 'eq',
  includes = 'includes',
  notEqualTo = 'ne',
  none = '<none>',
  startsWith = 'startswith',
  startsNotWith = 'startsnotwith',
}

export enum FilterOperator {
  AND = 'and',
  OR = 'or'
}

export enum FilterType {
  Auto = 'auto',
  Text = 'text'
}

export interface IColumnFilter {
  readonly name: string
  operator: FilterOperator
  type: FilterType
}

export interface IColumnFilterCondition {
  value: string | string[],
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

  match(val: unknown, insensitive?: boolean): boolean {
    const v = typeof val === 'string' ? insensitive ? (this._value as string).toLowerCase() : this._value : this._value
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
      case FilterConditionOperator.includes:
        if (!Array.isArray(v)) {
          return false
        }
        return v.includes(val)
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

  toJSON(): IAutoFilter | ITextFilter {
    if (this._type === FilterType.Text) {
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

export interface IAutoFilter extends IColumnFilter {
  readonly value: unknown[]
}

export class AutoFilter extends ColumnFilter {
  constructor(name: string, value?: unknown[]) {
    super(name, FilterType.Auto)
    if (value !== undefined) {
      this.conditions[0].operator = FilterConditionOperator.includes
      this.conditions[0].value = value
    }
  }
  match(val): boolean {
    let m = this.conditions[0].value === null ? true : this.conditions[0].match(val)
    for (let i = 1; i < this.conditions.length; i++) {
      if (this.conditions[i].operator !== FilterConditionOperator.none) {
        let r = false
        if (this.conditions[i].value === null) {
          r = true
        } else {
          r = this.conditions[i].match(val)
        }
        if (this.operator === FilterOperator.OR) {
          m = m || r
        } else {
          m = m && r
        }
      }
    }
    return m
  }

  get isActive(): boolean {
    return this.conditions[0].operator !== FilterConditionOperator.none && Array.isArray(this.conditions[0].value)
  }

  get value() {
    return this.conditions[0].value
  }
  set value(val) {
    this.conditions[0].value = val
  }
}

export interface ITextFilter extends IColumnFilter {
  readonly conditions: IColumnFilterCondition[]
}

export class TextFilter extends ColumnFilter {
  private _insensitive: boolean
  // constructor(name: string, operator: FilterOperator, conditions: IColumnFilterCondition[])
  constructor(name: string, operator: FilterOperator, conditions: IColumnFilterCondition[]) {
    super(name, FilterType.Text)
    this.operator = operator
    this.conditions = conditions.map(c => new ColumnFilterCondition(c.operator, c.value))
    this._insensitive = true
  }

  match(val): boolean {
    if (typeof val !== 'string') {
      throw new TypeError('"val" is not a string')
    }
    const v = this.insensitive ? val.toLowerCase() : val
    let m = this.conditions[0].match(v, this.insensitive)
    for (let i = 1; i < this.conditions.length; i++) {
      if (this.conditions[i].operator !== FilterConditionOperator.none) {
        const r = this.conditions[i].match(v, this.insensitive)
        if (this.operator === FilterOperator.OR) {
          m = m || r
        } else {
          m = m && r
        }
      }
    }
    return m
  }


  get insensitive(): boolean {
    return this._insensitive
  }
  set insensitive(val: boolean) {
    this._insensitive = val
  }
}