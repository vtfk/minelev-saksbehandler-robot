const getTemplatePath = require('tfk-saksbehandling-minelev-templates')
const datePadding = require('../date-padding')
const logger = require('../logger')
const getTemplate = require('../get-template')
const now = new Date()
const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()

const generateTitle = (item, notPublic) => {
  let title = []
  title.push('Informasjonsbrev')
  title.push('godkjent lærekontrakt')
  title.push(date)
  return title.join(' - ')
}

module.exports = data => {
  return new Promise((resolve, reject) => {
    logger('info', ['laerekontrakt-prepare-document', data._id, data.studentUserName, data.documentType])
    const template = getTemplate(data)
    data.document = {
      title: generateTitle(data, true),
      offTitle: generateTitle(data),
      data: {
        dato: date,
        navnElev: data.studentName
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
