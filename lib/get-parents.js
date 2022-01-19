'use strict'

/*
* Returns living parents with guardian responsibilities
*/

function isBosatt (person) {
  return person['STAT-KD'] !== null && person['STAT-KD'] !== undefined && person['STAT-KD'].toString() === '1'
}

function getFnrs (person) {
  const fnrs = []
  if (person['FORAN-KD'] === 'D') {
    if (person['MOR-FODT'] && person['MOR-PERS']) {
      fnrs.push(`${person['MOR-FODT']}${person['MOR-PERS']}`)
    }
    if (person['FAR-FODT'] && person['FAR-PERS']) {
      fnrs.push(`${person['FAR-FODT']}${person['FAR-PERS']}`)
    }
  }
  if (person['FORAN-KD'] === 'M') {
    if (person['MOR-FODT'] && person['MOR-PERS']) {
      fnrs.push(`${person['MOR-FODT']}${person['MOR-PERS']}`)
    }
  }
  if (person['FORAN-KD'] === 'F') {
    if (person['FAR-FODT'] && person['FAR-PERS']) {
      fnrs.push(`${person['FAR-FODT']}${person['FAR-PERS']}`)
    }
  }
  return fnrs
}

module.exports = data => {
  let foreldre = []

  if (data.FOR && data.HOV['FORAN-KD']) {
    const parents = Array.isArray(data.FOR) ? data.FOR : [data.FOR]
    const bosatteParents = parents.filter(isBosatt)
    const fnrs = getFnrs(data.HOV)
    foreldre = bosatteParents.filter(parent => fnrs.includes(parent.FNR))
  }

  return foreldre
}
