export default function (val: string): boolean {
  let r = 0
  for (let i = 0; i < val.length; i++) {
    if (val.charCodeAt(i) >= 65 && val.charCodeAt(i) <= 90){
      if (r === -1){
        return false
      }
      r = 1
    } else if (val.charCodeAt(i) >= 97 && val.charCodeAt(i) <= 122){
      if (r === 1){
        return false
      }
      r = -1
    } else {
      return false
    }
  }
  return r === 0 ? false : true
}