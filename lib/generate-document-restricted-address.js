const sanitize = require('sanitize-filename')
const getDocumentTemplate = require('document-templates')
const getSchoolInfo = require('vtfk-schools-info')
const datePadding = require('./date-padding')
const generateDocumentData = require('./generate-document-data')
const { logger } = require('@vtfk/logger')
const config = require('../config')

module.exports = async data => {
  const now = new Date()
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  const schoolInfo = getSchoolInfo({ organizationNumber: data.schoolOrganizationNumber.replace(/\D/g, '') })[0]
  const documentTemplate = getDocumentTemplate({ domain: 'minelev', templateId: 'hemmelig-adresse' })
  const template = documentTemplate.archive
  const docType = data.documentTemplate === 'ikke-samtale' ? 'Brev' : 'Varsel'
  const title = `${docType} må sendes til elev`
  const unofficialTitle = `${docType} må sendes til ${data.studentName}`
  logger('info', ['generate-document-restricted-address', 'documentTemplate', data.documentTemplate, 'docType', docType])
  const documentData = {
    data: {
      dato: date,
      navnElev: data.studentName,
      klasseElev: data.studentMainGroupName,
      navnAvsender: data.userName,
      navnSkole: data.schoolName,
      tlfSkole: schoolInfo.phoneNumber
    },
    template: documentTemplate.filePath
  }
  const fileData = await generateDocumentData(documentData)

  return {
    generator: 'add-documents',
    title: title,
    unofficialTitle: unofficialTitle,
    accessCode: template.AccessCode,
    accessGroup: schoolInfo.accessGroup,
    signOff: template.SignOff,
    documentCreated: data.documentDate || date,
    category: template.Category,
    paragraph: template.Paragraph,
    archive: 'Saksdokument',
    status: template.Status,
    responsibleEnterpriseNumber: schoolInfo.organizationNumber360,
    responsiblePersonRecno: config.P360_DEFAULT_RESPONSIBLE_PERSON,
    contacts: [
      {
        ReferenceNumber: schoolInfo.organizationNumber360,
        Role: 'Avsender'
      },
      {
        ReferenceNumber: schoolInfo.organizationNumber360,
        Role: 'Mottaker'
      }
    ],
    file: {
      title: sanitize(`${title}.docx`),
      data: fileData
    }
  }
}
