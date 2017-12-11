module.exports = (data, type) => {
  let mottaker = ''
  if (type === 'privat') {
    mottaker = 'privat'
  } else {
    mottaker = 'virksomhet'
  }
  return mottaker
}
