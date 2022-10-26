
import nerdamer from "nerdamer";
import { convert, Units } from ".";

export interface ICalcOptions {
  base?: string;
  constants?: Record<string, string>;
}

export function calc(formula: string, unit: Units, options?: ICalcOptions): number {
  const opts = options || {} as ICalcOptions;
  const regex = /(\d+.\d+|\d+)(cm|hpt|mm|pt|px|rem|twip|%)/g;
  const b = opts.base ? convert(opts.base, unit) : 0;
  let f = formula.toLowerCase();
  // sanintize formula: replace constants and adjust units
  Object.keys(opts.constants).forEach(key => {
    f = f.replaceAll(key, opts.constants[key]);
  });
  let m;
  while ((m = regex.exec(f)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    m.forEach((match, groupIndex) => {
      if (groupIndex === 0) {
        f = f.replace(match, convert(match, unit, b).toString());
      }
    });
  }
  return parseFloat(nerdamer(f).text());
}
// 