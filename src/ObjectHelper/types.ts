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
  name?: string | null
  uuid: Uuid
}

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

export type Action = {
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
};

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

export type Contact = {
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
};

export type ContactActivityLogRecorded = {
  by: {
    account: string | null;
    firstname: string | null;
    lastname: string | null;
    uuid: Uuid;
  };
  on: Date | null;
};

export type ContactActivityLogAction = Action;

export type ContactActivityLogMinutesOfMeeting = {
  uuid: Uuid
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

export type DesignDataAttributeDefinition = {
  properties: DesignDataAttributeDefinitionProperties
  type: AttributeTypes;
  uuid: Uuid;
};

export type DesignDataAttributeDefinitionProperties = {
  default: unknown
  enumeration?: Array<DesignDataEnumerationDefinition>
}

export type DesignDataConfigurationManagementData = {
  modifiedby: {
    account: string | null
    firstname: string | null
    surname: string | null
    uuid: Uuid;
  };
  owner: DesignDataOwnerData
  revision: number
  shared: Uuid | Array<Uuid> | null
  timestamp: Date | null
};

export type DesignDataEnumerationDefinition = {
  key: string,
  properties: DesignDataEnumerationDefinitionProperties
}

export type DesignDataEnumerationDefinitionProperties = {
  form?: DesignDataEnumerationDefinitionPropertiesForm
}

export type DesignDataEnumerationDefinitionPropertiesFormField = {
  default: unknown
  id: string
}

export type DesignDataEnumerationDefinitionPropertiesForm = {
  fields: Array<DesignDataEnumerationDefinitionPropertiesFormField>
}

export type DesignDataObjectDefinition = {
  attributes: Record<string,DesignDataAttributeDefinition>
  id: string
  uuid: Uuid;
};
export type DesignDataLink = {
  uuid: Uuid
}

export type DesignDataObject = {
  attributes: unknown
  cm: DesignDataConfigurationManagementData
  id: string | null
  puid: string | null
  uuid: Uuid | null;
  definition: DesignDataObjectDefinition;
};

export type MemberReference = {
  uuid: Uuid
}

export type MinutesOfMeeting = {
  uuid: Uuid
  dsuuid: Uuid
  language: string
  location: string,
  rpuuid: null
}

export type Project = {
  name: string
  solutions: Array<Solution>
  uuid: Uuid
}

export type Solution = {
  name: string
  uuid: Uuid
}