import ChapterNumber from "./ChapterNumber"

export default class NumberBuilder {
  private _values: Record<string, unknown>
  constructor(values?: Record<string, unknown>) {
    this._values = values || {}
  }

  render(expression: string): string {
    return this.parse(expression)
  }

  private chapterNumber(text: string, digits: number): string {
    const cn = new ChapterNumber(text)
    return cn.toString(digits)
  }

  private parse(str: string): string {
    let n = str

    const REGEX = {
      // repl: /\{(.*)\}/g,
      repl: /\{(.*?)\}/g,
      counter: /counter[(](.*),(.*),(.*),'(.*)'[)]|counter[(](.*),(.*)[)]/g,
      chapnum: /chapnum\((.*),(.*)\b\)/g,
      eq: /eq\((.*),(.*),'(.*)'\)|eq\((.*),(.*),(.*)\)/g,
      nq: /nw\((.*),(.*),(.*)\)/g,
      pad: /pad\((.*),(\d*),'(.*)','(e|s)'\)/g,
      padEnd: /padEnd\((.*),(\d*),'(.*)'\)/g,
      padStart: /padStart\((.*),(\d*),'(.*)'\)/g,
    }

    let m;
    const regex = /\{(.*?)\}/g
    while ((m = regex.exec(n)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      if (m[1] === undefined || m[1] === null || this._values[m[1]] === undefined) {
        n = n.replaceAll(m[0], '???')
      } else {
        n = n.replaceAll(m[0], String(this._values[m[1]]))
      }
    }

    for (const key in REGEX) {
      const regex = REGEX[key]
      const match = regex.exec(n)
      if (match) {
        switch (regex) {
          case REGEX.chapnum:
            n = n.replaceAll(match[0], this.chapterNumber(match[1], parseInt(match[2] || 0)))
            break;
          case REGEX.counter:
            if (match[1] === undefined) {
              n = n.replaceAll(match[0], `${parseInt(match[5]) ? parseInt(match[5]) * parseInt(match[6]) : match[5]}`)
            } else {
              n = n.replaceAll(match[0], `${parseInt(match[1]) ? parseInt(match[1]) * parseInt(match[2]) : match[1]}`.padStart(parseInt(match[3]), match[4]))
            }
            break
          case REGEX.eq:
            if (match[1] === match[2]){
              n = n.replaceAll(match[0], match[3])  
            } else {
              n = n.replaceAll(match[0], '')
            }
            break
          case REGEX.pad:
            if (match[4] === 'e') {
              n = n.replaceAll(match[0], match[1].padEnd(parseInt(match[2]), match[3]))
            } else if (match[4] === 's') {
              n = n.replaceAll(match[0], match[1].padStart(parseInt(match[2]), match[3]))
            }
            break;
          case REGEX.padEnd:
            n = n.replaceAll(match[0], match[1].padEnd(parseInt(match[2]), match[3]))
            break;
          case REGEX.padStart:
            n = n.replaceAll(match[0], match[1].padStart(parseInt(match[2]), match[3]))
            break;
          case REGEX.repl:
            if (match[1] === undefined || this._values[match[1]] === undefined) {
              n = n.replaceAll(match[0], '???')
            } else {
              n = n.replaceAll(match[0], String(this._values[match[1]]))
            }
            break
        }
      }
    }
    return n
  }

  static build(expression: string, values?: Record<string, unknown>): string {
    const nb = new NumberBuilder(values)
    return nb.render(expression)
  }
}

