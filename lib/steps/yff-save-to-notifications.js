const { v4: uuid } = require('uuid')
const saveFile = require('../save-file')
const { logger } = require('@vtfk/logger')
const config = require('../../config')

module.exports = async data => {
  logger('info', ['yff-save-to-notifications', data.documentType, data.documentCategory])

  if (data.documentCategory !== 'yff-bekreftelse-bedrift') {
    logger('info', ['yff-save-to-notifications', 'skipping - category not \'yff-bekreftelse-bedrift\''])
    return data
  }

  const kopiPrEpost = data.kopiPrEpost || data.newDocument.content.bekreftelse.kopiPrEpost || false
  if (!kopiPrEpost || (kopiPrEpost && kopiPrEpost.length === 0)) {
    logger('info', ['yff-save-to-notifications', 'skipping - kopiPrEpost is empty'])
    return data
  }

  if (!data.documents || data.documents.length === 0) {
    logger('info', ['yff-save-to-notifications', 'skipping - no documents found'])
    return data
  }

  const { _id: id, userId, userName, userMail, studentUserName, schoolName } = data
  const document = data.documents[0].archiveMetadata.file
  const recipients = typeof kopiPrEpost === 'string' ? data.kopiPrEpost.split(' ').filter(mail => mail.includes('@') && mail.length > 5) : kopiPrEpost

  if (!recipients || recipients.length === 0) {
    logger('info', ['yff-save-to-notifications', `skipping - no recipients after filtering out invalid emails: ${kopiPrEpost}`])
    return data
  }

  const notification = {
    _id: uuid(),
    system: 'MinElev',
    jobId: id,
    url: config.CALLBACK_SERVICE_URL,
    payload: {
      type: 'yff',
      userId,
      userName,
      userMail,
      studentUserName,
      schoolName,
      sender: `${userName} <${userMail}>`,
      recipients,
      document,
      id
    }
  }

  const fileName = `${config.NOTIFICATIONS_DIRECTORY_PATH}/${notification._id}.json`
  await saveFile({ filePath: fileName, data: notification })

  logger('info', ['yff-save-to-notifications', fileName, 'success'])
  return data
}
