import { IChapter } from "../ReportGenerator/types";

export default {
   isEqual: (left: IChapter, right: IChapter): boolean => {
    if (left.uuid !== right.uuid ||
    left.number !== right.number ||
    left.title !== right.title ||
    left.description !== right.description) {
      return false
    }
    return true
   }
  }
