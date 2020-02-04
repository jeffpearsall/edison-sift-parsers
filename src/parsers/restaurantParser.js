import moment from 'moment';

export const restaurantParser = (sift) => {
  const { payload, email_time, sift_id } = sift;

  let vendor, date, time, reservation, startTime, partySize;
  let providerName, restaurantName, title, address, phone;
  let subTitle = '';
  let displayTime = payload.startTime;

  if (payload) {
    if (payload.provider) {
      if (payload.provider.name) {
        vendor = payload.provider.name;
      }
    }

    if (payload.partySize) {
      partySize = payload.partySize;
    }

    if (payload.startTime) {
      startTime = payload.startTime;
      date = moment(startTime).format('dddd, MMM D');
      time = moment(startTime).format('h:mm a');
      reservation = moment(startTime);
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
      address = payload.reservationFor.address;
      phone = payload.reservationFor.telephone;
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
    reservation: reservation,
  };

  return {
    type: 'restaurant',
    sift: sift,
    title: title,
    subtitle: subTitle,
    emailTime: email_time,
    startTime: startTime,
    date: date,
    time: time,
    phone: phone,
    address: address,
    partySize: partySize,
    restaurantName: restaurantName,
    vendor: payload['x-vendorId'],
    displayData: displayData,
    uniqueId: createId(sift),
  };
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
