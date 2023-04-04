// import { LexicographicalOrder.ChapterNumber,ChapterNumberStyle, isRomanNumber } from '../src/LexicographicalOrder/LexicographicalOrder.ChapterNumber'
import { LexicographicalOrder } from '../src'
import { expect } from 'chai';
import { NumberStyle } from '../src/types';


describe('Module LexicographicalOrder', () => {
  describe('NumberFactory', () => {
    it ('chapnum(1.1,2) -> 01.01', function(){
      expect(LexicographicalOrder.NumberFactory.build('chapnum(1.1,2)')).to.equal('01.01')
    })
    it('{chapter.number} = 1.2.3', function () {
      expect(LexicographicalOrder.NumberFactory.build('{chapter.number}', { "chapter.number": "1.2.3" })).to.equal('1.2.3')
    })
    it('{chapter.number}-{requirements.count} = 1.2.3-1', function () {
      expect(LexicographicalOrder.NumberFactory.build('{chapter.number}-{requirements.count}', { "chapter.number": "1.2.3", "requirements.count": 1 })).to.equal('1.2.3-1')
    })
    it('pad(val,length,char,pos)', function () {
      expect(LexicographicalOrder.NumberFactory.build("pad(1,3,'0','e')")).to.be.equal('100')
      expect(LexicographicalOrder.NumberFactory.build("pad(1,3,'0','s')")).to.be.equal('001')
    })
    it('padEnd(val,length,char)', function () {
      expect(LexicographicalOrder.NumberFactory.build("padEnd(1,3,'0')")).to.be.equal('100')
    })
    it('padStart(val,length,char)', function () {
      expect(LexicographicalOrder.NumberFactory.build("padStart(1,3,'0')")).to.be.equal('001')
    })
    it("counter(0,1) -> 0", function () {
      expect(LexicographicalOrder.NumberFactory.build("counter(0,1)")).to.be.equal('0')
    })
    it("counter(1,1) -> 1", function () {
      expect(LexicographicalOrder.NumberFactory.build("counter(1,1)")).to.be.equal('1')
    })
    it("counter(1,10) -> 10", function () {
      expect(LexicographicalOrder.NumberFactory.build("counter(1,10)")).to.be.equal('10')
    })
    it("counter(2,10) -> 20", function () {
      expect(LexicographicalOrder.NumberFactory.build("counter(2,10)")).to.be.equal('20')
    })
    it('chapnum({chapter.number},2) -> 01.02.03', function () {
      expect(LexicographicalOrder.NumberFactory.build('chapnum({chapter.number},2)', { "chapter.number": "1.2.3" })).to.equal('01.02.03')
    })
    // it("RePoSyD-{chapter.number}-padStart(1,3,0)", function () {
    //   expect(LexicographicalOrder.NumberFactory.build("RePoSyD-{chapter.number}-padStart(1,3,0)", { "chapter.number": "1.2.3" })).to.be.equal('RePoSyD-1.2.3-001')
    // })
    it('SYS-chapnum({chapter.number},2)-counter({requirements.count},10)', function () {
      expect(LexicographicalOrder.NumberFactory.build("SYS-chapnum({chapter.number},2)-counter({requirements.count},10)", {
        "chapter.number": "1.2.3",
        "requirements.count": 1
      })).to.be.equal('SYS-01.02.03-10')
    })
    it("SYS-chapnum({chapter.number},2)-counter({requirements.count},10,3,'0')", function () {
      expect(LexicographicalOrder.NumberFactory.build("SYS-chapnum({chapter.number},2)-counter({requirements.count},10,3,'0')", {
        "chapter.number": "1.2.3",
        "requirements.count": 1
      })).to.be.equal('SYS-01.02.03-010')
    })
    it('val', function() {
      expect(LexicographicalOrder.NumberFactory.build('{}', { })).to.be.equal('???')
      expect(LexicographicalOrder.NumberFactory.build('{val}', { val: '42'})).to.be.equal('42')
    })
  })

  describe('ChapterNumber', () => {
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