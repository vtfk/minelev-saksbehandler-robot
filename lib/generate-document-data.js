const { logger } = require('@vtfk/logger')
const axios = require('axios').default
const getSchool = require('vtfk-schools-info')
const { DOCUMENT_GENERATOR_URL } = require('../config')

module.exports = async ({ newDocument, spraak }) => {
  const template = `${newDocument.type}/${newDocument.variant}`
  // Expand with school data if we have it, some templates use it in footer.
  if (newDocument.school && newDocument.school.id) {
    let schoolInfo = getSchool({ schoolId: newDocument.school.id })
    if (schoolInfo.length === 1) { // We found specific school info
      schoolInfo = schoolInfo[0]
      const schoolFooter = {}
      if (schoolInfo.address && schoolInfo.address.street && schoolInfo.address.place && schoolInfo.address.place.length > 0) {
        schoolFooter.address = `${schoolInfo.address.street}, ${schoolInfo.address.place.charAt(0).toUpperCase() + schoolInfo.address.place.slice(1).toLowerCase()}`
      }
      schoolFooter.phoneNumber = schoolInfo.phoneNumber ?? null
      schoolFooter.mail = schoolInfo.mail ?? null
      schoolFooter.organizationNumber = schoolInfo.organizationNumber ?? null
      newDocument.schoolFooter = schoolFooter
    }
  }
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
    const { status, data } = error.response
    logger('error', ['generate-document-data', 'template', template, 'error', status, data])
    throw new Error(error)
  }
}
