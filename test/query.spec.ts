import { expect } from 'chai';

import { QueryConditionOperator, IQueryDefinition, toURI, QueryConditionType } from '../src/Query';

describe('Query', function () {
  describe('toURI', function () {
    it('no conditions', function () {
      const d: IQueryDefinition = {
        conditions: [],
        match: 'and'
      }
      expect(toURI(d)).to.be.empty
    })
    it('<ddo.attr> eq <value>', function () {
      expect(toURI({
        conditions: [{
          subject: 'number',
          type: QueryConditionType.DDO,
          operator: QueryConditionOperator.EQUALTO,
          value: '101'
        }],
        match: 'and'
      })).to.be.equal("number eq '101'")
      expect(toURI({
        conditions: [{
          subject: 'number',
          type: QueryConditionType.DDO,
          operator: QueryConditionOperator.EQUALTO,
          value: 101
        }],
        match: 'and'
      })).to.be.equal("number eq 101")
    })
    it('contains(<ddo.attr>,<value>) eq true', function () {
      expect(toURI({
        conditions: [{
          subject: 'number',
          type: QueryConditionType.DDO,
          operator: QueryConditionOperator.CONTAINS,
          value: '-SUFFIX'
        }],
        match: 'and'
      })).to.be.equal("contains(number,'-SUFFIX') eq true")
    })
    it('endswith(<ddo.attr>,<value>) eq true', function () {
      expect(toURI({
        conditions: [{
          subject: 'number',
          type: QueryConditionType.DDO,
          operator: QueryConditionOperator.ENDSWITH,
          value: '-SUFFIX'
        }],
        match: 'and'
      })).to.be.equal("endswith(number,'-SUFFIX') eq true")
    })
    it('endswith(<ddo.attr>,<value>) eq false', function () {
      expect(toURI({
        conditions: [{
          subject: 'number',
          type: QueryConditionType.DDO,
          operator: QueryConditionOperator.ENDSNOTWITH,
          value: '-SUFFIX'
        }],
        match: 'and'
      })).to.be.equal("endswith(number,'-SUFFIX') eq false")
    })
    it('includedin(<ddo.attr>,[<value>]) eq true', function () {
      expect(toURI({
        conditions: [{
          subject: 'number',
          type: QueryConditionType.DDO,
          operator: QueryConditionOperator.INCLUDEDIN,
          value: ['101', '42']
        }],
        match: 'and'
      })).to.be.equal("includedin(number,['101','42']) eq true")
      expect(toURI({
        conditions: [{
          subject: 'number',
          type: QueryConditionType.DDO,
          operator: QueryConditionOperator.INCLUDEDIN,
          value: [101, 42]
        }],
        match: 'and'
      })).to.be.equal("includedin(number,[101,42]) eq true")
    })
    it('includedin(<ddo.attr>,<value>) eq true', function () {
      expect(toURI({
        conditions: [{
          subject: 'number',
          type: QueryConditionType.DDO,
          operator: QueryConditionOperator.STARTSWITH,
          value: 'PREFIX-'
        }],
        match: 'and'
      })).to.be.equal("startswith(number,'PREFIX-') eq true")
    })
    it('indexof(<ddo.attr>,<value>) eq 0', function () {
      expect(toURI({
        conditions: [{
          subject: 'number',
          type: QueryConditionType.DDO,
          operator: QueryConditionOperator.INDEXOF,
          value: '01.02.03'
        }],
        match: 'and'
      })).to.be.equal("indexof(number,'01.02.03') eq 0")
    })
    it('<ddo.prop> eq <value>', function () {
      expect(toURI({
        conditions: [{
          subject: '$id',
          type: QueryConditionType.DDO,
          operator: QueryConditionOperator.EQUALTO,
          value: 1
        }],
        match: 'and'
      })).to.be.equal('$id eq 1')
    })
    describe('links', function() {
      it ('<ddl-id>-><ddo-id> $counter eq <value>', function() {
        expect(toURI({
          conditions: [{
          subject: ['ddlid', 'ddoid', '$counter'],
          type: QueryConditionType.DDL,
          operator: QueryConditionOperator.EQUALTO,
          value: 1
        }],
        match: 'and'
      })).to.be.equal('ddlid->ddoid $counter eq 1')

      })
    })
  })
})
