import QualityGate from "./QualityGate";

export default class RequirementsAnalysis extends QualityGate {
  constructor(definition) {
    super(definition)
  }
  static properties() {
    return {
      charts: [],
      designData: {
        row: {
          id: "RT",
          type: "ddo"
        }
      },
      result: {
        groupBy: "state",
        assessmentPending: "#result eq null or $property('state') eq 'pending'",
        props: [
          {
            default: "pending",
            id: "state",
            items: [
              {
                color: "slategrey",
                condition: "#result eq null or $property('state') eq #groupkey",
                icon: "bi-cart2",
                key: "pending",
                label: {
                  de: "ausstehend",
                  en: "pending"
                }
              },
              {
                color: "royalblue",
                condition: "$property('state') eq #groupkey",
                icon: "bi-pause-circle",
                key: "onhold",
                label: {
                  de: "in der Warteschleife",
                  en: "on hold"
                },
                tooltip: {
                  de: "Stellt die Bearbeitung der Anforderung in die Warteschleife.",
                  en: "Places processing of the requirement on hold.container."
                }
              },
              {
                color: "darkgreen",
                condition: "$property('state') eq #groupkey",
                icon: "bi-check-circle",
                key: "accepted",
                label: {
                  de: "akzeptiert",
                  en: "accepted"
                },
                tooltip: {
                  de: "Die Anforderung entspricht den Qualitätskriterien.",
                  en: "The requirement meets the quality criteria."
                }
              },
              {
                color: "orange",
                condition: "$property('state') eq #groupkey",
                icon: "bi-exclamation-circle",
                key: "constraining",
                label: {
                  de: "einschränkend",
                  en: "constraining"
                },
                tooltip: {
                  de: "Die Anforderung schränkt den Lösungsraum ein.",
                  en: "The requirement limits the solution space."
                }
              },
              {
                color: "firebrick",
                condition: "$property('state') eq #groupkey",
                icon: "bi-question-circle",
                key: "ambiguous",
                label: {
                  de: "uneindeutig",
                  en: "ambiguous"
                },
                tooltip: {
                  de: "Die Anforderung ist nicht eindeutig.",
                  en: "The requirement is ambiguous."
                }
              },
              {
                color: "magenta",
                condition: "$property('state') eq #groupkey",
                icon: "bi-c-circle",
                key: "complex",
                label: {
                  de: "komplex",
                  en: "complex"
                },
                tooltip: {
                  de: "Im Text sind mehrere Anforderungen enthälten.",
                  en: "The text contains several requirements."
                }
              }
            ],
            label: {
              de: "Status",
              en: "State"
            },
            type: "enumeration"
          },
          {
            id: "rationale",
            label: {
              de: "Begründung",
              en: "Rationale"
            },
            rules: {
              id: "editable",
              op: "neq",
              subject: "state",
              value: "accepted"
            },
            type: "text"
          }
        ]
      }
    }
  }
}