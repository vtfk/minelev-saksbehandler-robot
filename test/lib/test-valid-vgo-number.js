const test = require('ava')
const isValidVgoNumber = require('../../lib/valid-vgo-number')

test('Valid VGO number', t => {
  const fnr = '65120099208'
  t.true(isValidVgoNumber(fnr), 'true found')
})

test('Invalid VGO number', t => {
  const fnr = '26118645108'
  t.false(isValidVgoNumber(fnr), 'false found')
})

test('Invalid VGO number (too short)', t => {
  const fnr = '2611864510'
  try {
    isValidVgoNumber(fnr)
  } catch (error) {
    t.true(error.message === 'Input must be 11 digits', 'Too short fnr throws "Input must be 11 digits"')
  }
})
