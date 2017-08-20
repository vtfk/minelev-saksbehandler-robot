'use strict'

const sanitize = require('sanitize-filename')
const templates = require('tfk-saksbehandling-minelev-templates')
const getSchoolInfo = require('tfk-schools-info')
const datePadding = require('./date-padding')
const generateDocumentData = require('./generate-document-data')

module.exports = async data => {
  const now = new Date()
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  const schoolInfo = getSchoolInfo({organizationNumber: data.schoolOrganizationNumber.replace(/\D/g, '')})[0]
  const template = templates('foresatte', true).archive
  const title = `Varsel tilhørende ${data.studentName} må distribueres`
  const documentData = {
    data: {
      dato: date,
      navnElev: data.studentName,
      klasseElev: data.studentMainGroupName,
      navnAvsender: data.userName,
      navnSkole: data.schoolName,
      tlfSkole: schoolInfo.phoneNumber
    },
    template: templates('foresatte')
  }
  const fileData = await generateDocumentData(documentData)

  return {
    generator: 'add-documents',
    title: title,
    unofficialTitle: 'Varsel må distribueres',
    accessCode: template.AccessCode,
    accessGroup: template.AccessGroup,
    signOff: template.SignOff,
    documentCreated: data.documentDate || date,
    category: template.Category,
    paragraph: template.Paragraph,
    archive: 'Saksdokument',
    status: template.Status,
    responsibleEnterpriseRecno: '506',
    responsiblePersonRecno: '200333',
    contacts: [
      {
        ReferenceNumber: data.recipient.personalIdNumber,
        Role: template.Category === 'Dokument inn' ? 'Avsender' : 'Mottaker'
      }
    ],
    file: {
      title: sanitize(`${title}.docx`),
      data: fileData
    }
  }
}
