import { DataImportRule, DataImportRuleType, IDataImportRule } from ".";

export interface IDataImportRuleNoDuplicates extends IDataImportRule {
  readonly mapping: any
}

export default class DataImportRuleNoDuplicates extends DataImportRule {
  private _mappings: any
  constructor(){
    super(DataImportRuleType.NoDuplicates)
  }

  json(data?: any) {
    return {
      enabled: this.enabled,
      type: this.type
    }
  }
}