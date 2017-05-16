'use strict'

const templates = require('./data/templates.json')

module.exports = input => {
  const data = input.data
  const document = input.document

  return {
    generator: 'add-documents',
    title: title,
    unofficialTitle: `${title} - ${fullName}`,
    accessCode: template.AccessCode,
    accessGroup: template.AccessGroup,
    signOff: template.SignOff,
    documentCreated: document.Dokumentelement.Dokumentdato,
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
      title: sanitize(`${title}.PDF`),
      file: document.Dokumentelement.Dokumentfil
    }
  }
}