'use strict'

module.exports = {
  ARCIVE_DIRECTORY_PATH: process.env.ARCIVE_DIRECTORY_PATH || 'test/directories/archive',
  CALLBACK_DIRECTORY_PATH: process.env.CALLBACK_DIRECTORY_PATH || 'test/directories/callback',
  DISTRIBUTION_DIRECTORY_PATH: process.env.DISTRIBUTION_DIRECTORY_PATH || 'test/directories/distribution',
  DONE_DIRECTORY_PATH: process.env.DONE_DIRECTORY_PATH || 'test/directories/done',
  ERRORS_DIRECTORY_PATH: process.env.ERRORS_DIRECTORY_PATH || 'test/directories/errors',
  NOTIFICATIONS_DIRECTORY_PATH: process.env.NOTIFICATIONS_DIRECTORY_PATH || 'test/directories/notifications',
  QUEUE_DIRECTORY_PATH: process.env.QUEUE_DIRECTORY_PATH || 'test/directories/queue',
  JWT_SECRET: process.env.JWT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  DSF_SERVICE_URL: process.env.DSF_SERVICE_URL || 'https://dsf.micro.tjeneste.win',
  PAPERTRAIL_HOSTNAME: process.env.PAPERTRAIL_HOSTNAME || 'minelev-robot',
  PAPERTRAIL_HOST: process.env.PAPERTRAIL_HOST || 'logs.papertrailapp.com',
  PAPERTRAIL_PORT: process.env.PAPERTRAIL_PORT || 12345
}
