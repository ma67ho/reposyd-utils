import romans from "romans";
import { NumberStyle } from "../types";
import isRomanNumber from "./isRomanNumber";
import isAlphabeticalOrder from "./isAlphabeticalOrder";

function compareSectionNumnber(a, b) {
  if (isNaN(a) && isNaN(b)) {
    if (a < b) {
      return -1
    } else if (a > b) {
      return 1
    } else {
      return 0
    }
  } else if (!isNaN(a) && isNaN(b)) {
    return -1
  } else if (isNaN(a) && !isNaN(b)) {
    return 1
  } else {
    a = parseInt(a)
    b = parseInt(b)
    if (a < b) {
      return -1
    } else if (a > b) {
      return 1
    } else {
      return 0
    }
  }
}


interface ChapterNumberLevel {
  val: number;
  style: NumberStyle;
}

class ChapterNumber {
  private _levels: Array<ChapterNumberLevel>;
  private _separator: string;
  constructor(text?: string) {
    this._levels = [];
    this._separator = ".";
    if (text) {
      this.parse(text);
    }
  }

  add(): ChapterNumber;
  add(style: NumberStyle): ChapterNumber;
  add(start: number): ChapterNumber;
  add(style: NumberStyle, start: number): ChapterNumber;
  add(style?: NumberStyle | number, start?: number): ChapterNumber {
    if (typeof style === 'string' && typeof start === 'number') {
      this._levels.push({ val: start, style: style });
    } else if (!style && !start) {
      this._levels.push({ val: 1, style: NumberStyle.Arabic });
    } else if (typeof style === "number" && !start) {
      this._levels.push({ val: style, style: NumberStyle.Arabic });
    } else if (typeof style === "string") {
      this._levels.push({ val: 1, style: style });
    }
    return this;
  }

  private compareLevels(a, b) {
    if (a.length < b.length) {
      return -1;
    } else if (a.length > b.length) {
      return 1;
    }
    const max = a.levels < b.length ? b.length : a.length;
    for (let i = 0; i < max; i++) {
      if (a[i].val < b[i].val) {
        return -1;
      } else if (a[i].val > b[i].val) {
        return 1;
      }
    }
    return 0;
  }

  compare(other: ChapterNumber): number {
    return this.compareLevels(this._levels, other._levels);
  }

  private parse(number) {
    this._levels = [];
    const items = number.split(this._separator)
    items.forEach((level) => {
      if (level.trim()) {
        if (isRomanNumber(level)) {
          this._levels.push({
            val: romans.deromanize(level),
            style: NumberStyle.Roman,
          });
        } else if (isAlphabeticalOrder(level)) {
          let val = 0
          for (let i = 0; i < level.length; i++){
            if (level[i] === level[i].toUpperCase()){
              val += level.charCodeAt(i) - 64
            } else {
              val += level.charCodeAt(i) - 96
            }
          }
          if (level === level.toUpperCase()) {
            this._levels.push({
              val: val,
              style: NumberStyle.AlphabeticalUpperCase
            })
          } else {
            this._levels.push({
              val: level,
              style: NumberStyle.AlphabeticalLowerCase
            })
          }
        } else {
          const v = parseInt(level)
          if (Number.isNaN(v)) {
            this._levels.push({
              val: level,
              style: NumberStyle.NaN,
            });
          } else {
            this._levels.push({
              val: parseInt(level),
              style: NumberStyle.Arabic,
            });
          }
        }
      }
    });
  }

  dec(count?: number): ChapterNumber {
    count = count || 1;
    if (this._levels.length > 0) {
      if (this._levels[this._levels.length - 1].style !== NumberStyle.NaN) {
        this._levels[this._levels.length - 1].val =
          this._levels[this._levels.length - 1].val - count;
        if (this._levels[this._levels.length - 1].style === NumberStyle.Roman) {
          if (this._levels[this._levels.length - 1].val < 1) {
            this._levels[this._levels.length - 1].val = this._levels[
              this._levels.length - 1
            ].val = 1;
          }
        } else {
          if (this._levels[this._levels.length - 1].val < 0) {
            this._levels[this._levels.length - 1].val = this._levels[
              this._levels.length - 1
            ].val = 0;
          }
        }
      }
    }
    return this;
  }

  inc(count?: number): ChapterNumber {
    count = count || 1;
    if (this._levels.length > 0) {
      if (this._levels[this._levels.length - 1].style !== NumberStyle.NaN) {
        this._levels[this._levels.length - 1].val = this._levels[this._levels.length - 1].val + count;
      }
    }
    return this;
  }

  isEqual(other: ChapterNumber): boolean {
    return this.compare(other) === 0;
  }

  isGreater(other: ChapterNumber): boolean {
    return this.compare(other) === 1;
  }

  isLess(other: ChapterNumber): boolean {
    return this.compare(other) === -1;
  }

  remove(): ChapterNumber {
    if (this._levels.length > 0) {
      this._levels.splice(this._levels.length - 1, 1);
    }
    return this;
  }

  setStyle(style: NumberStyle, level?: number) {
    const lvl = level === undefined ? this._levels.length - 1 : level
    if (lvl < 0 || lvl >= this._levels.length) {
      throw new RangeError('level out of range')
    }
    this._levels[lvl].style = style
  }

  setValue(value: number, level?: number) {
    const lvl = level === undefined ? this._levels.length - 1 : level
    if (lvl < 0 || lvl >= this._levels.length) {
      throw new RangeError('level out of range')
    }
    this._levels[lvl].val = value
  }

  style(level?: number): NumberStyle {
    const lvl = level === undefined ? this._levels.length - 1 : level
    if (lvl < 0 || lvl >= this._levels.length) {
      throw new RangeError('level out of range')
    }
    return this._levels[lvl].style
  }

  toString(digits?: number): string {
    digits = digits || 0;
    let t = "";
    this._levels.forEach((level, index) => {
      if (index > 0) {
        t += ".";
      }
      if (level.style === NumberStyle.AlphabeticalLowerCase) {
        let val = level.val
        while(val > 0){
          if (val % 26 > 0){
            t = String.fromCharCode(96 + val % 26) + t
            val -= val % 26
          } else {
            t = 'z' + t
            val -= 26
          }
        }
      } else if (level.style === NumberStyle.AlphabeticalUpperCase) {
        let val = level.val
        while(val > 0){
          if (val % 26 > 0){
            t = String.fromCharCode(64 + val % 26) + t
            val -= val % 26
          } else {
            t = 'Z' + t
            val -= 26
          }
        }
      } else if (level.style === NumberStyle.NaN) {
        t += level.val
      } else if (level.style === NumberStyle.Roman) {
        t += romans.romanize(level.val);
      } else if (level.style === NumberStyle.RomanLowerCase) {
        t += romans.romanize(level.val).toLowerCase();
      } else {
        let fl = digits - level.val.toString().length;
        if (fl < 0) {
          fl = 0;
        }
        t += "0".repeat(fl) + level.val.toString();
      }
    });
    return t;
  }

  value(level?: number): number {
    const lvl = level === undefined ? this._levels.length - 1 : level
    if (lvl < 0 || lvl >= this._levels.length) {
      throw new RangeError('level out of range')
    }
    return this._levels[lvl].val
  }

  get levels(): number {
    return this._levels.length;
  }

  static compare(a: string, b: string, sep?: string): number {
    const ia = a.split(sep === undefined ? '.' : sep)
    const ib = b.split(sep === undefined ? '.' : sep)
    const count = Math.min(ia.length, ib.length)
    for (let index = 0; index < count; index++) {
      const r = compareSectionNumnber(ia[index], ib[index])
      if (r !== 0) {
        return r
      }
    }
    if (ia.length < ib.length) {
      return -1
    } else if (ia.length > ib.length) {
      return 1
    } else {
      return 0
    }
  }
}

export default ChapterNumber;
