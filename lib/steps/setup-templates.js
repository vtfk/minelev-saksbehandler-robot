'use strict'

const uuid = require('uuid')
const config = require('../../config')
const logger = require('../logger')
const archiveMetadata = require('../generate-archive-metadata')
const noGuardianFound = require('../generate-document-no-guardian-found')
const restrictedAddress = require('../generate-document-restricted-address')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['setup-templates', data._id])

    // Main document for archive
    const documentId = uuid()
    data.documentTemplates.push(Object.assign(data.document, {archive: true, documentId: documentId, savePath: `${config.ARCIVE_DIRECTORY_PATH}/${documentId}.docx`, archiveMetadata: archiveMetadata({data: data, documentId: documentId})}))
    // If we should distribute but can't
    if (data.sendToDistribution === false && data.template !== 'samtale') {
      logger('info', ['setup-templates', data._id, 'manual distribution'])
      const document = restrictedAddress(data)
      const documentId = uuid()
      data.documentTemplates.push(Object.assign(document, {archive: true, documentId: documentId, savePath: `${config.ARCIVE_DIRECTORY_PATH}/${documentId}.docx`}))
    }

    // If we can't find guardian
    if (data.sendCopyToGuardian === true && data.guardiansFound === 0) {
      logger('info', ['setup-templates', data._id, 'manual distribution guardian'])
      const document = noGuardianFound(data)
      const documentId = uuid()
      data.documentTemplates.push(Object.assign(document, {archive: true, documentId: documentId, savePath: `${config.ARCIVE_DIRECTORY_PATH}/${documentId}.docx`}))
    }

    // Will it be distributed
    if (data.sendToDistribution === true) {
      logger('info', ['setup-templates', data._id, 'distribution needed'])
      data.document.recipients.push(data.recipient)
      if (data.sendCopyToGuardian === true && data.guardiansFound > 0) {
        logger('info', ['setup-templates', data._id, 'distribution guardian', data.recipientCopies.length])
        data.recipientCopies.forEach(recipient => {
          data.document.recipients.push(recipient)
        })
      }
      const documentId = uuid()
      data.documentTemplates.push(Object.assign(data.document, {distribution: true, documentId: documentId, savePath: `${config.DISTRIBUTION_DIRECTORY_PATH}/${documentId}.docx`}))
    }

    resolve(data)
  })
}
