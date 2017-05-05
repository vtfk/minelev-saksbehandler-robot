'use strict'

const logger = require('../logger')

const getMethod = data => {
  return data.sendCopyToGuardian ? 'hentForeldre' : 'hentDetaljer'
}

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    const method = getMethod(data)
    logger('info', ['lookup-dsf', data._id, method])
    resolve(data)
  })
}
