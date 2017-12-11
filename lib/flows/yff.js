const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['flows', 'yff'])
    resolve(data)
  })
}
