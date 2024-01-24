import { build } from "./ConditionBuilder"
import ConditionParser from "./ConditionParser"



export default function (key, group, results) {
  if (group.condition === undefined) {
    return results.filter(result => result !== null && result.props !== undefined && result.props[key] === group.key)
  }
  const condition = build(ConditionParser.parse(group.condition))
  return results.filter(result => {
    return condition(key, group, result)
  })
}