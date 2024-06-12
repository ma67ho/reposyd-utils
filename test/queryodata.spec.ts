import { expect } from 'chai';

import { QueryConditionOperator, IQueryDefinition, toURI, QueryConditionType, toOData } from '../src/Query';

describe('Query', function () {
  describe('toOData', function () {
    it('should confition includedin', function() {
      const dd = {
        attributes: {
          priority: {}
        }
      }
      const d: IQueryDefinition = {
        conditions: [
          {
            operator: QueryConditionOperator.INCLUDEDIN,
            subject: "priority",
            type: QueryConditionType.DDO,
            value: [
              "mandatory",
            ],
          },
        ],
        match: "and",
      }
      expect(toOData(d, dd)).to.equal("priority in ('mandatory')")
    }) 
  })
})


