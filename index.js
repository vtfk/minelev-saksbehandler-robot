'use strict'

const getNextJobFromQueue = require('./lib/get-next-job-from-queue')
const getFileData = require('./lib/get-file-data')
const logger = require('./lib/logger')

getNextJobFromQueue()
  .then(getFileData)
  .then((data) => {
    logger('info', ['index', data._id, 'finished'])
  })
  .catch((error) => {
    logger('error', ['index', 'error', JSON.stringify(error)])
    process.exit(1)
  })
