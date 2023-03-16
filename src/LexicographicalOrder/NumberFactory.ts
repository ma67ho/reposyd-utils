import ChapterNumber from "./chapternumber"

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
      chapnum: /chapnum[(](.*),(.*)[)]/g,
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
      n = n.replaceAll(m[0], this._values[m[1]].toString())
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
          case REGEX.padEnd:
            n = n.replaceAll(match[0], match[1].padEnd(parseInt(match[2]), match[3]))
            break;
          case REGEX.padStart:
            n = n.replaceAll(match[0], match[1].padStart(parseInt(match[2]), match[3]))
            break;
          case REGEX.repl:
            n = n.replaceAll(match[0], this._values[match[1]].toString())
            break
        }
      }
    }
    return n
  }

  static build(expression: string, values?: Record<string,unknown>): string {
    const nb = new NumberBuilder(values)
    return nb.render(expression)
  }
}

