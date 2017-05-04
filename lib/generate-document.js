'use strict'

const generateDocument = require('generate-docx')
const logger = require('./logger')

module.exports = document => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['generate-document'])
    await generateDocument(document)
    resolve(document)
  })
}
