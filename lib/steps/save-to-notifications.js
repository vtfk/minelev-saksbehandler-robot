const uuid = require('uuid')
const saveFile = require('../save-file')
const logger = require('../logger')
const config = require('../../config')

module.exports = async data => {
  logger('info', ['save-to-notifications', data._id, data.documentType])
  const notification = {
    _id: uuid(),
    system: 'MinElev',
    jobId: data._id,
    url: config.NOTIFICATIONS_SERVICE_URL,
    payload: data
  }
  const fileName = `${config.NOTIFICATIONS_DIRECTORY_PATH}/${notification._id}.json`
  await saveFile({ filePath: fileName, data: notification })
  logger('info', ['save-to-notifications', data._id, fileName, 'success'])
  return data
}
