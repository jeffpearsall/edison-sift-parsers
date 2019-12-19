import FlickrAirportMapping from '../data/FlickrAirportMapping.json';
import moment from 'moment';

export const SiftFlightParser = async (sifts) => {
  let flights = [];
  for (let sift of sifts) {
    let title, status, destinationCity, startTime, endTime, depart, arrival, airport, city;
    let subTitle = '';
    let emailTime = sift.email_time;
    let cancelled = false;

    // check if cancelled
    if (sift.payload.reservationStatus) {
      if (sift.payload.reservationStatus == 'http://schema.org/ReservationCancelled') {
        cancelled = true;
      }
    }

    if (sift.payload.reservationFor) {
      startTime = moment(sift.payload.reservationFor[0].departureTime).toISOString();

      if (sift.payload.reservationFor.length > 1) {
        if (sift.payload.reservationFor[0].departureTime) {
          let departureTime = moment(sift.payload.reservationFor[0].departureTime).format('h:mm a');
          status = `Departs ${departureTime}`;
          if (sift.payload.reservationFor[0].arrivalTime) {
            let arrivalTime = moment(sift.payload.reservationFor[0].arrivalTime).format('h:mm a');
            status = `Departs ${departureTime} - Arrives ${arrivalTime}`;
          }

          if (sift.payload.reservationFor[1].arrivalTime) {
            depart = moment(sift.payload.reservationFor[0].departureTime).format('ddd, MMM D');
            arrival = moment(sift.payload.reservationFor[1].arrivalTime).format('ddd, MMM D');
            subTitle = `${depart} to ${arrival}`;
          } else if (sift.payload.reservationFor[0].departureTime) {
            depart = moment(sift.payload.reservationFor[0].departureTime).format('ddd, MMM D');
            subTitle = `Departing ${depart}`;
          }
        }
      } else if (sift.payload.reservationFor.length === 1) {
        if (sift.payload.reservationFor[0].departureTime) {
          depart = moment(sift.payload.reservationFor[0].departureTime).format('ddd, MMM D');
          subTitle = depart;

          let departureTime = moment(sift.payload.reservationFor[0].departureTime).format('h:mm a');
          status = `Departs ${departureTime}`;
          if (sift.payload.reservationFor[0].arrivalTime) {
            let arrivalTime = moment(sift.payload.reservationFor[0].arrivalTime).format('h:mm a');
            status = `Departs ${departureTime} - Arrives ${arrivalTime}`;
          }
        } else {
          subTitle = 'Upcoming Trip';
        }
      }

      let arriveTime, departTime;
      if (sift.payload.reservationFor[0]) {
        // get arrival time for card
        if (sift.payload.reservationFor[0].arrivalTime) {
          departTime = sift.payload.reservationFor[0].departureTime;
        }

        if (sift.payload.reservationFor[0].departureAirport) {
          let DepartureAirport = sift.payload.reservationFor[0].departureAirport;
          if (DepartureAirport['x-cityName']) {
            title = 'Trip to ' + DepartureAirport['x-cityName'];
          }
        }
        if (sift.payload.reservationFor[0].arrivalAirport) {
          let ArrivalAirport = sift.payload.reservationFor[0].arrivalAirport;

          if (ArrivalAirport['x-cityName']) {
            title = 'Trip to ' + ArrivalAirport['x-cityName'];
            destinationCity = ArrivalAirport['x-cityName'];
          }
        }

        if (!startTime) {
          startTime = moment.unix(emailTime).toISOString();
        }

        let departures = [];

        // Testing new parsing for flights
        let arrivalFound = false;
        sift.payload.reservationFor.forEach((reservation, i) => {
          if (reservation.arrivalAirport) {
            let city;
            if (reservation.arrivalAirport['x-cityName']) {
              city = reservation.arrivalAirport['x-cityName'];
            } else if (reservation.arrivalAirport['x-rawName']) {
              city = reservation.arrivalAirport['x-cityName'];
            }

            if (reservation.arrivalAirport['x-destination'] == 'true') {
              departures.push({
                departureTime: reservation.departureTime,
                arrivalTime: reservation.arrivalTime,
                airport: reservation.arrivalAirport.iataCode,
                city,
                destination: true,
              });

              if (!arrivalFound) {
                arrivalFound = true;
                if (reservation.arrivalTime) {
                  arriveTime = reservation.arrivalTime;
                }
                arrival = moment(reservation.arrivalTime).format('ddd, MMM D');
                if (reservation.arrivalAirport['x-cityName']) {
                  title = `Trip to ${reservation.arrivalAirport['x-cityName']}`;
                  destinationCity = reservation.arrivalAirport['x-cityName'];
                } else if (reservation.arrivalAirport['x-rawName']) {
                  title = `Trip to ${reservation.arrivalAirport['x-rawName']}`;
                  destinationCity = reservation.arrivalAirport['x-cityName'];
                }
                if (reservation.arrivalAirport.iataCode) {
                  airport = FlickrAirportMapping[reservation.arrivalAirport.iataCode];
                }
              }
            } else {
              departures.push({
                departureTime: reservation.departureTime,
                arrivalTime: reservation.arrivalTime,
                airport: reservation.arrivalAirport.iataCode,
                city,
                destination: false,
              });
            }
          }
        });

        if (sift.payload.reservationFor.length > 0) {
          const last = sift.payload.reservationFor.length - 1;
          if (sift.payload.reservationFor[0] && sift.payload.reservationFor[last]) {
            if (sift.payload.reservationFor[last].arrivalTime) {
              endTime = sift.payload.reservationFor[last].arrivalTime;
            }

            const departureTime = sift.payload.reservationFor[0].departureTime;
            const arrivalTime = sift.payload.reservationFor[last].arrivalTime;

            if (departureTime && arrivalTime) {
              const leaving = moment(departureTime).format('ddd, MMM D');
              const arriving = moment(arrivalTime).format('ddd, MMM D');

              if (leaving === arriving) {
                subTitle = `${leaving}`;
              } else {
                subTitle = `${leaving} to ${arriving}`;
              }
            }
          }
        }

        // if departTime and arriveTime found, update status
        if (arriveTime && departTime) {
          const t1 = moment(departTime).format('h:mm a');
          const t2 = moment(arriveTime).format('h:mm a');
          status = `Departs ${t1} - Arrives ${t2}`;
        }

        console.log('AIRPORTS:');
        console.log(airport);
        if (airport && airport.airport) {
          console.log(airport.airport);
          let index = airport.airport.indexOf('-');
          if (index != -1) {
            city = airport.airport.slice(0, index);
          } else {
            city = airport.airport;
          }
        }

        // let airports = flights.map((flight) => flight.airport);
        // let cities = airports.map((airport) => (airport ? airport.airport : null));
        // let cleanedCities = cities.map((city) => {
        //   if (city) {
        //     let index = city.indexOf('-');
        //     if (index != -1) {
        //       return city.slice(0, index);
        //     } else {
        //       return city;
        //     }
        //   } else {
        //     return null;
        //   }
        // });

        let displayData = {
          type: 'flight',
          startTime: moment.unix(startTime),
          endTime: moment.unix(endTime),
          id: sift.sift_id,
          title: title,
          subtitle: subTitle,
          backupIcon: 'flight',
          destination: title,
          dates: subTitle,
          times: status,
          cancelled: cancelled,
        };

        let flightPayload = {
          type: 'flight',
          backupIcon: 'flight',
          sift: sift,
          title: title,
          status: status,
          destinationCity: destinationCity,
          subtitle: subTitle,
          emailTime: emailTime,
          endTime: endTime,
          startTime: startTime,
          vendor: sift.payload['x-vendorId'],
          displayData: JSON.stringify(displayData),
          departures: departures,
          airport: airport,
          city: city,
          imageQuery: city,
        };

        flights.push(flightPayload);
      }
    }
  }

  createIds(flights);
  return flights;
};

const createIds = (sifts) => {
  for (let sift of sifts) {
    const pl = sift.sift.payload;

    if (pl.reservationId) {
      sift.uniqueId = 'flightId:' + pl.reservationId;
    } else if (pl.reservationFor) {
      if (pl.reservationFor.departureTime && pl.reservationFor.flightNumber) {
        sift.uniqueId = 'flightId:' + pl.reservationFor.departureTime + pl.reservationFor.flightNumber;
      } else {
        sift.uniqueId = 'flightId:' + String(sift.sift.sift_id);
      }
    } else {
      sift.uniqueId = 'flightId:' + String(sift.sift.sift_id);
    }

    sift.uniqueId = sift.uniqueId.replace("'", '');
    sift.uniqueId = sift.uniqueId.toUpperCase();
  }
};
