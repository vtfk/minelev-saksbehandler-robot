const { logger } = require('@vtfk/logger')
const axios = require('axios').default
const { DOCUMENT_GENERATER_URL } = require('../config')

function getTemplateName (input) {
  return input ? input.toString().split('/').slice(-1)[0] : false
}

module.exports = async ({ newDocument }) => {
  const template = `${newDocument.type}/${newDocument.variant}`
  const templateName = getTemplateName(template)
  logger('info', ['generate-document-data', 'template', templateName])
  try {
    logger('info', ['generate-document-data', 'template', templateName, DOCUMENT_GENERATER_URL, 'generate document'])
    const { data } = await axios.post(DOCUMENT_GENERATER_URL, {
      system: 'minelev',
      template,
      // TODO: add language support...
      language: 'nb',
      data: { ...newDocument }
    })
    logger('info', ['generate-document-data', 'template', templateName, DOCUMENT_GENERATER_URL, 'document generated', data.data.base64.length])
    return data.data.base64
  } catch (error) {
    logger('error', ['generate-document-data', 'error', error])
    throw new Error(error.message)
  }
}
