'use strict'

const isHemmelig = require('tfk-is-hemmelig-adresse')
const { logger } = require('@vtfk/logger')
const { SVARUT_EXCEPTION_ENABLED, SVARUT_EXCEPTION_LIST } = require('../../config')

const hasSvarutException = (dsfContact) => {
  if (!SVARUT_EXCEPTION_ENABLED) return false
  const fnr = `${dsfContact.FODT}${dsfContact.PERS}`
  if (SVARUT_EXCEPTION_LIST.includes(fnr)) return true
  return false
}

module.exports = async data => {
  logger('info', ['check-secret-address'])

  if (data.sendToDistribution === true) {
    if (data.dsf === false) {
      logger('info', ['check-secret-address', 'skipped due to missing dsf data'])
    } else {
      const restrictedDsf = isHemmelig(data.dsfContact)
      const restricted360 = data.p360Contact ? isHemmelig(data.p360Contact) : false
      const svarutException = hasSvarutException(data.dsfContact)

      const gotRestrictedAddress = restricted360 || restrictedDsf || svarutException

      logger('info', ['check-secret-address', 'gotRestrictedAddress', gotRestrictedAddress, 'restrictedDsf', restrictedDsf, 'restricted360', restricted360, 'svarutException', svarutException])

      data.restrictedAddress = gotRestrictedAddress

      data.sendToDistribution = !gotRestrictedAddress
    }
  } else {
    logger('info', ['check-secret-address', 'skipped due to no distribution'])
  }
  return data
}
