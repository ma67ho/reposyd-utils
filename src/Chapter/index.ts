import { IChapter } from "../ReportGenerator/types";
import Uuid from "../Uuid";

export default {
  create: (): IChapter => {
    const c: IChapter = {
      description: '',
      number: '',
      script: {
        name: null,
        options: {
          reportblock: {},
          section: {
            pageBreak: false
          },
          uuid: null
        },

        uuid: null
      },
      title: '',
      uuid: Uuid.generate()
    }

    return c
  },
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
