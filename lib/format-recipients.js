'use strict'

module.exports = data => {
  return {
    ReferenceNumber: `${data.FODT}${data.PERS}`,
    Role: 'Mottaker'
  }
}
