'use strict'

const p360 = require('@vtfk/p360')
const unwrapContact = require('tfk-360-unwrap-contact')
const { logger } = require('@vtfk/logger')
const getError = require('../get-error')
const config = require('../../config')
const p360Options = {
  authkey: config.P360_TOKEN,
  host: config.P360_URL
}

module.exports = async data => {
  logger('info', ['lookup-360'])
  if (data.needsDistribution === true && data.sendToDistribution === true && !data.p360Data) {
    logger('info', ['lookup-360', 'looking up', data.studentUserName])
    const args = {
      parameter: {
        PersonalIdNumber: data.studentId,
        Active: true
      }
    }

    try {
      const { ContactService } = p360(p360Options)
      const p360Data = await ContactService.GetPrivatePersons(args)
      data.p360Data = p360Data
      if (p360Data.PrivatePersons.length === 0) {
        logger('warn', ['lookup-360', 'lookup complete but found no persons', data.studentUserName, 'person will be created', p360Data.TotalCount])
      } else {
        data.p360Contact = unwrapContact(p360Data)
        logger('info', ['lookup-360', 'lookup complete', data.studentUserName, p360Data.TotalCount || null])
      }
    } catch (error) {
      logger('error', ['lookup-360', 'lookup failed', error])
      data.errors.push(getError(error))
    }
  } else {
    if (data.p360Data) {
      logger('info', ['lookup-360', 'lookup data existed', 'new lookup unnecessary'])
    } else {
      logger('info', ['lookup-360', 'no distribution', 'lookup unnecessary'])
    }
  }
  return data
}
