import moment from 'moment';

export const SiftTrainParser = async (sifts) => {
  var trains = [];
  for (let sift of sifts) {
    var providerName;
    var title;
    var subTitle = '';
    var emailTime = sift.email_time;
    let startTime, depart, arrival, status, imageQuery;

    if (sift.payload.provider.name) {
      providerName = sift.payload.provider.name;
    }

    if (sift.payload.reservationFor[0]) {
      if (sift.payload.reservationFor[0].arrivalStation.name) {
        imageQuery = sift.payload.reservationFor[0].arrivalStation.name;
        title = 'Train to ' + sift.payload.reservationFor[0].arrivalStation.name;
      }
    }

    startTime = moment(sift.payload.reservationFor[0].departureTime).toISOString();

    if (sift.payload.reservationFor.length > 1) {
      if (sift.payload.reservationFor[0].departureTime) {
        status = `Departs - ${moment(sift.payload.reservationFor[0].departureTime).format('h:mm a')}`;
      }

      if (sift.payload.reservationFor[1].arrivalTime) {
        depart = moment(sift.payload.reservationFor[0].departureTime).format('ddd, MMM DD');
        arrival = moment(sift.payload.reservationFor[1].arrivalTime).format('ddd, MMM DD');
        subTitle = `${depart} - ${arrival}`;
      } else if (sift.payload.reservationFor[0].departureTime) {
        depart = moment(sift.payload.reservationFor[0].departureTime).format('dddd, MMM DD');
        subTitle = depart;
      }
    } else if (sift.payload.reservationFor.length === 1) {
      if (sift.payload.reservationFor[0].departureTime) {
        status = `Departs - ${moment(sift.payload.reservationFor[0].departureTime).format('h:mm a')}`;
      }

      if (sift.payload.reservationFor[0].departureTime) {
        depart = moment(sift.payload.reservationFor[0].departureTime).format('dddd, MMM DD');
        subTitle = depart;
      } else {
        subTitle = 'Upcoming Trip';
      }
    }

    let displayData = {
      type: 'train',
      id: sift.sift_id,
      title: title,
      subtitle: subTitle,
      backupIcon: 'train',
      destination: title,
      dates: subTitle,
      times: status,
    };

    let rentalPayload = {
      type: 'train',
      backupIcon: 'train',
      startTime: startTime,
      sift: sift,
      title: title,
      status: status,
      subtitle: subTitle,
      emailTime: emailTime,
      provider: providerName,
      vendor: sift.payload['x-vendorId'],
      imageQuery: imageQuery,
      displayData: JSON.stringify(displayData),
    };

    trains.push(rentalPayload);
  }

  createIds(trains);
  return trains;
};

const createIds = (sifts) => {
  for (let sift of sifts) {
    const pl = sift.sift.payload;

    if (pl.reservationId) {
      sift.uniqueId = 'trainId:' + pl.reservationId;
    } else {
      sift.uniqueId = 'trainId:' + String(sift.sift.sift_id);
    }

    sift.uniqueId = sift.uniqueId.replace("'", '');
    sift.uniqueId = sift.uniqueId.toUpperCase();
  }
};
