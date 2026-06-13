/**
 * Seed dataset for monitored properties.
 *
 * In production these records would live in a datastore populated by GARVIS
 * (Ground Analysis & Real-time Vigilance Intelligence System), the sensor
 * network that collects readings from each site. Here they are kept in memory
 * so the API is runnable with no external dependencies. Each property is
 * tracked by a ground sensor that reports cumulative movement (in millimetres).
 */

const properties = [
  {
    id: 1,
    name: '1427 Palm Grove Lane',
    city: 'Orlando, FL',
    movement: 0.8,
    sensorId: 'GW-SENS-0142',
    foundation: 'Slab-on-grade',
    installed: '2024-03-11',
    lat: 28.5383,
    lng: -81.3792,
  },
  {
    id: 2,
    name: '8932 Cypress Drive',
    city: 'Tampa, FL',
    movement: 4.2,
    sensorId: 'GW-SENS-0233',
    foundation: 'Pier & beam',
    installed: '2023-11-02',
    lat: 27.9506,
    lng: -82.4572,
  },
  {
    id: 3,
    name: '204 Mockingbird Court',
    city: 'Jacksonville, FL',
    movement: 6.7,
    sensorId: 'GW-SENS-0319',
    foundation: 'Slab-on-grade',
    installed: '2023-06-18',
    lat: 30.3322,
    lng: -81.6557,
  },
  {
    id: 4,
    name: '55 Harborview Terrace',
    city: 'Miami, FL',
    movement: 1.4,
    sensorId: 'GW-SENS-0407',
    foundation: 'Pile-supported',
    installed: '2024-01-27',
    lat: 25.7617,
    lng: -80.1918,
  },
  {
    id: 5,
    name: '3110 Sandhill Road',
    city: 'Gainesville, FL',
    movement: 5.9,
    sensorId: 'GW-SENS-0512',
    foundation: 'Pier & beam',
    installed: '2023-09-09',
    lat: 29.6516,
    lng: -82.3248,
  },
  {
    id: 6,
    name: '781 Lakeshore Boulevard',
    city: 'St. Petersburg, FL',
    movement: 0.3,
    sensorId: 'GW-SENS-0588',
    foundation: 'Slab-on-grade',
    installed: '2024-04-30',
    lat: 27.7676,
    lng: -82.6403,
  },
];

module.exports = properties;
