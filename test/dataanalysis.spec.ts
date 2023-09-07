// import { LexicographicalOrder.ChapterNumber,ChapterNumberStyle, isRomanNumber } from '../src/LexicographicalOrder/LexicographicalOrder.ChapterNumber'
import { DataAnalysis } from '../src'
import { expect } from 'chai';
import { IDataAnalyisGroup, IDataAnalyisResult, IDataAnalyisResultContainer } from '../src/DataAnalysis';
import QualityGate from '../src/DataAnalysis/QualityGate';


describe('DataAnalyis', () => {
  describe('ConditionFilter', () => {
    it('parse $result', function () {
      const f = DataAnalysis.ConditionParser.parse('$result eq null')
      expect(f).to.be.an('object')
    })
    it("$property('state') eq 'pending'", function () {
      const f = DataAnalysis.ConditionParser.parse("$property('state') eq 'pending'")
      expect(f).to.be.an('object')
      expect(f.value).to.eql('pending')
    })
    it('parse <cond1> or <cond2>', function () {
      const f = DataAnalysis.ConditionParser.parse("$result eq null or $property('state') eq 'pending'")
      expect(f).to.be.an('object')
    })
  })
  describe('filterResults', function () {
    const data: IDataAnalyisResultContainer[] = [
      {
        designdata: {
          dd: {
            type: 'ddo'
          }
        },
        result: null
      },
      {
        designdata: {
          dd: {
            type: 'ddo'
          }
        },
        result: {
          props: {
            state: 'pending'
          },
          uuid: null
        }
      }

    ]
    it('#result eq null', function () {
      const group: IDataAnalyisGroup = {
        condition: '#result eq null',
        key: 'pending'
      }
      expect(DataAnalysis.filterResults('pending', group, data)).to.be.an('array').and.to.have.lengthOf(1)
    })
    it("$property('$property('state') eq 'pending'", function () {
      const group: IDataAnalyisGroup = {
        condition: "$property('state') eq 'pending'",
        key: 'accepted'
      }
      expect(DataAnalysis.filterResults('pending', group, data)).to.be.an('array').and.to.have.lengthOf(1)
    })
    it("'$property('state') eq #groupkey", function () {
      const group: IDataAnalyisGroup = {
        condition: "$property('state') eq #groupkey",
        key: 'pending'
      }
      expect(DataAnalysis.filterResults('pending', group, data)).to.be.an('array').and.to.have.lengthOf(1)
    })
    it("#result eq null or $property('state') eq 'pending'", function () {
      const group: IDataAnalyisGroup = {
        condition: "#result eq null or $property('state') eq 'pending'",
        key: 'pending'
      }
      expect(DataAnalysis.filterResults('pending', group, data)).to.be.an('array').and.to.have.length(2)

    })
  })
  describe('QualityGate', function () {
    const definition = {
      "cm": {
        "modifiedby": {
          "account": "admin",
          "name": "admin, admin",
          "firstname": "admin",
          "surname": "admin",
          "uuid": "{92b84a3e-fbd9-4e1e-b5c4-c722c6c71901}"
        },
        "revision": 2,
        "timestamp": "2023-09-03 16:14:15",
        "owner": {
          "uuid": "{1f7805ea-c650-49c1-8f81-b52ce3dabb36}",
          "name": "Systems Engineering"
        }
      },
      "description": "",
      "groups": [
        "row"
      ],
      "state": "disabled",
      "number": "",
      "properties": {
        "charts": [
          {
            "label": {},
            "type": "pie"
          }
        ],
        "designData": {
          "row": {
            "id": "RT",
            "type": "ddo"
          }
        },
        "result": {
          "groupBy": "state",
          "assessmentPending": "#result eq null or $property('state') eq 'pending'",
          "props": [
            {
              "default": "pending",
              "id": "state",
              "items": [
                {
                  "color": "slategrey",
                  "condition": "#result eq null or $property('state') eq #groupkey",
                  "icon": "bi-cart2",
                  "key": "pending",
                  "label": {
                    "de": "ausstehend",
                    "en": "pending"
                  }
                },
                {
                  "color": "royalblue",
                  "condition": "$property('state') eq #groupkey",
                  "icon": "bi-pause-circle",
                  "key": "onhold",
                  "label": {
                    "de": "in der Warteschleife",
                    "en": "on hold"
                  },
                  "tooltip": {
                    "de": "Stellt die Bearbeitung der Anforderung in die Warteschleife.",
                    "en": "Places processing of the requirement on hold.container."
                  }
                },
                {
                  "color": "darkgreen",
                  "condition": "$property('state') eq #groupkey",
                  "icon": "bi-check-circle",
                  "key": "accepted",
                  "label": {
                    "de": "akzeptiert",
                    "en": "accepted"
                  },
                  "tooltip": {
                    "de": "Die Anforderung entspricht den Qualitätskriterien.",
                    "en": "The requirement meets the quality criteria."
                  }
                },
                {
                  "color": "orange",
                  "condition": "$property('state') eq #groupkey",
                  "icon": "bi-exclamation-circle",
                  "key": "constraining",
                  "label": {
                    "de": "einschränkend",
                    "en": "constraining"
                  },
                  "tooltip": {
                    "de": "Die Anforderung schränkt den Lösungsraum ein.",
                    "en": "The requirement limits the solution space."
                  }
                },
                {
                  "color": "firebrick",
                  "condition": "$property('state') eq #groupkey",
                  "icon": "bi-question-circle",
                  "key": "ambiguous",
                  "label": {
                    "de": "uneindeutig",
                    "en": "ambiguous"
                  },
                  "tooltip": {
                    "de": "Die Anforderung ist nicht eindeutig.",
                    "en": "The requirement is ambiguous."
                  }
                },
                {
                  "color": "magenta",
                  "condition": "$property('state') eq #groupkey",
                  "icon": "bi-c-circle",
                  "key": "complex",
                  "label": {
                    "de": "komplex",
                    "en": "complex"
                  },
                  "tooltip": {
                    "de": "Im Text sind mehrere Anforderungen enthälten.",
                    "en": "The text contains several requirements."
                  }
                }
              ],
              "label": {
                "de": "Status",
                "en": "State"
              },
              "type": "enumeration"
            },
            {
              "id": "rationale",
              "label": {
                "de": "Begründung",
                "en": "Rationale"
              },
              "rules": {
                "id": "editable",
                "op": "neq",
                "subject": "state",
                "value": "accepted"
              },
              "type": "text"
            }
          ]
        }
      },
      "repository": "{77ce5ee0-7585-4166-ada7-2d599969197b}",
      "title": "Quality Gate",
      "type": "qualitygate",
      "uuid": "{f253dab5-4f9e-4ac0-955d-0328f2434c63}"
    }
    const results: IDataAnalyisResultContainer[] = [
      {
        designdata: {
          dd: {
            type: 'ddo'
          }
        },
        result: null
      },
      {
        designdata: {
          dd: {
            type: 'ddo'
          }
        },
        result: {
          props: {
            state: 'pending'
          },
          uuid: null
        }
      },
      {
        designdata: {
          dd: {
            type: 'ddo'
          }
        },
        result: {
          props: {
            state: 'accepted'
          },
          uuid: null
        }
      }

    ]
    it('assessmentPending()', function () {
      const qg = new QualityGate(definition)
      expect(qg.assessmentPending(results[0])).to.be.true
      expect(qg.assessmentPending(results[1])).to.be.true
      expect(qg.assessmentPending(results[2])).to.be.false

      expect(qg.assessmentPending(results[0].result as IDataAnalyisResult)).to.be.true
    })

    it('updateAssessment()', function() {
      const qg = new QualityGate(definition)
      qg.read(results)
      expect(qg.updateAssessment(0, 0, { state: 'onhold'}).result?.props.state).to.eql('onhold')
    })
    it('test', function () {

      const qg = new QualityGate(definition)
      expect(qg.groups).to.be.an('array').and.to.have.lengthOf(6)
    })
  })
})