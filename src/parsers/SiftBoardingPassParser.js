import moment from 'moment';

export const SiftBoardingPassParser = async (sifts) => {
  let boardingpasses = [];

  for (let sift of sifts) {
    const { payload, email_time, sift_id } = sift;
    const { reservationFor: rf, reservedTicket: rt, reservationId } = payload;

    let startTime, endTime;
    let tickets = [];
    let reservations = [];

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
      id: sift_id,
      title: title,
      subtitle: subTitle,
      backupIcon: 'flight',
      reservations: reservations,
      reservationId: reservationId,
    };

    boardingpasses.push({
      type: 'boardingpass',
      backupIcon: 'flight',
      sift: sift,
      title: title,
      subtitle: subTitle,
      emailTime: email_time,
      startTime: startTime,
      endTime: endTime,
      displayData: displayData,
      uniqueId: createId(sift),
    });
  }
  return boardingpasses;
};

const createId = (sift) => {
  let uniqueId;

  if (sift.payload.reservationId) {
    uniqueId = 'boardingpassId:' + sift.payload.reservationId;
  } else {
    uniqueId = 'boardingpassId' + String(sift.sift_id);
  }

  uniqueId = uniqueId.toUpperCase();
  uniqueId = uniqueId.replace("'", '');

  return uniqueId;
};
