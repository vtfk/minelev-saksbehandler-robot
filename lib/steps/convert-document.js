const convert = require('@vtfk/minelev-document-converter')
const { logger } = require('@vtfk/logger')

module.exports = async data => {
  try {
    const lang = 'nb'
    logger('info', ['convert document', 'language', lang, 'start'])
    const result = await convert(data, lang)
    // appends new document to the converted old document
    result.newDocument = data
    logger('info', ['convert document', 'language', lang, 'finish'])
    return result
  } catch (error) {
    logger('error', ['convert document', error])
    throw error
  }
}
