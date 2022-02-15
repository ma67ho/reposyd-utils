import Action from "./action";
import { VCard } from "@covve/easy-vcard";
import {
  Contact,
  ContactActivityLogEntry,
  ContactActivityLogEntryType,
} from "./types";
import * as jsonexport from "jsonexport/dist";

function mapAddressType(type) {
  if (type === "business") {
    return "work";
  } else if (type === "private") {
    return "home";
  } else {
    return type;
  }
}

function mapPhoneType(type) {
  if (type === "businesscell") {
    return "cell";
  } else if (type === "business.fax") {
    return "fax";
  } else if (type === "business.voice") {
    return "work";
  } else if (type === "private.cell") {
    return "home,cell";
  } else if (type === "private.fax") {
    return "home,fax";
  } else if (type === "private.voice") {
    return "home,voice";
  } else {
    return type;
  }
}

export default {
  ActivityLog: {
    Entry: {
      create: (type: ContactActivityLogEntryType): ContactActivityLogEntry => {
        const o: ContactActivityLogEntry = {
          uuid: null,
          repository: null,
          recorded: {
            by: {
              account: null,
              firstname: null,
              lastname: null,
              uuid: null,
            },
            on: null,
          },
          type: type,
          cm: {
            modifiedby: {
              account: null,
              firstname: null,
              surname: null,
              uuid: null,
            },
            owner: {
              uuid: null
            },
            revision: -1,
            shared: null,
            timestamp: null
          },
        };
        if (type === ContactActivityLogEntryType.action) {
          o.action = Action.create();
        } else if (type === ContactActivityLogEntryType.phonecall) {
          o.phonecall = {
            description: "",
            title: "",
          };
        }
        return o;
      },
    },
  },
  create: (locale: string) => {
    return {
      department: "",
      displayName: "",
      emailAddresses: [
        {
          type: "business",
          address: {
            city: "",
            countryRegion: "",
            postCode: "",
            stateProvince: "",
            street: "",
            suffix: "",
          },
        },
        {
          type: "private",
          address: {
            city: "",
            countryRegion: "",
            postCode: "",
            stateProvince: "",
            street: "",
            suffix: "",
          },
        },
      ],
      firstName: "",
      lastName: "",
      language: locale ? locale.substr(0, 2) : "en",
      namePrfix: "",
      organization: "",
      phoneNumbers: [
        { type: "business.voice", number: "" },
        { type: "business.cell", number: "" },
        { type: "business.fax", number: "" },
        { type: "private.voice", number: "" },
      ],
      postalAddresses: [
        {
          type: "business",
          address: {
            city: "",
            countryRegion: "",
            postCode: "",
            stateProvince: "",
            street: "",
          },
        },
        {
          type: "private",
          address: {
            city: "",
            countryRegion: "",
            postCode: "",
            stateProvince: "",
            street: "",
          },
        },
      ],
      title: "",
    };
  },
  export: {
    as: {
      csv: (data: Array<Contact>): Promise<string> => {
        return new Promise((resolve, reject) => {
          try {
            const d = [];
            data.forEach((item) => {
              const o = JSON.parse(JSON.stringify(item));
              delete o.cm;
              o.emailAddresses = {};
              o.emailAddresses = {};
              item.emailAddresses.forEach((address) => {
                o.emailAddresses[address.type] = address.address;
              });

              o.phoneNumbers = {};
              item.phoneNumbers.forEach((number) => {
                o.phoneNumbers[number.type] = number.number;
              });
              o.postalAddresses = {};
              item.postalAddresses.forEach((address) => {
                o.postalAddresses[address.type] = address.address;
              });
              d.push(o);
            });
            const csv = jsonexport.default(d);
            resolve(csv);
          } catch (err) {
            reject(err);
          }
        });
      },
      vcard: (data: Contact) => {
        const vc = new VCard();
        vc.setFullName(data.displayName);
        vc.addFirstName(data.firstName);
        vc.addLastName(data.lastName);
        vc.addNotes(data.notes);
        vc.addOrganization(data.organization, [data.department]);
        vc.addPrefixName(data.namePrefix);
        vc.addTitle(data.title);
        vc.addUrl(data.website);

        if (data.emailAddresses) {
          data.emailAddresses.forEach((item) => {
            vc.addEmail(item.address, { type: mapAddressType(item.type) });
          });
        }
        if (data.phoneNumbers) {
          data.phoneNumbers.forEach((item) => {
            vc.addPhone(String(item.number), { type: mapPhoneType(item.type) });
          });
        }
        if (data.postalAddresses) {
          data.postalAddresses.forEach((item) => {
            vc.addAddress(
              item.address.street,
              item.address.city,
              item.address.stateProvince,
              String(item.address.postCode),
              item.address.countryRegion,
              { type: mapAddressType(item.type) }
            );
          });
        }
        return vc.toString();
      },
    },
  },
};
