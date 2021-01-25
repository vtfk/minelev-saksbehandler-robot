const { logger } = require('@vtfk/logger')
const axios = require('axios').default
const { DOCUMENT_GENERATOR_URL } = require('../config')

module.exports = async document => {
  const template = `${document.type}/${document.variant}`
  try {
    logger('info', ['generate-document-data', 'template', template, DOCUMENT_GENERATOR_URL, 'generate document start'])
    const { data } = await axios.post(DOCUMENT_GENERATOR_URL, {
      system: 'minelev',
      template,
      // TODO: add language support...
      language: 'nb',
      data: { ...document }
    })
    logger('info', ['generate-document-data', 'template', template, DOCUMENT_GENERATOR_URL, 'generate document finish', data.data.base64.length])
    return data.data.base64
  } catch (error) {
    logger('error', ['generate-document-data', 'template', template, 'error', error.response.data.error.message])
    throw new Error(error)
  }
}
