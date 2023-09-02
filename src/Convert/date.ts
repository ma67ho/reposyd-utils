import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import pluginLocaleData from 'dayjs/plugin/localeData'
dayjs.extend(utc)
dayjs.extend(localizedFormat)
dayjs.extend(pluginLocaleData)
dayjs.extend(customParseFormat)
import 'dayjs/locale/de'
import 'dayjs/locale/en'

let _LANGUAGE = 'en-US'

export function language(lang: string): string {
  if (lang !== undefined){
  _LANGUAGE = lang
  }
  return _LANGUAGE
}

export function locale(locale: string): string {
  if (locale !== undefined) {
    dayjs.locale(locale)
  }
  return dayjs.locale()
}

export function localeData() {
  return dayjs.localeData()
}

export function dateMask(locale): string {
  if (locale.substring(0, 2) === 'de') {
    return 'DD.MM.YYYY'
  }
  return 'MM/DD/YYYY'
}

export function fromISO(value: string, locale: string): string {
  return dayjs(value).format(dateMask(locale))
}

export function toISO(value, locale: string): string {
  return dayjs(value, dateMask(locale)).format('YYYY-MM-DD')
}

export function inputMask(locale) {
  if (locale.substring(0, 2) === 'de') {
    return '##.##.####'
  }
  return '##/##/####'
}

