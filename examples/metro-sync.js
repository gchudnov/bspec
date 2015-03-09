'use strict';

/**
 * Metro
 * An entry barrier opens only if the ticket meets all of the following criteria:
 *
 * 1. it is valid for travel from that station;
 * 2. it has not expired;
 * 3. it has not already been used for the maximum number of journeys allowed.
 */

var Spec = require('./../lib/bspec').SyncSpec;

var TODAY = new Date(2015, 2, 1);

var isTicketExpired = function isTicketExpired(ticket) {
  return (TODAY > ticket.expiresAt);
};

var isMaxJourneys = function isMaxJourneys(ticket) {
  return (ticket.cur_journeys >= ticket.max_journeys);
};

var isValidFromStation = function isValidFromStation(name, ticket) {
  return (ticket.stations.indexOf(name) !== -1);
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

console.log('The ticket can be used to enter the Lowangen station:', lowangenBarrier.isSatisfiedBy(ticket));
console.log('The ticket can be used to enter the Riva station:', rivaBarrier.isSatisfiedBy(ticket));
