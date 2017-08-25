'use strict'

const birthdateFromId = require('birthdate-from-id')

function createFullName (data) {
  let name = [data.studentLastName || '', data.studentFirstName || '']
  if (data.studentMiddleName && data.studentMiddleName !== '') {
    name.push(data.studentMiddleName)
  }
  return name.join(' ')
}

module.exports = data => {
  const birthdate = birthdateFromId(data.studentId)
  return {
    RESULT: {
      HOV: {
        FODT: data.studentId.substr(0, 6),
        PERS: data.studentId.substr(6, 11),
        FODTAR: birthdate.split('-')[0],
        'STAT-KD': '1',
        STAT: 'BOSATT',
        'NAVN-S': data.studentLastName || '',
        'NAVN-F': data.studentFirstName || '',
        'NAVN-M': data.studentMiddleName || '',
        NAVN: createFullName(data),
        ADR: '',
        POSTN: '',
        POSTS: '',
        ADRTYPE: 'O',
        'SPES-KD': '0',
        SPES: 'VANLIG BOSATT'
      },
      FOR: []
    }
  }
}
