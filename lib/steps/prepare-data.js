const getAge = require('get-age')
const dateFromPersonalId = require('birthdate-from-id')
const { logger } = require('@vtfk/logger')

module.exports = data => {
  return new Promise((resolve, reject) => {
    logger('info', ['prepare-data', data.studentUserName, data.documentType])
    data.errors = []
    data.jobId = data._id
    data.restrictedAddress = true
    data.needsDistribution = !['samtale', 'notat'].includes(data.documentCategory)
    data.sendToDistribution = false
    data.sendCopyToGuardian = getAge(dateFromPersonalId(data.studentId)) < 18 && data.documentType === 'varsel'
    data.guardiansFound = 0
    data.documents = []
    data.recipient = false
    data.recipientCopies = []
    if (data.callbackUrl) {
      data.callbackUrl = `${data.callbackUrl}/logs/${data._id}/status`
    }
    resolve(data)
  })
}
