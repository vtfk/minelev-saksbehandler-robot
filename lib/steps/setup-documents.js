'use strict'

const { logger } = require('@vtfk/logger')
const archiveMetadata = require('../generate-archive-metadata')
const noGuardianFound = require('../generate-document-no-guardian-found')
const restrictedAddress = require('../generate-document-restricted-address')
const restrictedAddressSamtale = require('../generate-document-restricted-address-ikke-samtale')
const generateDocumentData = require('../generate-document-data')

module.exports = async data => {
  logger('info', ['setup-documents'])
  // Main document for archive
  // add address
  if (data.recipient) {
    data.newDocument.recipient = data.recipient
  }
  const documentData = await generateDocumentData(data)
  const archiveDocument = JSON.parse(JSON.stringify(data.document))
  const archiveMetadataDocument = archiveMetadata({ data: data, fileData: documentData })
  data.documents.push(Object.assign(archiveDocument, { archive: true, archiveMetadata: archiveMetadataDocument }))
  logger('info', ['setup-documents', 'archiveMetadataDocument added to data.documents'])
  // Will it be distributed
  if (data.sendToDistribution === true) {
    logger('info', ['setup-documents', 'distribution needed'])
    data.document.recipients.push(data.recipient)
    if (data.sendCopyToGuardian === true && data.guardiansFound > 0) {
      logger('info', ['setup-documents', 'distribution guardian', data.recipientCopies.length])
      data.recipientCopies.forEach(recipient => {
        data.document.recipients.push(recipient)
      })
    }
    const distributionDocument = JSON.parse(JSON.stringify(data.document))
    data.documents.push(Object.assign(distributionDocument, { distribution: true, file: archiveMetadataDocument.file }))
  }
  // If we should distribute but can't
  if (data.sendToDistribution === false && !['samtale', 'notat'].includes(data.documentTemplate)) {
    logger('info', ['setup-documents', 'manual distribution', data.documentTemplate])
    // Is it warning or ikke-samtale
    const document = data.documentTemplate === 'ikke-samtale' ? await restrictedAddressSamtale(data) : await restrictedAddress(data)
    data.documents.push(Object.assign({ archive: true, archiveMetadata: document }))
    logger('info', ['setup-documents', 'manual distribution', data.documentTemplate, 'document added to data.documents'])
  }

  // If we can't find guardian
  if (data.sendCopyToGuardian === true && data.guardiansFound === 0) {
    logger('info', ['setup-documents', 'manual distribution guardian'])
    const archiveMetadata = await noGuardianFound(data)
    data.documents.push({ archive: true, archiveMetadata: archiveMetadata })
  }
  return data
}
