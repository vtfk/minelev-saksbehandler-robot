'use strict'

const normalize = require('tfk-dsf-normalize-contact')
// const filterGuardian = require('./lib/filter-guardian')
const felles = require('./test/data/hentForeldreFelles.json')['RESULT']

// console.log(filterGuardian(felles))

console.log(normalize(felles.HOV))
