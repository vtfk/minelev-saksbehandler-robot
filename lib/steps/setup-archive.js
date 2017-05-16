'use strict'

const sanitize = require('sanitize-filename')
const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['setup-archive', data._id])
    if (data.dsf !== false) {
      const now = new Date()
      const schoolYearDate = `${now.getFullYear()}-08-15`
      const documentType = document.Dokumentelement.Dokumenttype
      const template = archiveTemplates[documentType]
      const title = `${template.Title} ${template.SchoolYear ? getSkoleAar(schoolYearDate) : now.getFullYear()}`
      const fullName = getFullName(document)
      let archive = {}

      archive._id = document._id
      archive.date = `${datePadding(now.getDate())}.${datePadding(now.getMonth() + 1)}.${now.getFullYear()}`
      archive.refererSystem = 'MinElev'
      archive.refererDocumentId = data._id

      archive.case = {
        generator: 'elevmappe-add-case',
        title: 'Elevmappe',
        unofficialTitle: `Elevmappe - ${data.recipient.fullName}`,
        type: 'elevmappe',
        accessCode: template.AccessCode,
        accessGroup: template.AccessGroup,
        status: 'B',
        paragraph: template.Paragraph,
        subArchive: 'Elev',
        responsibleEnterpriseRecno: '506',
        responsiblePersonRecno: '200333'
      }

      archive.documents = template.includeDocuments ? documents : false

      archive.contacts = [
        {
          generator: 'add-private-person',
          personalIdNumber: document.Fodselsnummer,
          firstName: document.Fornavn,
          middleName: document.Mellomnavn || '',
          lastName: document.Etternavn,
          fullName: getFullName(document),
          email: document.Epost || '',
          phone: document.Mobilnr || '',
          streetAddress: document.FolkeRegisterAdresse.Adresselinje1 || '',
          zipCode: document.FolkeRegisterAdresse.Postnummmer,
          zipPlace: document.FolkeRegisterAdresse.Poststed,
          area: 'Telemark',
          caseContact: 'Sakspart'
        }
      ]

      archive.callbackData = {
        _id: document._id,
        fagsystemNavn: 'Public360',
        dokumentId: document.Dokumentelement.DokumentId,
        fodselsnummer: document.Fodselsnummer,
        arkiveringUtfort: true
      }

      document.archive = archive

      if (data.sendCopyToGuardian !== false) {
        const parents = filterGuardian(data.dsf)
        logger('info', ['setup-archive', data._id, 'sendCopyToGuardians', parents.length])
        const normalized = parents.map(normalizeContact)
        data.recipientCopies = normalized
        data.guardiansFound = normalized.length
      } else {
        logger('info', ['setup-archive', data._id, 'sendCopyToGuardians', false])
      }
    } else {
      logger('error', ['setup-archive', data._id, 'missing dsf data'])
    }
    resolve(data)
  })
}
