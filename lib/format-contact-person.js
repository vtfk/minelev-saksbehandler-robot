'use strict'

module.exports = data => {
  return {
    generator: 'add-private-person',
    personalIdNumber: `${data.FODT}${data.PERS}`,
    firstName: data['NAVN-F'],
    middleName: data['NAVN-M'] || '',
    lastName: data['NAVN-S'],
    fullName: data['NAVN'],
    email: '',
    phone: '',
    streetAddress: data['ADR'] || '',
    zipCode: data['POSTN'] || '',
    zipPlace: data['POSTS'] || '',
    area: 'Telemark',
    caseContact: false
  }
}
