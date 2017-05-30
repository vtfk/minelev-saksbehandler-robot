'use strict'

const datePadding = require('../date-padding')
const logger = require('../logger')

module.exports = data => {
  return new Promise(async (resolve, reject) => {
    logger('info', ['setup-archive', data._id])
    if (data.dsf !== false) {
      const now = new Date()

      const recipient = data.recipient
      const documents = data.documents.filter(document => document.archive === true)

      let archive = {}

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
        accessGroup: 'TFK-robot',
        status: 'B',
        paragraph: 'Offl §13 jfr Fvl §13.1',
        subArchive: 'Elev',
        responsibleEnterpriseRecno: '506',
        responsiblePersonRecno: '200333'
      }

      archive.documents = documents.map(document => document.archiveMetadata)

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
          streetAddress: recipient.address || '',
          zipCode: recipient.zip,
          zipPlace: recipient.city,
          area: 'Telemark',
          caseContact: 'Sakspart'
        }
      ]

      archive.callbackData = {
        _id: data._id,
        system: 'MinElev',
        jobId: data._id,
        url: data.callbackUrl,
        payload: {
          status: 'Arkivert'
        }
      }

      if (data.sendCopyToGuardian !== false && data.guardiansFound > 0) {
        // TODO: maccyber checks it out
        logger('info', ['setup-archive', data._id, 'parents add to contact', data.guardiansFound])
      } else {
        logger('info', ['setup-archive', data._id, 'parents add to contact', false])
      }

      data.archive = archive
    } else {
      logger('error', ['setup-archive', data._id, 'missing dsf data'])
    }
    resolve(data)
  })
}
