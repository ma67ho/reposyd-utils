import { expect } from 'chai';

import { PUID } from '../src'

describe('PUID', function () {
  it('compare without prefix', function () {
    expect(PUID.compare('RT-1', 'RT-1')).to.eql(0)
    expect(PUID.compare('RT-1', 'RT-2')).to.eql(-1)
    expect(PUID.compare('RT-2', 'RT-1')).to.eql(1)
    expect(PUID.compare('RT-10', 'RT-1')).to.eql(1)
    expect(PUID.compare('RT-1', 'RT-10')).to.eql(-1)
  })
  it('compare with prefix', function () {
    expect(PUID.compare('RPS-RT-1', 'RPS-RT-1')).to.eql(0)
    expect(PUID.compare('RPS-RT-1', 'RPS-RT-2')).to.eql(-1)
    expect(PUID.compare('RPS-RT-2', 'RPS-RT-1')).to.eql(1)
    expect(PUID.compare('RPS-RT-10', 'RPS-RT-1')).to.eql(1)
    expect(PUID.compare('RPS-RT-1', 'RPS-RT-10')).to.eql(-1)
  })
  it('compare with mixed prefix', function () {
    expect(PUID.compare('RT-1', 'RPS-RT-1')).to.eql(-1)
    expect(PUID.compare('RPS-RT-1', 'RT-1')).to.eql(1)
  })
})