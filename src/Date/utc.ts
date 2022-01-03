/**
 * This module provides support functions for handling Date objects
 * @module Utils/Date
 */

 import {utcToZonedTime} from 'date-fns-tz'
 import { format as dateFormat, zonedTimeToUtc } from 'date-fns-tz'
 import { de, enGB, enUS } from 'date-fns/locale'
 const locales = {
   deDE: de,
   enGB: enGB,
   enUS: enUS
 }

 function utc (tz: string | undefined): string {
   return zonedTimeToUtc(new Date(), tz || 'Europe/Berlin').toISOString()
 }
 
 function utcFormat (utc, format: string, locale: string, tz: string | undefined): string {
   if (!utc) {
     return null
   }
   return dateFormat(utcToZonedTime(utc, tz || 'Europe/Berlin'), format, { locale: locales[locale.replace('-', '')] })
 }
 
 function utcToTimezone (utc, tz: string | undefined, format: string | undefined): string {
   if (!utc) {
     return null
   }
   const dtz = utcToZonedTime(utc, tz || 'Europe/Berlin')
   return `${dateFormat(dtz, format || 'yyyy-MM-dd')}T${dateFormat(dtz, format || 'HH:mm')}`
 }

 export default {
   utc,
   utcFormat,
   utcToTimezone
 }