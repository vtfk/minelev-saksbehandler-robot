'use strict'
const { logger } = require('@vtfk/logger')
const axios = require('axios').default
const { KRR_URL, KRR_JWT_SECRET } = require('../../config')
const generateSystemJwt = require('../generate-system-jwt')

module.exports = async data => {
  logger('info', ['lookup-krr'])
  try {
    axios.defaults.headers.common.Authorization = generateSystemJwt(KRR_JWT_SECRET)
    const { data: result } = await axios.post(KRR_URL, [data.newDocument.student.personalIdNumber])
    data.krr = result.personer[0]
    data.spraak = data.krr.spraak || 'nb'
    logger('info', ['lookup-krr', 'success', result.personer.length, data.spraak])
  } catch (error) {
    logger('error', ['lookup-krr', error])
    data.spraak = 'nb'
  }
  return data
}
