import moment from 'moment';
import parser from 'parse-address';

export const SiftRentalParser = async (sifts) => {
  let rentals = [];
  for (let sift of sifts) {
    let emailTime = sift.email_time;
    let startTime = moment.unix(sift.email_time);
    let carName, title, subTitle, pickupTime, dropoffTime, status, endTime, imageQuery;

    if (sift.payload.reservationFor) {
      if (sift.payload.reservationFor.name) {
        carName = sift.payload.reservationFor.name;
      }
    }

    if (sift.payload.pickupTime) {
      startTime = sift.payload.pickupTime;
    }

    if (sift.payload.dropoffLocation.address) {
      let humanAddress = parser.parseLocation(sift.payload.dropoffLocation.address);
      if (humanAddress.city && humanAddress.state) {
        imageQuery = `${humanAddress.city},${humanAddress.state}`;
      }
    }

    if (sift.payload.dropoffTime) {
      endTime = sift.payload.dropoffTime;
    }

    if (sift.payload.pickupTime && sift.payload.dropoffTime) {
      pickupTime = moment(sift.payload.pickupTime).format('ddd, MMM DD');
      dropoffTime = moment(sift.payload.dropoffTime).format('ddd, MMM DD');
    }

    title = carName;
    subTitle = pickupTime + ' to ' + dropoffTime;
    status = `Pick Up - ${pickupTime}`;

    if (!title) {
      title = '';
    }

    let displayData = {
      id: sift.sift_id,
      title: title,
      subtitle: subTitle,
      backupIcon: 'carrental',
      destination: title,
      dates: subTitle,
      times: status,
    };

    let rentalPayload = {
      type: 'rental',
      backupIcon: 'carrental',
      unique: true,
      startTime: startTime,
      sift: sift,
      title: title,
      status: status,
      subtitle: subTitle,
      emailTime: emailTime,
      endTime: endTime,
      vendor: sift.payload['x-vendorId'],
      displayData: JSON.stringify(displayData),
      imageQuery: imageQuery,
    };
    rentals.push(rentalPayload);
  }

  createIds(rentals);
  return rentals;
};

const createIds = (sifts) => {
  for (let sift of sifts) {
    const pl = sift.sift.payload;

    if (pl.reservationId) {
      sift.uniqueId = 'rentalId:' + pl.reservationId;
    } else {
      sift.uniqueId = 'rentalId:' + String(sift.sift.sift_id);
    }

    sift.uniqueId = sift.uniqueId.replace("'", '');
    sift.uniqueId = sift.uniqueId.toUpperCase();
  }
};
