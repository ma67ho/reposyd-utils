import { expect } from 'chai';

import { DataFormatting } from '../src';

describe('DateFormatting', function () {
  it('format', function() {
    expect(DataFormatting.format(new Date(2023,0,2), 'MM/dd/yyyy', {locale: 'enUS'})).to.eql('01/02/2023')
    expect(DataFormatting.format(new Date(2023,0,1), 'dd MMM. yyyy', {locale: 'enUS'})).to.eql('01 Jan. 2023')
    expect(DataFormatting.format(new Date(2023,0,1), 'dd MMMM yyyy', {locale: 'enUS'})).to.eql('01 January 2023')
    expect(DataFormatting.format(new Date(2023,0,1), 'dd MMMM yyyy', 'de')).to.eql('01 Januar 2023')
  })
  it('date', function() {
    // expect(DateTime.dateLong(new Date(2023,0,1))).to.eql('1/2/2023')
    expect(DataFormatting.date(new Date(2023,0,1), 'long', { locale: 'de-DE'})).to.eql('1. January 2023')
    expect(DataFormatting.date(new Date(2023,0,1), 'long', { language: 'de-DE', locale: 'de-DE'})).to.eql('1. Januar 2023')
    expect(DataFormatting.date(new Date(2023,0,1), 'long', { locale: 'en-US'})).to.eql('January 1, 2023')
  })
  it('dateTime', function() {
    // expect(DateFormatting.dateTime(new Date(2023,0,1, 8, 30), 'short')).to.eql('1/1/23, 8:30 AM')
    expect(DataFormatting.dateTime(new Date(2023,0,1, 8, 30), 'short', { locale: 'de-DE'})).to.eql('01.01.23, 08:30')
  })
})
