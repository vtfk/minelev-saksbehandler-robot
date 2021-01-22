const sanitize = require('sanitize-filename')
const getDocumentTemplate = require('document-templates')
const generateTitle = require('elev-varsel-generate-document-title')
const getSchoolInfo = require('vtfk-schools-info')
const datePadding = require('./date-padding')
const formatRecipients = require('./format-recipients')
const { logger } = require('@vtfk/logger')
const config = require('../config')

module.exports = input => {
  const now = new Date()
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  const data = input.data
  const documentTemplate = getDocumentTemplate({ domain: 'minelev', templateId: data.documentTemplate })
  const template = documentTemplate.archive
  const title = generateTitle(data)
  const unofficialTitle = generateTitle(data, true)
  const schoolInfo = data.schoolOrganizationNumber ? getSchoolInfo({ organizationNumber: data.schoolOrganizationNumber.replace(/\D/g, '') })[0] : ''

  logger('info', ['generate-archive-metadata', data.documentTemplate])

  let meta = {}

  if (!['samtale', 'notat'].includes(data.documentType)) {
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
      responsiblePersonRecno: config.P360_DEFAULT_RESPONSIBLE_PERSON,
      contacts: [
        {
          IsUnofficial: true,
          ReferenceNumber: data.recipient.personalIdNumber,
          Role: template.Category === 'Dokument inn' ? 'Avsender' : 'Mottaker'
        }
      ],
      file: {
        title: sanitize(`${title}.docx`),
        data: input.fileData
      }
    }
    if (data.sendCopyToGuardian && data.recipientCopies && data.recipientCopies.length > 0) {
      const recipients = data.recipientCopies.map(formatRecipients)
      meta.contacts = meta.contacts.concat(recipients)
    }
    if (data.documentCategory === 'yff-bekreftelse-bedrift') {
      meta.contacts = []
      meta.unregisteredContacts = {
        address: data.bedriftsData.adresse,
        name: data.bedriftsData.navn,
        enterpriseNumber: data.bedriftsData.organisasjonsNummer,
        role: 'Mottaker',
        zipCode: data.bedriftsData.postnummer,
        zipPlace: data.bedriftsData.poststed
      }
    }
  } else if (data.documentCategory === 'ikke-samtale') {
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
      responsiblePersonRecno: config.P360_DEFAULT_RESPONSIBLE_PERSON,
      contacts: [
        {
          IsUnofficial: true,
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
      responsiblePersonRecno: config.P360_DEFAULT_RESPONSIBLE_PERSON,
      contacts: [
        {
          IsUnofficial: true,
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
