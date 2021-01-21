const getNextJobFromQueue = require('./lib/steps/get-next-job-from-queue')
const getFileData = require('./lib/steps/get-file-data')
const decryptData = require('./lib/steps/decrypt-data')
const convertData = require('./lib/steps/convert-document')
const decideFlow = require('./lib/steps/decide-flow')
const { logger } = require('@vtfk/logger')

logger('info', ['index', 'start'])

getNextJobFromQueue()
  .then(getFileData)
  .then(decryptData)
  .then(convertData)
  .then(decideFlow)
  .then(data => {
    logger('info', ['index', data._id, 'finished'])
    process.exit(0)
  })
  .catch(error => {
    logger('error', ['index', 'error', JSON.stringify(error)])
    process.exit(1)
  })
