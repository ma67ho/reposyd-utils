/**
 * @typedef {string} uuid A string containing an UUID encapsulated by {}
 */

import { v4 as uuidv4 } from 'uuid'

/**
 * Generates an UUID
 * @function generate
 * @returns {uuid} An UUID
 * @since 0.1.0
 * @memberof module:Utils/Uuid
 */
function generate(): string {
  return '{' + uuidv4() + '}'
}

function temporary(): string {
  return '{T-' + uuidv4() + '}'
}

function isTemporary(uuid: string): boolean {
  if (typeof uuid !== 'string') {
    return false
  }
  if (uuid.length !== 40) {
    return false
  }
  if (!uuid.startsWith('{T-')) {
    return false
  }
  if (!uuid.endsWith('}')) {
    return false
  }
  return true

}
/**
* @param  {uuid} uuid A string containing an UUID
* @returns {boolean} Returns true if the string object contains a valid UUID; otherwise false.
* @since 0.1.0
* @memberof module:Utils/Uuid
*/
function isUuid(uuid: string): boolean {
  if (typeof uuid !== 'string') {
    return false
  }
  if (uuid.length !== 38) {
    return false
  }
  if (uuid[0] !== '{') {
    return false
  }
  if (uuid[uuid.length - 1] !== '}') {
    return false
  }
  return true
}

/**
 * @module Utils/Uuid
 */
export default {
  generate,
  isTemporary,
  isUuid,
  temporary
}
