import { DataImport } from '../src';
import { expect } from 'chai';
import { ITransformValueSplit } from '../src/DataImport';

describe('DataImport', function () {
  describe('ValueTransformation', function () {
    it.skip('split by string', function () {
      //
    })
    it('split (regexp)', function () {
      const vt = new DataImport.ValueTransformation()
      vt.split('\r\n', 0)
      expect(vt.transform('1\r\n2')).to.eql('1')
      const fn = vt.at(0) as ITransformValueSplit
      fn.index = 1
      expect(vt.transform('1\r\n2')).to.eql('2')
    })
  })
})