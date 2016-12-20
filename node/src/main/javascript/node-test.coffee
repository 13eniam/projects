console.log 'Put your test code here.'

APPROOT = require('app-root-path')
console.log "APPROOT: #{APPROOT}"
console.log "=========================================================="
console.log
console.log

{testfixture, moment_testfixture} = require("#{APPROOT}/target/main/javascript/test_bench/testfixture")
#countries = require("#{APPROOT}/target/lib/test_bench/countries")

#console.log 'Countries', countries.COUNTRIES
#console.log 'Capital Cities', countries.CAPITAL_CITIES


#test.testfixture.test1()
#test.testfixture.dbtestTwo()
#test.testfixture.dbtestRowCount()
#testfixture.dbtestGetAdRulesByClientId()
testfixture.dbtest()

#moment_testfixture.test_moment_functions()