export type cm = {
  modifiedBy: {
    uuid: uuid;
  };
};

export type uuid = string | null;

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
    uuid: uuid;
  };
  on: Date | null;
};

export type ContactActivityLogAction = Action;

export type ContactActivityLogMinutesOfMeeting = {
};

export type ContactActivityLogTelephoneCall = {
  description: string;
  title: string;
};

export type ContactActivityLog = Array<ContactActivityLogEntry>;

export type ContactActivityLogEntry = {
  uuid: uuid;
  action?: ContactActivityLogAction;
  mon?: ContactActivityLogMinutesOfMeeting;
  phonecall?: ContactActivityLogTelephoneCall;
  recorded: ContactActivityLogRecorded;
  type: ContactActivityLogEntryType;
  cm: cm;
  repository: uuid;
};

export enum ContactActivityLogEntryType {
  action = "action",
  email = "email",
  meeting = "meeting",
  pending = "pending",
  phonecall = "phonecall",
}

export type DesignDataAttributeDefinition = {
  uuid: uuid;
};

export type DesignDataObjectDefinition = {
  uuid: uuid;
};
export type DesignDataLink = {
  uuid: uuid
}

export type DesignDataObject = {
  uuid: uuid;
  definition: DesignDataObjectDefinition;
};

export type MemberReference = {
  uuid: uuid
}

export type Project = {
  name: string
  solutions: Array<Solution>
  uuid: uuid
}

export type Solution = {
  name: string
  uuid: uuid
}