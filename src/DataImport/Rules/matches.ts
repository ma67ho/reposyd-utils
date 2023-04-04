import { DataImportRuleType, IDataImportRuleCounter, IDataImportRuleOmitRow, IDataImportRuleVariable, TDataImportDataRow, TDataImportRules } from ".";

export default function (row: TDataImportDataRow, rule: TDataImportRules): boolean {
  if (!rule.enabled) {
    return true
  }
  let conditions = []
  let match = 'all'
  if (rule.type === DataImportRuleType.Counter) {
    conditions = (rule as IDataImportRuleCounter).conditions
    match = (rule as IDataImportRuleCounter).match
  } else if (rule.type === DataImportRuleType.Omit) {
    conditions = (rule as IDataImportRuleOmitRow).conditions
    match = (rule as IDataImportRuleOmitRow).match
  } else if (rule.type === DataImportRuleType.Variable) {
    conditions = (rule as IDataImportRuleVariable).conditions
    match = (rule as IDataImportRuleVariable).match
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
    return matches === rule.conditions.length
  } else if (match === 'atleastone'){
    return matches > 0
  } else if (match === 'none'){
    return matches == 0
  }
  return true

  return false
}
