const logger = require('../logger')
const archiveMetadata = require('../generate-archive-metadata')
const restrictedAddress = require('../yff-generate-document-restricted-address')
const generateDocumentData = require('../generate-document-data')

module.exports = async data => {
  logger('info', ['yff-setup-documents', data._id])
  // Main document for archive
  const documentData = await generateDocumentData(data.document)
  const archiveDocument = JSON.parse(JSON.stringify(data.document))
  const archiveMetadataDocument = archiveMetadata({ data: data, fileData: documentData })
  data.documents.push(Object.assign({}, archiveDocument, { archive: true, archiveMetadata: archiveMetadataDocument }))
  logger('info', ['yff-setup-documents', data._id, 'archiveMetadataDocument added to data.documents'])
  // Will it be distributed
  if (data.sendToDistribution === true) {
    logger('info', ['yff-setup-documents', data._id, 'distribution needed'])
    data.document.recipients.push(data.recipient)
    const distributionDocument = JSON.parse(JSON.stringify(data.document))
    data.documents.push(Object.assign({}, distributionDocument, { distribution: true, file: archiveMetadataDocument.file }))
  }
  // If we should distribute but can't
  if (data.sendToDistribution === false) {
    logger('info', ['yff-setup-documents', data._id, 'manual distribution', data.documentTemplate])
    const document = await restrictedAddress(data)
    data.documents.push(Object.assign({ archive: true, archiveMetadata: document }))
    logger('info', ['yff-setup-documents', data._id, 'manual distribution', data.documentTemplate, 'document added to data.documents'])
  }

  return data
}
