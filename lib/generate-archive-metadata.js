'use strict'

const sanitize = require('sanitize-filename')
const templates = require('tfk-saksbehandling-minelev-templates')
const generateTitle = require('elev-varsel-generate-document-title')
const getSchoolInfo = require('tfk-schools-info')
const datePadding = require('./date-padding')
const logger = require('./logger')

module.exports = input => {
  const now = new Date()
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  const data = input.data
  const template = templates(data.documentTemplate, true).archive
  const title = generateTitle(data)
  const unofficialTitle = generateTitle(data, true)
  const schoolInfo = getSchoolInfo({organizationNumber: data.schoolOrganizationNumber.replace(/\D/g, '')})[0]

  logger('info', ['generate-archive-metadata', data.documentTemplate])

  let meta = {}

  if (data.documentType !== 'samtale') {
    meta = {
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
      responsiblePersonRecno: '200333',
      contacts: [
        {
          ReferenceNumber: data.recipient.personalIdNumber,
          Role: template.Category === 'Dokument inn' ? 'Avsender' : 'Mottaker'
        }
      ],
      file: {
        title: sanitize(`${title}.docx`),
        data: input.fileData
      }
    }
    if (data.guardians.length > 0) {
      meta.contacts.concat(data.guardians)
    }
  } else if (/Eleven ønsker ikke samtale/.test(data.samtaleCategories)) {
    meta = {
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
      responsiblePersonRecno: '200333',
      contacts: [
        {
          ReferenceNumber: data.recipient.personalIdNumber,
          Role: 'Mottaker'
        }
      ],
      file: {
        title: sanitize(`${title}.docx`),
        data: input.fileData
      }
    }
  } else {
    meta = {
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
      responsiblePersonRecno: '200333',
      contacts: [
        {
          ReferenceNumber: schoolInfo.organizationNumber360,
          Role: 'Avsender'
        }
      ],
      file: {
        title: sanitize(`${title}.docx`),
        data: input.fileData
      }
    }
  }
  return meta
}
