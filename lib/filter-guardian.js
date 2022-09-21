'use strict'

const getParents = require('./get-parents')
const getGuardianRecipient = require('./get-guardian-recipients')

module.exports = data => {
  const parents = getParents(data)
  return getGuardianRecipient(parents)
}
