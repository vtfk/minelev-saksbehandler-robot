'use strict'

module.exports = data => {
  return {
    type: 'privatPerson',
    navn: data.fullName,
    adresse1: data.address,
    adresse2: '',
    adresse3: '',
    postnr: data.zip,
    poststed: data.city,
    fodselsnr: data.personalIdNumber
  }
}
