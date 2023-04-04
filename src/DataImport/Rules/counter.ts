import { IDataImportRuleCounter, TDataImportCounter, TDataImportDataRow } from ".";
import matches from "./matches";

export default function (row: TDataImportDataRow, rule: IDataImportRuleCounter, counter: TDataImportCounter): void {
  if (!rule.enabled) {
    return
  }
  if (matches(row, rule)) {
    if (rule.action === 'increaseby') {
      counter[rule.name] = (counter[rule.name] || 0) + rule.value
    } else if (rule.action === 'resetto') {
      counter[rule.name] = rule.value
    }
  }
}

