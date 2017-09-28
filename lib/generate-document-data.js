'use strict'

const generateDocument = require('generate-docx')
const logger = require('./logger')

module.exports = document => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['generate-document-data', 'template', document.template])

    const options = {
      template: {
        filePath: document.template,
        data: document.data
      }
    }

    const buffer = await generateDocument(options)

    resolve(buffer.toString('base64'))
  })
}
