'use strict'

const isHemmelig = require('tfk-is-hemmelig-adresse')
const { logger } = require('@vtfk/logger')

module.exports = async data => {
  logger('info', ['check-secret-address'])

  if (data.sendToDistribution === true) {
    if (data.dsfError) {
      logger('info', ['check-secret-address', 'skipped due to dsfError'])
    } else {
      const restrictedDsf = isHemmelig(data.dsfContact)
      const restricted360 = data.p360Contact ? isHemmelig(data.p360Contact) : false

      const gotRestrictedAddress = restricted360 || restrictedDsf

      logger('info', ['check-secret-address', 'gotRestrictedAddress', gotRestrictedAddress])

      data.restrictedAddress = gotRestrictedAddress

      data.sendToDistribution = !gotRestrictedAddress
    }
  } else {
    logger('info', ['check-secret-address', 'skipped due to no distribution'])
  }
  return data
}
