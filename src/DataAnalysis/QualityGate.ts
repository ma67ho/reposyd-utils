import { IDataAnalyisResult, IDataAnalyisResultContainer, IDataAnalyisResultEnumProperty, IDataAnalyisResultPropertyEnumItem } from "."
import Uuid from "../Uuid"
import { build } from "./ConditionBuilder"
import { DataAnalysisContainer } from "./DataAnalysisContainer"
import { match } from "./DesignDataFilter"
import filterResults from "./filterResults"
import merge from 'lodash.merge'

function isResultContainer(item): boolean {
  return item !== null && item.designdata !== undefined && item.result !== undefined
}

export interface DataAnalysisDesignDataFilter {
  attributes: string
  responsible: string
}
type IDataAnalyisResults = IDataAnalyisResultContainer[]

export default class QualityGate extends DataAnalysisContainer {
  _results: IDataAnalyisResultContainer[]
  _groupedResults: Array<IDataAnalyisResults>
  _filterExpression: DataAnalysisDesignDataFilter
  constructor(definition) {
    super(definition)
    this._filterExpression = {
      attributes: null,
      responsible: null
    }
    this._groupedResults = []
    this._results = []
  }

  addDesignData() {
    //
  }

  designData(group: number, index: number) {
    if (group === -1 || index === -1) {
      return undefined
    }
    if (group >= this._groupedResults.length) {
      throw new RangeError('group out of range')
    }
    if (index >= this._groupedResults[group].length) {
      throw new RangeError('index out of range')
    }
    return this._groupedResults[group][index].designdata
  }

  assessmentPending(result: IDataAnalyisResult): boolean
  assessmentPending(item: IDataAnalyisResultContainer): boolean
  assessmentPending(group: IDataAnalyisResultContainer | IDataAnalyisResult | number, index?: number): boolean {
    const isp = build(this.definition.properties.result.assessmentPending)
    if (!Number.isNaN(group)) {
      if (isResultContainer(group)) {
        return isp(this.groupBy, {}, group)
      } else {
        return isp(this.groupBy, {}, { result: group })
      }
    } else {
      const grp = this.group(group as number)
      const item = this.item(group as number, index)
      return isp(this.groupBy, grp, item)
    }
  }

  indexOf(container: IDataAnalyisResultContainer): number[] {
    const grp = this.groupIndexByResult(container.result)
    const idx = this._groupedResults[grp].findIndex(item => item.result.uuid === container.result.uuid)
    return [grp, idx]
  }

  item(group: number, index: number): IDataAnalyisResultContainer {
    if (group === -1 || index === -1) {
      return undefined
    }
    if (group >= this._groupedResults.length) {
      throw new RangeError('group out of range')
    }
    if (index >= this._groupedResults[group].length) {
      throw new RangeError('index out of range')
    }
    return this._groupedResults[group][index]
  }

  group(index: number) {
    if (index >= this._groupedResults.length) {
      throw new RangeError('index out of range')
    }
    return this._groupedResults[index]
  }

  groupIndex(key: string) {
    return this.groups.findIndex(x => x.key === key)
  }

  groupIndexByResult(result): number {
    return this.groups.findIndex(group => filterResults(this.groupBy, group, [result]).length > 0)
  }

  pendingAssessments(): IDataAnalyisResultContainer[] {
    const isp = build(this.definition.properties.result.assessmentPending)
    return this._results.filter(result => isp(this.groupBy, {}, result))
  }

  read(results: IDataAnalyisResultContainer[]) {
    this._results = results.map(item => {
      if (item.result === null) {
        item.result = {
          props: {},
          uuid: Uuid.temporary()
        }
        for (const prop of this.definition.properties.result.props) {
          if (prop.default === undefined) {
            item.result.props[prop.id] = prop.type === 'text' ? '' : null
          } else {
            item.result.props[prop.id] = prop.default
          }
        }
      }
      return item
    })
    this._groupedResults = this.groups
      .map(group => filterResults(this.groupBy, group, this._results).filter(item => match(item.designdata, this._filterExpression)))
    this.emit('results.loaded')
  }

  resultsByGroup(group: string) {
    const idx = this.groups.findIndex(x => x.key === group)
    if (idx === -1) {
      throw new RangeError(`group '${group}' not found.`)
    }
    if (this._groupedResults.length < idx) {
      return []
    }
    return this._groupedResults[idx]
  }

  setDesignDataFilter(filter: DataAnalysisDesignDataFilter) {
    this._filterExpression = filter
    this._groupedResults = this.groups
      .map(group => filterResults(this.groupBy, group, this._results).filter(item => match(item.designdata, this._filterExpression)))
    this.emit('filter.changed')
  }

  transitions(result) {
    return []
  }

  updateAssessment(group: number, index: number, props): IDataAnalyisResultContainer {
    const item = this.item(group, index)
    // if (item.result === null){
    //   item.result = {
    //     props: {},
    //     uuid: null
    //   }
    //   for (const prop of this.definition.properties.result.props) {
    //     if (prop.default === undefined) {
    //       item.result.props[prop.id] = prop.type === 'text' ? '' : null
    //     } else {
    //       item.result.props[prop.id] = prop.default
    //     }
    //   }    
    // }
    if (item.result.props[this.groupBy] !== props[this.groupBy]) {
      merge(item.result.props, props)
      const newGroup = this.groupIndex(props[this.groupBy])
      this._groupedResults[group].splice(index, 1)
      this._groupedResults[newGroup].push(item)
      this.emit('assessment.changed', newGroup, this._groupedResults[newGroup].length - 1, group, index)
    } else {
      merge(item.result.props, props)
      this.emit('assessment.updated', group, index)
    }
    return item
  }

  updateResult(result: IDataAnalyisResult, temporary?: string): IDataAnalyisResultContainer {
    const uuid = temporary || result.uuid
    const item = this._results.find(item => item.result.uuid === uuid)
    const oldGroup = this.groupIndex(item.result.props[this.groupBy] as string)
    const oldIndex = this._groupedResults[oldGroup].findIndex(item => item.result.uuid === uuid)
    const newGroup = this.groupIndex(result.props[this.groupBy] as string)
    item.result = result

    if (oldGroup !== newGroup) {
      this._groupedResults[oldGroup].splice(oldIndex, 1)
      this._groupedResults[newGroup].push(item)
      this.emit('assessment.changed', newGroup, this._groupedResults[newGroup].length - 1, oldGroup, oldIndex)
    } else {
      this.emit('assessment.updated', oldGroup, oldIndex)
    }
    return item
  }

  get groupBy() {
    if (this.definition === undefined) {
      return null
    }
    return this.definition.properties.result.groupBy
  }

  get groupedResults() {
    if (this.definition === undefined) {
      return []
    }
    return this._groupedResults
  }

  get groups(): IDataAnalyisResultPropertyEnumItem[] {
    if (this.definition === undefined) {
      return []
    }
    const item = this.definition.properties.result.props.find(x => x.id === this.groupBy)
    if (item.type !== 'enumeration') {
      return undefined
    }
    return (item as IDataAnalyisResultEnumProperty).items
  }

  get results(): IDataAnalyisResults {
    return this._results
  }
}
