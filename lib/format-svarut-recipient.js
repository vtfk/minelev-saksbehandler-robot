module.exports = data => {
  const bedrift = data.organisasjonsNummer
  const mottaker = {
    type: bedrift ? 'organisasjon' : 'privatPerson',
    name: data.fullName || data.navn,
    address1: data.address || data.streetAddress || data.adresse,
    address2: '',
    address3: '',
    postalCode: data.zip || data.zipCode || data.postnummer,
    postalCity: data.city || data.zipPlace || data.poststed
  }

  if (data.personalIdNumber) {
    mottaker.personalId = data.personalIdNumber
  } else {
    mottaker.organizationId = data.organisasjonsNummer
  }

  return mottaker
}
