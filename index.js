'use strict'

const getNextJobFromQueue = require('./lib/get-next-job-from-queue')
const getFileData = require('./lib/get-file-data')
const saveToNotifications = require('./lib/save-to-notifications')
const prepareDocument = require('./lib/prepare-document')
const lookupDsf = require('./lib/lookup-dsf')
const lookup360 = require('./lib/lookup-360')
const setupDistribution = require('./lib/setup-distribution')
const setupTemplates = require('./lib/setup-templates')
const generateDocuments = require('./lib/generate-documents')
const saveToDone = require('./lib/save-to-done')
const saveToErrors = require('./lib/save-to-errors')
const cleanupDocuments = require('./lib/cleanup-documents')
const removeFromQueue = require('./lib/remove-from-queue')
const logger = require('./lib/logger')

logger('info', ['index', 'start'])

getNextJobFromQueue()
  .then(getFileData)
  .then(saveToNotifications)
  .then(prepareDocument)
  .then(lookupDsf)
  .then(lookup360)
  .then(setupDistribution)
  .then(setupTemplates)
  .then(generateDocuments)
  .then(saveToDone)
  .then(saveToErrors)
  .then(cleanupDocuments)
  .then(removeFromQueue)
  .then((data) => {
    logger('info', ['index', data._id, 'finished'])
    process.exit(0)
  })
  .catch((error) => {
    logger('error', ['index', 'error', JSON.stringify(error)])
    process.exit(1)
  })
