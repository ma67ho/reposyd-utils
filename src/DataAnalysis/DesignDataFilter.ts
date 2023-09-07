export function match (designData, filter) {
  if (designData.dd.type === 'ddo') {
    if (Array.isArray(filter.responsible) && !filter.responsible.includes(designData.dd.ddo.responsible.uuid)) {
      return false
    }
    if (filter.attributes !== undefined && filter.attributes !== null && filter.attributes.trim() !== '') {
      const needle = filter.attributes.toLowerCase()
      for (const key of Object.keys(designData.dd.ddo.attributes)) {
        if (String(designData.dd.ddo.attributes[key]).toLowerCase().includes(needle)) {
          return true
        }
      }
      if (designData.dd.ddo.puid.toLowerCase().includes(needle)) {
        return true
      }
      return false
    }
  }
  return true
}
