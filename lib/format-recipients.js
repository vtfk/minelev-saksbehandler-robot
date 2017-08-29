'use strict'

module.exports = data => {
  return {
    ReferenceNumber: data.personalIdNumber,
    Role: 'Mottaker'
  }
}
