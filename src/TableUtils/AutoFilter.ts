import { ColumnFilter, FilterConditionOperator, FilterOperator, FilterType, IColumnFilter } from "./ColumnFilter"

export interface IAutoFilter extends IColumnFilter {
  readonly mapping: Map<string|number,unknown>
  readonly value: unknown[]
}

export class AutoFilter extends ColumnFilter {
  constructor(name: string, value?: unknown[], mapping?: Map<string | number, unknown>) {
    super(name, FilterType.AUTO)
    if (value !== undefined) {
      this.conditions[0].operator = FilterConditionOperator.includes
      this.conditions[0].value = value
    }
    if (mapping === undefined) {
      this._mapping = new Map()
    } else {
      this._mapping = mapping
    }
  }

  match(val): boolean {
    const v = val.toString()
    let m = this.conditions[0].value === null ? true : this.conditions[0].match(v, { mapping: this._mapping })
    for (let i = 1; i < this.conditions.length; i++) {
      if (this.conditions[i].operator !== FilterConditionOperator.none) {
        let r = false
        if (this.conditions[i].value === null) {
          r = true
        } else {
          r = this.conditions[i].match(v, { mapping: this._mapping })
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

  get mapping(): Map<string | number, unknown> {
    return this._mapping
  }
  set mapping(val: Map<string | number, unknown>) {
    this._mapping = val
  }

  get value() {
    return this.conditions[0].value
  }
  set value(val) {
    this.conditions[0].value = val
  }
}
