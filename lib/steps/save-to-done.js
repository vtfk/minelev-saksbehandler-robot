'use strict'

const saveFile = require('../save-file')
const { logger } = require('@vtfk/logger')
const config = require('../../config')

module.exports = async data => {
  logger('info', ['save-to-done'])
  if (data.errors.length === 0) {
    logger('info', ['save-to-done', 'no errors', 'saving to done'])
    const fileName = `${config.DONE_DIRECTORY_PATH}/${data._id}.json`
    await saveFile({ filePath: fileName, data: data })
  } else {
    logger('warn', ['save-to-done', 'errors', data.errors.length])
  }
  return data
}
