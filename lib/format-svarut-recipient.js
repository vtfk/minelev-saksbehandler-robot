'use strict'

module.exports = data => {
  return {
    type: 'privatPerson',
    name: data.fullName,
    address1: data.address,
    address2: '',
    address3: '',
    postalCode: data.zip,
    postalCity: data.city,
    personalId: data.personalIdNumber
  }
}
