'use strict'

const saveFile = require('../save-file')
const { logger } = require('@vtfk/logger')
const config = require('../../config')

module.exports = async data => {
  logger('info', ['save-to-error'])
  if (data.errors.length > 0) {
    const fileName = `${config.ERRORS_DIRECTORY_PATH}/${data._id}.json`
    await saveFile({ filePath: fileName, data: data })
    logger('info', ['save-to-error', fileName, 'success'])
  } else {
    logger('info', ['save-to-error', 'no errors'])
  }
  return data
}
