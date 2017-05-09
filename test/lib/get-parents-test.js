'use strict'

const test = require('ava')
const getParents = require('../../lib/get-parents')

test('Returns 2 parents for D', t => {
  const dsf = require('../data/hentForeldreFelles.json')['RESULT']
  const parents = getParents(dsf)
  t.is(parents.length, 2, '2 parents found')
})

test('Returns 1 parent for M', t => {
  const dsf = require('../data/hentForeldreMor.json')['RESULT']
  const parents = getParents(dsf)
  t.is(parents.length, 1, '1 parent found')
})

test('Returns 1 parent for F', t => {
  const dsf = require('../data/hentForeldreFar.json')['RESULT']
  const parents = getParents(dsf)
  t.is(parents.length, 1, '1 parent found')
})

test('Returns 0 parents for A', t => {
  const dsf = require('../data/hentForeldreAndre.json')['RESULT']
  const parents = getParents(dsf)
  t.is(parents.length, 0, '0 parents found')
})

test('Returns 0 parents if of age', t => {
  const dsf = require('../data/hentForeldreMyndig.json')['RESULT']
  const parents = getParents(dsf)
  t.is(parents.length, 0, '0 parents found')
})
