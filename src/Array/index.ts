/**
 * Moves an array item
 * @param  {array} array The array to be modified
 * @param  {number} at The position of the item to be moved
 * @param  {number} to The item's new position
 * @returns {array} Returns the given array object.
 * @since 0.1.0
 * @memberof module:Utils/Array
 */
 function move (array: any , at: number, to: number): [] {
  return array.map((item, index, array) => {
    if (index === at) return array[to]
    else if (index === to) return array[at]
    else return item
  })
}

export default {
  move
}
