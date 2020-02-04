import moment from 'moment';

export const eventParser = (sift) => {
  const { payload, email_time, sift_id } = sift;

  let vendor, date, time, ticket, reservation, address, locationName;
  let startTime, eventName, title, ticketUrl;
  let subTitle = '';

  if (payload) {
    if (payload.provider) {
      if (payload.provider.name) {
        vendor = payload.provider.name;
      }
    }

    if (payload.reservedTicket) {
      if (payload.reservedTicket[0]) {
        if (payload.reservedTicket[0].url) {
          ticket = payload.reservedTicket[0].url;
        }
      }
    }

    if (payload.startTime) {
      startTime = payload.startTime;
      date = moment(payload.startTime).format('dddd, MMM D');
      time = moment(payload.startTime).format('h:mm a');

      reservation = moment(payload.startTime);
    } else if (payload.reservationFor.startDate) {
      startTime = payload.reservationFor.startDate;
      date = moment(payload.reservationFor.startDate).format('dddd, MMM D');
      time = moment(payload.reservationFor.startDate).format('h:mm a');
    }

    if (payload.reservationFor) {
      if (payload.reservationFor.name) {
        eventName = payload.reservationFor.name;
      } else {
        eventName = 'Upcoming Event';
      }

      title = eventName;

      if (payload.reservationFor.startDate) {
        const startDate = moment(payload.reservationFor.startDate).format('dddd, MMM D - hh:mm A');
        subTitle = `${startDate}`;
      } else {
        subTitle = 'Upcoming Event';
      }

      if (payload.reservationFor.location) {
        address = payload.reservationFor.location.address;
        locationName = payload.reservationFor.location.name;
      }
    }

    if (payload.reservedTicket) {
      if (payload.reservedTicket[0]) {
        if (payload.reservedTicket[0].ticketUrl) {
          ticketUrl = payload.reservedTicket[0].ticketUrl;
        }
      }
    }
  }

  let displayData = {
    type: 'event',
    startTime: moment.unix(startTime),
    id: sift_id,
    title: title,
    subtitle: subTitle,
    backupIcon: 'entertainment',
    vendor: vendor,
    date: date,
    time: time,
    ticket: ticket,
    reservation: reservation,
  };

  return {
    type: 'event',
    sift: sift,
    title: title,
    subtitle: subTitle,
    emailTime: email_time,
    startTime: startTime,
    ticketUrl: ticketUrl,
    time: time,
    date: date,
    address: address,
    locationName: locationName,
    provider: vendor,
    displayData: displayData,
    vendor: sift.payload['x-vendorId'],
    uniqueId: createId(sift),
  };
};

const createId = (sift) => {
  let uniqueId;

  if (sift.payload.reservationFor) {
    if (sift.payload.reservationFor.name && sift.payload.reservationFor.startDate) {
      uniqueId = 'eventId:' + sift.payload.reservationFor.name + sift.payload.reservationFor.startDate;
    } else {
      uniqueId = 'eventId:' + String(sift.sift_id);
    }

    uniqueId = uniqueId.replace("'", '');
    uniqueId = uniqueId.toUpperCase();
  }

  return uniqueId;
};
