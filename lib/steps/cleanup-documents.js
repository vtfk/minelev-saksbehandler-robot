'use strict'

// const deleteFile = require('./delete-file')
const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['cleanup-documents', data._id])
    if (data.errors.length > 0) {
      logger('info', ['cleanup-documents', 'errors detected', data.errors.length, 'cleanup initiated'])
    } else {
      logger('info', ['cleanup-documents', 'no errors detected'])
    }
    resolve(data)
  })
}
