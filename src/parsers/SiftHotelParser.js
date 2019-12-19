import moment from 'moment';
import parser from 'parse-address';

export const SiftHotelParser = async (sifts) => {
  let hotels = [];
  for (let sift of sifts) {
    const hotelPayload = parseSift(sift);
    hotels.push(hotelPayload);
  }

  hotels.forEach((hotel) => (hotel.displayData = JSON.stringify(hotel.displayData)));

  createIds(hotels);
  return hotels;
};

export const parseSift = (sift) => {
  let title, startTime, endTime, status, imageQuery;
  let subTitle = '';
  let emailTime = sift.email_time;

  if (sift.payload.checkinTime) {
    startTime = sift.payload.checkinTime;
  }

  if (sift.payload.checkoutTime) {
    endTime = sift.payload.checkoutTime;
  }

  if (sift.payload.checkinTime && sift.payload.checkoutTime) {
    const checkin = moment(sift.payload.checkinTime).format('ddd, MMM DD');
    const checkout = moment(sift.payload.checkoutTime).format('ddd, MMM DD, YYYY');
    subTitle = `${checkin} to ${checkout}`;
    status = `Check In - ${checkin}`;
  } else if (sift.payload.checkinTime) {
    const checkin = moment(sift.payload.checkinTime).format('MMM D');
    subTitle = `Checkin ${checkin}`;
    status = `Check In - ${checkin}`;
  } else {
    subTitle = 'Hotel Stay';
  }

  if (sift.payload.reservationFor) {
    title = sift.payload.reservationFor.name;

    if (sift.payload.reservationFor.address) {
      let humanAddress = parser.parseLocation(sift.payload.reservationFor.address);
      if (humanAddress && humanAddress.city && humanAddress.state) {
        imageQuery = `${humanAddress.city},${humanAddress.state}`;
      }
    } else if (sift.payload.reservationFor.name) {
      imageQuery = sift.payload.reservationFor.name;
    }
  }

  let displayData = {
    type: 'hotel',
    id: sift.sift_id,
    title: title,
    subtitle: subTitle,
    backupIcon: 'lodging',
    endTime: endTime,
    startTime: startTime,
    destination: title,
    dates: subTitle,
    times: status,
  };

  return {
    type: 'hotel',
    backupIcon: 'lodging',
    sift: sift,
    title: title,
    subtitle: subTitle,
    status: status,
    emailTime: emailTime,
    startTime: startTime,
    endTime: endTime,
    vendor: sift.payload['x-vendorId'],
    displayData: JSON.stringify(displayData),
    imageQuery: imageQuery,
  };
};

const createIds = (sifts) => {
  for (let sift of sifts) {
    const pl = sift.sift.payload;

    if (pl.reservationId) {
      sift.uniqueId = 'hotelId:' + pl.reservationId;
    } else {
      sift.uniqueId = 'hotelId:' + String(sift.sift.sift_id);
    }

    sift.uniqueId = sift.uniqueId.replace("'", '');
    sift.uniqueId = sift.uniqueId.toUpperCase();
  }
};
