const sanitize = require('sanitize-filename')
const templates = require('tfk-saksbehandling-minelev-templates')
const getSchoolInfo = require('tfk-schools-info')
const datePadding = require('./date-padding')
const generateDocumentData = require('./generate-document-data')
const logger = require('./logger')

module.exports = async data => {
  const now = new Date()
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  const schoolInfo = getSchoolInfo({ organizationNumber: data.schoolOrganizationNumber.replace(/\D/g, '') })[0]
  const template = templates('hemmelig-adresse-kontrakt-signert', true).archive
  const docType = data.documentTemplate === 'ikke-samtale' ? 'Brev' : 'Varsel'
  const title = `Informasjonsbrev - godkjent lærekontrakt – ${date} - må sendes manuelt`
  const unofficialTitle = title
  logger('info', ['laerekontrakt-generate-document-restricted-address', 'documentTemplate', data.documentTemplate, 'docType', docType])
  const documentData = {
    data: {
      dato: date,
      navnElev: data.studentName
    },
    template: templates('hemmelig-adresse-kontrakt-signert')
  }
  const fileData = await generateDocumentData(documentData)

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
    responsiblePersonRecno: '200333',
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
