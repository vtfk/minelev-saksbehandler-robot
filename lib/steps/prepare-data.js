'use strict'

const getAge = require('get-age')
const dateFromPersonalId = require('birthdate-from-id')
const logger = require('../logger')

module.exports = data => {
  return new Promise((resolve, reject) => {
    logger('info', ['prepare-data', data._id, data.studentUserName, data.documentType])
    data.errors = []
    data.sendToDistribution = false
    data.sendCopyToGuardian = getAge(dateFromPersonalId(data.studentId)) < 18 && data.documentType !== 'samtale'
    data.documents = []
    data.documentTemplates = []
    data.archive = {
      _id: data._id
    }
    data.distribution = {
      _id: data._id
    }
    data.callback = {
      _id: data._id
    }
    resolve(data)
  })
}
