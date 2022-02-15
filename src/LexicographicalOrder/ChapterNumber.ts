import romans from "romans";
import { NumberStyle } from "../types";
import isRomanNumber from "./isRomanNumber";

interface ChapterNumberLevel {
  val: number;
  style: NumberStyle;
}

class ChapterNumber {
  private _levels: Array<ChapterNumberLevel>;
  private _separator: string;
  constructor(text?: string) {
    this._levels = [];
    if (text) {
      this.parse(text);
    }
    this._separator = ".";
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
    number.split(".").forEach((level) => {
      if (level.trim()) {
        if (isRomanNumber(level)) {
          this._levels.push({
            val: romans.deromanize(level),
            style: NumberStyle.Roman,
          });
        } else {
          this._levels.push({
            val: parseInt(level),
            style: NumberStyle.Arabic,
          });
        }
      }
    });
  }

  dec(count?: number): ChapterNumber {
    count = count || 1;
    if (this._levels.length > 0) {
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
    return this;
  }

  inc(count?: number): ChapterNumber {
    count = count || 1;
    if (this._levels.length > 0) {
      this._levels[this._levels.length - 1].val =
        this._levels[this._levels.length - 1].val + count;
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

  toString(digits?: number): string {
    digits = digits || 0;
    let t = "";
    this._levels.forEach((level, index) => {
      if (index > 0) {
        t += ".";
      }
      if (level.style === NumberStyle.Roman) {
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

  get levels(): number {
    return this._levels.length;
  }
}

export default ChapterNumber;
