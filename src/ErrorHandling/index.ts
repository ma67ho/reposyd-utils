export default {
  isVersionConflict: (error): boolean => {
    if (!error || !error.response){
      return false
    }
    return error.response.status === 409 &&
    error.response.data.code === 'DesignDataVersionConflict'
  }
}