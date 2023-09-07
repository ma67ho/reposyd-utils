import { build } from "./ConditionBuilder"
import ConditionParser from "./ConditionParser"



export default function (key, group, results) {
  if (group.condition === undefined) {
    return results.filter(result => result !== null && result.props[key] === group.key)
  }
  // const conditions = build(ConditionParser.parse(group.condition))
  const condition = build(ConditionParser.parse(group.condition))
  return results.filter(result => {
    // eslint-disable-next-line no-debugger
    // debugger;
    return condition(key, group, result)
  })

  // if (Array.isArray(f.subject)) {
  //   if (f.subject[0] === '$property') {
  //     if (f.operator === 'eq') {
  //       conditions.push((key, group, result) => result.result !== null && result.props[f.subject[1]] === f.value)
  //     }
  //   }
  // } else if (f.subject === '$result') {
  //   if (f.operator === 'eq') {
  //     conditions.push((key, group, result) => result.result === f.value)
  //   } else if (f.operator === 'ne') {
  //     conditions.push((key, group, result) => result.result !== f.value)
  //   }
  // }

  // return results.filter(result => match(key, group, conditions, result))
}