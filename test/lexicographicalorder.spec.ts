// import { LexicographicalOrder.ChapterNumber,ChapterNumberStyle, isRomanNumber } from '../src/LexicographicalOrder/LexicographicalOrder.ChapterNumber'
import {LexicographicalOrder } from '../src'
import { expect } from 'chai';
import { NumberStyle } from '../src/types';


describe('Module LexicographicalOrder', () => { 
  describe('ChatperNumber', () => {
    it('isRomanNumber', () => {
      expect(LexicographicalOrder.isRomanNumber('')).to.be.false
      expect(LexicographicalOrder.isRomanNumber('A')).to.be.false
      expect(LexicographicalOrder.isRomanNumber('C')).to.be.true
      expect(LexicographicalOrder.isRomanNumber('D')).to.be.true
      expect(LexicographicalOrder.isRomanNumber('I')).to.be.true
      expect(LexicographicalOrder.isRomanNumber('L')).to.be.true
      expect(LexicographicalOrder.isRomanNumber('M')).to.be.true
      expect(LexicographicalOrder.isRomanNumber('V')).to.be.true
      expect(LexicographicalOrder.isRomanNumber('X')).to.be.true
    })
    it('contruct empty LexicographicalOrder.ChapterNumber', () => { // the single test
      const cn = new LexicographicalOrder.ChapterNumber()
      expect(cn).to.be.an.instanceof(LexicographicalOrder.ChapterNumber)
      expect(cn.levels).to.equal(0)
      expect(cn.toString()).to.equal('')
    })
    it("construct LexicographicalOrder.ChapterNumber('1')", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1')
      expect(cn).to.be.an.instanceof(LexicographicalOrder.ChapterNumber)
      expect(cn.levels).to.equal(1)
      expect(cn.toString()).to.equal('1')
    })
    it("construct LexicographicalOrder.ChapterNumber('I')", () => {
      const cn = new LexicographicalOrder.ChapterNumber('I')
      expect(cn).to.be.an.instanceof(LexicographicalOrder.ChapterNumber)
      expect(cn.levels).to.equal(1)
      expect(cn.toString()).to.equal('I')
    })
    it("add()", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1')
      cn.add()
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.1')
    })
    it("add(start: 10)", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1')
      cn.add(10)
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.10')
    })
    it("add(style: Arabic)", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1')
      cn.add(NumberStyle.Arabic)
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.1')
    })
    it("add(style: Roman)", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1')
      cn.add(NumberStyle.Roman)
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.I')
    })
    it("add(style: RomanUpperCase)", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1')
      cn.add(NumberStyle.RomanUpperCase)
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.I')
    })
    it("add(style: RomanLowerCase)", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1')
      cn.add(NumberStyle.RomanLowerCase)
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.i')
    })
    it("add(start: 5, style: RomanUpperCase)", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1')
      cn.add(NumberStyle.RomanUpperCase, 5)
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.V')
    })
    it("add(start: 10, style: RomanLowerCase)", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1')
      cn.add(NumberStyle.RomanLowerCase, 10)
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.x')
    })
    it("inc()", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1')
      cn.inc()
      expect(cn.toString()).to.equal('2')
    })
    it("inc(2)", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1')
      cn.inc(2)
      expect(cn.toString()).to.equal('3')
    })
    it("dec()", () => {
      let cn = new LexicographicalOrder.ChapterNumber('1')
      cn.dec()
      expect(cn.toString()).to.equal('0')
      cn.dec()
      expect(cn.toString()).to.equal('0')
      cn = new LexicographicalOrder.ChapterNumber('I')
      cn.dec()
      expect(cn.toString()).to.equal('I')
      cn.dec()
      expect(cn.toString()).to.equal('I')
    })
    it("dec(2)", () => {
      const cn = new LexicographicalOrder.ChapterNumber('3')
      cn.dec(2)
      expect(cn.toString()).to.equal('1')
    })
    it("construct LexicographicalOrder.ChapterNumber('1.1')", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1.1')
      expect(cn).to.be.an.instanceof(LexicographicalOrder.ChapterNumber)
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.1')
    })
    it("add()", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1.1')
      cn.add()
      expect(cn.levels).to.equal(3)
      expect(cn.toString()).to.equal('1.1.1')
    })
    it("remove()", () => {
      const cn = new LexicographicalOrder.ChapterNumber('1.1.1')
      cn.remove()
      expect(cn.levels).to.equal(2)
      expect(cn.toString()).to.equal('1.1')
    })
    it("comapre('1', '1')", () => {
      const a = new LexicographicalOrder.ChapterNumber('1')
      const b = new LexicographicalOrder.ChapterNumber('1')
      expect(a.compare(b)).to.equal(0)
      expect(a.isEqual(b)).to.be.true
      expect(a.isGreater(b)).to.be.false
      expect(a.isLess(b)).to.be.false
    })
    it("compare('1', 'I')", () => {
      const a = new LexicographicalOrder.ChapterNumber('1')
      const b = new LexicographicalOrder.ChapterNumber('I')
      expect(a.compare(b)).to.equal(0)
      expect(a.isEqual(b)).to.be.true
      expect(a.isGreater(b)).to.be.false
      expect(a.isLess(b)).to.be.false
    })
    it("compare('1', '2')", () => {
      const a = new LexicographicalOrder.ChapterNumber('1')
      const b = new LexicographicalOrder.ChapterNumber('2')
      expect(a.compare(b)).to.equal(-1)
      expect(a.isEqual(b)).to.be.false
      expect(a.isGreater(b)).to.be.false
      expect(a.isLess(b)).to.be.true
    })
    it("compare('1', 'II')", () => {
      const a = new LexicographicalOrder.ChapterNumber('1')
      const b = new LexicographicalOrder.ChapterNumber('II')
      expect(a.compare(b)).to.equal(-1)
      expect(a.isEqual(b)).to.be.false
      expect(a.isGreater(b)).to.be.false
      expect(a.isLess(b)).to.be.true
    })
    it("compare('2', ('1')", () => {
      const a = new LexicographicalOrder.ChapterNumber('2')
      const b = new LexicographicalOrder.ChapterNumber('1')
      expect(a.compare(b)).to.equal(1)
      expect(a.isEqual(b)).to.be.false
      expect(a.isGreater(b)).to.be.true
      expect(a.isLess(b)).to.be.false
    })
    it("compare('II', '1')", () => {
      const a = new LexicographicalOrder.ChapterNumber('II')
      const b = new LexicographicalOrder.ChapterNumber('1')
      expect(a.compare(b)).to.equal(1)
      expect(a.isEqual(b)).to.be.false
      expect(a.isGreater(b)).to.be.true
      expect(a.isLess(b)).to.be.false
    })
  })
});