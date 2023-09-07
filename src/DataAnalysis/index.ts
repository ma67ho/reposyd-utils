export enum DataAnalysisContainerState {
  CLOSED = 'closed',
  DISABLED = 'disabled',
  OPEN = 'open'
}

export interface IDataAnalysisContainerChart {
  readonly label: Record<string, string>
  readonly type: string
}

export interface IDataAnalysisContainerData {
  readonly row: {
    readonly id: string
    readonly type: string
  }
}

export interface IDataAnalyisResultProperty {
  readonly default?: unknown
  readonly id: string
  readonly label: Record<string, string>
  readonly type: string
}

export interface IDataAnalyisResultPropertyEnumItem {
  readonly color?: string
  readonly condition?: string
  readonly icon?: string
  readonly key: string
  readonly label: Record<string, string>
}

export interface IDataAnalyisResultEnumProperty extends IDataAnalyisResultProperty {
  readonly default: string
  readonly items: IDataAnalyisResultPropertyEnumItem[]
}

export interface IDataAnalyisResultTextProperty extends IDataAnalyisResultProperty {
  readonly rules: unknown
}


export interface IDataAnalysisQualityGate {
  readonly groupBy: string
  readonly assessmentPending: string
  readonly props: Array<IDataAnalyisResultEnumProperty | IDataAnalyisResultTextProperty>
}


export interface IDataAnalysisContainer {
  readonly properties: {
    readonly charts: IDataAnalysisContainerChart[]
    readonly result: IDataAnalysisQualityGate
    readonly type: string
  }
  readonly state: DataAnalysisContainerState
}

export interface IDataAnalyisGroup {
  readonly color?: string
  readonly condition?: string
  readonly key: string
}

export interface IDataAnalyisResult {
  readonly props: Record<string, unknown>
  readonly uuid: string | null
}

export interface IDataAnalyisResultContainer {
  readonly designdata: Record<string,unknown>
  result: IDataAnalyisResult | null
}

import ComplianceStatement from './ComplianceStatement'
import * as ConditionBuilder from './ConditionBuilder'
import ConditionParser from './ConditionParser'
import * as DesignDataFilter from './DesignDataFilter'
import QualityGate from './QualityGate'
import RequirementsAnalysis from './RequirementsAnalysis'
import filterResults from './filterResults'
export default {
  ComplianceStatement,
  ConditionBuilder,
  ConditionParser,
  DesignDataFilter,
  QualityGate,
  filterResults,
  RequirementsAnalysis
}