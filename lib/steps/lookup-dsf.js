const checkFnr = require('is-valid-fodselsnummer')
const checkVgoNr = require('../valid-vgo-number')
const unwrapContact = require('tfk-dsf-unwrap-contact')
const { DSF_SERVICE_URL } = require('../../config')
const getDsfData = require('../get-dsf-data')
const getError = require('../get-error')
const { logger } = require('@vtfk/logger')
const createDsfData = require('../create-dsf-data')

const getMethod = data => {
  return data.sendCopyToGuardian ? 'hentForeldre' : 'hentDetaljer'
}

module.exports = async data => {
  let dsfData = false
  logger('info', ['lookup-dsf', data.studentUserName])
  if (data.needsDistribution === true) {
    if (checkFnr(data.studentId, true) === 'D' || checkVgoNr(data.studentId)) {
      logger('info', ['lookup-dsf', data.studentUserName, 'is D-number or VGO-number', 'generating dsfData'])
      dsfData = createDsfData(data)
    } else {
      const method = getMethod(data)
      logger('info', ['lookup-dsf', method, data.studentUserName])
      const options = {
        url: DSF_SERVICE_URL,
        payload: {
          method: method,
          query: {
            saksref: 'minelev',
            foedselsnr: data.studentId
          }
        }
      }
      dsfData = await getDsfData(options)
    }
  } else {
    logger('info', ['lookup-dsf', data.studentUserName, 'distribution not needed', 'skips lookup'])
    dsfData = createDsfData(data)
  }
  if (dsfData !== false && dsfData.error === undefined) {
    logger('info', ['lookup-dsf', data.studentUserName, 'success'])
    const dsfContact = unwrapContact(dsfData)
    const dsf = dsfData.RESULT
    data.dsfContact = dsfContact
    data.dsf = dsf
  } else {
    const err = dsfData.error || 'DSF lookup failed'
    logger('error', ['lookup-dsf', data.studentUserName, err])
    data.dsf = false
    data.errors.push(getError(new Error(err)))
  }

  return data
}
