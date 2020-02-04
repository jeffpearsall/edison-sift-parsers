import moment from 'moment';
import parser from 'parse-address';

export const rentalParser = (sift) => {
  const { payload, email_time, sift_id } = sift;

  let startTime = moment.unix(email_time);
  let carName, title, subTitle, pickupTime, dropoffTime, status, endTime, city;
  let reservationNumber, pickupLocation, dropoffLocation, underName;

  if (payload.reservationFor) {
    if (payload.reservationFor.name) {
      carName = payload.reservationFor.name;
    }
  }
  if (payload.reservationId) {
    reservationNumber = payload.reservationId;
  }

  if (payload.pickupTime) {
    startTime = payload.pickupTime;
  }

  if (payload.dropoffLocation.address) {
    let humanAddress = parser.parseLocation(payload.dropoffLocation.address);
    if (humanAddress.city && humanAddress.state) {
      city = `${humanAddress.city},${humanAddress.state}`;
    }
  }

  if (payload.dropoffTime) {
    endTime = payload.dropoffTime;
  }

  if (payload.pickupTime && payload.dropoffTime) {
    pickupTime = moment(payload.pickupTime).format('ddd, MMM DD');
    dropoffTime = moment(payload.dropoffTime).format('ddd, MMM DD');
  }

  if (payload.pickupLocation) {
    pickupLocation = payload.pickupLocation.address;
  }

  if (payload.dropoffLocation) {
    dropoffLocation = payload.dropoffLocation.address;
  }

  if (payload.underName) {
    underName = payload.underName.name;
  }

  title = carName;
  subTitle = pickupTime + ' to ' + dropoffTime;
  status = `Pick Up - ${pickupTime}`;

  if (!title) {
    title = '';
  }

  let displayData = {
    id: sift_id,
    title: title,
    subtitle: subTitle,
    backupIcon: 'carrental',
    destination: title,
    dates: subTitle,
    times: status,
  };

  return {
    type: 'rental',
    sift: sift,
    startTime: startTime,
    title: title,
    status: status,
    subtitle: subTitle,
    emailTime: email_time,
    endTime: endTime,
    vendor: payload['x-vendorId'],
    pickupTime: pickupTime,
    dropoffTime: dropoffTime,
    pickupLocation: pickupLocation,
    dropoffLocation: dropoffLocation,
    reservationNumber: reservationNumber,
    displayData: displayData,
    city: city,
    carName: carName,
    underName: underName,
    uniqueId: createId(sift),
  };
};

const createId = (sift) => {
  let uniqueId;
  const { payload: pl } = sift;

  if (pl.reservationId) {
    uniqueId = 'rentalId:' + pl.reservationId;
  } else {
    uniqueId = 'rentalId:' + String(sift.sift_id);
  }

  uniqueId = uniqueId.replace("'", '');
  uniqueId = uniqueId.toUpperCase();
  return uniqueId;
};
