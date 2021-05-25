const { logger } = require('@vtfk/logger')
const axios = require('axios').default
const { DOCUMENT_GENERATOR_URL } = require('../config')

module.exports = async ({ newDocument, spraak }) => {
  const template = `${newDocument.type}/${newDocument.variant}`
  try {
    logger('info', ['generate-document-data', 'template', template, DOCUMENT_GENERATOR_URL, 'generate pdf/a document start'])
    const { data } = await axios.post(DOCUMENT_GENERATOR_URL, {
      system: 'minelev',
      template,
      language: spraak,
      type: '2',
      version: 'B',
      data: { ...newDocument }
    })
    logger('info', ['generate-document-data', 'template', template, DOCUMENT_GENERATOR_URL, 'generate pdf/a document finish', data.data.base64.length])
    return data.data.base64
  } catch (error) {
    logger('error', ['generate-document-data', 'template', template, 'error', error.response.data.error.message])
    throw new Error(error)
  }
}
