import moment from 'moment';

export const SiftBoardingPassParser = async (sifts) => {
  let boardingpasses = [];
  for (let sift of sifts) {
    let { reservationFor: rf, reservedTicket: rt, reservationId } = sift.payload;
    let startTime, endTime;
    let tickets = [];
    let reservations = [];
    let emailTime = sift.email_time;
    let subTitle = '';
    let title = 'Boarding Pass';

    if (rf && rf.length > 0) {
      reservations = rf.map((reservation, i) => {
        if (i === 0) {
          startTime = reservation.departureTime;
        } else if (i === rf.length - 1) {
          endTime = reservation.arrivalTime;
        }

        let { departureGate, departureTerminal, arrivalAirport, departureAirport, flightNumber } = reservation;

        let arrivalTime;
        if (reservation.arrivalTime) {
          arrivalTime = moment(reservation.arrivalTime).unix();
        } else {
          if (reservation.departureTime) {
            arrivalTime = moment(reservation.departureTime)
              .startOf('day')
              .unix();
          }
        }

        let departureTime;
        if (reservation.departureTime) {
          departureTime = moment(reservation.departureTime).unix();
        }

        return {
          gate: departureGate,
          terminal: departureTerminal,
          arrivalIata: arrivalAirport.iataCode,
          departureIata: departureAirport.iataCode,
          windowStart: departureTime,
          windowEnd: arrivalTime,
          reservationId: reservationId,
          flightNumber: flightNumber,
        };
      });
    }

    if (rt && rt.length > 0) {
      tickets = rt.map((ticket) => {
        let { ticketToken, url, ticketedSeat, underName } = ticket;
        let seatRow, seatNumber, name;

        if (ticketedSeat) {
          seatRow = ticketedSeat.seatRow;
          seatNumber = ticketedSeat.seatNumber;
        }

        if (underName) {
          name = underName.name;
        }

        return {
          ticketToken,
          url,
          seatRow,
          seatNumber,
          name,
        };
      });
    }

    // combine reservations and tickets
    if (tickets.length == reservations.length) {
      reservations = reservations.map((reservation, i) => Object.assign(reservation, tickets[i]));
    }

    let displayData = {
      type: 'boardingpass',
      startTime: startTime ? moment.unix(startTime) : null,
      endTime: endTime ? moment.unix(endTime) : null,
      id: sift.sift_id,
      title: title,
      subtitle: subTitle,
      backupIcon: 'flight',
      reservations: reservations,
      reservationId: reservationId,
    };

    let payload = {
      type: 'boardingpass',
      backupIcon: 'flight',
      sift: sift,
      title: title,
      subtitle: subTitle,
      emailTime: emailTime,
      startTime: startTime,
      endTime: endTime,
      displayData: JSON.stringify(displayData),
    };
    boardingpasses.push(payload);
  }

  createIds(boardingpasses);
  return boardingpasses;
};

const createIds = (sifts) => {
  for (let sift of sifts) {
    if (sift.sift.payload.reservationId) {
      sift.uniqueId = 'boardingpassId:' + sift.sift.payload.reservationId;
    } else {
      sift.uniqueId = 'boardingpassId' + String(sift.sift.sift_id);
    }

    sift.uniqueId = sift.uniqueId.toUpperCase();
    sift.uniqueId = sift.uniqueId.replace("'", '');
  }
};
