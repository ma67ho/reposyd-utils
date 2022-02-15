import {
  AttributeTypes,
  DesignDataObject,
  DesignDataObjectDefinition,
  Uuid,
} from "./types";
import dayjs from "dayjs";

function objectCreate(values?): DesignDataObject {
  values = values || {};
  const o: DesignDataObject = {
    attributes: values.attributes || {},
    cm: values.cm || {},
    id: values.id || null,
    definition: values.definition || {},
    puid: values.puid || null,
    uuid: values.uuid || null,
  };
  return o;
}

function readSqlRow(
  result: Array<unknown>,
  definition: DesignDataObjectDefinition,
  start?: number
): { ddo: DesignDataObject | null; lastRow: number } {
  if (result.length === 0) {
    return { ddo: null, lastRow: -1 };
  }
  const uuid: Uuid = null;
  const ddo: DesignDataObject = objectCreate({ definition: definition });
  for (
    let rowCount: number = start || 0;
    rowCount < result.length;
    rowCount++
  ) {
    const row = result[rowCount];
    if (row["do_uuid"] !== uuid) {
      if (uuid) {
        return {
          ddo: ddo,
          lastRow: rowCount,
        };
      }
      Object.keys(ddo.definition.attributes).forEach((key) => {
        const dd = ddo.definition.attributes[key];
        if (dd.properties && dd.properties.default) {
          ddo.attributes[key] = dd.properties.default;
        } else {
          ddo.attributes[key] = null;
        }
      });
      ddo.cm.modifiedby = {
        uuid: row["do_mb_uuid"],
        firstname: row["do_mb_firstname"],
        surname: row["do_mb_surname"],
        account: row["do_mb_account"],
      };
      ddo.cm.owner = {
        uuid: row["do_ow_uuid"],
        name: row["do_ow_name"],
      };
      ddo.cm.revision = row["do_cm_revision"];
      ddo.cm.shared =
        row["do_cm_shared"] === undefined
          ? row["ds_uuid"]
          : row["do_cm_shared"].split(",");
      ddo.cm.timestamp = row["do_cm_timestamp"];

      ddo.id = row["do_local_id"];
      ddo.puid = definition.id + "-" + row["do_local_id"];
      ddo.uuid = row["do_uuid"];
    }
    setValueFromRow(row, ddo);
  }
  if (ddo.uuid) {
    return {
      ddo: ddo,
      lastRow: result.length,
    };
  }
  return {
    ddo: null,
    lastRow: -1,
  };
}

function setValueFromRow(row, ddo: DesignDataObject): void {
  if (ddo.definition.attributes[row.da_id].type === AttributeTypes.boolean) {
    ddo.attributes[row.da_id] = row.da_value === 1;
  } else if (
    ddo.definition.attributes[row.da_id].type === AttributeTypes.choice
  ) {
    ddo.attributes[row.da_id] = JSON.parse(row.da_value);
  } else if (
    ddo.definition.attributes[row.da_id].type === AttributeTypes.date
  ) {
    ddo.attributes[row.da_id] = null;
    if (row.da_value !== "Invalid date" && row.da_value !== "Invalid Date") {
      if (row.da_value) {
        ddo.attributes[row.da_id] = dayjs(row.da_value).format("YYYY-MM-DD");
      }
    }
  } else if (
    ddo.definition.attributes[row.da_id].type === AttributeTypes.enumeration
  ) {
    ddo.attributes[row.da_id] = row.da_value =
      row.da_value || ddo.definition.attributes[row.da_id].properties.default;
  } else if (
    ddo.definition.attributes[row.da_id].type ===
    AttributeTypes.enumerationwithforms
  ) {
    let v = (row.da_value = JSON.parse(row.da_value));
    if (!v) {
      v = {
        value: ddo.definition.attributes[row.da_id].properties.default,
        fields: [],
      };
    }
    const dde = ddo.definition.attributes[
      row.da_id
    ].properties.enumeration.find((x) => x.key === v.value);
    if (dde) {
      if (dde.properties.form) {
        dde.properties.form.fields.forEach((field) => {
          if (v.fields[field.id] === undefined) {
            v.fields[field.id] = field.default;
          }
        });
      }
    }
    ddo.attributes[row.da_id] = v;
  } else if (
    ddo.definition.attributes[row.da_id].type === AttributeTypes.properties
  ) {
    ddo.attributes[row.da_id] = JSON.parse(
      row.da_value === null ? {} : row.da_value
    );
  } else if (
    ddo.definition.attributes[row.da_id].type === AttributeTypes.text
  ) {
    ddo.attributes[row.da_id] = row.da_value === null ? "" : row.da_value;
  } else if (
    ddo.definition.attributes[row.da_id].type === AttributeTypes.value
  ) {
    const v = parseFloat(row.da_value);
    if (Number.isNaN(v)) {
      ddo.attributes[row.da_id] =
        ddo.definition.attributes[row.da_id].properties.default || 0;
    } else {
      ddo.attributes[row.da_id] = v;
    }
  } else {
    ddo.attributes[row.da_id] = row.da_value;
  }
}

export default {
  object: {
    create: objectCreate,
  },
  SQL: {
    row: readSqlRow,
  },
};
