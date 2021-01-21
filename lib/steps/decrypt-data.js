const  { logger } = require('@vtfk/logger')
const { decryptContent } = require('@vtfk/encryption')
const { ENCRYPTION_KEY } = require('../../config')

module.exports = async data => {
  try {
    if (data.isEncrypted) {
      logger('info', ['steps', 'decrypt data', data._id, 'data needs decrypting'])
      const result = await decryptContent(data.content, ENCRYPTION_KEY)
      data.content = result
      logger('info', ['steps', 'decrypt data', data._id, 'data decrypted'])
      return data
    } else {
      logger('info', ['steps', 'decrypt data', data._id, 'decrypting not needed'])
      return data
    }
  } catch (error) {
    logger('error', ['steps', 'decrypt data', data._id, error])
    throw error
  }
}
