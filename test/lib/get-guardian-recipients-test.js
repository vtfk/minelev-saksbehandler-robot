'use strict'

const test = require('ava')
const getGuardianRecipients = require('../../lib/get-guardian-recipients')

test('Returns 2 for SPES-KD 0', t => {
  const parents = require('../data/parentsDelt.json')
  const recipients = getGuardianRecipients(parents)
  t.is(recipients.length, 2, '2 recipients returned')
})

test('Returns 1 for SPES-KD 1', t => {
  const parents = require('../data/parentsFelles.json')
  const recipients = getGuardianRecipients(parents)
  t.is(recipients.length, 1, '1 recipient returned')
})
