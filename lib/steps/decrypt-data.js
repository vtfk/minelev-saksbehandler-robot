const { logger } = require('@vtfk/logger')
const { decryptContent } = require('@vtfk/encryption')
const { ENCRYPTION_KEY } = require('../../config')

module.exports = async data => {
  try {
    if (data.isEncrypted) {
      logger('info', ['decrypt data', 'data needs decrypting'])
      const result = await decryptContent(data.content, ENCRYPTION_KEY)
      data.content = result
      logger('info', ['decrypt data', 'data decrypted'])
      return data
    } else {
      logger('info', ['decrypt data', 'decrypting not needed'])
      return data
    }
  } catch (error) {
    logger('error', ['decrypt data', error])
    throw error
  }
}
