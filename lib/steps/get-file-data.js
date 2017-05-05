'use strict'

const config = require('../../config')
const logger = require('../logger')

module.exports = file => {
  return new Promise((resolve, reject) => {
    const data = require(`../${config.QUEUE_DIRECTORY_PATH}/${file}`)
    if (data) {
      logger('info', ['get-file-data', data._id, 'data found'])
      resolve(data)
    } else {
      const error = new Error('File not found')
      logger('error', ['get-file-data', 'error', error])
      reject(error)
    }
  })
}
