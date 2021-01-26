'use strict'

const saveFile = require('../save-file')
const { logger } = require('@vtfk/logger')
const config = require('../../config')

module.exports = async data => {
  logger('info', ['save-to-archive'])
  if (data.errors.length === 0) {
    logger('info', ['save-to-arcive', 'no errors', 'saving to archive'])
    // Looping through documents generating archive jobs
    const fileName = `${config.ARCIVE_DIRECTORY_PATH}/${data._id}.json`
    await saveFile({ filePath: fileName, data: data.archive })
  } else {
    logger('warn', ['save-to-archive', 'errors', data.errors.length])
  }
  return data
}
