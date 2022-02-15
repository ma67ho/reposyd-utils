import { MinutesOfMeeting } from "./types";

export default {
  create: (values): MinutesOfMeeting => {
    values = values || {}
    const o:MinutesOfMeeting = {
      uuid: values.uuid || null,
      dsuuid: values.dsuuid || null,
      language: values.language || null,
      location: values.location || null,
      rpuuid: values.rpuuid || null
    }
    return o
  },
  SQL: {
    row: (row): MinutesOfMeeting | null => {
      if (row === undefined){
        return null
      }
      const o: MinutesOfMeeting = {
        uuid: row.ms_uuid,
        dsuuid: row.ds_uuid,
        location: row.ms_location || '',
        language: row.ms_language,
        rpuuid: row.rp_uuid,
      }
      return o
    }
  }
}