'use strict'

module.exports = data => {
  return {
    IsUnofficial: true,
    ReferenceNumber: data.personalIdNumber,
    Role: 'Mottaker'
  }
}
