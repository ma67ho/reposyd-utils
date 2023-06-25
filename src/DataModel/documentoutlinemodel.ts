/* eslint-disable no-inner-declarations */
import { IChapter } from "../ReportGenerator/types";
import shasum from "shasum-object";
import Uuid from "../Uuid";
import LexicographicalOrder from "../LexicographicalOrder";

export enum DocumentOutlineNodeState {
  UNCHANGD = 0x00,
  MODIFIED = 0x01,
  ADDED = 0x02,
  REMOVED = 0x04,
  MOVED = 0x10,
}

// export interface IDocumentOutlineNode {
//   section: IChapter;
//   children: IDocumentOutlineNode[];
//   icon: string;
//   label: string;
//   level: number;
//   key: Uuid;
//   modified: boolean;
//   parent?: Uuid;
//   shasum?: string;
//   status: number;
// }

// function buildOutline(sections) {
//   const tree = [];
//   const parents = {};
//   sections.forEach((section) => {
//     const sn = new ChapterNumber(section.number || "");
//     const node: IDocumentOutlineNode = {
//       label: `${section.number} ${section.title}`,
//       children: [],
//       icon: "mdi-file-outline",
//       level: sn.levels,
//       modified: false,
//       status: DocumentOutlineNodeStatus.UNCHANGD,
//       section: section,
//       key: section.uuid,
//     };
//     if (sn.levels === 1) {
//       node.parent = null;
//       tree.push(node);
//     } else {
//       const psn = new ChapterNumber(section.number || "");
//       psn.remove();
//       if (psn.toString() !== "" && parents[psn.toString()]) {
//         node.parent = parents[psn.toString()].uuid;
//         parents[psn.toString()].children.push(node);
//       } else {
//         tree.push(node);
//       }
//     }
//     parents[section.number] = node;
//   });
//   return tree;
// }

// class DocumentOutlineNode {
//   private _chapter: IChapter
//   private _children: DocumentOutlineNode[]
//   private _model: DocumentOutlineModel
//   private _parent: Uuid
//   private _shasum: string
//   private _status: DocumentOutlineNodeStatus
//   constructor(model: DocumentOutlineModel, parent?: Uuid)
//   constructor(model: DocumentOutlineModel, chapter?: IChapter, parent?: Uuid)
//   constructor(model: DocumentOutlineModel, chapter?: IChapter | Uuid, parent?: Uuid) {
//     if (chapter === undefined && parent === undefined){
//       this._parent = null
//       this._chapter = Chapter.create()
//     } else if (chapter !== undefined && parent === undefined){
//       if (typeof chapter === 'string'){
//         this._parent = chapter
//       } else {
//         this._chapter = chapter
//         this._parent = null
//       }
//     } else {
//       this._chapter = chapter as IChapter
//       this._parent = parent
//     }
//     // this._chapter = chapter
//     this._children = []
//     this._model = model
//     // this._parent = parent
//     this._shasum = shasum(this._chapter)
//     this._status = DocumentOutlineNodeStatus.UNCHANGD
//     if (this._parent) {
//       const p = this._model.nodeByKey(this._parent);
//       if (p) {
//         p._children.push(this);
//       }
//     } else {
//       this._model.appendNode(this);
//     }
//   }

//   /**
//    * Adds a subchapter
//    *
//    * @param {IChapter} [chapter]
//    * @return {*}  {DocumentOutlineNode}
//    * @memberof DocumentOutlineNode
//    */
//   addChapter(chapter?: IChapter): DocumentOutlineNode{
//     const n = this.model.addChapter(this.key)
//     if (chapter){
//       n.update(chapter) 
//     }
//     return n
//   }

//   append(node: DocumentOutlineNode) {
//     this._children.push(node);
//   }

//   indexOf(node: DocumentOutlineNode): number {
//     return this._children.findIndex((x) => x.key === node.key);
//   }
//   /**
//    *
//    *
//    * @param {Uuid} [to]
//    * @memberof DocumentOutlineNode
//    */
//   moveTo(to?: Uuid) {
//     const p = this._model.nodeByKey(this._parent);
//     const t = this._model.nodeByKey(to);
//     if (p) {
//       const idx = p._children.findIndex((x) => x.key === this.key);
//       p._children.splice(idx, 1);
//     }
//     if (t) {
//       this._parent = t.key;
//       t._children.push(this);
//     } else {
//       this._parent = null;
//       this._model.appendNode(this);
//     }
//     this._status |= DocumentOutlineNodeStatus.MOVED;
//   }
//   /**
//    *
//    *
//    * @memberof DocumentOutlineNode
//    */
//   remove(): void {
//     while (this._children.length) {
//       const c = this._children[this._children.length - 1];
//       c.remove();
//     }
//     const p = this._model.nodeByKey(this._parent)
//     if (p) {
//       p.take(this._chapter.uuid)
//     }
//     this._model.removeNode(this);
//     this._model = null;
//     this._parent = null;
//   }

//   renumber(start?: string) {
//     const cn = new ChapterNumber(start || '1')
//     this._chapter.number = cn.toString()
//     cn.add()
//     for (let i = 0; i < this._children.length; i++) {
//       this._children[i].renumber(cn.toString())
//       cn.inc()
//     }
//     cn.remove();
//   }

//   sort() {
//     // for (let i = 0; i < this._children.length; i++) {
//     //   this._children[i].sort()
//     // }
//     this._children.sort((a, b) =>
//       ChapterNumber.compare(a.chapter.number, b.chapter.number)
//     );
//   }

//   take(key: Uuid): DocumentOutlineNode {
//     const idx = this._children.findIndex((x) => x.key === key);
//     if (idx === -1) {
//       return null;
//     }
//     const n = this._children.splice(idx, 1)[0];
//     n._parent = null;
//     return n;
//   }
//   // 1.1.1 -> 1.1 -> 1
//   // 1
//   treeUp(): DocumentOutlineNode[] {
//     const t:DocumentOutlineNode[] = [];
//     const m = this._model
//     function up(n) {
//       const p = m.nodeByKey(n.parent)
//       if (p) {
//         t.push(p)
//         up(p)
//       }
//     }
//     up(this)
//     return t
//   }

//   get description(): string {
//     return this._chapter.description;
//   }
//   set description(val: string) {
//     this._chapter.description = val;
//     this.updateFlags();
//   }

//   update(chapter: IChapter){
//     if (chapter.uuid === this._chapter.uuid){
//       this._chapter = chapter
//       this._shasum = shasum(this._chapter)
//       this._status = DocumentOutlineNodeStatus.UNCHANGD
//     }
//   }

//   get hasCildren(): boolean {
//     return this._children.length > 0;
//   }

//   get index(): number {
//     const p = this._parent ? this._model.nodeByKey(this.key) : null;
//     if (p) {
//       p.indexOf(this);
//     } else {
//       return this.model.indexOf(this);
//     }
//   }

//   get isModified(): boolean {
//     return this._shasum !== shasum(this._chapter);
//   }

//   get lastChildNode(): DocumentOutlineNode {
//     if (this._children.length === 0) {
//       return null;
//     }
//     return this._children[this._children.length - 1];
//   }

//   get model(): DocumentOutlineModel {
//     return this._model;
//   }

//   get number(): string {
//     return this._chapter.number;
//   }
//   set number(val: string) {
//     if (this._chapter.number !== val) {
//       const cn = new ChapterNumber(val);
//       cn.add();
//       for (const child of this._children) {
//         child.number = cn.toString();
//       }
//     }
//     this._chapter.number = val;
//     this.updateFlags();
//   }

//   get section(): IChapter {
//     return this._chapter;
//   }

//   get selectable(): boolean {
//     return true;
//   }

//   get title(): string {
//     return this._chapter.title;
//   }
//   set title(val: string) {
//     this._chapter.title = val;
//     this.updateFlags();
//   }

//   get chapter(): IChapter {
//     return this._chapter;
//   }
//   set chapter(val: IChapter) {
//     if (this._status !== DocumentOutlineNodeStatus.ADDED){
//       if (this._shasum !== shasum(val)) {
//         this._status = DocumentOutlineNodeStatus.MODIFIED
//       } else {
//         this._status = DocumentOutlineNodeStatus.UNCHANGD
//       }
//     }
//     this._chapter = val
//   }

//   get children(): DocumentOutlineNode[] {
//     return this._children;
//   }
//   set children(val: DocumentOutlineNode[]) {
//     this._children = val;
//   }

//   get key(): Uuid {
//     return this._chapter.uuid;
//   }

//   get label(): string {
//     return `${this._chapter.number} ${this._chapter.title}`;
//   }

//   get parent(): Uuid {
//     return this._parent;
//   }
//   private updateFlags() {
//     if (this._shasum !== shasum(this._chapter)) {
//       this._status |= DocumentOutlineNodeStatus.MODIFIED;
//     } else {
//       this._status = this._status & ~DocumentOutlineNodeStatus.MODIFIED;
//     }
//   }

//   get status(): DocumentOutlineNodeStatus {
//     return this._status
//   }
//   set status(v: DocumentOutlineNodeStatus) {
//     this._status = v
//   }
// }

// class DocumentOutlineModel {
//   private _chapters: IChapter[]
//   private _eventHandler: Record<string,any[]>
//   private _nodes: DocumentOutlineNode[]
//   private _removedNodes: DocumentOutlineNode[]
//   constructor(chapters?) {
//     this._chapters = []
//     this._eventHandler = {}
//     this._nodes = []
//     this._removedNodes = []
//     if (chapters) {
//       this.buildModel(chapters);
//     }
//   }

//   /**
//    *
//    *
//    * @param {Uuid} [parent]
//    * @return {*}  {DocumentOutlineNode}
//    * @memberof DocumentOutlineModel
//    */
//   addChapter(parent?: Uuid): DocumentOutlineNode {
//     const p = this.nodeByKey(parent);
//     const c = Chapter.create();

//     let cn;
//     if (p) {
//       if (p.children.length === 0) {
//         cn = new ChapterNumber(p.chapter.number);
//         cn.add();
//       } else {
//         cn = new ChapterNumber(
//           p.children[p.children.length - 1].chapter.number
//         );
//         cn.inc();
//       }
//     } else {
//       if (this._nodes.length === 0) {
//         cn = new ChapterNumber("0");
//       } else {
//         cn = new ChapterNumber(
//           this._nodes[this._nodes.length - 1].chapter.number
//         );
//       }
//       cn.inc();
//     }
//     c.number = cn.toString()
//     const n = new DocumentOutlineNode(this, c, p ? p.key : undefined)
//     n.status = DocumentOutlineNodeStatus.ADDED
//     this.callEventHandler('modified', this)
//     return n
//   }

//   appendNode(node: DocumentOutlineNode) {
//     this._nodes.push(node);
//   }

//   indexOf(node: DocumentOutlineNode): number {
//     return this._nodes.findIndex((x) => x.key === node.key);
//   }

//   get modifiedChapters(): IChapter[] {
//     const l = []
//     function check(node: DocumentOutlineNode){
//       if (node.status === DocumentOutlineNodeStatus.ADDED || node.status === DocumentOutlineNodeStatus.MODIFIED){
//         l.push(node.chapter)
//       }
//       for(let i = 0; i < node.children.length; i++){
//         check(node.children[i])
//       }
//     }
//     for (let i = 0; i < this._nodes.length; i++){
//       check(this._nodes[i])
//     }
//     return l
//   }

//   nodeByChapterNumber(number: string): DocumentOutlineNode {
//     if (!number) {
//       return null;
//     }
//     for (const node of this._nodes) {
//       const n = (function f(n) {
//         if (n.chapter.number === number) {
//           return n;
//         }
//         for (const c of n.children) {
//           const n = f(c);
//           if (n) {
//             return n;
//           }
//         }
//       })(node);
//       if (n) {
//         return n;
//       }
//     }
//     return null;
//   }

//   nodeByKey(key: Uuid): DocumentOutlineNode {
//     if (!key) {
//       return null;
//     }
//     for (const node of this._nodes) {
//       const n = (function f(n) {
//         if (n.key === key) {
//           return n;
//         }
//         for (const c of n.children) {
//           const n = f(c);
//           if (n) {
//             return n;
//           }
//         }
//       })(node);
//       if (n) {
//         return n;
//       }
//     }
//     return null;
//   }

//   on(event: string, callback: any){
//     if (!this._eventHandler[event]){
//       this._eventHandler[event] = []
//     }
//     this._eventHandler[event].push(callback)
//   }

//   read(chapters): void {
//     this.buildModel(chapters);
//   }

//   removeNode(node: DocumentOutlineNode): void {
//     const idx = this._nodes.findIndex(x => x.key === node.key)
//     if (idx === -1) {
//       return
//     }
//     this._chapters.splice(idx, 1);
//     const p = this.nodeByKey(node.parent);
//     if (p) {
//       //   const c = node.take(node.key)
//       //   this._removedNodes.push(c)
//     } else {
//       const idx = this._nodes.findIndex((x) => x.key === node.key);
//       this._removedNodes.push(node);
//       this._nodes.splice(idx, 1);
//     }
//     this._removedNodes.push(node);
//     this.callEventHandler('modified', this)
//   }

//   private buildModel(chapters) {
//     this._chapters = chapters;
//     this._nodes = [];
//     for (const chapter of chapters) {
//       const cn = new ChapterNumber(chapter.number || "");
//       if (cn.levels === 1) {
//         new DocumentOutlineNode(this, chapter);
//         // this._nodes.push(new DocumentOutlineNode(chapter))
//       } else {
//         const pcn = new ChapterNumber(chapter.number || "");
//         pcn.remove();
//         const p = this.nodeByChapterNumber(pcn.toString());
//         if (p) {
//           new DocumentOutlineNode(this, chapter, p.key);
//         } else {
//           new DocumentOutlineNode(this, chapter);
//         }
//       }
//     }
//   }

//   renumber(start?: string) {
//     const cn = new ChapterNumber(start || '1')
//     for (let i = 0; i < this._nodes.length; i++) {
//       this._nodes[i].renumber(cn.toString())
//       cn.inc()
//     }
//   }

//   sort(descending): void {
//     this._nodes.sort(
//       (a, b) =>
//         ChapterNumber.compare(a.chapter.number, b.chapter.number) *
//         (descending ? -1 : 1)
//     );
//   }

//   update(chapter: IChapter) {
//     const n = this.nodeByKey(chapter.uuid);
//     if (!n) {
//       throw new RangeError(`node ${chapter.uuid} not found`);
//     }
//     if (n.status & DocumentOutlineNodeStatus.REMOVED) {
//       const idx = this._removedNodes.findIndex((x) => x.key === chapter.uuid);
//       this._removedNodes.splice(idx, 1);
//     } else {
//       const idx = this._chapters.findIndex((x) => x.uuid === chapter.uuid);
//       this._chapters[idx] = chapter;
//       n.update(this._chapters[idx]);
//     }
//   }

//   get chapters() {
//     const l = []
//     function down(n){
//       l.push(n)
//       for (const child of n.children) {
//         down(child)
//       }
//     }
//     for (const node of this._nodes){
//       down(node)
//     }
//     return l
//   }

//   get changes(): DocumentOutlineNode[] {
//     let l = [];
//     for (const node of this._nodes) {
//       const c = (function f(n) {
//         let l = [];

//         if (n.isModified) {
//           l.push(n);
//         }
//         for (const child of n.children) {
//           l = l.concat(f(child));
//         }
//         return l;
//       })(node);
//       l = l.concat(c);
//     }
//     return l;
//   }

//   // update(chapter: IChapter){
//   //   const n = this.nodeByKey(chapter.uuid)
//   //   if (n){
//   //     n.update(chapter)
//   //   }
//   // }

//   get isModified(): boolean {
//     function follow(node){
//       if (node.status !== DocumentOutlineNodeStatus.UNCHANGD){
//         return true
//       }
//       for (let i = 0; i < node.children.length; i++){
//         if (follow(node.children[i])){
//           return true
//         }
//       }
//       return false
//     }
//     for (let i = 0; i < this._nodes.length; i++){
//       if(follow(this._nodes[i])){
//         return true
//       }
//     }
//     return false
//   }

//   get nodes() {
//     return this._nodes;
//   }

//   private callEventHandler(event: string, props?: any) {
//     const callbacks = this._eventHandler[event] || []
//     for (let i = 0; i < callbacks.length; i++){
//       callbacks[i](props)
//     }
//   }

// }

class DocumentOutlineNode {
  private _chapter: IChapter
  private _children: DocumentOutlineNode[]
  private _parent: DocumentOutlineNode
  private _shasum: string
  private _state: DocumentOutlineNodeState
  constructor(chapter: IChapter, parent?: DocumentOutlineNode) {
    this._children = []
    this._parent = parent
    this._shasum = chapter ? shasum(chapter) : null
    this._state = 0

    if (chapter) {
      this._chapter = chapter
    } else {
      this._chapter = {
        cm: {
          modifiedby: null,
          owner: {
            uuid: null
          },
          revision: -1,
          shared: [],
          timestamp: null,
        },
        description: '',
        number: '',
        options: {
          pagebreak: 'none'
        },
        script: {
          id: null,
          uuid: null,
          options: {}
        },
        title: '',
        uuid: Uuid.generate()
      }
    }
  }

  get chapter() {
    return this._chapter
  }

  set chapter(v) {
    this._chapter = v
  }

  get children() {
    return this._children
  }

  get key() {
    return this._chapter.uuid
  }

  get parent() {
    return this._parent
  }

  set parent(v) {
    this._parent = v
  }

  get state() {
    return this._state
  }

  set state(v) {
    this._state = v
  }
}

class DocumentOutlineModel {
  private _chapters: IChapter[]
  private _nodes: DocumentOutlineNode[]
  constructor() {
    this._chapters = []
    this._nodes = []
  }

  add(parent?: string) {
    const uuid = Uuid.generate()
    const p = this.getNodeByKey(parent)
    const n = new DocumentOutlineNode({
      cm: {
        modifiedby: null,
        owner: null,
        revision: -1,
        shared: [],
        timestamp: null
      },
      description: '',
      number: '',
      options: {
        pagebreak: 'none'
      },
      script: {
        id: null,
        uuid: null,
        options: {}
      },
      title: '',
      uuid: uuid
    })
    if (p !== undefined) {
      const pn = new LexicographicalOrder.ChapterNumber(p.chapter.number)
      pn.add()
      if (p.children.length > 0) {
        pn.inc()
      }
      n.chapter.number = pn.toString()
      this._chapters.push(n.chapter)
      p.children.push(n)
    } else {
      n.chapter.number = this.nodes.length === 0 ? '1' : (this.nodes.length + 1).toString()
      this._chapters.push(n.chapter)
      this._nodes.push(n)
    }
    return n
  }

  getNodeByNumber(number) {
    function follow(n) {
      if (n.chapter?.number === number) {
        return n
      }
      for (const c of (Array.isArray(n) ? n : n.children)) {
        const r = follow(c)
        if (r) {
          return r
        }
      }
      return null
    }
    if (!number) {
      return null
    }
    return follow(this.nodes)
  }

  getNodeByKey(key) {
    function follow(n) {
      if (n.key === key) {
        return n
      }
      for (const c of (Array.isArray(n) ? n : n.children)) {
        const r = follow(c)
        if (r) {
          return r
        }
      }
      return null
    }
    if (!key) {
      return null
    }
    return follow(this.nodes)
  }

  markAsDeleted(key, mode) {
    const node = this.getNodeByKey(key)
    if (!node) {
      return
    }
    if (mode === undefined || mode === 'node' || mode === 'nodeandchildren') {
      node.state |= 0x02
    }
    if (mode === 'children' || mode === 'nodeandchildren') {
      function mark(n: { state: number; children: DocumentOutlineNode[]; }): void {
        n.state |= 0x02
        for (const c of n.children) {
          mark(c)
        }
      }
      for (const c of node.children) {
        mark(c)
      }
    }
  }

  markAsModified(key, on) {
    const n = this.getNodeByKey(key)
    if (!n) {
      return
    }
    if (on === undefined) {
      if (n.shasum !== shasum(n.chapter)) {
        n.state |= 0x01
      } else {
        n.state &= ~0x01
      }
    } else if (on) {
      n.state |= 0x01
    } else {
      n.state &= ~0x01
    }
  }

  moveByNumber(key, number) {
    const n = this.getNodeByKey(key)
    if (!n) {
      return
    }
    const nn = new LexicographicalOrder.ChapterNumber(number)
    nn.remove()
    const cp = this.getNodeByKey(n.parent)
    const np = this.getNodeByNumber(nn.toString())
    const npk = np ? np.key : null
    if (npk === n.parent) {
      return null
    }
    if (cp) {
      cp.children.splice(cp.children.findIndex(x => x.key === n.key), 1)
    } else {
      this.nodes.splice(this.nodes.findIndex(x => x.key === n.key), 1)
    }
    if (npk) {
      n.parent = npk
      np.children.push(n)
    } else {
      n.parent = null
      this._nodes.push(n)
    }
    return npk
  }

  read(chapters) {
    this._chapters = chapters
    const pmap = {}
    this._nodes = []
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i]
      // const n = {
      //   chapter: chapter,
      //   children: [],
      //   key: chapter.uuid,
      //   modified: false,
      //   parent: null,
      //   shasum: shasumObject(chapter),
      //   status: 0
      // }
      const n = new DocumentOutlineNode(chapter)
      const pn = new LexicographicalOrder.ChapterNumber(chapter.number)
      pmap[pn.toString()] = n
      if (pn.levels < 2) {
        this._nodes.push(n)
      } else {
        pn.remove()
        const p = pmap[pn.toString()]
        if (p) {
          p.children.push(n)
          n.parent = p.key
        }
      }
    }
  }

  remove(key) {
    const n = this.getNodeByKey(key)
    if (!n) {
      return
    }
    const p = this.getNodeByKey(n.parent)
    if (!p) {
      this._nodes.splice(this._nodes.findIndex(x => x.key === key), 1)
    } else {
      p.children.splice(p.children.findIndex(x => x.key === key), 1)
    }
    this.chapters.splice(this.chapters.findIndex(x => x.uuid === key), 1)
  }

  set(chapter) {
    const n = this.getNodeByKey(chapter.uuid)
    if (!n) {
      return
    }
    n.chapter = chapter
    if (n._shasum !== shasum(n.chapter)) {
      n.state |= 0x01
    } else {
      n.state &= ~0x01
    }
  }

  update(chapter) {
    const n = this.getNodeByKey(chapter.uuid)
    if (!n) {
      return
    }
    n.chapter = chapter
    n.shasum = shasum(n.chapter)
    n.state = 0
  }

  get changes() {
    const l = []
    function follow(n) {
      if (n.state === 0x01) {
        l.push(n.key)
      } else if (n.state === 0x02) {
        l.unshift(n.key)
      }
      for (const c of n.children) {
        follow(c)
      }
    }
    for (const c of this._nodes) {
      follow(c)
    }
    return l
  }

  get chapters() {
    return this._chapters
  }

  get isModified() {
    function follow(n) {
      if (typeof n === 'object') {
        if (n.state !== 0) {
          return true
        }
      }
      for (const c of Array.isArray(n) ? n : n.children) {
        const r = follow(c)
        if (r) {
          return true
        }
      }
      return false
    }
    return follow(this.nodes)
  }

  get nodes() {
    return this._nodes
  }
}

export default DocumentOutlineModel;
