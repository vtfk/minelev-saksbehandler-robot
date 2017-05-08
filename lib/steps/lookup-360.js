'use strict'

const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['lookup-360', data._id])
    if (data.sendToDistribution === true) {
      logger('info', ['lookup-360', data._id, 'looking up', data.studentUserName])
    } else {
      logger('info', ['lookup-360', data._id, 'no distribution', 'lookup unnecessary'])
    }
    resolve(data)
  })
}
