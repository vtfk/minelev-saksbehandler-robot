'use strict'

const deleteFile = require('../delete-file')
const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['cleanup-documents', data._id])
    if (data.errors.length > 0) {
      logger('info', ['cleanup-documents', 'errors detected', data.errors.length, 'cleanup initiated'])
      const jobs = data.documents.map(document => deleteFile(document.filePath))
      logger('info', ['cleanup-documents', 'ready to cleanup', jobs.length(), 'files'])
      const done = await Promise.all(jobs)
      logger('info', ['cleanup-documents', 'deleted', done.length(), 'files'])
    } else {
      logger('info', ['cleanup-documents', 'no errors detected'])
    }
    resolve(data)
  })
}
