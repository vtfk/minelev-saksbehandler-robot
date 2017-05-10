'use strict'

const uuid = require('uuid')
const config = require('../../config')
const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['setup-templates', data._id])
    const documentId = uuid()
    data.documentTemplates.push(Object.assign(data.document, {documentId: documentId, savePath: `${config.ARCIVE_DIRECTORY_PATH}/${documentId}.docx`}))
    resolve(data)
  })
}
