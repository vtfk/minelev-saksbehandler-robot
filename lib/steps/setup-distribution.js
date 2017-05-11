'use strict'

const normalizeContact = require('tfk-dsf-normalize-contact')
const filterGuardian = require('../filter-guardian')
const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['setup-distribution', data._id])
    if (data.dsf !== false) {
      if (data.documentTemplate !== 'samtale') {
        logger('info', ['setup-distribution', data._id, 'needs distribution'])
        data.recipient = normalizeContact(data.dsf.HOV)
        data.sendToDistribution = true
      }
      if (data.sendCopyToGuardian !== false) {
        const parents = filterGuardian(data.dsf)
        logger('info', ['setup-distribution', data._id, 'sendCopyToGuardians', parents.length])
        const normalized = parents.map(normalizeContact)
        data.recipientCopies = normalized
        data.guardiansFound = normalized.length
      } else {
        logger('info', ['setup-distribution', data._id, 'sendCopyToGuardians', false])
      }
    } else {
      logger('error', ['setup-distribution', data._id, 'missing dsf data'])
    }
    resolve(data)
  })
}
