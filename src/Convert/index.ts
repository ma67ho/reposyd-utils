export enum Units {
  ANY = "*",
  CM = "cm",
  DEG = "deg",
  INVALID = "",
  HALFPOINT = "hpt",
  HPT = "hpt",
  MM = "mm",
  PT = "pt",
  PX = "px",
  TWIP = "twip",
  PERCENT = "%",
}

export type TDimension = {
  value: number;
  unit: Units;
};
/**
 * COnverts millimeter to half points
 *
 * @param {number} val
 * @returns {number}
 */
function mm2hpt(val: number): number {
  return Math.round(val / 0.176388889);
}
/**
 * Converts millimeter to a twentith width of an inch
 *
 * @param {number} val
 * @returns {number}
 */
function mm2twip(val: number): number {
  return Math.trunc(val * 56.6928);
}
/**
 * Coverts millimeter to half points
 *
 * @param {number} val
 * @returns {number}
 */
function pt2hpt(val: number) {
  // 1 hpt = 0.176388889 millimeters
  return Math.round(pt2mm(val) / 0.176388889);
}
/**
 * Converts point to millimeter.
 *
 * @param {number} val
 * @returns
 */
function pt2mm(val: number) {
  return val / 2.8346456692913384;
}
/**
 * Converts point to pixel
 *
 * @param {number} val
 * @returns
 */
function pt2px(val: number) {
  return Math.round(val / 0.75);
}
/**
 * Converts point to twentith width of an inch
 *
 * @param {number} val
 * @returns
 */
function pt2twip(val: number) {
  return Math.round(val * 20);
}
/**
 * Converts pixel to millimeter
 *
 * @param {number} val
 * @returns
 */
function px2mm(val: number) {
  return val / 3.779528;
}
/**
 * Converts point to twentith width of an inch
 *
 * @param {number} val
 * @returns
 */
function px2twip(val: number) {
  return Math.round(val * 15);
}

/**
 * Converts pixel to point
 *
 * @param {number} val
 * @returns
 */
function px2pt(val: number) {
  return Math.trunc(val * 0.75);
}
/**
 *
 *
 * @param {number} val
 * @returns {number}
 */
function mm2pt(val: number): number {
  return Math.trunc(val * 2.8346456692913384);
}
/**
 * Converts millimeter to pixel
 *
 * @param {number} val
 * @returns {number}
 */
function mm2px(val: number): number {
  return Math.trunc(val * 3.779528);
}
/**
 * Converts point to twentith width of an inch
 *
 * @param {number} val
 * @returns
 */
 function twip2mm(val: number) {
  return Math.trunc(val * 0.0176388889);
}


/**
 * Converts point to twentith width of an inch
 *
 * @param {number} val
 * @returns
 */
function twip2pt(val: number) {
  return Math.round(val * 20);
}
/**
 * Converts a value including an unit of measuerment to the specified target unit of measurement
 *
 * @example
 * convert('1mm', UnitOfMeasurement.PX) // 3.779528
 * @example
 * convert(1, UnitOfMeasurement.MM, UNitOfMeasurement.PX) // 3.779528
 * @param {string} val
 * @param {Units} to
 * @param {number} [base]
 * @returns {number}
 */
function convert(val: string, to: Units, base?: number): number;
/**
 *
 *
 * @param {number} val
 * @param {Units} from
 * @param {Units} to
 * @param {number} [base]
 * @returns {number}
 */
function convert(val: number, from: Units, to: Units, base?: number): number;
/**
 * Converts a value including an unit of measuerment to the specified target unit of measurement
 *
 * @example
 * convert('1mm', UnitOfMeasurement.PX) // 3.779528
 * @example
 * convert(1, UnitOfMeasurement.MM, UNitOfMeasurement.PX) // 3.779528
 *
 * @param {number} val
 * @param {Units} from
 * @param {Units} to
 * @param {number} [base]
 * @returns {number}
 */
function convert(
  val: number | string,
  from: Units,
  to: Units | number,
  base?: number
): number {
  let unit;
  let v;
  let t;
  let b = base;
  if (typeof val === "string") {
    const rxp = /\d+.\d+|\d+/;
    const m: RegExpExecArray = rxp.exec(String(val));
    if (m) {
      unit = String(val).replace(m[0], "");
      v = parseFloat(m[0]);
      t = from;
    }
  } else {
    unit = from;
    v = val;
    t = to;
  }
  if (typeof to === 'number') {
    b = to;
  }
  if (!unit) {
    return parseFloat(val as string);
  }
  if (unit === Units.CM) {
    v *= 10;
    unit = Units.MM;
  }
  if (unit === Units.MM && t === Units.CM) {
    return Math.round(v / 10);
  } else if (unit === Units.MM && t === Units.HPT) {
    return mm2hpt(v);
  } else if (unit === Units.MM && t === Units.PT) {
    return mm2pt(v);
  } else if (unit === Units.MM && t === Units.PX) {
    return mm2px(v);
  } else if (unit === Units.MM && t === Units.TWIP) {
    return mm2twip(v);
  } else if (unit === Units.PT && t === Units.HPT) {
    return pt2hpt(v);
  } else if (unit === Units.PT && t === Units.MM) {
    return pt2mm(v);
  } else if (unit === Units.PT && t === Units.PX) {
    return pt2px(v);
  } else if (unit === Units.PT && t === Units.TWIP) {
    return pt2twip(v);
  } else if (unit === Units.PX && t === Units.CM) {
    return px2mm(v) / 10;
  } else if (unit === Units.PX && t === Units.MM) {
    return px2mm(v);
  } else if (unit === Units.PX && t === Units.PX) {
    return v;
  } else if (unit === Units.PX && t === Units.PT) {
    return px2pt(v);
  } else if (unit === Units.PX && t === Units.TWIP) {
    return px2twip(v);
  } else if (unit === Units.TWIP && t === Units.MM) {
    return twip2mm(v);
  } else if (unit === Units.TWIP && t === Units.PT) {
    return twip2pt(v);
  } else if (unit === Units.PERCENT && t === Units.PERCENT) {
    return parseInt(v);
  } else if (unit === Units.PERCENT && t === Units.MM && b) {
    return (parseInt(v) * b) / 100;
  } else if (unit === Units.PERCENT && t === Units.PT && b) {
    return (parseInt(v) * b) / 100;
  } else if (unit === Units.PERCENT && t === Units.TWIP && b) {
    return (parseInt(v) * b) / 100;
  }
  return parseFloat(v);
}
/**
 * Returns the dimension and unit of a given value.
 * @param  {string} value
 * @returns TDimension
 */
function dimension(value: string): TDimension {
  const rxp = /\d+.\d+|\d+/;
  const m: RegExpExecArray = rxp.exec(String(value));
  if (m) {
    return {
      unit: unit(value),
      value: parseFloat(m[0]),
    };
  }
  return {
    unit: Units.INVALID,
    value: -1,
  };
}

function round(value: number, fixed?: number) {
  return parseFloat(Math.round(parseFloat(value + `e+${fixed || 2}`)) + "e-2");
}
/**
 * Returns the value's unit
 * @param  {string} value
 * @returns Units
 */
function unit(value: string): Units {
  if (typeof value === "string") {
    const rxp = /\d+.\d+|\d+/;
    const m: RegExpExecArray = rxp.exec(String(value));
    if (m) {
      switch (String(value).replace(m[0], "").trim().toLowerCase()) {
        case "cm":
          return Units.CM;
        case "deg":
          return Units.DEG;
        case "hpt":
          return Units.HPT;
        case "mm":
          return Units.MM;
        case "pt":
          return Units.PT;
        case "px":
          return Units.PX;
        case "twip":
          return Units.TWIP;
        case "%":
          return Units.PERCENT;
        default:
          return Units.INVALID;
      }
    }
  }
  return Units.INVALID;
}
/**
 * Converts a given unit string to enum Units.
 * @param  {string} unit
 * @returns Units
 */
function string2Unit(unit: string): Units {
  switch (unit.trim().toLowerCase()) {
    case "cm":
      return Units.CM;
    case "hpt":
      return Units.HPT;
    case "mm":
      return Units.MM;
    case "pt":
      return Units.PT;
    case "px":
      return Units.PX;
    case "twip":
      return Units.TWIP;
    case "%":
      return Units.PERCENT;
    default:
      return Units.INVALID;
  }
}
export {
  convert,
  dimension,
  pt2hpt,
  pt2mm,
  pt2px,
  pt2twip,
  px2pt,
  px2mm,
  px2twip,
  mm2pt,
  mm2px,
  string2Unit,
  twip2mm,
  twip2pt,
  unit,
};
