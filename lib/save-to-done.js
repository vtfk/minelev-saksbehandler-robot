'use strict'

const saveFile = require('./save-file')
const logger = require('./logger')
const config = require('../config')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['save-to-done', data.id])
    await saveFile({filePath: config.DONE_DIRECTORY_PATH, data: data})
    resolve(data)
  })
}
