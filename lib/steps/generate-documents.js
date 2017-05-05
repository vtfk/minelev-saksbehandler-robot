'use strict'

const generateDocument = require('../generate-document')
const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['generate-documents', data._id])
    if (data.documentTemplates.length > 0) {
      logger('info', ['generate-documents', data._id, 'documents', data.documentTemplates.length])
      const jobs = data.documentTemplates.map(document => generateDocument(document))
      const documents = await Promise.all(jobs)
      data.documents = documents
      logger('info', ['generate-documents', data._id, 'documents generated', documents.length])
    } else {
      logger('info', ['generate-documents', data._id, 'no documents to generate'])
    }
    resolve(data)
  })
}
