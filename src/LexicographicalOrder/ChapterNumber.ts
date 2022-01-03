import romans from "romans";

export enum ChapterNumberStyle {
  Arabic,
  Roman,
}

export function isRomanNumber(num: string): boolean {
  if (!num || num === "") {
    return false;
  }
  for (let i = 0; i < num.length; i++) {
    if (
      num[i] !== "C" &&
      num[i] !== "D" &&
      num[i] !== "I" &&
      num[i] !== "L" &&
      num[i] !== "M" &&
      num[i] !== "V" &&
      num[i] !== "X"
    ) {
      return false;
    }
  }
  return true;
}

interface ChapterNumberLevel {
  val: number;
  style: ChapterNumberStyle;
}

export class ChapterNumber {
  private _levels: Array<ChapterNumberLevel>;
  private _separator: string;
  constructor(text?: string) {
    this._levels = [];
    if (text) {
      this.parse(text);
    }
    this._separator = ".";
  }

  add(style?: ChapterNumberStyle): ChapterNumber {
    this._levels.push({ val: 1, style: style || ChapterNumberStyle.Arabic });
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
            style: ChapterNumberStyle.Roman,
          });
        } else {
          this._levels.push({
            val: parseInt(level),
            style: ChapterNumberStyle.Arabic,
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
      if (
        this._levels[this._levels.length - 1].style === ChapterNumberStyle.Roman
      ) {
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
      if (level.style === ChapterNumberStyle.Roman) {
        t += romans.romanize(level.val);
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
