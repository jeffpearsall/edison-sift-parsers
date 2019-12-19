import moment from 'moment';

export const SiftEventParser = async (sifts) => {
  let events = [];
  for (let sift of sifts) {
    let vendor, date, time, ticket, reservation;
    let startTime, eventName, title;
    let subTitle = '';
    let emailTime = sift.email_time;

    if (sift.payload) {
      if (sift.payload.provider) {
        if (sift.payload.provider.name) {
          vendor = sift.payload.provider.name;
        }
      }

      if (sift.payload.reservedTicket) {
        if (sift.payload.reservedTicket[0]) {
          if (sift.payload.reservedTicket[0].url) {
            ticket = sift.payload.reservedTicket[0].url;
          }
        }
      }

      if (sift.payload.startTime) {
        startTime = sift.payload.startTime;
        date = moment(sift.payload.startTime).format('dddd, MMM D');
        time = moment(sift.payload.startTime).format('h:mm a');

        reservation = moment(sift.payload.startTime);
      } else if (sift.payload.reservationFor.startDate) {
        startTime = sift.payload.reservationFor.startDate;
        date = moment(sift.payload.reservationFor.startDate).format('dddd, MMM D');
        time = moment(sift.payload.reservationFor.startDate).format('h:mm a');
      }

      if (sift.payload.reservationFor) {
        if (sift.payload.reservationFor.name) {
          eventName = sift.payload.reservationFor.name;
        } else {
          eventName = 'Upcoming Event';
        }

        title = eventName;

        if (sift.payload.reservationFor.startDate) {
          const startDate = moment(sift.payload.reservationFor.startDate).format('dddd, MMM D - hh:mm A');
          subTitle = `${startDate}`;
        } else {
          subTitle = 'Upcoming Event';
        }
      }
    }

    let displayData = {
      type: 'event',
      startTime: moment.unix(startTime),
      id: sift.sift_id,
      title: title,
      subtitle: subTitle,
      backupIcon: 'entertainment',
      vendor: vendor,
      date: date,
      time: time,
      ticket: ticket,
      reservation: reservation,
    };

    let payload = {
      type: 'event',
      backupIcon: 'entertainment',
      sift: sift,
      title: title,
      subtitle: subTitle,
      emailTime: emailTime,
      vendor: sift.payload['x-vendorId'],
      startTime: startTime,
      displayData: JSON.stringify(displayData),
    };
    events.push(payload);
  }

  createIds(events);
  return events;
};

const createIds = (sifts) => {
  for (let sift of sifts) {
    if (sift.sift.payload.reservationFor) {
      if (sift.sift.payload.reservationFor.name && sift.sift.payload.reservationFor.startDate) {
        sift.uniqueId = 'eventId:' + sift.sift.payload.reservationFor.name + sift.sift.payload.reservationFor.startDate;
      } else {
        sift.uniqueId = 'eventId:' + String(sift.sift.sift_id);
      }

      sift.uniqueId = sift.uniqueId.replace("'", '');
      sift.uniqueId = sift.uniqueId.toUpperCase();
    }
  }
};
