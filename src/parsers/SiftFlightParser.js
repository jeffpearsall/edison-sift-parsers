import FlickrAirportMapping from '../data/FlickrAirportMapping.json';
import moment from 'moment';

export const SiftFlightParser = async (sifts) => {
  let flights = [];
  for (let sift of sifts) {
    const { payload, email_time, sift_id } = sift;

    let title, status, destinationCity, startTime, endTime, depart, arrival, airport, city;
    let subTitle = '';
    let cancelled = false;

    // check if cancelled
    if (payload.reservationStatus) {
      if (payload.reservationStatus == 'http://schema.org/ReservationCancelled') {
        cancelled = true;
      }
    }

    if (payload.reservationFor) {
      startTime = moment(payload.reservationFor[0].departureTime).toISOString();

      if (payload.reservationFor.length > 1) {
        if (payload.reservationFor[0].departureTime) {
          let departureTime = moment(payload.reservationFor[0].departureTime).format('h:mm a');
          status = `Departs ${departureTime}`;
          if (payload.reservationFor[0].arrivalTime) {
            let arrivalTime = moment(payload.reservationFor[0].arrivalTime).format('h:mm a');
            status = `Departs ${departureTime} - Arrives ${arrivalTime}`;
          }

          if (payload.reservationFor[1].arrivalTime) {
            depart = moment(payload.reservationFor[0].departureTime).format('ddd, MMM D');
            arrival = moment(payload.reservationFor[1].arrivalTime).format('ddd, MMM D');
            subTitle = `${depart} to ${arrival}`;
          } else if (payload.reservationFor[0].departureTime) {
            depart = moment(payload.reservationFor[0].departureTime).format('ddd, MMM D');
            subTitle = `Departing ${depart}`;
          }
        }
      } else if (payload.reservationFor.length === 1) {
        if (payload.reservationFor[0].departureTime) {
          depart = moment(payload.reservationFor[0].departureTime).format('ddd, MMM D');
          subTitle = depart;

          let departureTime = moment(payload.reservationFor[0].departureTime).format('h:mm a');
          status = `Departs ${departureTime}`;
          if (payload.reservationFor[0].arrivalTime) {
            let arrivalTime = moment(payload.reservationFor[0].arrivalTime).format('h:mm a');
            status = `Departs ${departureTime} - Arrives ${arrivalTime}`;
          }
        } else {
          subTitle = 'Upcoming Trip';
        }
      }

      let arriveTime, departTime;
      if (payload.reservationFor[0]) {
        // get arrival time for card
        if (payload.reservationFor[0].arrivalTime) {
          departTime = payload.reservationFor[0].departureTime;
        }

        if (payload.reservationFor[0].departureAirport) {
          let DepartureAirport = payload.reservationFor[0].departureAirport;
          if (DepartureAirport['x-cityName']) {
            title = 'Trip to ' + DepartureAirport['x-cityName'];
          }
        }
        if (payload.reservationFor[0].arrivalAirport) {
          let ArrivalAirport = payload.reservationFor[0].arrivalAirport;

          if (ArrivalAirport['x-cityName']) {
            title = 'Trip to ' + ArrivalAirport['x-cityName'];
            destinationCity = ArrivalAirport['x-cityName'];
          }
        }

        if (!startTime) {
          startTime = moment.unix(email_time).toISOString();
        }

        let departures = [];

        // Testing new parsing for flights
        let arrivalFound = false;
        payload.reservationFor.forEach((reservation, i) => {
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

        if (payload.reservationFor.length > 0) {
          const last = payload.reservationFor.length - 1;
          if (payload.reservationFor[0] && payload.reservationFor[last]) {
            if (payload.reservationFor[last].arrivalTime) {
              endTime = payload.reservationFor[last].arrivalTime;
            }

            const departureTime = payload.reservationFor[0].departureTime;
            const arrivalTime = payload.reservationFor[last].arrivalTime;

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

        if (airport && airport.airport) {
          let index = airport.airport.indexOf('-');
          if (index != -1) {
            city = airport.airport.slice(0, index);
          } else {
            city = airport.airport;
          }
        }

        let displayData = {
          type: 'flight',
          startTime: moment.unix(startTime),
          endTime: moment.unix(endTime),
          id: sift_id,
          title: title,
          subtitle: subTitle,
          backupIcon: 'flight',
          destination: title,
          dates: subTitle,
          times: status,
          cancelled: cancelled,
        };

        flights.push({
          type: 'flight',
          backupIcon: 'flight',
          sift: sift,
          title: title,
          status: status,
          destinationCity: destinationCity,
          subtitle: subTitle,
          emailTime: email_time,
          endTime: endTime,
          startTime: startTime,
          vendor: payload['x-vendorId'],
          displayData: displayData,
          departures: departures,
          airport: airport,
          city: city,
          imageQuery: city,
          cancelled: cancelled,
          uniqueId: createId(sift),
        });
      }
    }
  }

  return flights;
};

const createId = (sift) => {
  let uniqueId;
  const { payload: pl } = sift;

  if (pl.reservationId) {
    uniqueId = 'flightId:' + pl.reservationId;
  } else if (pl.reservationFor) {
    if (pl.reservationFor.departureTime && pl.reservationFor.flightNumber) {
      uniqueId = 'flightId:' + pl.reservationFor.departureTime + pl.reservationFor.flightNumber;
    } else {
      uniqueId = 'flightId:' + String(sift.sift_id);
    }
  } else {
    uniqueId = 'flightId:' + String(sift.sift_id);
  }

  uniqueId = uniqueId.replace("'", '');
  uniqueId = uniqueId.toUpperCase();

  return uniqueId;
};
