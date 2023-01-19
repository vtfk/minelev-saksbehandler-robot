if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  ARCIVE_DIRECTORY_PATH: process.env.ARCIVE_DIRECTORY_PATH || 'test/directories/archive',
  CALLBACK_DIRECTORY_PATH: process.env.CALLBACK_DIRECTORY_PATH || 'test/directories/callback',
  DISTRIBUTION_DIRECTORY_PATH: process.env.DISTRIBUTION_DIRECTORY_PATH || 'test/directories/distribution',
  DONE_DIRECTORY_PATH: process.env.DONE_DIRECTORY_PATH || 'test/directories/done',
  ERRORS_DIRECTORY_PATH: process.env.ERRORS_DIRECTORY_PATH || 'test/directories/errors',
  NOTIFICATIONS_DIRECTORY_PATH: process.env.NOTIFICATIONS_DIRECTORY_PATH || 'test/directories/notifications',
  CALLBACK_SERVICE_URL: process.env.CALLBACK_SERVICE_URL || 'https://echo.mikrotjeneste.win/warnings',
  QUEUE_DIRECTORY_PATH: process.env.QUEUE_DIRECTORY_PATH || 'test/directories/queue',
  DISTRIBUTION_CODE: process.env.DISTRIBUTION_CODE || '1111',
  DISTRIBUTION_LETTER_TYPE: process.env.DISTRIBUTION_LETTER_TYPE || 'BPOST',
  DSF_SERVICE_URL: process.env.DSF_SERVICE_URL || 'https://dsf.micro.tjeneste.win',
  DSF_JWT_SECRET: process.env.DSF_JWT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  DOCUMENT_GENERATOR_URL: process.env.DOCUMENT_GENERATOR_URL || 'https://api.vtfk.dev/pdf/generate',
  KRR_URL: process.env.KRR_URL || 'https://api.vtfk.dev/krr/lookup',
  KRR_JWT_SECRET: process.env.KRR_JWT_SECRET || 'Secret secret',
  P360_URL: process.env.P360_URL || '',
  P360_TOKEN: process.env.P360_TOKEN || '',
  P360_DEFAULT_RESPONSIBLE_PERSON: process.env.P360_DEFAULT_RESPONSIBLE_PERSON || '200326',
  P360_DEFAULT_RESPONSIBLE_ENTERPRISE: process.env.P360_DEFAULT_RESPONSIBLE_ENTERPRISE || '506',
  P360_DEFAULT_ARCHIVE: process.env.P360_DEFAULT_ARCHIVE || 'Saksdokument',
  P360_DEFAULT_ARCHIVE_SECURE: process.env.P360_DEFAULT_ARCHIVE_SECURE || 'Personsensitivt dokument',
  PAPERTRAIL_HOST: process.env.PAPERTRAIL_HOST || 'logs.papertrailapp.com',
  PAPERTRAIL_TOKEN: process.env.PAPERTRAIL_TOKEN || undefined,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'Super secret secret',
  SVARUT_EXCEPTION_ENABLED: process.env.SVARUT_EXCEPTION_ENABLED && process.env.SVARUT_EXCEPTION_ENABLED === 'true' || false,
  SVARUT_EXCEPTION_LIST: process.env.SVARUT_EXCEPTION_LIST ? process.env.SVARUT_EXCEPTION_LIST.split(',') : []
}
