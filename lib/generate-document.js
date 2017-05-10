'use strict'

const generateDocument = require('generate-docx')
const logger = require('./logger')

module.exports = document => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['generate-document'])

    const options = {
      template: {
        filePath: document.template,
        data: document.data
      },
      save: {
        filePath: document.savePath
      }
    }

    await generateDocument(options)
    resolve(document)
  })
}
