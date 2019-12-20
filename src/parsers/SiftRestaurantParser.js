import moment from 'moment';

export const SiftRestaurantParser = async (sifts) => {
  let reservations = [];
  for (let sift of sifts) {
    const { payload, email_time, sift_id } = sift;

    let vendor, date, time, ticket, reservation, startTime;
    let providerName, restaurantName, title;
    let subTitle = '';
    let displayTime = payload.startTime;

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
        startTime = payload.startTime;
        reservation = moment(payload.startTime);
      } else if (payload.reservationFor.startDate) {
        startTime = payload.reservationFor.startDate;
        date = moment(payload.reservationFor.startDate).format('dddd, MMM D');
        time = moment(payload.reservationFor.startDate).format('h:mm a');
        startTime = payload.reservationFor.startDate;
      }

      if (payload.provider) {
        if (payload.provider.name) {
          providerName = payload.provider.name;
        }
      }

      if (payload.reservationFor) {
        restaurantName = payload.reservationFor.name;
      }
    }

    if (displayTime) {
      displayTime = moment(displayTime).format('MMM DD [at] h:mm a');
    }

    // Setting the title
    if (restaurantName) {
      title = restaurantName;
    } else if (providerName) {
      title = providerName;
    } else {
      title = 'Restaurant reservation';
    }

    // Setting the subtitle
    if (displayTime) {
      subTitle = displayTime;
    } else {
      subTitle = 'Restaurant reservation';
    }

    let displayData = {
      type: 'restaurant',
      startTime: moment.unix(email_time),
      id: sift_id,
      title: title,
      subtitle: subTitle,
      backupIcon: 'categoryRestaurant',
      vendor: vendor,
      date: date,
      time: time,
      ticket: ticket,
      reservation: reservation,
    };

    reservations.push({
      type: 'restaurant',
      backupIcon: 'categoryRestaurant',
      sift: sift,
      title: title,
      subtitle: subTitle,
      emailTime: email_time,
      startTime: startTime,
      date: date,
      time: time,
      ticket: ticket,
      reservation: reservation,
      vendor: payload['x-vendorId'],
      displayData: displayData,
      uniqueId: createId(sift),
    });
  }

  return reservations;
};

const createId = (sift) => {
  let uniqueId;

  const { payload: pl } = sift;

  if (pl.reservationId) {
    uniqueId = 'restaurantId:' + pl.reservationId;
  } else {
    uniqueId = 'restaurantId:' + String(sift.sift_id);
  }

  uniqueId = uniqueId.replace("'", '');
  uniqueId = uniqueId.toUpperCase();

  return uniqueId;
};
