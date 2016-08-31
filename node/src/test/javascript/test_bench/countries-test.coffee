_ = require 'underscore'
APPROOT = require 'app-root-path'

{CAPITAL_CITIES} = require "#{APPROOT}/target/main/javascript/test_bench/countries"

describe 'Testing countries', ->
  describe 'capital_cities', ->

    it 'should contain the capital cities of the world!', ->
      console.log CAPITAL_CITIES
