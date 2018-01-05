'use strict'

const checkFnr = require('is-valid-fodselsnummer')
const checkVgoNr = require('../valid-vgo-number')
const unwrapContact = require('tfk-dsf-unwrap-contact')
const config = require('../../config')
const getData = require('../get-data')
const logger = require('../logger')
const createDsfData = require('../create-dsf-data')

const getMethod = data => {
  return data.sendCopyToGuardian ? 'hentForeldre' : 'hentDetaljer'
}

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    let dsfData = false
    logger('info', ['lookup-dsf', data._id, data.studentUserName])
    if (data.needsDistribution === true) {
      if (checkFnr(data.studentId, true) === 'D' || checkVgoNr(data.studentId)) {
        logger('info', ['lookup-dsf', data._id, data.studentUserName, 'is D-number or VGO-number', 'generating dsfData'])
        dsfData = createDsfData(data)
      } else {
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
        dsfData = await getData(options)
      }
    } else {
      logger('info', ['lookup-dsf', data._id, data.studentUserName, 'distribution not needed', 'skips lookup'])
      dsfData = createDsfData(data)
    }
    if (dsfData !== false) {
      logger('info', ['lookup-dsf', data._id, data.studentUserName, 'success'])
      const dsfContact = unwrapContact(dsfData)
      const dsf = dsfData.RESULT
      data.dsfContact = dsfContact
      data.dsf = dsf
    } else {
      logger('error', ['lookup-dsf', data._id, data.studentUserName])
      data.dsf = false
      data.errors.push(new Error('DSF lookup failed'))
    }

    resolve(data)
  })
}
