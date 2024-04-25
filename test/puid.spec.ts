import { expect } from 'chai';

import { PUID } from '../src'

describe('PUID', function () {
  describe('compare', function () {
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
  describe('isPUID', function () {
    it('should return false for an undefined value', function () {
      expect(PUID.isPUID('')).to.be.false
    })
    it('should return false for an empty string', function () {
      expect(PUID.isPUID('')).to.be.false
    })
    it('should return false for a lowercase ddo type ', function() {
      expect(PUID.isPUID('rt-1')).to.be.false
    })
    it('should return false for am invalid ddo id (RT-1a) ', function() {
      expect(PUID.isPUID('RT-1a')).to.be.false
    })
    it('should return true for a uppercase ddo type ', function() {
      expect(PUID.isPUID('RT-1')).to.be.true
    })
    it('should return true for a PUID prefix with a - ', function() {
      expect(PUID.isPUID('te-st-RT-1')).to.be.false
    })
    it('should return true for a PUID with prefix ', function() {
      expect(PUID.isPUID('TEST-RT-1')).to.be.true
      expect(PUID.isPUID('(TEST)-RT-1')).to.be.true
      expect(PUID.isPUID('[TEST]-RT-1')).to.be.true
    })
    it ('should return false for a PUID with search pattern and option disabled', function() {
      expect(PUID.isPUID('test-RT-1_')).to.be.false
    })
    it('should return true for a PUID with search pattern and option enabled', function() {
      expect(PUID.isPUID('test-RT-1_', true)).to.be.true
    })
  })
})