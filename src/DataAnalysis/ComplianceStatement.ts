import QualityGate from "./QualityGate";

export default class ComplianceStatement extends QualityGate {
  constructor(definition){
    super(definition)
  }

  static properties() {
    return  {
      designData: {
        row: {
          id: 'RT',
          type: 'ddo'
        }
      },
      result: {
        groupBy: 'assessment',
        assessmentPending: "#result eq null or $property('state') eq 'pending'",
        props: [
          {
            id: 'assessment',
            type: 'enumeration',
            default: 'pending',
            items: [
              {
                color: 'slategrey',
                condition: "#result eq null or $property('assessment') eq #groupkey",
                icon: 'bi-cart2',
                label: {
                  de: 'ausstehend',
                  en: 'pending'
                }
              },
              {
                autosave: true,
                color: "royalblue",
                condition: "$property('assessment') eq #groupkey",
                icon: 'bi-pause-circle',
                key: 'onhold',
                label: { de: 'in der Warteschleife', en: 'on hold' },
                tooltip: {
                  de: 'Stellt die Bearbeitung der Anforderung in die Warteschleife.',
                  en: 'Places processing of the requirement on hold.'
                }
              },
              {
                autosave: true,
                color: "darkgreen",
                condition: "$property('assessment') eq #groupkey",
                icon: 'bi-check-circle',
                key: 'met',
                label: {
                  de: 'erfüllt',
                  en: 'met'
                },
                tooltip: {
                  de: 'Die Anforderung wird erfüllt.',
                  en: 'The requirement is met.'
                }
              },
              {
                color: "orange",
                condition: "$property('assessment') eq #groupkey",
                icon: 'bi-exclamation-circle',
                key: 'metwithcomments',
                label: { de: 'erfüllt mit Kommentare(n)', en: 'met with comment(s)' },
                tooltip: {
                  de: 'Die Anforderung wird mit Kommentaren erfüllt.',
                  en: 'The requirement is met with comments.'
                }
              },
              {
                color: "firebrick",
                condition: "$property('assessment') eq #groupkey",
                icon: 'bi-x-circle',
                key: 'notmet',
                label: { de: 'nicht erfüllt', en: 'not met' },
                tooltip: {
                  de: 'Die Anforderung wird nicht erfüllt.',
                  en: 'The requirement is not met.'
                }
              }
            ],
            label: {
              de: 'Bewertung',
              en: 'Assessment'
            }
          },
          {
            id: 'rationale',
            label: {
              de: 'Begründung',
              en: 'Rationale'
            },
            type: 'text',
            rules: { id: 'editable', subject: 'assessment', op: 'neq', value: 'met' }
          }
        ]
      }
    }
  }
}