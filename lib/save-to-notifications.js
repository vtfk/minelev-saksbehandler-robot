'use strict'

const saveFile = require('./save-file')
const logger = require('./logger')
const config = require('../config')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['save-to-notifications', data._id, data.documentType])
    if (data.documentType === 'varsel') {
      const fileName = `${config.NOTIFICATIONS_DIRECTORY_PATH}/${data._id}.json`
      await saveFile({filePath: fileName, data: data})
    } else {
      logger('info', ['save-to-notifications', data._id, 'notofications skipped'])
    }
    resolve(data)
  })
}
