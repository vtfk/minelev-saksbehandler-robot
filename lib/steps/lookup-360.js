'use strict'

const p360 = require('p360')
const unwrapContact = require('tfk-360-unwrap-contact')
const  { logger } = require('@vtfk/logger')
const config = require('../../config')
const p360Options = {
  user: config.P360_USER,
  password: config.P360_PASSWORD,
  baseUrl: config.P360_URL,
  options: {
    ignoredNamespaces: true
  }
}

module.exports = async data => {
  logger('info', ['lookup-360', data._id])
  if (data.needsDistribution === true && data.sendToDistribution === true && !data.p360Data) {
    logger('info', ['lookup-360', data._id, 'looking up', data.studentUserName])
    const clientService = 'ContactService'
    const clientMethod = 'GetPrivatePersons'
    const args = {
      parameter: {
        PersonalIdNumber: data.studentId
      }
    }
    const options = {
      p360: p360Options,
      clientService: clientService,
      clientMethod: clientMethod,
      args: args
    }

    try {
      const p360Data = await p360(options)
      data.p360Data = p360Data
      data.p360Contact = unwrapContact(p360Data)

      logger('info', ['lookup-360', data._id, 'lookup complete', data.studentUserName])
    } catch (error) {
      logger('error', ['lookup-360', data._id, 'lookup failed', JSON.stringify(error)])
      data.errors.push(JSON.stringify(error))
    }
  } else {
    if (data.p360Data) {
      logger('info', ['lookup-360', data._id, 'lookup data existed', 'new lookup unnecessary'])
    } else {
      logger('info', ['lookup-360', data._id, 'no distribution', 'lookup unnecessary'])
    }
  }
  return data
}
