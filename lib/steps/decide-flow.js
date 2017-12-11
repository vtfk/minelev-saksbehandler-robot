const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['steps', 'decide flow', data.documentType])
    try {
      const flow = require(`../flows/${data.documentType}.js`)
      const result = await flow(data)
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}
