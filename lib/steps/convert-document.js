const convert = require('@vtfk/minelev-document-converter')
const  { logger } = require('@vtfk/logger')

module.exports = async data => {
  try {
    const lang = 'nb'
    logger('info', ['steps', 'convert document', data._id, 'language', lang, 'start'])
    // TODO: add language support...
    const result = await convert(data, lang)
     // appends new document to the converted old document
    result.newDocument = data
    logger('info', ['steps', 'convert document', data._id, 'language', lang, 'finish'])
    return result
  } catch (error) {
    logger('error', ['steps', 'convert document', data._id, error])
    throw error
  }
}
