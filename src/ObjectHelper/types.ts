export enum AttributeTypes {
  boolean = "boolean",
  calculated = "calculated",
  choice = "choice",
  date = "date",
  datetime = "datetime",
  enumeration = "enumeration",
  enumerationwithforms = "enumerationwithforms",
  id = "id",
  matrix = "matrix",
  number = "number",
  properties = "properties",
  resource_pm = "resource_pm",
  string = "string",
  text = "text",
  url = "url",
  useraccount = "useraccount",
  value = "value",
}

export type DesignDataOwnerData = {
  name?: string | null;
  uuid: Uuid;
};

export type Uuid = string | null;

export type WorkLog = {
  uuid: string;
};

export enum ActionPriority {
  high = "high",
  low = "low",
  normal = "normal",
}

export enum ActionState {
  aborted = "aborted",
  done = "done",
  notStarted = "notstarted",
  inProgress = "inprogress",
  onHold = "onhold",
}

export interface IActionProperties {
  workLog: Array<WorkLog>;
  dateOfCompletion: Date | null;
  dd: {
    type: string | null;
    uuid: string | null;
  };
  ddo: {
    uuid: string | null;
  };
  degreeOfCompletion: number;
  description: string;
  dueDate: Date | null;
  followup: boolean;
  overdue: boolean;
  priority: ActionPriority;
  responsible: MemberReference;
  source: string | null;
  startDate: Date | null;
  state: ActionState;
  title: string;
  tracker: string | null;
  workflow: string | null;
}

export type ContactEmalAddress = {
  address: string;
  type: string;
};

export type ContactPhoneNumber = {
  number: string;
  type: string;
};

export type ContactPostalAddress = {
  address: {
    city: string;
    countryRegion: string;
    postCode: string;
    stateProvince: string;
    street: string;
  };
  type: string;
};

export interface IContactProperties {
  department?: string;
  displayName?: string;
  dsuuid?: string;
  emailAddresses?: Array<ContactEmalAddress>;
  firstName?: string;
  lastName: string;
  namePrefix?: string;
  notes?: string;
  organization?: string;
  postalAddresses?: Array<ContactPostalAddress>;
  phoneNumbers?: Array<ContactPhoneNumber>;
  title?: string;
  website?: string;
}

export type ContactActivityLogRecorded = {
  by: {
    account: string | null;
    firstname: string | null;
    lastname: string | null;
    uuid: Uuid;
  };
  on: Date | null;
};

export type ContactActivityLogAction = IActionProperties;

export type ContactActivityLogMinutesOfMeeting = {
  uuid: Uuid;
};

export type ContactActivityLogTelephoneCall = {
  description: string;
  title: string;
};

export type ContactActivityLog = Array<ContactActivityLogEntry>;

export type ContactActivityLogEntry = {
  uuid: Uuid;
  action?: ContactActivityLogAction;
  meeting?: ContactActivityLogMinutesOfMeeting;
  phonecall?: ContactActivityLogTelephoneCall;
  recorded: ContactActivityLogRecorded;
  type: ContactActivityLogEntryType;
  cm: DesignDataConfigurationManagementData;
  repository: Uuid;
};

export enum ContactActivityLogEntryType {
  action = "action",
  email = "email",
  meeting = "meeting",
  pending = "pending",
  phonecall = "phonecall",
}

export interface IDesignDataDefinitionAttribute {
  properties:
    | IDesignDataDefinitionAttributeProperties
    | IDesignDataDefinitionAttributePropertiesEnumeration;
  sortOrder: number;
  title: Record<string, string>;
  type: AttributeTypes;
  uuid: Uuid;
}

export interface IDesignDataDefinitionAttributeProperties {
  default: unknown;
}

export interface IDesignDataDefinitionAttributePropertiesEnumeration
  extends IDesignDataDefinitionAttributeProperties {
  enumeration: IDesignDataDefinitionEnumerationItem[];
  statusnetwork: boolean;
}

export type DesignDataConfigurationManagementData = {
  modifiedby: {
    account: string | null;
    firstname: string | null;
    surname: string | null;
    uuid: Uuid;
  };
  owner: DesignDataOwnerData;
  revision: number;
  shared: Uuid | Array<Uuid> | null;
  timestamp: Date | null;
};

export interface IDesignDataDefinitionEnumerationItem {
  key: string;
  properties: IDesignDataDefinitionEnumerationProperties;
  value: Record<string, string>;
}

export interface IDesignDataDefinitionEnumerationProperties {
  backgroundColor?: string;
  form?: IDesignDataDefinitionEnumerationForm;
  icon?: string;
  transitions?: IDesignDataEnumerationDefinitionTransitions;
}

export type DesignDataDefinitionEnumerationFieldType = {
  CHECKBOX: "checkbox";
  INPUT: "input";
  SELECT: "select";
  TOGGLE: "toggle";
};
export type DesignDataDefinitionEnumerationInputFormat = {
  DATAFRAME: "dataframe";
  FLOAT: "float";
  HEX: "hex";
  INT: "int";
  KEYVALUE: "keyvalue";
  STRING: "string";
  TEXT: "text";
};
export interface IDesignDataDefinitionEnumerationFormField {
  default: any[] | string | number;
  id: string;
  hint: Record<string, string>;
  label: Record<string, string>;
  type: DesignDataDefinitionEnumerationFieldType;
}

export interface IDesignDataDefinitionEnumerationFieldDataframe
  extends IDesignDataDefinitionEnumerationFormField {
  bytes: number;
}

export interface IDesignDataDefinitionEnumerationFieldKeyValueType {
  label: Record<string, string>;
  type: string;
}

export interface IDesignDataDefinitionEnumerationFieldKeyValue
  extends IDesignDataDefinitionEnumerationFormField {
  defaultType: string;
  duplicates: boolean;
  items: number;
  types: IDesignDataDefinitionEnumerationFieldKeyValueType[];
}

export interface IDesignDataDefinitionEnumerationFieldSelectItem {
  label: Record<string, string>;
  value: string;
}
export interface IDesignDataDefinitionEnumerationFieldSelect
  extends IDesignDataDefinitionEnumerationFormField {
  customvalue: string;
  options: IDesignDataDefinitionEnumerationFieldSelectItem[];
}

export interface IDesignDataDefinitionEnumerationFieldInput
  extends IDesignDataDefinitionEnumerationFormField {
  decimals?: number;
  format: DesignDataDefinitionEnumerationInputFormat;
  range?: {
    max: number;
    min: number;
  };
  length: number;
}

export interface IDesignDataEnumerationDefinitionTransitions {
  readonly allowd: string[];
  readonly enabled: boolean;
}

export type IDesignDataDefinitionEnumerationForm = {
  custom: boolean;
  enabled: boolean;
  fields: Array<IDesignDataDefinitionEnumerationFormField>;
};

export interface IDesignDataDefinitionObject {
  attributes: Record<string, IDesignDataDefinitionAttribute>;
  id: string;
  uuid: Uuid;
}

export interface IDesignDataDefinitionLink {
  readonly uuid: string;
}

export interface IDesignDataLink {
  uuid: Uuid;
}

export interface IDesignDataObject {
  attributes: unknown;
  cm: DesignDataConfigurationManagementData;
  id: string | null;
  puid: string | null;
  uuid: Uuid | null;
  definition: IDesignDataDefinitionObject;
}

export interface IDocument {
  category: DocumentCategory;
  documentNumber: string;
  properties: IDocumentProperties
  publicationDate: Date;
  revisionNumber: string;
  template: Uuid | null;
  title: string;
  uuid: Uuid | null;
  dsuuid: Uuid | null;
}

export type IDocumentProperties = Record<string,any>

export enum DocumentCategory {
  REPORT = "report",
  SPECIFICATION = "specification",
  REFERENCE = "reference",
}

export type MemberReference = {
  uuid: Uuid;
};

export type MinutesOfMeeting = {
  uuid: Uuid;
  dsuuid: Uuid;
  language: string;
  location: string;
  rpuuid: null;
};

export type Project = {
  name: string;
  solutions: Array<ISolution>;
  uuid: Uuid;
};

export interface ISolution {
  name: string;
  uuid: Uuid;
}

export interface IExport {
  date: Date;
  description?: string;
  readonly solution: ISolution;
}

export interface IDesignDataExport {
  definitions: IDesignDataDefinitionObject[];
  objects: IDesignDataObject[];
}

export interface IRequirementsTraceabilityMatrix {
  traceObjects: IDesignDataObject[],
  rows: IRequirementsTraceabilityMatrixRow[],
}

export interface IRequirementsTraceabilityMatrixRow {
  rt: IDesignDataObject,
  traces: IRequirementsTraceabilityMatrixTrace[]
}

export interface IRequirementsTraceabilityMatrixTrace {
  ddl: IDesignDataLink,
  ddo: IDesignDataObject
}
  