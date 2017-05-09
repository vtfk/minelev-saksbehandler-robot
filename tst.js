'use strict'

const filterGuardian = require('./lib/filter-guardian')
const felles = require('./test/data/hentForeldreFelles.json')['RESULT']

console.log(filterGuardian(felles))
