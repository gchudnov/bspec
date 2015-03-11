'use strict';

/**
 * An entry barrier opens only if the ticket meets all of the following criteria:
 *
 * 1. it is valid for travel from that station;
 * 2. it has not expired;
 * 3. it has not already been used for the maximum number of journeys allowed.
 */

require('es6-promise').polyfill();
var Spec = require('./../lib/bspec').PromiseSpec;

var TODAY = new Date(2015, 2, 1);

var isTicketExpired = function isTicketExpired(ticket) {
  return Promise.resolve(TODAY > ticket.expiresAt);
};

var isMaxJourneys = function isMaxJourneys(ticket) {
  return Promise.resolve(ticket.cur_journeys >= ticket.max_journeys);
};

var isValidFromStation = function isValidFromStation(name, ticket) {
  return Promise.resolve(ticket.stations.indexOf(name) !== -1);
};

function makeBarrierSpec(stationName) {
  return Spec(isValidFromStation.bind(null, stationName))
    .and(Spec(isTicketExpired).not())
    .and(Spec(isMaxJourneys).not());
}

var lowangenBarrier = makeBarrierSpec('Lowangen');
var rivaBarrier = makeBarrierSpec('Riva');

var ticket = {
  stations: [ 'Lowangen' ],
  expiresAt: new Date(2015, 2, 6),
  max_journeys: 30,
  cur_journeys: 11
};

lowangenBarrier.isSatisfiedBy(ticket)
  .then(function(result) {
    console.log('The ticket can be used to enter the Lowangen station:', result);
  })
  .catch(function(err) {
    throw err;
  });

rivaBarrier.isSatisfiedBy(ticket)
  .then(function(result) {
    console.log('The ticket can be used to enter the Riva station:', result);
  })
  .catch(function(err) {
    throw err;
  });
