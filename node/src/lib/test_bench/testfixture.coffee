_ = require('underscore')

APPROOT = require('app-root-path')
knex = require("#{APPROOT}/target/lib/test_bench/uacdb").Knex

testfixture =
  test1:  ->

    chooseFromArray = (arr) ->
      startIndex = _.random(1, arr.length)
      endIndex = _.random(startIndex, arr.length)
      result = arr.slice startIndex, endIndex
      result.join(',')

    console.log "Test Fixture one"
    console.log "Random 1-10", _.random(1,10)
    clients = ['FIAT', 'Volvo', 'SCANIA', 'IVECO']

    console.log 'result', chooseFromArray clients
    console.log 'result', chooseFromArray clients
    console.log 'result', chooseFromArray clients
    console.log 'result', chooseFromArray clients
    console.log 'result', chooseFromArray clients

  dbtest: ->
    console.log "UAC DB test"
    knex('client').select('uuid','name','alias').limit(10).offset(40).then (rows) ->
      _.each rows, (row,index) ->
        console.log "%d  %s", index+1, row.name
    .catch (err) ->
      console.error err

  dbtestTwo: ->
    console.log "UAC DB AutoDisposition test"
    knex.select('auto_disposition_rules.name as rule_name','created_at', 'updated_at', 'created_by', 'updated_by' ).from('auto_disposition_rules')
    .innerJoin('auto_disposition_rule_clients','auto_disposition_rules.uuid', 'auto_disposition_rule_clients.auto_disposition_rule_uuid')
    .innerJoin('client', 'client.uuid', 'auto_disposition_rule_clients.client_uuid')
    .where({alert_type: 'Network'})
    #.limit(2).offset(2)
    .then (rows) ->
      #console.dir JSON.stringify rows
      _.each rows, (row,index) ->
       console.log "%d    %s", index+1, JSON.stringify row
    .catch (err) ->
      console.error err

  dbtestRowCount: ->
    console.log "UAC DB AutoDisposition row count test"
    knex.select().from('auto_disposition_rules')
    .innerJoin('auto_disposition_rule_clients','auto_disposition_rules.uuid', 'auto_disposition_rule_clients.auto_disposition_rule_uuid')
    .innerJoin('client', 'client.uuid', 'auto_disposition_rule_clients.client_uuid')
    .where({alert_type: 'Network'}).count('auto_disposition_rule_uuid').first()
    #.limit(2).offset(2)
    .then (rows) ->
      console.dir parseInt rows.count, 10
    .catch (err) ->
      console.error err

exports.testfixture = testfixture
