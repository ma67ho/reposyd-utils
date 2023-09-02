import { ColumnFilter, ColumnFilterCondition, FilterConditionOperator, FilterOperator, FilterType, IColumnFilter, IColumnFilterCondition } from "./ColumnFilter"

export interface ITextFilter extends IColumnFilter {
  readonly conditions: IColumnFilterCondition[]
}

export class TextFilter extends ColumnFilter {
  private _insensitive: boolean
  // constructor(name: string, operator: FilterOperator, conditions: IColumnFilterCondition[])
  constructor(name: string, operator: FilterOperator, conditions: IColumnFilterCondition[]) {
    super(name, FilterType.TEXT)
    this.operator = operator
    this.conditions = conditions.map(c => new ColumnFilterCondition(c.operator, c.value))
    this._insensitive = true
  }

  match(val): boolean {
    if (typeof val !== 'string') {
      throw new TypeError('"val" is not a string')
    }
    const v = this.insensitive ? val.toLowerCase() : val
    let m = this.conditions[0].match(v, { insensitive: this.insensitive })
    for (let i = 1; i < this.conditions.length; i++) {
      if (this.conditions[i].operator !== FilterConditionOperator.none) {
        const r = this.conditions[i].match(v, { insensitive: this.insensitive })
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