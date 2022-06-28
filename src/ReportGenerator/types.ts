import { Uuid } from "../ObjectHelper/types"

export interface IChapter {
  uuid: Uuid
  number: string
  title: string
  description: string
  script: {
    name: string
    options: any
    uuid: Uuid
  }
  // script: {
  //   uuid: null,
  //   name: row.sn_script,
  //   options: row.st_options === null ? defaultOptions : JSON.parse(row.st_options)
  // }, 
}