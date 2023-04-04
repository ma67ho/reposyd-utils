import { IDataImportRuleVariable, TDataImportDataRow } from ".";
import matches from "./matches";

export default function(row:TDataImportDataRow, rule: IDataImportRuleVariable, variables): void{
  if (!rule.enabled){
    return
  }
  if (matches(row, rule)){
    variables[rule.name] = row[rule.column]
  }
}