const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    try {
      logger('info', ['steps', 'decide flow', data.documentType])
      const flow = require(`../flows/${data.documentType}.js`)
      const result = await flow(data)
      resolve(result)
    } catch (error) {
      logger('error', ['steps', 'decide flow', data.documentType, error])
      reject(error)
    }
  })
}
