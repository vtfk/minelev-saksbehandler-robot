'use strict'

const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['got-address-for-distribution', data._id])

    if (data.dsfError) {
      logger('info', ['got-address-for-distribution', data._id, 'skipped due to dsfError'])
    } else if (data.needsDistribution === true && data.sendToDistribution === true) {
      if (data.dsfContact.POSTS === '') {
        logger('warn', ['got-address-for-distribution', data._id, 'no address found'])
        data.restrictedAddress = false
        data.sendToDistribution = false
      } else {
        logger('info', ['got-address-for-distribution', data._id, 'address OK'])
      }
    } else {
      logger('info', ['got-address-for-distribution', data._id, 'skipped due to no distribution needed'])
    }
    resolve(data)
  })
}
