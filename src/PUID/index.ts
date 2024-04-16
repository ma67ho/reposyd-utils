import { isEmpty } from "lodash"

function compare (a, b){
  const al = a.split('-')
  const bl = b.split('-')
  
  if (al.length < 3){
    al.splice(0,0, '')
  }
  if (bl.length < 3){
    bl.splice(0,0, '')
  }
  
  al[2] = parseInt(al[2])
  bl[2] = parseInt(bl[2])
  let r = al[0].localeCompare(bl[0])
  if (r !== 0) {
    return r
  }
  r = al[1].localeCompare(bl[1])
  if (r !== 0) {
    return r
  }
  if (al[2] < bl[2]){
    return -1
  }
  if (al[2] > bl[2]){
    return 1
  }
  return 0
}

function isPUID(str?: string): boolean {
  if (isEmpty(str)){
    return false
  }
  // eslint-disable-next-line no-useless-escape
  const regexp = /^[a-zA-Z\d #$@\(\)\[\]+*]+-[A-Z]{2}-\d{1,}$|^[A-Z]{2}-\d{1,}$/
  return str.match(regexp) !== null
}

export {
  compare,
  isPUID
}