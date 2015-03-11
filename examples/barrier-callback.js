'use strict';

/**
 * An entry barrier opens only if the ticket meets all of the following criteria:
 *
 * 1. it is valid for travel from that station;
 * 2. it has not expired;
 * 3. it has not already been used for the maximum number of journeys allowed.
 */

var Spec = require('./../lib/bspec').CallbackSpec;

var TODAY = new Date(2015, 2, 1);

var isTicketExpired = function isTicketExpired(ticket, cb) {
  var result = TODAY > ticket.expiresAt;
  cb(null, result);
};

var isMaxJourneys = function isMaxJourneys(ticket, cb) {
  var result = ticket.cur_journeys >= ticket.max_journeys;
  cb(null, result);
};

var isValidFromStation = function isValidFromStation(name, ticket, cb) {
  var result = (ticket.stations.indexOf(name) !== -1);
  cb(null, result);
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

lowangenBarrier.isSatisfiedBy(ticket, function(err, result) {
  if(err) {
    throw err;
  }
  console.log('The ticket can be used to enter the Lowangen station:', result);
});

rivaBarrier.isSatisfiedBy(ticket, function(err, result) {
  if(err) {
    throw  err;
  }
  console.log('The ticket can be used to enter the Riva station:', result);
});
