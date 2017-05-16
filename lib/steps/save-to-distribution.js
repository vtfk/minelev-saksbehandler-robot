'use strict'

const saveFile = require('../save-file')
const logger = require('../logger')
const config = require('../../config')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['save-to-distribution', data._id])
    if (data.errors.length === 0) {
      logger('info', ['save-to-distribution', data._id, 'no errors', 'saving to distribution'])
      // Looping through documents generating distribution jobs
      const fileName = `${config.DISTRIBUTION_DIRECTORY_PATH}/${data._id}.json`
      await saveFile({filePath: fileName, data: data})
    } else {
      logger('warn', ['save-to-distribution', data._id, 'errors', data.errors.length])
    }
    resolve(data)
  })
}
