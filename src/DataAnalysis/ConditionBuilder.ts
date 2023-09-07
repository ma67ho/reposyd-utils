import ConditionParser from "./ConditionParser"

export function build(condition) {
  if (typeof condition === 'string') {
    condition = ConditionParser.parse(condition)
  }
  if (condition.type === 'group') {
    const f1 = build(condition.value[0])
    const f2 = build(condition.value[1])
    if (condition.operator === 'and') {
      return (key, group, result) => {
        return f1(key, group, result) && f2(key, group, result)
      }
    } else if (condition.operator === 'or') {
      return (key, group, result) => {
        return f1(key, group, result) || f2(key, group, result)
      }
    }
  } else if (condition.type === 'operator') {
    if (condition.subject === '#result') {
      if (condition.operator === 'eq') {
        return (key, group, result) => result.result === condition.value
      } else if (condition.operator === 'ne') {
        (key, group, result) => result.result !== condition.value
      }
    }
  } else if (condition.type === 'property') {
    if (condition.operator === 'eq') {
      return (key, group, item) => {
        if (item.result === null) {
          return false
        }
        let v = condition.value
        if (condition.value === '#groupkey') [
          v = group.key
        ]
        return item.result.props[condition.subject] === v
      }
    }
  } else if (condition.type === 'object') {
    if (condition.operator === 'eq') {
      return (key, group, result) => result.result === condition.value
    } else if (condition.operator === 'ne') {
      (key, group, result) => result.result !== condition.value
    }
}
  return () => true
}
