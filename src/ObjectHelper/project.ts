import { Project } from "./types";

export default {
  object: (values): Project => {
    values = values || {}
    return {
      name: values.name || '',
      solutions: values.solutions || [],
      uuid: values.uuid || null
    }
  }
}