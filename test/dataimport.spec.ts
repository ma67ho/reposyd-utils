import { DataImport } from '../src';
import { expect } from 'chai';
describe('DataImport', function() {
  describe('mapColumns', function () {
    it('', function() {
      //
    })
  })
  describe('plainText2html', function() {
    it('simple text', function(){
      const t = DataImport.plainText2html('hello world')
      expect(t).to.be.equal('hello world')
    })
    it('formatted text', function(){
      const t = DataImport.plainText2html('hello <world>')
      expect(t).to.be.equal('hello &lt;world&gt;')
    })
    it('line break', function() {
      const t = DataImport.plainText2html('hello\nworld')
      expect(t).to.be.equal('hello<br>world')
    })
  })
})