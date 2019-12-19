import moment from 'moment';

export const SiftRestaurantParser = async (sifts) => {
  let reservations = [];
  for (let sift of sifts) {
    let vendor, date, time, ticket, reservation, startTime;
    let providerName, restaurantName, title;
    let subTitle = '';
    let emailTime = sift.email_time;
    let displayTime = sift.payload.startTime;

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
        startTime = sift.payload.startTime;
        reservation = moment(sift.payload.startTime);
      } else if (sift.payload.reservationFor.startDate) {
        startTime = sift.payload.reservationFor.startDate;
        date = moment(sift.payload.reservationFor.startDate).format('dddd, MMM D');
        time = moment(sift.payload.reservationFor.startDate).format('h:mm a');
        startTime = sift.payload.reservationFor.startDate;
      }

      if (sift.payload.provider) {
        if (sift.payload.provider.name) {
          providerName = sift.payload.provider.name;
        }
      }

      if (sift.payload.reservationFor) {
        restaurantName = sift.payload.reservationFor.name;
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
      startTime: moment.unix(emailTime),
      id: sift.sift_id,
      title: title,
      subtitle: subTitle,
      backupIcon: 'categoryRestaurant',
      vendor: vendor,
      date: date,
      time: time,
      ticket: ticket,
      reservation: reservation,
    };

    let reservationPayload = {
      type: 'restaurant',
      backupIcon: 'categoryRestaurant',
      sift: sift,
      title: title,
      subtitle: subTitle,
      emailTime: emailTime,
      startTime: startTime,
      vendor: sift.payload['x-vendorId'],
      displayData: JSON.stringify(displayData),
    };
    reservations.push(reservationPayload);
  }

  createIds(reservations);
  return reservations;
};

const createIds = (sifts) => {
  for (let sift of sifts) {
    const pl = sift.sift.payload;

    if (pl.reservationId) {
      sift.uniqueId = 'restaurantId:' + pl.reservationId;
    } else {
      sift.uniqueId = 'restaurantId:' + String(sift.sift.sift_id);
    }

    sift.uniqueId = sift.uniqueId.replace("'", '');
    sift.uniqueId = sift.uniqueId.toUpperCase();
  }
};
