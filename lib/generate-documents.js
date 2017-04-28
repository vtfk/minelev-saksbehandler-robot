'use strict'

const logger = require('./logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['generate-documents', data._id])
    resolve(data)
  })
}
