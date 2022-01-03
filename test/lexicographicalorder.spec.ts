import { ChapterNumber,ChapterNumberStyle, isRomanNumber } from '../src/LexicographicalOrder/ChapterNumber'
import { expect } from 'chai';

describe('Module LexicographicalOrder', () => { 
  describe('ChaperNumber', () => {
    it('isRomanNumber', () => {
      expect(isRomanNumber('')).to.be.false
      expect(isRomanNumber('A')).to.be.false
      expect(isRomanNumber('C')).to.be.true
      expect(isRomanNumber('D')).to.be.true
      expect(isRomanNumber('I')).to.be.true
      expect(isRomanNumber('L')).to.be.true
      expect(isRomanNumber('M')).to.be.true
      expect(isRomanNumber('V')).to.be.true
      expect(isRomanNumber('X')).to.be.true
    })
    it('contruct empty ChapterNumber', () => { // the single test
      const cn = new ChapterNumber()
      expect(cn).to.be.an.instanceof(ChapterNumber)
      expect(cn.levels).to.equal(0)
      expect(cn.toString()).to.equal('')
    })
    it("construct ChapterNumber('1')", () => {
      const cn = new ChapterNumber('1')
      expect(cn).to.be.an.instanceof(ChapterNumber)
      expect(cn.levels).to.equal(1)
      expect(cn.toString()).to.equal('1')
    })
    it("construct ChapterNumber('I')", () => {
      const cn = new ChapterNumber('I')
      expect(cn).to.be.an.instanceof(ChapterNumber)
      expect(cn.levels).to.equal(1)
      expect(cn.toString()).to.equal('I')
    })
    it("ChapterNumber('1') - add()", () => {
      const cn = new ChapterNumber('1')
      cn.add()
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.1')
    })
    it("ChapterNumber('1') - add(ChapterNumberStyle.Arabic)", () => {
      const cn = new ChapterNumber('1')
      cn.add(ChapterNumberStyle.Arabic)
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.1')
    })
    it("ChapterNumber('I') - add(ChapterNumberStyle.Roman)", () => {
      const cn = new ChapterNumber('1')
      cn.add(ChapterNumberStyle.Roman)
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.I')
    })
    it("ChapterNumber('I') - inc()", () => {
      const cn = new ChapterNumber('1')
      cn.inc()
      expect(cn.toString()).to.equal('2')
    })
    it("ChapterNumber('I') - inc(2)", () => {
      const cn = new ChapterNumber('1')
      cn.inc(2)
      expect(cn.toString()).to.equal('3')
    })
    it("ChapterNumber('I') - dec()", () => {
      let cn = new ChapterNumber('1')
      cn.dec()
      expect(cn.toString()).to.equal('0')
      cn.dec()
      expect(cn.toString()).to.equal('0')
      cn = new ChapterNumber('I')
      cn.dec()
      expect(cn.toString()).to.equal('I')
      cn.dec()
      expect(cn.toString()).to.equal('I')
    })
    it("ChapterNumber('I') - dec(2)", () => {
      const cn = new ChapterNumber('3')
      cn.dec(2)
      expect(cn.toString()).to.equal('1')
    })
    it("construct ChapterNumber('1.1')", () => {
      const cn = new ChapterNumber('1.1')
      expect(cn).to.be.an.instanceof(ChapterNumber)
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.1')
    })
    it("ChapterNumber('1.1') - add()", () => {
      const cn = new ChapterNumber('1.1')
      cn.add()
      expect(cn.levels).to.equal(3)
      expect(cn.toString()).to.equal('1.1.1')
    })
    it("ChapterNumber('1.1.1') - remove()", () => {
      const cn = new ChapterNumber('1.1.1')
      cn.remove()
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.1')
    })
    it("ChapterNumber('1') === ChapterNumber('1')", () => {
      const a = new ChapterNumber('1')
      const b = new ChapterNumber('1')
      expect(a.compare(b)).to.equal(0)
      expect(a.isEqual(b)).to.be.true
      expect(a.isGreater(b)).to.be.false
      expect(a.isLess(b)).to.be.false
    })
    it("ChapterNumber('1') === ChapterNumber('I')", () => {
      const a = new ChapterNumber('1')
      const b = new ChapterNumber('I')
      expect(a.compare(b)).to.equal(0)
      expect(a.isEqual(b)).to.be.true
      expect(a.isGreater(b)).to.be.false
      expect(a.isLess(b)).to.be.false
    })
    it("ChapterNumber('1') < ChapterNumber('2')", () => {
      const a = new ChapterNumber('1')
      const b = new ChapterNumber('2')
      expect(a.compare(b)).to.equal(-1)
      expect(a.isEqual(b)).to.be.false
      expect(a.isGreater(b)).to.be.false
      expect(a.isLess(b)).to.be.true
    })
    it("ChapterNumber('1') < ChapterNumber('II')", () => {
      const a = new ChapterNumber('1')
      const b = new ChapterNumber('II')
      expect(a.compare(b)).to.equal(-1)
      expect(a.isEqual(b)).to.be.false
      expect(a.isGreater(b)).to.be.false
      expect(a.isLess(b)).to.be.true
    })
    it("ChapterNumber('2') > ChapterNumber('1')", () => {
      const a = new ChapterNumber('2')
      const b = new ChapterNumber('1')
      expect(a.compare(b)).to.equal(1)
      expect(a.isEqual(b)).to.be.false
      expect(a.isGreater(b)).to.be.true
      expect(a.isLess(b)).to.be.false
    })
    it("ChapterNumber('II') > ChapterNumber('1')", () => {
      const a = new ChapterNumber('II')
      const b = new ChapterNumber('1')
      expect(a.compare(b)).to.equal(1)
      expect(a.isEqual(b)).to.be.false
      expect(a.isGreater(b)).to.be.true
      expect(a.isLess(b)).to.be.false
    })
  })
});