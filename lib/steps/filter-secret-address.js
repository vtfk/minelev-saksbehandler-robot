'use strict'

const isHemmelig = require('tfk-is-hemmelig-adresse')
const { logger } = require('@vtfk/logger')

module.exports = async data => {
  logger('info', ['filter-secret-address'])
  return new Promise((resolve) => {
    if (data.dsf === false) {
      logger('info', ['filter-secret-address', 'skipped due to missing dsf data'])
    } else {
      const restrictedDsf = isHemmelig(data.dsfContact)

      logger('info', ['filter-secret-address', 'gotRestrictedAddress', restrictedDsf])

      if (restrictedDsf) {
        data.dsfContact.ADR = ''
        data.dsfContact.POSTN = ''
        data.dsfContact.POSTS = ''

        data.dsf.HOV.ADR = ''
        data.dsf.HOV.POSTN = ''
        data.dsf.HOV.POSTS = ''
        if (data.dsf.HOV.ADRL) delete data.dsf.HOV.ADRL
        if (data.dsf.HOV['ADR-T']) delete data.dsf.HOV['ADR-T']
        if (data.dsf.HOV.ADR1) delete data.dsf.HOV.ADR1
        if (data.dsf.HOV.ADR2) delete data.dsf.HOV.ADR2
        if (data.dsf.HOV.ADR3) delete data.dsf.HOV.ADR3
        if (data.dsf.HOV.GATE) delete data.dsf.HOV.GATE
        if (data.dsf.HOV.HUS) delete data.dsf.HOV.HUS
        if (data.dsf.FOR) delete data.dsf.FOR

        logger('info', ['filter-secret-address', 'filtered address fields'])
      }

      data.restrictedAddress = restrictedDsf
    }
    resolve(data)
  })
}
