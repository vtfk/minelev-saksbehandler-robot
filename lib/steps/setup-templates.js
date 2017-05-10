'use strict'

const uuid = require('uuid')
const config = require('../../config')
const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['setup-templates', data._id])

    // Main document for archive and distribution
    const documentId = uuid()
    data.documentTemplates.push(Object.assign(data.document, {documentId: documentId, savePath: `${config.ARCIVE_DIRECTORY_PATH}/${documentId}.docx`}))
    if (data.sendToDistribution) {
      const documentId = uuid()
      data.documentTemplates.push(Object.assign(data.document, {documentId: documentId, savePath: `${config.DISTRIBUTION_DIRECTORY_PATH}/${documentId}.docx`}))
    }

    // If we should distribute but can't
    if (data.sendToDistribution === false && data.template !== 'samtale') {
      logger('info', ['setup-templates', data._id, 'manual distribution'])
    }

    // If we can't find guardian
    if (data.sendCopyToGuardian === true && data.guardiansFound === 0) {
      logger('info', ['setup-templates', data._id, 'manual distribution guardian'])
    }

    resolve(data)
  })
}
