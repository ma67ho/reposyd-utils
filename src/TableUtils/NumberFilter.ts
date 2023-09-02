import { ColumnFilter, ColumnFilterCondition, FilterConditionOperator, FilterOperator, FilterType, IColumnFilter, IColumnFilterCondition } from "./ColumnFilter"

export interface INumberFilter extends IColumnFilter {
  readonly conditions: IColumnFilterCondition[]
}

export class NumberFilter extends ColumnFilter {
  constructor(name: string, operator: FilterOperator, conditions: IColumnFilterCondition[]) {
    super(name, FilterType.NUMBER)
    this.operator = operator
    this.conditions = conditions.map(c => new ColumnFilterCondition(c.operator, c.value))
  }
  match(val): boolean {

    if (isNaN(val)) {
      throw new TypeError('"val" is not a number')
    }
    let m = this.conditions[0].match(+val)
    for (let i = 1; i < this.conditions.length; i++) {
      if (this.conditions[i].operator !== FilterConditionOperator.none) {
        const r = this.conditions[i].match(+val)
        if (this.operator === FilterOperator.OR) {
          m = m || r
        } else {
          m = m && r
        }
      }
    }
    return m
  }
}

