'use strict'

const config = require('../../config')
const getData = require('../get-data')
const logger = require('../logger')

const getMethod = data => {
  return data.sendCopyToGuardian ? 'hentForeldre' : 'hentDetaljer'
}

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    const method = getMethod(data)
    logger('info', ['lookup-dsf', data._id, method, data.studentUserName])
    const options = {
      url: config.DSF_SERVICE_URL,
      payload: {
        method: method,
        query: {
          saksref: 'minelev',
          foedselsnr: data.studentId
        }
      }
    }

    const dsfData = await getData(options)

    if (dsfData !== false) {
      logger('info', ['lookup-dsf', data._id, method, data.studentUserName, 'success'])
      data.dsf = dsfData.RESULT
    } else {
      logger('error', ['lookup-dsf', data._id, method, data.studentUserName])
      data.dsf = false
      data.error.push(new Error('DSF lookup failed'))
    }

    resolve(data)
  })
}
