'use strict'

module.exports = period => {
  if (!period) {
    throw new Error('Missing required input: period')
  }

  const matched = period.match(/\.\s\w/g) || ['']
  const fixed = matched[0].replace(' ', '')
  return period.replace(matched, fixed)
}
