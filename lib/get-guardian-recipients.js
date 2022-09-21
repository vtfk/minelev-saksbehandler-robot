'use strict'

function isAvailable (parent) {
  const validStats = ['0']
  return validStats.includes(parent['SPES-KD'].toString())
}

module.exports = parents => {
  if (parents.length > 0) return parents.filter(isAvailable)
  return []
}
