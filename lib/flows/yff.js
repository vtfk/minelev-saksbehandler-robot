const prepareData = require('../steps/prepare-data')
const prepareDocument = require('../steps/yff-prepare-document')
const lookupKrr = require('../steps/lookup-krr')
const lookupDsf = require('../steps/lookup-dsf')
const lookup360 = require('../steps/lookup-360')
const filterSecretAddress = require('../steps/filter-secret-address')
const checkSecretAddress = require('../steps/check-secret-address')
const gotAddressForDistribution = require('../steps/got-address-for-distribution')
const setupDistribution = require('../steps/setup-distribution')
const setupDocuments = require('../steps/yff-setup-documents')
const setupArchive = require('../steps/setup-archive')
const saveToDone = require('../steps/save-to-done')
const saveToArchive = require('../steps/save-to-archive')
const saveToDistribution = require('../steps/save-to-distribution')
const saveToNotifications = require('../steps/yff-save-to-notifications')
const saveToErrors = require('../steps/save-to-errors')
const removeFromQueue = require('../steps/remove-from-queue')
const { logger } = require('@vtfk/logger')

module.exports = data => {
  return new Promise((resolve, reject) => {
    logger('info', ['flows', 'yff', data.studentUserName])
    prepareData(data)
      .then(prepareDocument)
      .then(lookupKrr)
      .then(lookupDsf)
      .then(filterSecretAddress)
      .then(setupDistribution)
      .then(lookup360)
      .then(checkSecretAddress)
      .then(gotAddressForDistribution)
      .then(setupDocuments)
      .then(setupArchive)
      .then(saveToDone)
      .then(saveToNotifications)
      .then(saveToArchive)
      .then(saveToDistribution)
      .then(saveToErrors)
      .then(removeFromQueue)
      .then(data => {
        return resolve(data)
      })
      .catch(error => {
        logger('error', ['flows', 'yff', error])
        return reject(error)
      })
  })
}
