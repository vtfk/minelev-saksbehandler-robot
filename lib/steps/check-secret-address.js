'use strict'

const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['check-secret-address', data._id])
    resolve(data)
  })
}
