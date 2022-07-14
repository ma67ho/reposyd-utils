import { IChapter } from "../ReportGenerator/types";
import ChapterNumber from "../LexicographicalOrder/chapternumber";
import Chapter from "../Chapter";
import { Uuid } from "../ObjectHelper/types";
import shasum from "shasum-object";

export enum DocumentOutlineNodeStatus {
  UNCHANGD = 0x00,
  MODIFIED = 0x01,
  ADDED = 0x02,
  REMOVED = 0x04,
  MOVED = 0x10,
}

export interface IDocumentOutlineNode {
  section: IChapter;
  children: IDocumentOutlineNode[];
  icon: string;
  label: string;
  level: number;
  key: Uuid;
  modified: boolean;
  parent?: Uuid;
  shasum?: string;
  status: number;
}

function buildOutline(sections) {
  const tree = [];
  const parents = {};
  sections.forEach((section) => {
    const sn = new ChapterNumber(section.number || "");
    const node: IDocumentOutlineNode = {
      label: `${section.number} ${section.title}`,
      children: [],
      icon: "mdi-file-outline",
      level: sn.levels,
      modified: false,
      status: DocumentOutlineNodeStatus.UNCHANGD,
      section: section,
      key: section.uuid,
    };
    if (sn.levels === 1) {
      node.parent = null;
      tree.push(node);
    } else {
      const psn = new ChapterNumber(section.number || "");
      psn.remove();
      if (psn.toString() !== "" && parents[psn.toString()]) {
        node.parent = parents[psn.toString()].uuid;
        parents[psn.toString()].children.push(node);
      } else {
        tree.push(node);
      }
    }
    parents[section.number] = node;
  });
  return tree;
}

class DocumentOutlineNode {
  private _chapter: IChapter;
  private _children: DocumentOutlineNode[];
  private _model: DocumentOutlineModel;
  private _parent: Uuid;
  private _shasum: string;
  private _status: DocumentOutlineNodeStatus;
  constructor(model: DocumentOutlineModel, chapter: IChapter, parent?: Uuid) {
    this._chapter = chapter;
    this._children = [];
    this._model = model;
    this._parent = parent;
    this._shasum = shasum(this._chapter);
    this._status = 0;
    if (this._parent) {
      const p = this._model.nodeByKey(this._parent);
      if (p) {
        p._children.push(this);
      }
    } else {
      this._model.appendNode(this);
    }
  }

  append(node: DocumentOutlineNode) {
    this._children.push(node);
  }

  indexOf(node: DocumentOutlineNode): number {
    return this._children.findIndex((x) => x.key === node.key);
  }
  /**
   *
   *
   * @param {Uuid} [to]
   * @memberof DocumentOutlineNode
   */
  moveTo(to?: Uuid) {
    const p = this._model.nodeByKey(this._parent);
    const t = this._model.nodeByKey(to);
    if (p) {
      const idx = p._children.findIndex((x) => x.key === this.key);
      p._children.splice(idx, 1);
    }
    if (t) {
      this._parent = t.key;
      t._children.push(this);
    } else {
      this._parent = null;
      this._model.appendNode(this);
    }
    this._status |= DocumentOutlineNodeStatus.MOVED;
  }
  /**
   *
   *
   * @memberof DocumentOutlineNode
   */
  remove(): void {
    while (this._children.length) {
      const c = this._children[this._children.length - 1];
      c.remove();
    }
    const p = this._model.nodeByKey(this._parent);
    if (p) {
      p.take(this._chapter.uuid);
    }
    this._model.removeNode(this);
    this._model = null;
    this._parent = null;
  }

  renumber(start?: string) {
    const cn = new ChapterNumber(start || "1");
    this._chapter.number = cn.toString();
    cn.add();
    for (let i = 0; i < this._children.length; i++) {
      this._children[i].renumber(cn.toString());
      cn.inc();
    }
    cn.remove();
  }

  sort() {
    // for (let i = 0; i < this._children.length; i++) {
    //   this._children[i].sort()
    // }
    this._children.sort((a, b) =>
      ChapterNumber.compare(a.chapter.number, b.chapter.number)
    );
  }

  take(key: Uuid): DocumentOutlineNode {
    const idx = this._children.findIndex((x) => x.key === key);
    if (idx === -1) {
      return null;
    }
    const n = this._children.splice(idx, 1)[0];
    n._parent = null;
    return n;
  }

  update(chapter: IChapter) {
    this._chapter = chapter;
    this._status = 0;
    this._shasum = shasum(this._chapter);
    console.log(this._status, this.isModified, this._shasum = shasum(this._chapter));
  }

  get description(): string {
    return this._chapter.description;
  }
  set description(val: string) {
    this._chapter.description = val;
    this.updateFlags();
  }

  get hasCildren(): boolean {
    return this._children.length > 0;
  }

  get index(): number {
    const p = this._parent ? this._model.nodeByKey(this.key) : null;
    if (p) {
      p.indexOf(this);
    } else {
      return this.model.indexOf(this);
    }
  }

  get isModified(): boolean {
    return this._shasum !== shasum(this._chapter);
  }

  get lastChildNode(): DocumentOutlineNode {
    if (this._children.length === 0) {
      return null;
    }
    return this._children[this._children.length - 1];
  }

  get model(): DocumentOutlineModel {
    return this._model;
  }

  get number(): string {
    return this._chapter.number;
  }
  set number(val: string) {
    console.log(this._chapter.number !== val);
    if (this._chapter.number !== val) {
      const cn = new ChapterNumber(val);
      cn.add();
      console.log(cn.toString());
      for (const child of this._children) {
        child.number = cn.toString();
      }
    }
    this._chapter.number = val;
    this.updateFlags();
  }

  get section(): IChapter {
    return this._chapter;
  }

  get selectable(): boolean {
    return true;
  }

  get status(): DocumentOutlineNodeStatus {
    return this._status;
  }

  get title(): string {
    return this._chapter.title;
  }
  set title(val: string) {
    this._chapter.title = val;
    this.updateFlags();
  }

  get chapter(): IChapter {
    return this._chapter;
  }
  set chapter(val: IChapter) {
    this.description = val.description;
    this.number = val.number;
    this.title = val.title;
    // if (this._shasum !== shasum(this._chapter)) {
    //   this._status |= DocumentOutlineNodeStatus.MODIFIED
    // } else {
    //   this._status = this._status & ~DocumentOutlineNodeStatus.MODIFIED
    // }
  }

  get children(): DocumentOutlineNode[] {
    return this._children;
  }
  set children(val: DocumentOutlineNode[]) {
    this._children = val;
  }

  get key(): Uuid {
    return this._chapter.uuid;
  }

  get label(): string {
    return `${this._chapter.number} ${this._chapter.title}`;
  }

  get parent(): Uuid {
    return this._parent;
  }
  private updateFlags() {
    if (this._shasum !== shasum(this._chapter)) {
      this._status |= DocumentOutlineNodeStatus.MODIFIED;
    } else {
      this._status = this._status & ~DocumentOutlineNodeStatus.MODIFIED;
    }
  }
}

class DocumentOutlineModel {
  private _chapters: IChapter[];
  private _nodes: DocumentOutlineNode[];
  private _removedNodes: DocumentOutlineNode[];
  constructor(chapters) {
    this._chapters = [];
    this._nodes = [];
    this._removedNodes = [];
    if (chapters) {
      this.buildModel(chapters);
    }
  }

  addChapter(parent: Uuid): IChapter {
    const p = this.nodeByKey(parent);
    const c = Chapter.create();

    let cn;
    if (p) {
      if (p.children.length === 0) {
        cn = new ChapterNumber(p.chapter.number);
        cn.add();
      } else {
        cn = new ChapterNumber(
          p.children[p.children.length - 1].chapter.number
        );
        cn.inc();
      }
    } else {
      if (this._nodes.length === 0) {
        cn = new ChapterNumber("0");
      } else {
        cn = new ChapterNumber(
          this._nodes[this._nodes.length - 1].chapter.number
        );
      }
      cn.inc();
    }
    c.number = cn.toString();
    new DocumentOutlineNode(this, c, p ? p.key : undefined);
    return c;
  }

  appendNode(node: DocumentOutlineNode) {
    this._nodes.push(node);
  }

  indexOf(node: DocumentOutlineNode): number {
    return this._nodes.findIndex((x) => x.key === node.key);
  }

  nodeByChapterNumber(number: string): DocumentOutlineNode {
    if (!number) {
      return null;
    }
    for (const node of this._nodes) {
      const n = (function f(n) {
        if (n.chapter.number === number) {
          return n;
        }
        for (const c of n.children) {
          const n = f(c);
          if (n) {
            return n;
          }
        }
      })(node);
      if (n) {
        return n;
      }
    }
    return null;
  }

  nodeByKey(key: Uuid): DocumentOutlineNode {
    if (!key) {
      return null;
    }
    for (const node of this._nodes) {
      const n = (function f(n) {
        if (n.key === key) {
          return n;
        }
        for (const c of n.children) {
          const n = f(c);
          if (n) {
            return n;
          }
        }
      })(node);
      if (n) {
        return n;
      }
    }
    return null;
  }

  read(chapters): void {
    this.buildModel(chapters);
  }

  removeNode(node: DocumentOutlineNode): void {
    const idx = this._chapters.findIndex((x) => x.uuid === node.key);
    if (idx === -1) {
      return;
    }
    this._chapters.splice(idx, 1);
    const p = this.nodeByKey(node.parent);
    if (p) {
      //   const c = node.take(node.key)
      //   this._removedNodes.push(c)
    } else {
      const idx = this._nodes.findIndex((x) => x.key === node.key);
      this._removedNodes.push(node);
      this._nodes.splice(idx, 1);
    }
    this._removedNodes.push(node);
  }

  private buildModel(chapters) {
    this._chapters = chapters;
    this._nodes = [];
    for (const chapter of chapters) {
      const cn = new ChapterNumber(chapter.number || "");
      if (cn.levels === 1) {
        new DocumentOutlineNode(this, chapter);
        // this._nodes.push(new DocumentOutlineNode(chapter))
      } else {
        const pcn = new ChapterNumber(chapter.number || "");
        pcn.remove();
        const p = this.nodeByChapterNumber(pcn.toString());
        if (p) {
          new DocumentOutlineNode(this, chapter, p.key);
        } else {
          new DocumentOutlineNode(this, chapter);
        }
      }
    }
  }

  renumber(start?: string) {
    const cn = new ChapterNumber(start || "1");
    for (let i = 0; i < this._nodes.length; i++) {
      this._nodes[i].renumber(cn.toString());
      cn.inc();
    }
  }

  sort(descending): void {
    this._nodes.sort(
      (a, b) =>
        ChapterNumber.compare(a.chapter.number, b.chapter.number) *
        (descending ? -1 : 1)
    );
  }

  update(chapter: IChapter) {
    const n = this.nodeByKey(chapter.uuid);
    if (!n) {
      throw new RangeError(`node ${chapter.uuid} not found`);
    }
    if (n.status & DocumentOutlineNodeStatus.REMOVED) {
      const idx = this._removedNodes.findIndex((x) => x.key === chapter.uuid);
      this._removedNodes.splice(idx, 1);
    } else {
      const idx = this._chapters.findIndex((x) => x.uuid === chapter.uuid);
      this._chapters[idx] = chapter;
      n.update(this._chapters[idx]);
    }
  }
  
  get changes(): DocumentOutlineNode[] {
    let l = [];
    for (const node of this._nodes) {
      const c = (function f(n) {
        let l = [];

        if (n.isModified) {
          l.push(n);
        }
        for (const child of n.children) {
          l = l.concat(f(child));
        }
        return l;
      })(node);
      l = l.concat(c);
    }
    return l;
  }

  get nodes() {
    return this._nodes;
  }
}

export default DocumentOutlineModel;
