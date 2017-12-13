const normalizeContact = require('tfk-dsf-normalize-contact')
const uuid = require('uuid')
const filterGuardian = require('../filter-guardian')
const logger = require('../logger')
const formatSvarUtRecipient = require('../format-svarut-recipient')
const config = require('../../config')

function generateSvarutTitle (data) {
  let title = 'Brev fra videregående skole'
  if (/yff/.test(data.documentCategory) === true) {
    if (data.documentCategory === 'yff-bekreftelse') {
      title = 'Bekreftelse om utplassering hos virksomhet'
    } else if (data.documentCategory === 'yff-bekreftelse-bedrift') {
      title = 'Bekreftelse om utplassering av elev'
    } else if (data.documentCategory === 'yff-tilbakemelding') {
      title = 'Tilbakemelding etter utplassering hos virksomhet'
    } else if (data.documentCategory === 'yff-lokalplan') {
      title = 'Oppdatert lokal læreplan'
    }
  }
  return title
}

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['setup-distribution', data._id, data.documentTemplate])
    if (data.dsf !== false) {
      let recipients = []
      let distribution = {
        _id: data._id,
        title: generateSvarutTitle(data)
      }
      if (data.needsDistribution === true) {
        logger('info', ['setup-distribution', data._id, 'needs distribution', data.documentCategory])
        data.recipient = data.documentCategory !== 'yff-bekreftelse-bedrift' ? normalizeContact(data.dsf.HOV) : data.bedriftsData
        recipients.push(data.recipient)
        data.sendToDistribution = true
      } else {
        logger('info', ['setup-distribution', data._id, 'no need for distribution'])
        data.recipient = normalizeContact(data.dsf.HOV)
        data.sendToDistribution = false
      }
      if (data.sendToDistribution === true) {
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
          postingCode: config.DISTRIBUTION_CODE,
          level4login: false,
          encrypted: false,
          digitalDelivery: false
        }

        distribution.printConfiguration = {
          letterType: config.DISTRIBUTION_LETTER_TYPE,
          colorPrint: true,
          duplex: false
        }

        if (data.callbackUrl) {
          distribution.callbackData = {
            _id: uuid(),
            system: 'MinElev',
            jobId: data._id,
            url: data.callbackUrl,
            payload: {
              status: 'Sendt via SvarUt'
            }
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
