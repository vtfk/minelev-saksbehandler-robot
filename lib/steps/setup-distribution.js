'use strict'

const normalizeContact = require('tfk-dsf-normalize-contact')
const filterGuardian = require('../filter-guardian')
const logger = require('../logger')
const formatSvarUtRecipient = require('../format-svarut-recipient')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['setup-distribution', data._id, data.documentTemplate])
    if (data.dsf !== false) {
      let recipients = []
      let distribution = {
        _id: data._id,
        title: 'Brev fra videregående skole'
      }
      if (data.documentTemplate !== 'samtale') {
        logger('info', ['setup-distribution', data._id, 'needs distribution'])
        data.recipient = normalizeContact(data.dsf.HOV)
        recipients.push(data.recipient)
        data.sendToDistribution = true
      } else {
        logger('info', ['setup-distribution', data._id, 'no need for distribution'])
        data.sendToDistribution = false
      }
      if (data.sendCopyToGuardian !== false) {
        const parents = filterGuardian(data.dsf)
        logger('info', ['setup-distribution', data._id, 'sendCopyToGuardians', parents.length])
        const normalized = parents.map(normalizeContact)
        data.recipientCopies = normalized
        data.guardiansFound = normalized.length
        data.recipientCopies.forEach(recipient => recipients.push(recipient))
      } else {
        logger('info', ['setup-distribution', data._id, 'sendCopyToGuardians', false])
      }
      distribution.recipients = recipients.map(recipient => formatSvarUtRecipient(recipient))

      distribution.shipment = {
        emittingSystem: 'MinElev',
        postingCode: '1111',
        level4login: false,
        encrypted: false,
        digitalDelivery: false
      }

      distribution.printConfiguration = {
        letterType: 'BPOST',
        colorPrint: true,
        duplex: false
      }

      if (data.callbackUrl) {
        distribution.callbackData = {
          _id: data._id,
          system: 'MinElev',
          jobId: data._id,
          url: data.callbackUrl,
          payload: {
            status: 'Sendt via SvarUt'
          }
        }
      }
      data.distribution = distribution
    } else {
      logger('error', ['setup-distribution', data._id, 'missing dsf data'])
    }
    resolve(data)
  })
}
