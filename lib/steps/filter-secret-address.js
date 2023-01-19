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
  logger('info', ['filter-secret-address'])
  return new Promise((resolve) => {
    if (data.dsf === false) {
      logger('info', ['filter-secret-address', 'skipped due to missing dsf data'])
    } else {
      const restrictedDsf = isHemmelig(data.dsfContact)
      const svarutException = hasSvarutException(data.dsfContact)

      logger('info', ['filter-secret-address', 'gotRestrictedAddress', 'restrictedDsf', restrictedDsf, 'svarutException', svarutException])

      if (restrictedDsf || svarutException) {
        data.dsfContact.ADR = ''
        data.dsfContact.POSTN = ''
        data.dsfContact.POSTS = ''

        data.dsf.HOV.ADR = ''
        data.dsf.HOV.POSTN = ''
        data.dsf.HOV.POSTS = ''
        if (data.dsf.FOR) delete data.dsf.FOR

        logger('info', ['filter-secret-address', 'filtered address fields'])
      }

      data.restrictedAddress = restrictedDsf || svarutException
    }
    resolve(data)
  })
}
