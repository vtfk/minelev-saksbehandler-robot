'use strict'

module.exports = (data, p360Contact) => {
  return {
    IsUnofficial: true,
    ReferenceNumber: data.personalIdNumber,
    Recno: (p360Contact && p360Contact.Recno) || undefined,
    Role: 'Mottaker'
  }
}
