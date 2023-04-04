import { escape } from 'html-escaper'
import LexicographicalOrder from '../LexicographicalOrder'

function mapColumns(row: any , mappings: any, values: Record<string,any>): any{
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
  plainText2html,
  Rules
}