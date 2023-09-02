
import { add, addWeeks, differenceInBusinessDays, Duration, format, isDate } from 'date-fns'
import utc from './utc'

import { de, enGB, enUS } from 'date-fns/locale'
import { getDateLocalePattern, getDateTimeLocalePattern, getTimeLocalePattern, PatternStyle } from 'datetime-locale-patterns'

export interface IDateTimeOptions {
  locale?: string
  language?: string
}

function toDate(date: Date | string): Date {
  return (isDate(date) ? date : new Date(date)) as Date
}

const locales = { de, enGB, enUS }



function compare(a, b) {
  return 0
}

function localeFormat(date, pattern, locale): string {
  if (date === undefined || date === null) {
    return ''
  }
  const d = isDate(date) ? date : new Date(date)
  let locl = locale.replace(/-/g, '')
  if (locales[locl] === undefined) {
    locl = locale.substring(0, 2)
  }
  return format(d, pattern, { locale: locales[locl] })
}

export default {
  add: function (date: Date, duration: Duration): Date {
    return add(date, duration)
  },
  addWeeks: function (date, amount: number): Date {
    return addWeeks(date, amount)
  },
  businessDays: function (left, right): number {
    return differenceInBusinessDays(toDate(left), toDate(right))
  }
  ,
  compare,
  date: function (date: Date | string, style: PatternStyle, options?: IDateTimeOptions): string {
    const p = getDateLocalePattern(options?.locale.substring(0, 2) || 'en', style)
    return localeFormat(date, p, options?.language || 'en-US')
  },
  dateTime: function (date: Date | string, style: PatternStyle, options?: IDateTimeOptions): string {
    const p = getDateTimeLocalePattern(options?.locale.substring(0, 2) || 'en', style, style)
    return localeFormat(date, p, options?.language || 'en-US')
  },
  format: localeFormat,
  minutes: function(value: number): string {
    if (value < 60) {
      return `${value} m`
    } else {
      return `${value / 60} h`    }

  },
  time: function (date: Date | string, style: PatternStyle, options?: IDateTimeOptions): string {
    const p = getTimeLocalePattern(options?.locale.substring(0, 2) || 'en', style)
    return localeFormat(date, p, options?.language || 'en-US')
  },
  utc
}