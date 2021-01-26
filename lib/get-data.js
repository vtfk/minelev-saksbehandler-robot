'use strict'

const axios = require('axios').default
const generateSystemJwt = require('./generate-system-jwt')
const { logger } = require('@vtfk/logger')

module.exports = async options => {
  logger('info', ['get-data', options.url, 'start'])
  try {
    const { data } = await axios.post(options.url, options.payload, { headers: { Authorization: generateSystemJwt() } })
    logger('info', ['get-data', options.url, 'success'])
    return data
  } catch (error) {
    logger('error', ['get-data', options.url, error])
    return false
  }
}
