console.log 'Countries'

_ = require('underscore')


COUNTRIES = [
  {
    name: 'ITALY'
    capital: 'ROME'
  }
  {
    name: 'GERMANY'
    capital: 'BERLIN'
  }
  {
    name: 'FRANCE'
    capital: 'PARIS'
  }
]

CAPITAL_CITIES = _.pluck COUNTRIES,'capital'

exports.COUNTRIES = COUNTRIES
exports.CAPITAL_CITIES = CAPITAL_CITIES
