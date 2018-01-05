const getFullYear = year => parseInt('20' + year) < new Date().getFullYear() ? parseInt('20' + year) : parseInt('19' + year)

module.exports = fodselsnummer => {
  if (fodselsnummer.length !== 11) {
    throw new Error('Input must be 11 digits')
  }
  const day = fodselsnummer.substr(0, 2) - 40
  const month = fodselsnummer.substr(2, 2)
  const year = getFullYear(fodselsnummer.substr(4, 2))
  const date = new Date(`${year}-${month}-${day}`)
  return !(date.toString() === 'Invalid Date')
}
