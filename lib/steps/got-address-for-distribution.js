'use strict'

const { logger } = require('@vtfk/logger')

module.exports = async data => {
  logger('info', ['got-address-for-distribution'])

  if (data.dsf === false) {
    logger('info', ['got-address-for-distribution', 'skipped due to missing dsf data'])
  } else if (data.needsDistribution === true && data.sendToDistribution === true) {
    if (data.dsfContact.POSTS === '') {
      logger('warn', ['got-address-for-distribution', 'no address found'])
      data.restrictedAddress = true
      data.sendToDistribution = false
    } else {
      logger('info', ['got-address-for-distribution', 'address OK'])
    }
  } else {
    logger('info', ['got-address-for-distribution', 'skipped due to no distribution needed'])
  }
  return data
}
