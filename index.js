'use strict'

const getNextJobFromQueue = require('./lib/get-next-job-from-queue')
const getFileData = require('./lib/get-file-data')
const saveToNotifications = require('./lib/save-to-notifications')
const prepareDocument = require('./lib/prepare-document')
const saveToDone = require('./lib/save-to-done')
const logger = require('./lib/logger')

logger('info', ['index', 'start'])

getNextJobFromQueue()
  .then(getFileData)
  .then(saveToNotifications)
  .then(prepareDocument)
  .then(saveToDone)
  .then((data) => {
    logger('info', ['index', data._id, 'finished'])
    process.exit(0)
  })
  .catch((error) => {
    logger('error', ['index', 'error', JSON.stringify(error)])
    process.exit(1)
  })
