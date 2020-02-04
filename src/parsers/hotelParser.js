import moment from 'moment';
import parser from 'parse-address';

export const hotelParser = (sift) => {
  const { payload, email_time, sift_id } = sift;

  let title, startTime, endTime, status, city, reservationNumber;
  let hotelName, telephone, address, rooms, roomType, days, broker;
  let subTitle = '';

  if (payload.broker) {
    broker = payload.broker.name;
  }

  if (payload.checkinTime) {
    startTime = payload.checkinTime;
  }

  if (payload.checkoutTime) {
    endTime = payload.checkoutTime;
  }

  if (payload.checkinTime && payload.checkoutTime) {
    const checkin = moment(payload.checkinTime).format('ddd, MMM DD');
    const checkout = moment(payload.checkoutTime).format('ddd, MMM DD, YYYY');
    subTitle = `${checkin} to ${checkout}`;
    status = `Check In - ${checkin}`;
  } else if (payload.checkinTime) {
    const checkin = moment(payload.checkinTime).format('MMM D');
    subTitle = `Checkin ${checkin}`;
    status = `Check In - ${checkin}`;
  } else {
    subTitle = 'Hotel Stay';
  }

  if (payload.reservationId) {
    reservationNumber = payload.reservationId;
  }

  if (payload.reservationFor) {
    title = payload.reservationFor.name;
    hotelName = payload.reservationFor.name;
    telephone = payload.reservationFor.telephone;
    address = payload.reservationFor.address;
    rooms = payload.reservationFor['x-rooms'];
    roomType = payload.reservationFor['x-roomType'];
    days = payload.reservationFor['x-days'];

    if (payload.reservationFor.address) {
      let humanAddress = parser.parseLocation(payload.reservationFor.address);
      if (humanAddress && humanAddress.city && humanAddress.state) {
        city = `${humanAddress.city},${humanAddress.state}`;
      }
    } else if (payload.reservationFor.name) {
      city = payload.reservationFor.name;
    }
  }

  let displayData = {
    type: 'hotel',
    id: sift_id,
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
    sift: sift,
    title: title,
    subtitle: subTitle,
    status: status,
    emailTime: email_time,
    startTime: startTime,
    endTime: endTime,
    dates: subTitle,
    reservationNumber,
    hotelName,
    telephone,
    address,
    rooms,
    roomType,
    days,
    broker,
    destination: title,
    vendor: payload['x-vendorId'],
    displayData: displayData,
    city: city,
    uniqueId: createId(sift),
  };
};

const createId = (sift) => {
  let uniqueId;
  if (sift.payload.reservationId) {
    uniqueId = 'hotelId:' + sift.payload.reservationId;
  } else {
    uniqueId = 'hotelId:' + String(sift.sift_id);
  }

  uniqueId = uniqueId.replace("'", '');
  uniqueId = uniqueId.toUpperCase();

  return uniqueId;
};
