// import ObjectHelper from "../src/ObjectHelper";
// import { expect } from "chai";
// import { Contact } from "../src/ObjectHelper/types";

// import * as faker from "faker";

// const dummy1: Contact = {
//   lastName: faker.name.lastName(),
// };
// describe("Module ObjectHelper/Contact", () => {
//   describe("Contact", () => {
//     it("", (done) => {
//       const c: Contact = { lastName: "" };
//       expect(ObjectHelper.Contact.export.as.vcard(c)).to.be.not.null;
//       done();
//     });
//     describe("export to", () => {
//       it("vcard", (done) => {
//         const c: Contact = {
//           lastName: faker.name.lastName(),
//         };
//         expect(ObjectHelper.Contact.export.as.vcard(c)).not.to.be.null;
//         done();
//       });
//       it("csv", done => {
//         ObjectHelper.Contact.export.as.csv([dummy1])
//           .then((data) => {
//             expect(data).not.to.be.null;
//             expect(data.length).to.be.greaterThan(0)
//             done();
//           })
//           .catch((err) => {
//             done(err);
//           });
//       });
//     });
//   });
// });
