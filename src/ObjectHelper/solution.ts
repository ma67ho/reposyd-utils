import { ISolution } from "./types";

export default {
  object: (values): ISolution => {
    values = values || {}
    return {
      name: values.name ||'',
      uuid: values.uuid || null
    }
  }
}