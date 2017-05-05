'use strict'

const saveFile = require('../save-file')
const logger = require('../logger')
const config = require('../../config')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['save-to-notifications', data._id, data.documentType])
    if (data.documentType !== 'samtale') {
      const fileName = `${config.NOTIFICATIONS_DIRECTORY_PATH}/${data._id}.json`
      await saveFile({filePath: fileName, data: data})
      logger('info', ['save-to-notifications', data._id, fileName, 'success'])
    } else {
      logger('info', ['save-to-notifications', data._id, 'notification not needed'])
    }
    resolve(data)
  })
}
