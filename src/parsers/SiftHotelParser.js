import moment from 'moment';
import parser from 'parse-address';

export const SiftHotelParser = async (sifts) => {
  let hotels = [];

  for (let sift of sifts) {
    const { payload, email_time, sift_id } = sift;

    let title, startTime, endTime, status, imageQuery;
    let subTitle = '';

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

    if (payload.reservationFor) {
      title = payload.reservationFor.name;

      if (payload.reservationFor.address) {
        let humanAddress = parser.parseLocation(payload.reservationFor.address);
        if (humanAddress && humanAddress.city && humanAddress.state) {
          imageQuery = `${humanAddress.city},${humanAddress.state}`;
        }
      } else if (payload.reservationFor.name) {
        imageQuery = payload.reservationFor.name;
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

    hotels.push({
      type: 'hotel',
      backupIcon: 'lodging',
      sift: sift,
      title: title,
      subtitle: subTitle,
      status: status,
      emailTime: email_time,
      startTime: startTime,
      endTime: endTime,
      dates: subTitle,
      destination: title,
      vendor: payload['x-vendorId'],
      displayData: displayData,
      imageQuery: imageQuery,
      uniqueId: createId(sift),
    });
  }

  return hotels;
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
