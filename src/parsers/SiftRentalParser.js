import moment from 'moment';
import parser from 'parse-address';

export const SiftRentalParser = async (sifts) => {
  let rentals = [];
  for (let sift of sifts) {
    const { payload, email_time, sift_id } = sift;

    let startTime = moment.unix(email_time);
    let carName, title, subTitle, pickupTime, dropoffTime, status, endTime, imageQuery;

    if (payload.reservationFor) {
      if (payload.reservationFor.name) {
        carName = payload.reservationFor.name;
      }
    }

    if (payload.pickupTime) {
      startTime = payload.pickupTime;
    }

    if (payload.dropoffLocation.address) {
      let humanAddress = parser.parseLocation(payload.dropoffLocation.address);
      if (humanAddress.city && humanAddress.state) {
        imageQuery = `${humanAddress.city},${humanAddress.state}`;
      }
    }

    if (payload.dropoffTime) {
      endTime = payload.dropoffTime;
    }

    if (payload.pickupTime && payload.dropoffTime) {
      pickupTime = moment(payload.pickupTime).format('ddd, MMM DD');
      dropoffTime = moment(payload.dropoffTime).format('ddd, MMM DD');
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

    rentals.push({
      type: 'rental',
      backupIcon: 'carrental',
      unique: true,
      startTime: startTime,
      sift: sift,
      title: title,
      status: status,
      subtitle: subTitle,
      emailTime: email_time,
      endTime: endTime,
      vendor: payload['x-vendorId'],
      pickupTime: pickupTime,
      dropoffTime: dropoffTime,
      displayData: displayData,
      imageQuery: imageQuery,
      name: carName,
      uniqueId: createId(sift),
    });
  }

  return rentals;
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
