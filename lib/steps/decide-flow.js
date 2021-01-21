const logger = require('@vtfk/logger')

module.exports = async data => {
  try {
    logger('info', ['steps', 'decide flow', data.documentType])
    const flow = require(`../flows/${data.documentType}.js`)
    const result = await flow(data)
    return result
  } catch (error) {
    logger('error', ['steps', 'decide flow', data.documentType, error])
    throw error
  }
}
