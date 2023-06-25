import { expect } from 'chai';
import {DataModel, Uuid } from '../src'
import { DocumentOutlineNodeState } from '../src/DataModel/documentoutlinemodel';
import { IChapter } from '../src/ReportGenerator/types'

describe('Module DataModel', () => { 
  describe('DocumentOutlineModel', () => {
    let chapters: IChapter[]
    before(function() {
      chapters = [
        { uuid: Uuid.generate(), number: '1' } as IChapter,
        { uuid: Uuid.generate(), number: '1.1' } as IChapter
      ]
      
    })
    it('constructor', function() {
      let m = new DataModel.DocumentOutlineModel()
      expect(m.nodes).to.have.length(0)
      expect(m.chapters).to.be.an('array').and.to.have.length(0)
      m = new DataModel.DocumentOutlineModel()
      m.read(chapters)
      expect(m.nodes).to.have.length(1)
      expect(m.chapters).to.be.an('array').and.to.have.length(2)
    })
    it('getNodeByKey', function() {
      const m = new DataModel.DocumentOutlineModel()
      m.read(chapters)
      expect(m.getNodeByKey(chapters[0].uuid)).not.to.be.null
      expect(m.getNodeByKey(chapters[1].uuid)).not.to.be.null
    })

    it ('add', function() {
      const m = new DataModel.DocumentOutlineModel()
      const n = m.add()
      // expect(n.model).to.be.equal(m)
      expect(m.nodes).to.have.length(1)
      expect(n.key).to.be.not.null
      expect(n.parent).to.be.null
      // expect(n.status).to.be.equal(DocumentOutlineNodeState.ADDED)
      expect(m.getNodeByKey(n.key)).to.be.not.null
    })

    it ('update', function() {
      const m = new DataModel.DocumentOutlineModel()
      m.read(chapters)
      const n = m.getNodeByKey(chapters[1].uuid)
      expect(n.status).to.be.equal(DocumentOutlineNodeState.UNCHANGD)
      const c = n.chapter
      c.title = '123'
      n.chapter = c
      expect(n.status).to.be.equal(DocumentOutlineNodeState.MODIFIED)
    })

    it('isModified', function () {
      let m = new DataModel.DocumentOutlineModel()
      m.read(chapters)
      expect(m.isModified).to.be.false
      m.add()
      expect(m.isModified).to.be.true
      m = new DataModel.DocumentOutlineModel()
      m.read(chapters)
      const p = m.getNodeByKey(chapters[0].uuid)
      const c = p.add()
      expect(m.isModified).to.be.true
      c.remove()
      expect(m.isModified).to.be.false
    })
  })
  describe('DocumentOutlineModelNode', () => {
    it.skip ('add', function() {
      // const m = new DataModel.DocumentOutlineModel()
      // const p = m.add()
      // expect(p.hasCildren).to.be.false

      // const c = p.add()
      // expect(p.hasCildren).to.be.true

      // expect(c.parent).to.be.equal(p.key)
      // expect(c.model).to.be.equal(m)
      // expect(m.nodes).to.have.length(1)
      // expect(m.chapters).to.have.length(2)
    })

    it.skip('remove', function() {
      // const m = new DataModel.DocumentOutlineModel()
      // const n = m.add()      
      // n.remove()
      // expect(m.nodes).to.have.length(0)
      // // expect(m.getNodeByKey(uuid)).to.be.null
    })

    it.skip ('treeUp', function () {
      // const m = new DataModel.DocumentOutlineModel()
      // const p = m.add()
      // const c = p.add()
      // expect(p.treeUp()).to.be.an('array').and.to.have.length(0)
      // const t = c.treeUp()
      // expect(t).to.be.an('array').and.to.have.length(1)
      // expect(t[0].key).to.be.equal(p.key)
    })

  })
})
