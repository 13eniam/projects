knex_lib = require 'knex'

knex_config =
  client: 'postgres'
  connection:
    host: '172.16.30.129'
    user: 'uac_user'
    database: 'uac'
    password: ''
    port: 5432
    charset: 'utf8'
  pool:
    min: 0
    max: 25
    log: false

Knex = knex_lib(knex_config)

exports.Knex = Knex

