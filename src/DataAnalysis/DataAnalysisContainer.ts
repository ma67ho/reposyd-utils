import { DataAnalysisContainerState, IDataAnalysisContainer } from "."

interface IDataAnalysisContainerEventListener {
  callback(args): void
  emit: string
}

export class DataAnalysisContainer {
  _definition: IDataAnalysisContainer
  readonly _listeners: Record<string,IDataAnalysisContainerEventListener[]>
  constructor(definition: IDataAnalysisContainer){
    this._definition = definition
    this._listeners = {}
  }

  isOpen() {
    if (this._definition === undefined){
      return false
    }
    return this._definition.state === DataAnalysisContainerState.OPEN
  }

  protected emit(evt, ...args) {
    const listeners = this._listeners[evt]
    if (listeners !== undefined){
      for (const listener of listeners){
        listener.callback(args)
      }
    }
  }

  on(evt: string, callback){
    let l = this._listeners[evt]
    if (l === undefined){
      l = []
      this._listeners[evt] = l
    }
    l.push({
      callback: callback,
      emit: 'always'
    })
  }

  setDefinition(definition){
    this._definition = definition
    this.emit('definitionchanged')
  }

  get state(): DataAnalysisContainerState {
    return this._definition.state
  }

  protected get definition() {
    return this._definition
  }
}

