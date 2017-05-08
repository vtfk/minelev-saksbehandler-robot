'use strict'

const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['setup-distribution', data._id])
    resolve(data)
  })
}