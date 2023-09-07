/* eslint-disable no-case-declarations */

export const Operators = {
  EQUALS: 'eq',
  AND: 'and',
  OR: 'or',
  GREATER_THAN: 'gt',
  GREATER_THAN_EQUAL: 'ge',
  LESS_THAN: 'lt',
  LESS_THAN_EQUAL: 'le',
  LIKE: 'like',
  ISNULL: 'isnull',
  NOT_EQUAL: 'ne',

  /**
   * Whether a defined operation is unary or binary.  Will return true
   * if the operation only supports a subject with no value.
   *
   * @param {String} op the operation to check.
   * @return {Boolean} whether the operation is an unary operation.
   */
  isUnary: function (op) {
    let value = false
    if (op === Operators.ISNULL) {
      value = true
    }
    return value
  },
  /**
   * Whether a defined operation is a logical operators or not.
   *
   * @param {String} op the operation to check.
   * @return {Boolean} whether the operation is a logical operation.
   */
  isLogical: function (op) {
    return (op === Operators.AND || op === Operators.OR)
  }
}

const Functions = {
  CONCAT: 'concat',
  CONTAINS: 'contains',
  DAY: 'day',
  HOUR: 'hour',
  INCLUDED: 'includedin',
  INDEXOF: 'indexof',
  LENGTH: 'length',
  MINUTE: 'minute',
  MONTH: 'month',
  REPLACE: 'replace',
  SECOND: 'second',
  SUBSTRING: 'substring',
  TOLOWER: 'tolower',
  TOUPPER: 'toupper',
  TRIM: 'trim',
  YEAR: 'year',
  STARTSWITH: 'startswith',
  ENDSWIDTH: 'endswith'
}

class FilterCondition {
  private _subject: any
  _operator: any
  _type: any
  _value: any
  constructor(config) {
    this._subject = config.subject
    this._operator = (config.operator) ? config.operator : Operators.EQUALS
    this._value = config.value
    this._type = config.type
  }

  get operator() {
    return this._operator
  }
  get subject() {
    return this._subject
  }
  get type() {
    return this._type
  }
  get value() {
    return this._value
  }
}
// const FilterCondition = function (config) {
//   if (!config) {
//     config = {}
//   }
//   this.subject = config.subject
//   this.operator = (config.operator) ? config.operator : Operators.EQUALS
//   this.type = config.type
//   this.value = config.value
//   return this
// }

export default (function () {
  const REGEX = {
    parenthesis: /^([(](.*)[)])$/,
    ddl: /^([A-Z]{2})->([a-z]*)->([A-Z]{2}) (.*)/,
    andor: /^(.*?) (or|and)+ (.*)$/,
    property: /(\$property)\('(.*)'\) (eq|gt|lt|ge|le|ne) (null|not null|(#groupkey)|'(.*)')/,
    result: /(#result) (eq|ne) (null)/,
    fnboolean: /(contains|includedin|endswith|startswith)\((.*)\) (eq) (false|true)/,
    fnnumber: /(day|hour|minute|month|year|indexof|length|second)\((.*)\) (eq|gt|lt|ge|le|ne) ([0-9]*)/,
    fnstring: /(concat|endswith|indexof|replace|substring|startswith|tolower|toupper|trim)\((.*)\) (eq|gt|lt|ge|le|ne) (null|not null|'(.*)')/,
    fnnested: /(day|startswith|endswith|tolower|toupper)\((.*)\)/,
    link: /^(.*)->([A-Z]{2}) (.*) (eq|gt|lt|ge|le|ne) ('(.*)'|[0-9]*)/,
    op: /(\$?\w*) (eq|gt|lt|ge|le|ne) (null|not null|datetimeoffset'(.*)'|'(.*)'|[0-9]*)/,
  }

  function isFunction(str) {
    for (const key of Object.keys(Functions)) {
      if (str.startsWith(Functions[key] + '(')) {
        return true
      }
    }
    return false
  }

  function fnarguments(fn, args) {
    switch (fn) {
      case Functions.CONCAT:
        let a = args.match(/([^,]*),'(.*)'/)
        if (a === null) {
          a = args.match(/([^,]*),(\$?\w*)/)
        }
        return a ? a : []
      case Functions.INCLUDED:
        const i = args.match(/(\$?\w*),\[('.*')\]/)
        i[2] = i[i.length - 1].split(',').map(x => x.replace(/'/g, ''))
        return i
      case Functions.DAY:
      case Functions.HOUR:
      case Functions.LENGTH:
      case Functions.MINUTE:
      case Functions.MONTH:
      case Functions.SECOND:
      case Functions.TOLOWER:
      case Functions.TOUPPER:
      case Functions.TRIM:
      case Functions.YEAR:
        return args.match(/(.*)/)
      case Functions.CONTAINS:
      case Functions.ENDSWIDTH:
      case Functions.INDEXOF:
      case Functions.STARTSWITH:
        return args.match(/(\w*),'(.*)'/)
      case Functions.REPLACE:
        return args.match(/(.*),'(.*)','(.*)'/)
      case Functions.SUBSTRING:
        return args.match(/([^,]*),([0-9]*)(?:,([0-9]*))?/)
      default:
        return []
    }
  }

  function value(match) {
    let v = (match.indexOf('\'') === -1) ? +match : match
    if (match === 'null') {
      v = null
    }
    return v
  }
  function parseFunction(match) {
    const fnargs = fnarguments(match[1], match[2]).filter(x => x !== undefined)
    const isfn = isFunction(match[2])
    return new FilterCondition({
      subject: isfn ? parseFragment(match[2]) : fnargs[1],
      operator: match[1],
      value: fnargs.length > 3 ? fnargs.slice(2) : fnargs[2],
      type: 'fn'
    })
    // }
  }

  function parseFragment(filter) {
    let found = false
    let obj
    for (const key in REGEX) {
      const regex = REGEX[key]
      if (found) {
        break
      }
      const match = filter.match(regex)
      if (match) {
        switch (regex) {
          case REGEX.andor:
            obj = new FilterCondition({
              value: [parseFragment(match[1]), parseFragment(match[3])],
              operator: match[2],
              type: 'group'
            })
            break
          case REGEX.property:
            obj = new FilterCondition({
              subject: match[2],
              operator: match[3],
              value: match[5] !== undefined ? match[5] : match[6],
              type: 'property'
            })
            break
            case REGEX.result:
              obj = new FilterCondition({
                subject: match[1],
                operator: match[2],
                value: value(match[3]),
                type: 'object'
              })
              break
            case REGEX.ddl:
            obj = new FilterCondition({
              subject: [match[1], match[2], match[3]],
              value: parseFragment(match[4]),

            })
            break
          case REGEX.fnboolean:
            obj = new FilterCondition({
              subject: parseFunction(match),
              operator: match[3],
              value: match[4] == 'true'
            })
            break
          case REGEX.fnnumber:
            obj = new FilterCondition({
              subject: parseFunction(match),
              operator: match[3],
              value: parseInt(match[4])
            })
            break
          case REGEX.fnstring:
            obj = new FilterCondition({
              subject: parseFunction(match),
              operator: match[3],
              value: match[5]
            })
            break
          // return parseFunction(match)
          case REGEX.fnnested:
            return parseFunction(match)
          case REGEX.parenthesis:
            return parseFragment(match[2])
          case REGEX.op:
            obj = new FilterCondition({
              subject: match[1],
              operator: match[2],
              value: value(match[3]),
              type: 'operator'
            })
            if (typeof obj.value === 'string') {
              const quoted = obj.value.match(/^'(.*)'$/)
              const m = obj.value.match(/^datetimeoffset'(.*)'$/)
              if (quoted && quoted.length > 1) {
                obj.value = quoted[1]
              } else if (m && m.length > 1) {
                obj.value = new Date(m[1])
              }
            }
            break
          case REGEX.link:
            obj = new FilterCondition({
              operator: match[4],
              subject: [match[1], match[2], match[3]],
              value: match[5],
            })
            const quoted = obj.value.match(/^'(.*)'$/)
            if (quoted === null) {
              obj.value = parseInt(obj.value)
            } else if (quoted.length > 1) {
              obj.value = quoted[1]
            }
            // if (_domain == 'ddo') {
            //   throw new Error('link not supported')
            // }
            // obj = new FilterCondition({
            //   subject: [match[1], match[2]],
            //   type: 'ddl',
            //   value: new FilterCondition({
            //     subject: match[3],
            //     operator: match[4],
            //     value: match[6] === undefined ? match[5] : match[6],
            //     type: 'ddo'
            //   })
            //   // value: parseFragment(match[3])
            // })
            break
        }
        found = true
      }
    }
    return obj
  }

  function parseNested(filter) {
    const expressions = {}
    const keyRegex = /([$][0-9]+[$])/g
    while (filter.indexOf('(') !== -1) {
      let i; let leftParenthesisIndex = 0
      let isInsideQuotes = false
      for (i = 0; i < filter.length; i++) {
        if (filter[i] === '\'') {
          isInsideQuotes = !isInsideQuotes
        } else if (!isInsideQuotes && filter[i] === '(') {
          leftParenthesisIndex = i
        } else if (!isInsideQuotes && filter[i] === ')') {
          const key = `$${Object.keys(expressions).length}$`
          const filterSubstring = filter.substring(leftParenthesisIndex + 1, i)
          expressions[key] = parseFragment(filterSubstring)

          const match = filterSubstring.match(keyRegex)
          if (match && match.length === 2) {
            expressions[key].subject = expressions[match[0]]
            expressions[key].value = expressions[match[1]]
          } else if (match && match.length === 1) {
            if (filterSubstring.indexOf('$') === 0) {
              expressions[key].subject = expressions[match[0]]
            } else {
              expressions[key].value = expressions[match[0]]
            }
          }
          filter = `${filter.substring(0, leftParenthesisIndex)}${key}${filter.substring(i + 1)}`
          break
        }
      }
      if (i === filter.length) {
        throw new Error('The given string has uneven number of parenthesis'
        )
      }
    }
    return expressions[`$${Object.keys(expressions).length - 1}$`]
  }

  return {
    parse: function (definition) {
      return parseFragment(definition)
    }
  }
}())
