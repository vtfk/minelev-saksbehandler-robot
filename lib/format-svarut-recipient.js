module.exports = data => {
  const bedrift = data.organisasjonsNummer
  let mottaker = {
    type: bedrift ? 'organisasjon' : 'privatPerson',
    name: data.fullName || data.navn,
    address1: data.address,
    address2: '',
    address3: '',
    postalCode: data.zip || data.postNummer,
    postalCity: data.city || data.postSted
  }

  if (data.personalIdNumber) {
    mottaker.fodselsnr = data.personalIdNumber
  } else {
    mottaker.orgnr = data.organisasjonsNummer
  }

  return mottaker
}
