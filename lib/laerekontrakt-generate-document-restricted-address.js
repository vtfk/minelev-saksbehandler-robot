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
  const documentTemplate = getDocumentTemplate({ domain: 'minelev', templateId: 'hemmelig-adresse-kontrakt-signert' })
  const template = documentTemplate.archive
  const title = `Informasjonsbrev - godkjent lærekontrakt – ${date} - må sendes manuelt`
  const unofficialTitle = title
  logger('info', ['laerekontrakt-generate-document-restricted-address', 'documentTemplate', data.documentTemplate, 'title', title])
  const fileData = await generateDocumentData(data)

  return {
    generator: 'add-documents',
    title: title,
    unofficialTitle: unofficialTitle,
    accessCode: template.AccessCode,
    accessGroup: template.AccessGroup,
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
      title: sanitize(`${title}.pdf`),
      data: fileData
    }
  }
}
