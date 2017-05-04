'use strict'

const getTemplatePath = require('tfk-saksbehandling-minelev-templates')
const getSchoolInfo = require('tfk-schools-info')
const getSkoleAar = require('get-skole-aar')
const capitalize = require('capitalize')
const datePadding = require('./date-padding')
const fixPeriod = require('./fix-period')
const logger = require('./logger')

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

module.exports = data => {
  return new Promise((resolve, reject) => {
    logger('info', ['prepare-document', data._id, data.studentUserName, data.documentType])
    const now = new Date()
    const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
    const schoolInfo = getSchoolInfo({organizationNumber: data.schoolOrganizationNumber.replace(/\D/g, '')})
    data.document = {
      title: generateTitle(data, true),
      offTitle: generateTitle(data),
      data: {
        dato: date,
        navnElev: data.studentName,
        navnAvsender: data.userName,
        navnSkole: data.schoolName,
        tlfSkole: schoolInfo.phoneNumber,
        Arsak: data.behaviourCategories || data.orderCategories || data.gradesCategories || '',
        fag: data.coursesList || '',
        varselPeriode: data.period ? data.period.toLowerCase() : '',
        skoleAar: getSkoleAar()
      },
      template: getTemplatePath(data.documentCategory),
      type: 'warning'
    }
    resolve(data)
  })
}
