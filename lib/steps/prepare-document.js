'use strict'

const getTemplatePath = require('tfk-saksbehandling-minelev-templates')
const getSchoolInfo = require('tfk-schools-info')
const getSkoleAar = require('get-skole-aar')
const capitalize = require('capitalize')
const datePadding = require('../date-padding')
const fixPeriod = require('../fix-period')
const logger = require('../logger')

const generateTitle = (item, notPublic) => {
  let title = []
  title.push(capitalize(item.documentType))
  title.push(item.documentCategory)
  if (notPublic) {
    title.push(item.studentName)
  }
  title.push(item.studentMainGroupName)
  title.push(item.schoolName)
  title.push(fixPeriod(item.period))
  title.push(getSkoleAar())

  return title.join(' - ')
}

const getTemplate = data => {
  return data.samtaleCategories && /Eleven ønsker ikke samtale/.test(data.samtaleCategories) ? 'ikke-samtale' : data.documentCategory
}

module.exports = data => {
  return new Promise((resolve, reject) => {
    logger('info', ['prepare-document', data._id, data.studentUserName, data.documentType])
    const now = new Date()
    const nowDocument = data.documentDate ? new Date(documentDate) : new Date()
    const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
    const documentDate = datePadding(nowDocument.getDate()) + '.' + datePadding(nowDocument.getMonth() + 1) + '.' + nowDocument.getFullYear()
    const schoolInfo = getSchoolInfo({organizationNumber: data.schoolOrganizationNumber.replace(/\D/g, '')})[0]
    const template = getTemplate(data)
    data.document = {
      title: generateTitle(data, true),
      offTitle: generateTitle(data),
      data: {
        dato: date,
        datoSamtale: documentDate,
        navnElev: data.studentName,
        navnAvsender: data.userName,
        navnSkole: schoolInfo.officialName,
        tlfSkole: schoolInfo.phoneNumber,
        Arsak: data.behaviourCategories || data.orderCategories || data.gradesCategories || '',
        fag: data.coursesList || '',
        varselPeriode: data.period ? data.period.toLowerCase() : '',
        skoleAar: getSkoleAar()
      },
      templateId: template,
      template: getTemplatePath(template),
      type: data.documentType,
      recipients: []
    }
    data.documentTemplate = template
    resolve(data)
  })
}
