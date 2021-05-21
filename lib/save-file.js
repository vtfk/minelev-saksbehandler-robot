'use strict'

const fs = require('fs')
const { logger } = require('@vtfk/logger')

module.exports = options => {
  return new Promise((resolve, reject) => {
    fs.writeFile(options.filePath, JSON.stringify(options.data, null, 2), error => {
      if (error) {
        logger('error', ['save-file', options.filePath, 'error', error])
        reject(error)
      } else {
        logger('info', ['save-file', options.filePath, 'success'])
        resolve(options.data)
      }
    })
  })
}
