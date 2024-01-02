import { AutoFilter, IAutoFilter } from "./AutoFilter"
import { ColumnFilter, ColumnFilterCondition, FilterOperator, FilterType, IColumnFilterCondition } from "./ColumnFilter"
import { INumberFilter, NumberFilter } from "./NumberFilter"
import { ITextFilter, TextFilter } from "./TextFilter"


export interface ITableColumn {
  readonly field: string | object
  readonly format?: ((val: unknown) => unknown)
  readonly name: string
}

export interface ITableColumnFilterOptions {
  readonly enableCache?: boolean
}

class TableColumnFilter {
  private _columns: ITableColumn[]
  private _filters: ColumnFilter[]
  private _data: unknown[]
  private _dataKey: string | object
  private _listeners: unknown[]
  private _cachedOptions: Record<string, unknown[]>
  private _cacheEnabled: boolean
  constructor(columns, options?: ITableColumnFilterOptions) {
    this._cachedOptions = {}
    this._cacheEnabled = options?.enableCache === undefined ? false : options.enableCache
    this._columns = columns
    this._data = []
    this._filters = []
    this._listeners = []
  }

  /**
   * Adds an auto filter for the column specified by name.
   * Any existing filter of a different type is replaced.
   *
   * @param {string} name
   * @param {(string[] | null)} value
   * @return {*}  {AutoFilter}
   * @memberof TableColumnFilter
   * @see textFilter
   */
  autoFilter(name: string, value: string[] | null, mapping?: Map<string | number, unknown>): AutoFilter {
    let f = this._filters.find(x => x.name === name) as AutoFilter
    if (f === undefined) {
      f = new AutoFilter(name, value, mapping)
      this._filters.push(f)
      this.notify('add', f)
    } else {
      if (f.type === FilterType.AUTO) {
        f.conditions[0].value = value || null
        f.mapping = mapping
        this.notify('update', f)
      }
    }
    return f
  }

  customFilter(type: FilterType, name: string, operator: FilterOperator, conditions: IColumnFilterCondition[]): ColumnFilter
  customFilter(type: FilterType, name: string, value: unknown | unknown[] | FilterOperator, conditions?: IColumnFilterCondition[]): ColumnFilter {
    let f = this._filters.find(x => x.name === name) as ColumnFilter
    if (f === undefined) {
      if (type === FilterType.AUTO) {
        f = new AutoFilter(name, value as unknown[])
      } else if (type === FilterType.NUMBER) {
        f = new NumberFilter(name, value as FilterOperator, conditions)
      } else if (type === FilterType.TEXT) {
        f = new TextFilter(name, value as FilterOperator, conditions)
      }
      this._filters.push(f)
      this.notify('add', f)
    } else {
      if (f.type === type) {
        if (f.type === FilterType.AUTO) {
          f.conditions[0].value = value || null
        } else {
          f.conditions = conditions.map(c => new ColumnFilterCondition(c.operator, c.value))
        }
        this.notify('update', f)
      } else {
        const idx = this._filters.findIndex(x => x.name === name)
        let f
        if (type === FilterType.AUTO) {
          f = new AutoFilter(name, value as unknown[])
        } else if (type === FilterType.NUMBER) {
          f = new NumberFilter(name, value as FilterOperator, conditions)
        } else if (type === FilterType.TEXT) {
          f = new TextFilter(name, value as FilterOperator, conditions)
        }
        this._filters[idx] = f
        this.notify('change', f)
      }
    }
    return f

  }

  clearCache(column?: string) {
    if (column !== undefined && this._cachedOptions[column] !== undefined) {
      this._cachedOptions[column] = []
    } else {
      this._cachedOptions = {}
    }
  }
  enableCache(on: boolean) {
    this._cacheEnabled = on
  }
  isCacheEnabled(): boolean {
    return this._cacheEnabled
  }

  private notify(event, data?) {
    for (const recv of this._listeners.filter(x => x[0] === event)) {
      recv[1](data)
    }
  }

  filter(name): ColumnFilter {
    return this._filters.find(x => x !== undefined && x.name === name)
  }

  on(event, cb) {
    this._listeners.push([event, cb, false])
  }
  once(event, cb) {
    this._listeners.push([event, cb, true])
  }
  /**
   * Returns the option list for the column specified by colname.
   * 
   *
   * @param {*} colname
   * @return {*}  {unknown[]}
   * @memberof TableColumnFilter
   */
  options(colname: string): unknown[] {
    const c = this._columns.find(x => x.name === colname)
    if (c === undefined) {
      return []
    }
    if (this._cacheEnabled && this._cachedOptions[colname] !== undefined) {
      return this._cachedOptions[colname]
    }
    const l = [...new Set(this._data.map((row: unknown) => {
      let v = typeof c.field === 'function' ? c.field(row) : row[c.field as string]
      if (typeof c.format === 'function') {
        v = c.format(v)
      }
      return v === null ? null : v.toString()
    }))]
    this._cachedOptions[colname] = l
    return l
  }

  selectedOptions(colname: string): unknown {
    const c = this._columns.find(x => x.name === colname)
    if (c === undefined) {
      return []
    }
    const f = this._filters.find(x => x.name === colname)
    if (f === undefined || f.type !== FilterType.AUTO) {
      return this.options(colname)
    }
    return (f as AutoFilter).value
  }

  setColumns(columns) {
    this._columns = columns
    this._filters = []
  }

  /**
   * Adds a text filter for the column specified by name.
   * Any existing filter of a different type is replaced.
   *
   * @param {string} name
   * @param {FilterConditionOperator} operator
   * @param {string} value
   * @return {*}  {TextFilter}
   * @memberof TableColumnFilter
   */
  textFilter(name: string, operator: FilterOperator, conditions: IColumnFilterCondition[]): TextFilter {
    let f = this._filters.find(x => x.name === name) as TextFilter
    if (f === undefined) {
      f = new TextFilter(name, operator, conditions)
      this._filters.push(f)
      this.notify('add', f)
    } else {
      if (f.type === FilterType.TEXT) {
        f.conditions = conditions.map(c => new ColumnFilterCondition(c.operator, c.value))
        this.notify('update', f)
      }
    }
    return f
  }

  /**
   * Returns the rows matching the filter conditions.
   *
   * @param {*} rows
   * @return {*} unknown[]
   * @memberof TableColumnFilter
   */
  filterRows(rows): unknown[] {
    if (this._filters === undefined) {
      console.trace()
      return rows
    }
    let result = rows
    for (let i = 0; result.length > 0 && i < this._filters.length; i++) {
      const f = this._filters[i]
      const col = this._columns.find(x => x.name === f.name)
      result = result.filter(row => {
        const v = typeof col.field === 'function' ? col.field(row) : row[(col.field as string)]
        return f.match(col.format(v))
      })
    }
    return result
  }

  match(row): boolean {
    let m = false
    for (let i = 0; !m && i < this._filters.length; i++) {
      const f = this._filters[i]
      const col = this._columns.find(x => x.name === f.name)
      const v = typeof col.field === 'function' ? col.field(this.getData(row)) : this.getData(row)[(col.field as string)]
      const r = f.match(v)
      if (i === 0) {
        m = r
      } else {
        m = m && r
      }
    }
    return m
  }

  removeFilter(colname: string) {
    const idx = this._filters.findIndex(x => x.name === colname)
    const f = this._filters[idx]
    this._filters.splice(idx, 1)
    this.notify('remove', f)
  }

  removeAllFilters() {
    this._filters = []
    this.notify('clear')
  }

  get data(): unknown[] {
    return this._data
  }
  set data(val: unknown[]) {
    this._data = val
    this.clearCache()
  }
  get definition() {
    const o = {
      filter: this._filters.map(f => {
        const o = {
          conditions: f.conditions.map(c => {
            return {
              operator: c.operator,
              value: c.value
            }
          }),
          operator: f.operator,
          type: f.type
        }
        return o
      })
    }
    return o
  }

  private getData(row: object) {
    if (this._dataKey === undefined) {
      return row
    }
    if (typeof this._dataKey === 'function') {
      return this._dataKey(row)
    }
    return row[this._dataKey as string]
  }

  get(): (IAutoFilter | INumberFilter | ITextFilter)[] {
    return this._filters.map(x => x.toJSON())
  }

  set(filters: (IAutoFilter | INumberFilter | ITextFilter)[]) {
    this._filters = filters.map(x => {
      let f
      if (x.type === FilterType.AUTO) {
        f = new AutoFilter(x.name, (x as IAutoFilter).value, (x as IAutoFilter).mapping)
      } else if (x.type === FilterType.NUMBER) {
        f = new NumberFilter(x.name, x.operator, (x as INumberFilter).conditions)
      } else if (x.type === FilterType.TEXT) {
        f = new TextFilter(x.name, x.operator, (x as ITextFilter).conditions)
      }
      return f
    })
  }

  get filters(): ColumnFilter[] {
    return this._filters
  }

  set dataKey(object: string | object) {
    this._dataKey = object
  }
}

export default TableColumnFilter