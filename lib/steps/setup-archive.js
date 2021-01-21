const { v4: uuid } = require('uuid')
const normalizeContact = require('tfk-dsf-normalize-contact')
const formatContactPerson = require('../format-contact-person')
const filterGuardian = require('../filter-guardian')
const datePadding = require('../date-padding')
const  { logger } = require('@vtfk/logger')
const config = require('../../config')

module.exports = async data => {
  logger('info', ['setup-archive', data._id])
  if (data.dsf !== false) {
    const now = new Date()

    const recipient = data.documentCategory !== 'yff-bekreftelse-bedrift' ? data.recipient : normalizeContact(data.dsf.HOV)
    const documents = data.documents.filter(document => document.archive === true)

    const archive = {}

    archive._id = data._id
    archive.date = `${datePadding(now.getDate())}.${datePadding(now.getMonth() + 1)}.${now.getFullYear()}`
    archive.refererSystem = 'MinElev'
    archive.refererDocumentId = data._id

    archive.case = {
      generator: 'elevmappe-add-case',
      title: 'Elevmappe',
      unofficialTitle: `Elevmappe - ${recipient.fullName}`,
      type: 'elevmappe',
      accessCode: '13',
      accessGroup: 'VTFK Robot',
      status: 'B',
      paragraph: 'Offl. § 13 jf. fvl. § 13 (1) nr.1',
      subArchive: 'Elev',
      responsibleEnterpriseRecno: config.P360_DEFAULT_RESPONSIBLE_ENTERPRISE,
      responsiblePersonRecno: config.P360_DEFAULT_RESPONSIBLE_PERSON
    }

    archive.contacts = [
      {
        generator: 'add-private-person',
        personalIdNumber: recipient.personalIdNumber,
        firstName: recipient.firstName,
        middleName: recipient.middleName || '',
        lastName: recipient.lastName,
        fullName: recipient.fullName,
        email: data.studentMail || '',
        phone: data.studentPhone || '',
        streetAddress: recipient.streetAddress || '',
        zipCode: recipient.zipCode,
        zipPlace: recipient.zipPlace,
        area: 'Vestfold og Telemark',
        caseContact: 'Sakspart',
        secret: data.restrictedAddress
      }
    ]

    if (data.sendCopyToGuardian !== false && data.guardiansFound > 0 && data.documentTemplate !== 'samtale') {
      logger('info', ['setup-archive', data._id, 'parents add to contact', data.guardiansFound])
      const guardians = filterGuardian(data.dsf)
      const contacts = guardians.map(formatContactPerson)
      logger('info', ['setup-archive', data._id, 'parents add to contact', contacts.length, 'parents found'])
      if (contacts.length > 0) {
        archive.contacts = archive.contacts.concat(contacts)
      }
    } else {
      logger('info', ['setup-archive', data._id, 'parents add to contact', false])
    }

    archive.documents = documents.map(document => document.archiveMetadata)

    if (data.callbackUrl) {
      archive.callbackData = {
        _id: uuid(),
        system: 'MinElev',
        jobId: data._id,
        url: data.callbackUrl,
        payload: {
          status: 'Arkivert'
        }
      }
    }
    data.archive = archive
  } else {
    logger('error', ['setup-archive', data._id, 'missing dsf data'])
  }
  return data
}
