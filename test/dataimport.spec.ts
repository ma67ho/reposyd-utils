import { DataImport } from '../src';
import { expect } from 'chai';
import Rules, { DataImportRuleType, TDataImportCounter } from '../src/DataImport/Rules';
describe('DataImport', function () {
  describe('mapColumns', function () {
    it('', function () {
      //
    })
  })
  describe('plainText2html', function () {
    it('simple text', function () {
      const t = DataImport.plainText2html('hello world')
      expect(t).to.be.equal('hello world')
    })
    it('formatted text', function () {
      const t = DataImport.plainText2html('hello <world>')
      expect(t).to.be.equal('hello &lt;world&gt;')
    })
    it('line break', function () {
      const t = DataImport.plainText2html('hello\nworld')
      expect(t).to.be.equal('hello<br>world')
    })
  })
  describe('sanitizedObjectKeys', function () {
    it('from object', function () {
      const d = {
        key: '123',
        nested: {
          key: '456'
        }
      }
      const keys = DataImport.sanitizedObjectKeys(d)
      expect(keys).to.be.an('array').and.to.have.lengthOf(2)
      expect(keys).to.include('key')
      expect(keys).to.include('nested.key')
    })
    it('from array', function () {
      const d = [
        {
          key: '123',
          nested: {
            key: '456'
          }
        },
        {
          key: '123',
          nested: {
            key: '456',
            value: 789
          }
        }
      ]
      const keys = DataImport.sanitizedObjectKeys(d)
      expect(keys).to.be.an('array').and.to.have.lengthOf(3)
      expect(keys).to.include('key')
      expect(keys).to.include('nested.key')
      expect(keys).to.include('nested.value')
    })
  })
  describe('Rules', function () {
    const rows = [
      ['A', 'B', 'C']
    ]
    describe('counter', function () {
      it('increaseby', function () {
        const counter: TDataImportCounter = { defined: 10 }
        Rules.counter([], { enabled: true, action: 'increaseby', conditions: [], match: 'none', name: 'defined', value: 10, type: DataImportRuleType.Counter }, counter)
        expect(counter.defined).to.equal(20)
      })
      it('resetto', function () {
        const counter: TDataImportCounter = { defined: 0 }
        Rules.counter([], { enabled: true, action: 'resetto', conditions: [], match: 'none', name: 'defined', value: 10, type: DataImportRuleType.Counter }, counter)
        expect(counter.defined).to.equal(10)
        Rules.counter([], { enabled: true, action: 'resetto', conditions: [], match: 'none', name: 'new', value: 20, type: DataImportRuleType.Counter }, counter)
        expect(counter['new']).to.equal(20)
      })
    })
    it('omit - match all eq', function () {
      expect(Rules.omit(rows[0], { enabled: true, conditions: [{ column: 0, condition: 'eq', value: 'A' }], match: 'all', type: DataImportRuleType.Omit })).to.be.true
      expect(Rules.omit(rows[0], { enabled: true, conditions: [{ column: 0, condition: 'eq', value: 'A' }, { column: 1, condition: 'eq', value: 'A' }], match: 'all', type: DataImportRuleType.Omit })).to.be.false
    })
    it('omit - match all neq', function () {
      expect(Rules.omit(rows[0], { enabled: true, conditions: [{ column: 0, condition: 'neq', value: 'X' }], match: 'all', type: DataImportRuleType.Omit })).to.be.true
    })
    describe('omit match at least one', function () {
      const rows = [
        ['A', 'B', 'C'],
        ['C', 'B', 'A']
      ]
      it('eq', function () {
        expect(Rules.omit(rows[0], { enabled: true, conditions: [{ column: 0, condition: 'eq', value: 'A' }, { column: 1, condition: 'eq', value: 'B' }], match: 'atleastone', type: DataImportRuleType.Omit })).to.be.true
        expect(Rules.omit(rows[1], { enabled: true, conditions: [{ column: 0, condition: 'eq', value: 'A' }, { column: 1, condition: 'eq', value: 'B' }], match: 'atleastone', type: DataImportRuleType.Omit })).to.be.true
      })
      it('neq', function () {
        expect(Rules.omit(rows[0], { enabled: true, conditions: [{ column: 0, condition: 'neq', value: 'A' }, { column: 1, condition: 'eq', value: 'B' }], match: 'atleastone', type: DataImportRuleType.Omit })).to.be.true
        expect(Rules.omit(rows[1], { enabled: true, conditions: [{ column: 0, condition: 'neq', value: 'A' }, { column: 1, condition: 'eq', value: 'B' }], match: 'atleastone', type: DataImportRuleType.Omit })).to.be.true
      })
    })
    it('variable', function () {
      const vars = {}
      Rules.variable(rows[0], { enabled: true, conditions: [], column: 0, match: 'all', name: 'col0', type: DataImportRuleType.Variable }, vars)
      expect(vars).to.haveOwnProperty('col0')
      expect(vars['col0']).to.be.equal(rows[0][0])
    })
  })
})