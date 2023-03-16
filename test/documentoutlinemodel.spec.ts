// import { expect } from 'chai';
// import {DataModel, Uuid } from '../src'
// import { DocumentOutlineNodeStatus } from '../src/DataModel/documentoutlinemodel';
// import { IChapter } from '../src/ReportGenerator/types'

// describe('Module DataModel', () => { 
//   describe('DocumentOutlineModel', () => {
//     let chapters: IChapter[]
//     before(function() {
//       chapters = [
//         { uuid: Uuid.generate(), number: '1' } as IChapter,
//         { uuid: Uuid.generate(), number: '1.1' } as IChapter
//       ]
      
//     })
//     it('constructor', function() {
//       let m = new DataModel.DocumentOutlineModel()
//       expect(m.nodes).to.have.length(0)
//       expect(m.chapters).to.be.an('array').and.to.have.length(0)
//       m = new DataModel.DocumentOutlineModel(chapters)
//       expect(m.nodes).to.have.length(1)
//       expect(m.chapters).to.be.an('array').and.to.have.length(2)
//     })
//     it('nodeByKey', function() {
//       const m = new DataModel.DocumentOutlineModel(chapters)
//       expect(m.nodeByKey(chapters[0].uuid)).not.to.be.null
//       expect(m.nodeByKey(chapters[1].uuid)).not.to.be.null
//     })

//     it ('addChapter', function() {
//       const m = new DataModel.DocumentOutlineModel()
//       const n = m.addChapter()
//       expect(n.model).to.be.equal(m)
//       expect(m.nodes).to.have.length(1)
//       expect(n.key).to.be.not.null
//       expect(n.parent).to.be.null
//       expect(n.status).to.be.equal(DocumentOutlineNodeStatus.ADDED)
//       expect(m.nodeByKey(n.key)).to.be.not.null
//     })

//     it ('update', function() {
//       const m = new DataModel.DocumentOutlineModel(chapters)
//       const n = m.nodeByKey(chapters[1].uuid)
//       expect(n.status).to.be.equal(DocumentOutlineNodeStatus.UNCHANGD)
//       const c = n.chapter
//       c.title = '123'
//       n.chapter = c
//       expect(n.status).to.be.equal(DocumentOutlineNodeStatus.MODIFIED)
//     })

//     it('isModified', function () {
//       let m = new DataModel.DocumentOutlineModel(chapters)
//       expect(m.isModified).to.be.false
//       m.addChapter()
//       expect(m.isModified).to.be.true
//       m = new DataModel.DocumentOutlineModel(chapters)
//       const p = m.nodeByKey(chapters[0].uuid)
//       const c = p.addChapter()
//       expect(m.isModified).to.be.true
//       c.remove()
//       expect(m.isModified).to.be.false
//     })
//   })
//   describe('DocumentOutlineModelNode', () => {
//     it ('addChapter', function() {
//       const m = new DataModel.DocumentOutlineModel()
//       const p = m.addChapter()
//       expect(p.hasCildren).to.be.false

//       const c = p.addChapter()
//       expect(p.hasCildren).to.be.true

//       expect(c.parent).to.be.equal(p.key)
//       expect(c.model).to.be.equal(m)
//       expect(m.nodes).to.have.length(1)
//       expect(m.chapters).to.have.length(2)
//     })

//     it('remove', function() {
//       const m = new DataModel.DocumentOutlineModel()
//       const n = m.addChapter()      
//       n.remove()
//       expect(m.nodes).to.have.length(0)
//       // expect(m.nodeByKey(uuid)).to.be.null
//     })

//     it ('treeUp', function () {
//       const m = new DataModel.DocumentOutlineModel()
//       const p = m.addChapter()
//       const c = p.addChapter()
//       expect(p.treeUp()).to.be.an('array').and.to.have.length(0)
//       const t = c.treeUp()
//       expect(t).to.be.an('array').and.to.have.length(1)
//       expect(t[0].key).to.be.equal(p.key)
//     })

//   })
// })
