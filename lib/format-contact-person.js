'use strict'

const normalize = require('tfk-dsf-normalize-contact')

module.exports = data => {
  return Object.assign(normalize(data), {generator: 'add-private-person', email: '', phone: '', area: 'Telemark', caseContact: false})
}
