import { expect } from 'chai';
import { TableUtils } from '../src';
import { FilterConditionOperator, FilterOperator, FilterType } from '../src/TableUtils/ColumnFilter';

describe('TableUtils', function () {
  describe('TableFilter', function () {
    it('constructor', function () {
      const c = new TableUtils.TableFilter([])
      expect(c.filters).to.be.empty
    })
    it('options', function () {
      let tf = new TableUtils.TableFilter([{ field: 'col0', name: 'col0' }])
      tf.data = [{ col0: '42' }]
      expect(tf.options('col0')).to.have.deep.members(['42'])

      tf = new TableUtils.TableFilter([{ field: row => row.data.col0, name: 'col0' }])
      tf.data = [{ data: { col0: '42' } }]
      expect(tf.options('col0')).to.have.deep.members(['42'])
    })
    it('customFilter', function () {
      const tf = new TableUtils.TableFilter([{ field: 'col0', name: 'col0' }, { field: 'col1', name: 'col1' }])
      tf.customFilter(FilterType.NUMBER, 'col0', FilterOperator.AND, [{ operator: FilterConditionOperator.contains, value: 1 }])
      expect(tf.filters).to.have.lengthOf(1)
      expect(tf.filters[0].type).to.be.eql(FilterType.NUMBER)
      tf.customFilter(FilterType.TEXT, 'col1', FilterOperator.AND, [{ operator: FilterConditionOperator.contains, value: 1 }])
      expect(tf.filters).to.have.lengthOf(2)
      expect(tf.filters[1].type).to.be.eql(FilterType.TEXT)
    })

    it('definition (property', function() {
      const tf = new TableUtils.TableFilter([{ field: 'col0', name: 'col0' }, { field: 'col1', name: 'col1' }])
      tf.customFilter(FilterType.NUMBER, 'col0', FilterOperator.AND, [{ operator: FilterConditionOperator.contains, value: 1 }])
      expect(tf.definition).to.be.an('object')
    })
  })
  // describe('class TableProxy', function() {
  //   it ('constructor', function() {
  //     const c = new TableUtils.TableProxy()
  //     expect(c.columnFilters).to.be.an('array').and.lengthOf(0)
  //   })
  //   it('filteredRows', function() {
  //     const c = new TableUtils.TableProxy()
  //     expect(c.filteredRows([])).to.be.empty
  //   })
  // })
  // describe(TableColumnFilter)
  describe('auto filter', function () {
    it('isActive', function () {
      const tf = new TableUtils.TableFilter([{ name: 'col0' }])
      expect(tf.autoFilter('col0', null).isActive).to.be.false
      expect(tf.autoFilter('col0', ['1']).isActive).to.be.true
    })
    it('empty', function () {
      const tf = new TableUtils.TableFilter([{ name: 'col0' }])
      const af = tf.autoFilter('col0', ['01'])
      expect(af.type).to.be.equal(FilterType.AUTO)
      expect(af.operator).to.be.equal(FilterOperator.AND)
      expect(af.conditions).to.be.an('array').and.to.have.lengthOf(2)
      expect(af.conditions[0].operator).to.be.equal(FilterConditionOperator.includes)
      expect(af.conditions[0].value).to.be.an('array')
      expect(af.conditions[1].operator).to.be.equal(FilterConditionOperator.none)
    })
    it('set filter for column', function () {
      const tf = new TableUtils.TableFilter([{ name: 'col0' }])
      let af = tf.autoFilter('col0', ['01'])
      expect(af.value).to.have.deep.members(['01'])
      af = tf.autoFilter('col0', ['02'])
      expect(af.value).to.have.deep.members(['02'])
    })
    it('set/get value', function () {
      const tf = new TableUtils.TableFilter([{ name: 'col0' }])
      const af = tf.autoFilter('col0', ['01'])
      expect(af.value).to.have.deep.members(['01'])
      af.value = ['02']
      expect(af.value).to.have.deep.members(['02'])
    })
  })
  describe('filterRows', function () {
    describe('autofilter', function () {
      const rows = [
        {
          id: 1,
          number: '01'
        },
        {
          id: 2,
          number: '02'
        }
      ]
      it('no filter', function () {
        const tf = new TableUtils.TableFilter([{ name: 'col0' }])
        expect(tf.filterRows(rows)).to.be.an('array').and.to.have.length(rows.length)
      })
      it('filterRows (value: null)', function () {
        const tf = new TableUtils.TableFilter([{ field: 'number', name: 'number' }])
        tf.autoFilter('number', null)
        expect(tf.filterRows(rows)).to.be.an('array').and.to.have.lengthOf(2)
      })
      it('filterRows', function () {
        const tf = new TableUtils.TableFilter([{ field: 'number', name: 'number' }])
        tf.autoFilter('number', ['01'])
        expect(tf.filterRows(rows)).to.be.an('array').and.to.have.lengthOf(1)
        tf.autoFilter('number', ['02'])
        expect(tf.filterRows(rows)).to.be.an('array').and.to.have.lengthOf(1)
        tf.autoFilter('number', ['01', '02'])
        expect(tf.filterRows(rows)).to.be.an('array').and.to.have.lengthOf(2)
      })
      it('match', function () {
        const tf = new TableUtils.TableFilter([{ field: 'number', name: 'number' }])
        tf.autoFilter('number', ['01'])
        expect(tf.match(rows[0])).to.be.true
        tf.autoFilter('number', ['01', '02'])
        expect(tf.match(rows[0])).to.be.true
        expect(tf.match(rows[1])).to.be.true
      })
      it('match with mapping table', function () {
        const tf = new TableUtils.TableFilter([{ field: 'number', name: 'number' }])
        const mapping = new Map()
        mapping.set('10', '01')
        tf.autoFilter('number', ['10'], mapping)
        expect(tf.match(rows[0])).to.be.true
        tf.autoFilter('number', ['10', '20'], mapping)
        expect(tf.match(rows[0])).to.be.true
        expect(tf.match(rows[1])).to.be.false
      })
    })
    describe('number filter', function () {
      const rows = [
        {
          id: 1,
          number: '01',
          value: 1
        },
        {
          id: 2,
          number: '02',
          value: 2
        },
        {
          id: 3,
          number: '02.01',
          value: 0
        }
      ]

      it('match equal to', function () {
        const tf = new TableUtils.TableFilter([{ field: 'value', name: 'value' }])
        tf.customFilter(FilterType.NUMBER, 'value', FilterOperator.AND, [{ operator: FilterConditionOperator.equalTo, value: 1 }])
        expect(tf.match(rows[0])).to.be.true
        expect(tf.match(rows[1])).to.be.false
        expect(tf.match(rows[2])).to.be.false
        tf.customFilter(FilterType.NUMBER, 'value', FilterOperator.AND, [{ operator: FilterConditionOperator.equalTo, value: 0 }])
        expect(tf.match(rows[2])).to.be.true
      })
      it('match not equal to', function () {
        const tf = new TableUtils.TableFilter([{ field: 'value', name: 'value' }])
        tf.customFilter(FilterType.NUMBER, 'value', FilterOperator.AND, [{ operator: FilterConditionOperator.notEqualTo, value: 1 }])
        expect(tf.match(rows[0])).to.be.false
        expect(tf.match(rows[1])).to.be.true
        expect(tf.match(rows[2])).to.be.true
      })
      it('match greater than', function () {
        const tf = new TableUtils.TableFilter([{ field: 'value', name: 'value' }])
        tf.customFilter(FilterType.NUMBER, 'value', FilterOperator.AND, [{ operator: FilterConditionOperator.greaterThan, value: 1 }])
        expect(tf.match(rows[0])).to.be.false
        expect(tf.match(rows[1])).to.be.true
        expect(tf.match(rows[2])).to.be.false
      })
      it('match greater than or equal', function () {
        const tf = new TableUtils.TableFilter([{ field: 'value', name: 'value' }])
        tf.customFilter(FilterType.NUMBER, 'value', FilterOperator.AND, [{ operator: FilterConditionOperator.greaterThanOrEqual, value: 1 }])
        expect(tf.match(rows[0])).to.be.true
        expect(tf.match(rows[1])).to.be.true
        expect(tf.match(rows[2])).to.be.false
      })
      it('match less than', function () {
        const tf = new TableUtils.TableFilter([{ field: 'value', name: 'value' }])
        tf.customFilter(FilterType.NUMBER, 'value', FilterOperator.AND, [{ operator: FilterConditionOperator.lessThan, value: 1 }])
        expect(tf.match(rows[0])).to.be.false
        expect(tf.match(rows[1])).to.be.false
        expect(tf.match(rows[2])).to.be.true
      })
      it('match less than or equal', function () {
        const tf = new TableUtils.TableFilter([{ field: 'value', name: 'value' }])
        tf.customFilter(FilterType.NUMBER, 'value', FilterOperator.AND, [{ operator: FilterConditionOperator.lessThanOrEqual, value: 1 }])
        expect(tf.match(rows[0])).to.be.true
        expect(tf.match(rows[1])).to.be.false
        expect(tf.match(rows[2])).to.be.true
      })
      it('filterRows', function () {
        const tf = new TableUtils.TableFilter([{ field: 'value', name: 'value' }])
        tf.customFilter(FilterType.NUMBER, 'value', FilterOperator.AND, [{ operator: FilterConditionOperator.equalTo, value: 1 }])
        expect(tf.filterRows(rows)).to.be.an('array').and.to.have.lengthOf(1)
        tf.customFilter(FilterType.NUMBER, 'value', FilterOperator.AND, [{ operator: FilterConditionOperator.notEqualTo, value: 1 }])
        expect(tf.filterRows(rows)).to.be.an('array').and.to.have.lengthOf(2)
        tf.customFilter(FilterType.NUMBER, 'value', FilterOperator.AND, [{ operator: FilterConditionOperator.greaterThan, value: 0 }])
        expect(tf.filterRows(rows)).to.be.an('array').and.to.have.lengthOf(2)
        tf.customFilter(FilterType.NUMBER, 'value', FilterOperator.AND, [{ operator: FilterConditionOperator.greaterThanOrEqual, value: 0 }])
        expect(tf.filterRows(rows)).to.be.an('array').and.to.have.lengthOf(3)
        tf.customFilter(FilterType.NUMBER, 'value', FilterOperator.AND, [{ operator: FilterConditionOperator.lessThan, value: 1 }])
        expect(tf.filterRows(rows)).to.be.an('array').and.to.have.lengthOf(1)
        tf.customFilter(FilterType.NUMBER, 'value', FilterOperator.AND, [{ operator: FilterConditionOperator.lessThanOrEqual, value: 1 }])
        expect(tf.filterRows(rows)).to.be.an('array').and.to.have.lengthOf(2)
      })
    })
    describe('text filter', function () {
      const rows = [
        {
          id: 1,
          number: '01',
          title: 'lowercase'
        },
        {
          id: 2,
          number: '02',
          title: 'UPPERCASE'
        },
        {
          id: 3,
          number: '02.01',
          title: 'MIXEDcase'
        }
      ]
      it('match endsNotWith (case sensitive)', function () {
        const tf = new TableUtils.TableFilter([{ field: 'number', name: 'number' }])
        tf.textFilter('number', FilterOperator.AND, [{ operator: FilterConditionOperator.endsNotWith, value: '01' }])
        expect(tf.match(rows[0])).to.be.false
        expect(tf.match(rows[1])).to.be.true
        expect(tf.match(rows[2])).to.be.false
      })
      it('match endsNotWith (case insensitive)', function () {
        const tf = new TableUtils.TableFilter([{ field: 'title', name: 'title' }])
        tf.textFilter('title', FilterOperator.AND, [{ operator: FilterConditionOperator.endsNotWith, value: 'case' }]).insensitive = true
        expect(tf.match(rows[0])).to.be.false
        expect(tf.match(rows[1])).to.be.false
        expect(tf.match(rows[2])).to.be.false
      })
      it('match endsWith (case sensitive)', function () {
        const tf = new TableUtils.TableFilter([{ field: 'title', name: 'title' }])
        tf.textFilter('title', FilterOperator.AND, [{ operator: FilterConditionOperator.endsWith, value: 'case' }])
        expect(tf.match(rows[0])).to.be.true
        expect(tf.match(rows[1])).to.be.false
        expect(tf.match(rows[2])).to.be.true
      })
      it('match endsWith (case insensitive)', function () {
        const tf = new TableUtils.TableFilter([{ field: 'title', name: 'title' }])
        tf.textFilter('title', FilterOperator.AND, [{ operator: FilterConditionOperator.endsWith, value: 'case' }]).insensitive = true
        expect(tf.match(rows[0])).to.be.true
        expect(tf.match(rows[1])).to.be.true
        expect(tf.match(rows[2])).to.be.true
      })
      it('match equalTo (sensitive)', function () {
        const tf = new TableUtils.TableFilter([{ field: 'title', name: 'title' }])
        tf.textFilter('title', FilterOperator.AND, [{ operator: FilterConditionOperator.equalTo, value: 'MIXEDcase' }])
        expect(tf.match(rows[0])).to.be.false
        expect(tf.match(rows[1])).to.be.false
        expect(tf.match(rows[2])).to.be.true
      })
      it('match equalTo (case insensitive)', function () {
        const tf = new TableUtils.TableFilter([{ field: 'title', name: 'title' }])
        tf.textFilter('title', FilterOperator.AND, [{ operator: FilterConditionOperator.equalTo, value: 'mixedCASE' }]).insensitive = true
        expect(tf.match(rows[0])).to.be.false
        expect(tf.match(rows[1])).to.be.false
        expect(tf.match(rows[2])).to.be.true
      })
      it('match notEqualTo (case sensitive)', function () {
        const tf = new TableUtils.TableFilter([{ field: 'title', name: 'title' }])
        tf.textFilter('title', FilterOperator.AND, [{ operator: FilterConditionOperator.notEqualTo, value: 'MIXEDcase' }])
        expect(tf.match(rows[0])).to.be.true
        expect(tf.match(rows[1])).to.be.true
        expect(tf.match(rows[2])).to.be.false
      })
      it('match notEqualTo (case insensitive)', function () {
        const tf = new TableUtils.TableFilter([{ field: 'title', name: 'title' }])
        tf.textFilter('title', FilterOperator.AND, [{ operator: FilterConditionOperator.notEqualTo, value: 'MIXEDcase' }]).insensitive = true
        expect(tf.match(rows[0])).to.be.true
        expect(tf.match(rows[1])).to.be.true
        expect(tf.match(rows[2])).to.be.false
      })
      it('match startNotWith (case sensitive)', function () {
        const tf = new TableUtils.TableFilter([{ field: 'title', name: 'title' }])
        tf.textFilter('title', FilterOperator.AND, [{ operator: FilterConditionOperator.startsNotWith, value: 'MIXEDc' }])
        expect(tf.match(rows[0])).to.be.true
        expect(tf.match(rows[1])).to.be.true
        expect(tf.match(rows[2])).to.be.false
      })
      it('match startNotWith (case insensitive)', function () {
        const tf = new TableUtils.TableFilter([{ field: 'title', name: 'title' }])
        tf.textFilter('title', FilterOperator.AND, [{ operator: FilterConditionOperator.startsNotWith, value: 'MIXEDc' }]).insensitive = true
        expect(tf.match(rows[0])).to.be.true
        expect(tf.match(rows[1])).to.be.true
        expect(tf.match(rows[2])).to.be.false
      })
      it('match startsWith (case sensitive)', function () {
        const tf = new TableUtils.TableFilter([{ field: 'title', name: 'title' }])
        tf.textFilter('title', FilterOperator.AND, [{ operator: FilterConditionOperator.startsWith, value: 'MIXEDc' }])
        expect(tf.match(rows[0])).to.be.false
        expect(tf.match(rows[1])).to.be.false
        expect(tf.match(rows[2])).to.be.true
      })
      it('match startsWith (case insensitive)', function () {
        const tf = new TableUtils.TableFilter([{ field: 'title', name: 'title' }])
        tf.textFilter('title', FilterOperator.AND, [{ operator: FilterConditionOperator.startsWith, value: 'mixedc' }]).insensitive = true
        expect(tf.match(rows[0])).to.be.false
        expect(tf.match(rows[1])).to.be.false
        expect(tf.match(rows[2])).to.be.true
      })

    })
  })
})