'use strict'

const sanitize = require('sanitize-filename')
const templates = require('tfk-saksbehandling-minelev-templates')
const generateTitle = require('elev-varsel-generate-document-title')
const datePadding = require('./date-padding')
const logger = require('./logger')

module.exports = input => {
  const now = new Date()
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  const data = input.data
  const template = templates(data.documentTemplate, true).archive
  const title = generateTitle(data)
  const unofficialTitle = generateTitle(data, true)

  logger('info', ['generate-archive-metadata', data.documentTemplate])

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
      data: input.fileData
    }
  }
}
