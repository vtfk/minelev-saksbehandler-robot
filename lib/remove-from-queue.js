'use strict'

const fs = require('fs')
const config = require('../config')
const logger = require('./logger')

module.exports = data => {
  return new Promise((resolve, reject) => {
    logger('info', ['remove-from-queue', data._id])
    const fileName = `${config.QUEUE_DIRECTORY_PATH}/${data._id}.json`
    fs.unlink(fileName, (error, data) => {
      if (error) {
        logger('error', ['remove-from-queue', data._id, error])
      } else {
        logger('info', ['remove-from-queue', data._id, `${fileName} removed from queue`])
      }
      resolve(data)
    })
  })
}
