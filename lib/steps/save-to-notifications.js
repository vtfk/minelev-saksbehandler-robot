const { v4: uuid } = require('uuid')
const saveFile = require('../save-file')
const { logger } = require('@vtfk/logger')
const config = require('../../config')

module.exports = async data => {
  logger('info', ['save-to-notifications', data.documentType])
  if (data.errors.length > 0) {
    logger('warn', ['save-to-notifications', 'errors', data.errors.length])
    return data
  }

  const { _id: id, userId, userName, studentUserName } = data

  const notification = {
    _id: uuid(),
    system: 'MinElev',
    jobId: id,
    url: config.NOTIFICATIONS_SERVICE_URL,
    payload: {
      userId,
      studentUserName,
      userName,
      id
    }
  }

  const fileName = `${config.NOTIFICATIONS_DIRECTORY_PATH}/${notification._id}.json`
  await saveFile({ filePath: fileName, data: notification })

  logger('info', ['save-to-notifications', fileName, 'success'])
  return data
}
