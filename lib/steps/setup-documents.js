'use strict'

const logger = require('../logger')
const archiveMetadata = require('../generate-archive-metadata')
const noGuardianFound = require('../generate-document-no-guardian-found')
const restrictedAddress = require('../generate-document-restricted-address')
const restrictedAddressSamtale = require('../generate-document-restricted-address-ikke-samtale')
const generateDocumentData = require('../generate-document-data')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['setup-documents', data._id])
    // Main document for archive
    const documentData = await generateDocumentData(data.document)
    const archiveDocument = JSON.parse(JSON.stringify(data.document))
    data.documents.push(Object.assign(archiveDocument, {archive: true, archiveMetadata: archiveMetadata({data: data, fileData: documentData})}))
    // Will it be distributed
    if (data.sendToDistribution === true) {
      logger('info', ['setup-documents', data._id, 'distribution needed'])
      data.document.recipients.push(data.recipient)
      if (data.sendCopyToGuardian === true && data.guardiansFound > 0) {
        logger('info', ['setup-documents', data._id, 'distribution guardian', data.recipientCopies.length])
        data.recipientCopies.forEach(recipient => {
          data.document.recipients.push(recipient)
        })
      }
      const distributionDocument = JSON.parse(JSON.stringify(data.document))
      data.documents.push(Object.assign(distributionDocument, {distribution: true, documentData: documentData}))
    }
    // If we should distribute but can't
    if (data.sendToDistribution === false && data.documentTemplate !== 'samtale') {
      logger('info', ['setup-documents', data._id, 'manual distribution'])
      // Is it warning or ikke-samtale
      const document = data.documentTemplate === 'ikke-samtale' ? restrictedAddressSamtale(data) : restrictedAddress(data)
      const documentData = await generateDocumentData(document)
      data.documents.push(Object.assign(document, {archive: true, archiveMetadata: {documentData: documentData}}))
    }

    // If we can't find guardian
    if (data.sendCopyToGuardian === true && data.guardiansFound === 0) {
      logger('info', ['setup-documents', data._id, 'manual distribution guardian'])
      const archiveMetadata = await noGuardianFound(data)
      data.documents.push({archive: true, archiveMetadata: archiveMetadata})
    }
    resolve(data)
  })
}
