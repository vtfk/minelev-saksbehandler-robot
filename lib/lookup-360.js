'use strict'

const logger = require('./logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['lookup-360', data._id])
    resolve(data)
  })
}
