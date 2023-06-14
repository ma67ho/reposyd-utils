export enum QueryConditionOperator {  
  CONTAINS = 'contains',
  CONTAINSNOT = 'containsnot',
  ENDSWITH = 'endswith',
  ENDSNOTWITH = 'endsnotwith',
  EQUALTO = 'eq',
  INCLUDEDIN = 'includedin',
  INDEXOF = 'indexof',
  NOTINCLUDEDIN = 'notincludedin',
  STARTSWITH = 'startswith',
  STARTSNOTWITH = 'startnotswith',
}

export enum QueryConditionType {
  DDL = 'ddl',
  DDO = 'ddo',
  DDLDDO = 'ddo',
}

export enum QuerySubjectType {
  DDOATTRIBUTES = 'ddo.attr',
  DDOPROPERTIES = 'ddo.prop'
}

export interface IQueryCondition {
  // readonly operator: QueryConditionOperator | {
  //   negated?: boolean
  //   type: QueryConditionOperator
  // }
  // readonly ddl?: IQueryConditionLink
  readonly mandatory?: boolean
  readonly name?: string
  readonly operator: QueryConditionOperator
  readonly subject: string | string[]
  readonly type: QueryConditionType
  readonly value: any
}

export interface IQueryConditionObject extends IQueryCondition {
  readonly id: any
}

export interface IQueryConditionLink {
  readonly subl: string
  readonly operator: QueryConditionOperator
  readonly target: string
}

export interface IQueryConditionSubject {
  readonly name: string | IQueryConditionLink
  readonly type: QuerySubjectType
  readonly value: any
}

export interface IQueryDefinition {
  readonly conditions: IQueryCondition[]
  readonly match: string
  readonly required?: boolean
}

function args(condition: IQueryCondition) {
  if (condition.operator === QueryConditionOperator.ENDSWITH || condition.operator === QueryConditionOperator.STARTSWITH) {
    return `'${condition.value}'`
  } else if (condition.operator === QueryConditionOperator.INCLUDEDIN) {
    return `[${condition.value.map(x => {
      if (typeof x === 'string' || isNaN(x)) {
        return `'${x}'`
      }
      return `${x}`
    }).join(',')}]`
  }
  if (typeof condition.value === 'string' || isNaN(condition.value)) {
    return `'${condition.value}'`
  }
  return `${condition.value}`
}

// function asStringArray(c: IQueryCondition): boolean{
//   if (c.operator === QueryConditionOperator.INCLUDEDIN){
//     return true
//   }
//   return false
// }

// function asNumber(c: IQueryCondition){
//   if (c.subject.name === '$id'){
//     return true
//   }
//   if (c.subject.value === 'number'){
//     return true
//   }
//   return false
// }

function returnsBoolean(operator): boolean {
  return [
    QueryConditionOperator.CONTAINS,
    QueryConditionOperator.CONTAINSNOT,
    QueryConditionOperator.ENDSWITH,
    QueryConditionOperator.ENDSNOTWITH,
    QueryConditionOperator.INCLUDEDIN,
    QueryConditionOperator.NOTINCLUDEDIN,
    QueryConditionOperator.STARTSWITH,
    QueryConditionOperator.STARTSNOTWITH
  ].includes(operator)
}

function returnsNumber(operator): boolean {
  return [
    QueryConditionOperator.INDEXOF
  ].includes(operator)
}

const NegatedOperator = [QueryConditionOperator.ENDSNOTWITH, QueryConditionOperator.NOTINCLUDEDIN, QueryConditionOperator.STARTSNOTWITH]
function isNegated(c: IQueryCondition) {
  return NegatedOperator.includes(c.operator)
}

export function multipleValuesAllowed(op: QueryConditionOperator) {
  if (op === QueryConditionOperator.INCLUDEDIN) {
    return true
  }
  return false
}

function uriOperator(op: QueryConditionOperator): string {
  if (op === QueryConditionOperator.ENDSNOTWITH) {
    return QueryConditionOperator.ENDSWITH
  } else if (op === QueryConditionOperator.NOTINCLUDEDIN) {
    return QueryConditionOperator.INCLUDEDIN
  } else if (op === QueryConditionOperator.STARTSNOTWITH) {
    return QueryConditionOperator.STARTSWITH
  }
  return op
}
// export function operator(c: IQueryCondition): string {
//   if (c === null || c.operator === null) {
//     return null
//   }
//   if (typeof c.operator === 'object'){
//     return c.operator.type
//   }
//   return c.operator
// }

// export function allowedOperators(c: IQueryCondition): string[] {
//   if (c.subject.type === QuerySubjectType.DDOPROPERTIES){
//     if (c.subject.name === '$id'){
//       return ['eq', 'ge', 'gt', 'le', 'lt', 'ne', 'includedin']
//     }
//   } else if (c.subject.type === QuerySubjectType.DDOATTRIBUTES){
//     if (c.subject.value === 'number'){
//       return ['eq', 'ge', 'gt', 'le', 'lt', 'includedin',]
//     } else if (c.subject.value === 'string'){
//       return ['eq', 'ge', 'gt', 'le', 'lt', 'endswith', 'endsnotwith', 'includedin', 'startswith', 'startsnotwith']
//     }
//   }
//   return []
// }

export function toURI(definition: IQueryDefinition): string {
  const frags = []

  for (const cond of definition.conditions) {
    if (cond.type === QueryConditionType.DDL) {
      frags.push(`${cond.subject[0]}->${cond.subject[1]} ${cond.subject[2]} ${uriOperator(cond.operator)} ${args(cond)}`)
    } else if (cond.type === QueryConditionType.DDO) {
      if (returnsBoolean(cond.operator)) {
        frags.push(`${uriOperator(cond.operator)}(${cond.subject},${args(cond)}) eq ${isNegated(cond) ? 'false' : 'true'}`)
      } else if (returnsNumber(cond.operator)) {
        frags.push(`${uriOperator(cond.operator)}(${cond.subject},${args(cond)}) ${uriOperator(cond.operator)} ${cond.value}`)
        } else {
        frags.push(`${cond.subject} ${uriOperator(cond.operator)} ${args(cond)}`)
      }
    }
  }

  return frags.join(definition.match === 'and' ? ' and ' : ' or ')
}

export function subjects(condition: IQueryCondition, attributes?: Record<string, string>): string[] {
  const l = []
  return l
}

export function subjectType(condition: IQueryCondition, attributes?: Record<string, string>): string {
  attributes = attributes || {}
  const s = Array.isArray(condition.subject) ? condition.subject[2] : condition.subject
  if (s === '$counter') {
    return 'number'
  } else if (s === '$id' || s === '@id') {
    return 'number'
  } else if (s === '$puid' || s === '@puid') {
    return 'string'
  } else if (s === '$owner' || s === '@owner') {
    return 'team'
  } else if (s === '$responsible' || s === '@responsible') {
    return 'team?'
  } else if (s === '$uuid' || s === '@uuid') {
    return 'uuid'
  }
  const atype = attributes[s]
  if (atype === 'number' || atype === 'string') {
    return 'string'
  }
  return null
}

export function valueType(condition: IQueryCondition, attributes?: Record<string, string>) {
  attributes = attributes || {}
  const s = Array.isArray(condition.subject) ? condition.subject[2] : condition.subject
  if (s === '$counter') {
    return 'number'
  } else if (s === '$id' || s === '@id') {
    return 'number'
  } else if (s === '$puid' || s === '@puid') {
    return 'string'
  } else if (s === '$owner' || s === '@owner') {
    return 'team'
  } else if (s === '$responsible' || s === '@responsible') {
    return 'team?'
  } else if (s === '$uuid' || s === '@uuid') {
    return 'uuid'
  }
  const atype = attributes[s]
  if (atype === 'number' || atype === 'string') {
    return 'string'
  }
  return null
}