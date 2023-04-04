import { IDataImportRuleOmitRow } from "."
import matches from "./matches"

export default function (row, rule: IDataImportRuleOmitRow){
  if (!rule.enabled){
    return false
  }
  return matches(row, rule)
}