import { Solution } from "./types";

export default {
  object: (values): Solution => {
    values = values || {}
    return {
      name: values.name ||'',
      uuid: values.uuid || null
    }
  }
}