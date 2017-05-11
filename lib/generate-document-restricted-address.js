'use strict'

const getTemplatePath = require('tfk-saksbehandling-minelev-templates')
const getSchoolInfo = require('tfk-schools-info')
const datePadding = require('./date-padding')

module.exports = data => {
  const now = new Date()
  const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
  const schoolInfo = getSchoolInfo({organizationNumber: data.schoolOrganizationNumber.replace(/\D/g, '')})[0]
  const docType = data.documentTemplate === 'ikke-samtale' ? 'Brev' : 'Varsel'
  return {
    title: `${docType} må sendes til ${data.studentName}`,
    offTitle: `${docType} må sendes til elev`,
    data: {
      dato: date,
      navnElev: data.studentName,
      klasseElev: data.studentMainGroupName,
      navnAvsender: data.userName,
      navnSkole: data.schoolName,
      tlfSkole: schoolInfo.phoneNumber
    },
    template: getTemplatePath('hemmelig-adresse'),
    type: 'note-secret'
  }
}
