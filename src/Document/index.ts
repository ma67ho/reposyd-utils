import diff from "node-htmldiff";
import { IDocument } from "../ObjectHelper/types";

const keys = ["category", "documentNumber", "publicationDate", "revisionNumber", "title"];
export default {
  diff: (left: IDocument, right: IDocument) => {
    const changes = {};

    for (const key of keys) {
      const lv = left[key];
      const rv = right[key];
      if (lv !== rv) {
        const result = diff(lv, rv);
        if (result !== "") {
          changes[key] = { left: lv, right: rv, diff: result };
        }
      }
    }
    return changes;
  },
};
