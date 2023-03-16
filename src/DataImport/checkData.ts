export enum TCheckDataError {
  ENUMERATIONERROR = 1
}

export interface ICheckDataError {
  column: any
  error: TCheckDataError
}

export default function (row: any, mappings: any, columns: any): ICheckDataError[] {
  const errors = []
  for (const mapping of mappings){
    if (mapping.map === 'tablecolumn'){
      const column = columns.find(x => x.label === mapping.value)
      if (column === undefined){
        // TODO error handling
        // console.log(mapping.value, columns)
      } else {
        const value = row[column.value]
        // console.log(value, mapping.value,'column:', column)
        if (mapping.attr.type === 'enumeration' && value !== undefined){
          if (mapping.attr.properties.enumeration.find(x => x.key === value) === undefined){
            errors.push({
              column: column,
              error: TCheckDataError.ENUMERATIONERROR
            })
          }
        }
      }
    }
  }
  return errors
}