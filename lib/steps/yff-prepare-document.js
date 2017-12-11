const getTemplatePath = require('tfk-saksbehandling-minelev-templates')
const getSchoolInfo = require('tfk-schools-info')
const getSkoleAar = require('get-skole-aar')
const birthdateFromId = require('birthdate-from-id')
const datePadding = require('../date-padding')
const logger = require('../logger')
const getTemplate = require('../get-template')
const buildLareplan = require('../yff-build-lareplan')

const generateTitle = (item, notPublic) => {
  let title = ['YFF']
  if (item.documentCategory === 'yff-bekreftelse') {
    title.push('Bekreftelse om avtale yrkesfaglig fordypning')
  } else if (item.documentCategory === 'yff-lokalplan') {
    title.push('Elevens lokale læreplan i yrkesfaglig fordypning')
  } else if (item.documentCategory === 'yff-tilbakemelding') {
    title.push('Tilbakemeldingsskjema - arbeidspraksis')
  }
  title.push(item.documentCategory)
  if (notPublic) {
    title.push(item.studentName)
    title.push(item.schoolName)
    title.push(getSkoleAar())
    if (item.documentCategory !== 'yff-lokalplan') {
      title.push(item.bedriftsNavn)
    }
  }
  return title.join(' - ')
}

function repackLareplan (lines) {
  let plans = []
  lines.forEach(line => {
    plans.push(`\n${line.utplasseringsSted}`)
    line.line.forEach(l => {
      plans.push(`\nKompetansemål: ${l.kompetanseMaal} \nArbeidsoppgaver: ${l.arbeidsOppgaver}`)
    })
  })
  return plans.join('\n')
}

function repackPerson (lines) {
  let kontaktperson = []
  lines.forEach(line => {
    kontaktperson.push(`${line.navn} - telefon: ${line.telefon}${line.avdeling && line.avdeling !== '' ? ' - ' : ''}${line.avdeling || ''}`)
  })
  return kontaktperson.join('\n')
}

function repackTilbakemelding (lines) {
  let tilbakemelding = []
  lines.forEach(line => {
    if (/0/.test(line.score) !== true) {
      tilbakemelding.push(`${line.name} - ${line.score}`)
    }
  })
  return tilbakemelding.join('\n')
}

function repackArbeidstid (data) {
  let arbeidstid = []
  arbeidstid.push(`Tidsrom: ${data.startDato} - ${data.sluttDato}`)
  arbeidstid.push(`Arbeidsdag: ${data.startTid} - ${data.sluttTid}`)
  arbeidstid.push(`Dager i uken: ${data.daysPerWeek}`)
  if (data.oppmotested !== '') {
    arbeidstid.push(`Oppmøtested: ${data.oppmotested}`)
  }
  return arbeidstid.join('\n')
}

function repackFravar (data) {
  let fravar = ''
  if (/0/.test(data.fravarDager) !== true || /0/.test(data.fravarTimer) !== true) {
    if (data.varsletFravar === 'ja') {
      fravar = 'Eleven varslet selv om fraværet.'
    } else if (data.varsletFravar === 'nei') {
      fravar = 'Eleven varslet ikke om fraværet.'
    } else if (data.varsletFravar === 'av og til') {
      fravar = 'Eleven varslet selv om noe av fraværet.'
    }
  }
  return fravar
}

module.exports = data => {
  return new Promise((resolve, reject) => {
    logger('info', ['yff-prepare-document', data._id, data.studentUserName, data.documentType])
    const now = new Date()
    const date = datePadding(now.getDate()) + '.' + datePadding(now.getMonth() + 1) + '.' + now.getFullYear()
    const schoolInfo = getSchoolInfo({organizationNumber: data.schoolOrganizationNumber.replace(/\D/g, '')})[0]
    const template = getTemplate(data)
    const offTitle = generateTitle(data)
    data.document = {
      title: generateTitle(data, true),
      offTitle: offTitle,
      data: {
        dato: date,
        navnElev: data.studentName,
        tlfElev: data.studentPhone,
        epostElev: data.studentMail,
        fodselsdatoElev: birthdateFromId(data.studentId),
        fodselsNummerElev: data.studentId,
        klasseElev: data.studentMainGroupName,
        klasseTrinn: data.classLevel || '',
        utdanningsProgram: data.utdanningsprogram || '',
        paarorendeElev: data.parorendeData ? repackPerson(data.parorendeData) : '',
        navnMottaker: '',
        kontaktBedrift: data.kontaktpersonData ? repackPerson(data.kontaktpersonData) : '',
        navnOpplaeringssted: data.bedriftsNavn || '',
        utplasseringsTidsrom: data.utplasseringsPeriode || '',
        skoleAar: getSkoleAar(),
        arbeidsTid: data.utplasseringData ? repackArbeidstid(data.utplasseringData) : '',
        navnLaerer: data.userName,
        epostLaerer: data.userMail,
        navnSkole: schoolInfo.officialName,
        tlfSkole: schoolInfo.phoneNumber,
        yffDokument: offTitle,
        lokalLaereplan: data.lokalPlanMaal ? repackLareplan(buildLareplan(data.lokalPlanMaal)) : '',
        tilbakemeldingKompetansemaal: data.maal ? repackTilbakemelding(data.maal) : '',
        tilbakemeldingInntrykk: data.evaluation ? repackTilbakemelding(data.evaluation) : '',
        fravaerAntallDager: data.fravarDager || '',
        fravaerAntallTimer: data.fravarTimer || '',
        fravaerVarsling: data.documentCategory === 'yff-tilbakemelding' ? repackFravar(data) : ''
      },
      templateId: template,
      template: getTemplatePath(template),
      type: data.documentType,
      recipients: []
    }
    data.documentTemplate = template
    resolve(data)
  })
}
