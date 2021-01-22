const prepareData = require('../steps/prepare-data')
const prepareDocument = require('../steps/prepare-document')
const setupDocuments = require('../steps/setup-documents')
const setupArchive = require('../steps/setup-archive')
const saveToDone = require('../steps/save-to-done')
const saveToArchive = require('../steps/save-to-archive')
const saveToErrors = require('../steps/save-to-errors')
const removeFromQueue = require('../steps/remove-from-queue')
const { logger } = require('@vtfk/logger')

module.exports = data => {
  return new Promise((resolve, reject) => {
    logger('info', ['flows', 'notat', data._id, data.studentUserName])
    prepareData(data)
      .then(prepareDocument)
      .then(setupDocuments)
      .then(setupArchive)
      .then(saveToDone)
      .then(saveToArchive)
      .then(saveToErrors)
      .then(removeFromQueue)
      .then(data => {
        return resolve(data)
      })
      .catch(error => {
        return reject(error)
      })
  })
}
