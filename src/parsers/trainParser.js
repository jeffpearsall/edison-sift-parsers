import moment from 'moment';

export const trainParser = (sift) => {
  const { payload, email_time, sift_id } = sift;

  let providerName, title, startTime, depart, arrival, status, imageQuery;
  let subTitle = '';

  if (payload.provider.name) {
    providerName = payload.provider.name;
  }

  if (payload.reservationFor[0]) {
    if (payload.reservationFor[0].arrivalStation.name) {
      imageQuery = payload.reservationFor[0].arrivalStation.name;
      title = 'Train to ' + payload.reservationFor[0].arrivalStation.name;
    }
  }

  startTime = moment(payload.reservationFor[0].departureTime).toISOString();

  if (payload.reservationFor.length > 1) {
    if (payload.reservationFor[0].departureTime) {
      status = `Departs - ${moment(payload.reservationFor[0].departureTime).format('h:mm a')}`;
    }

    if (payload.reservationFor[1].arrivalTime) {
      depart = moment(payload.reservationFor[0].departureTime).format('ddd, MMM DD');
      arrival = moment(payload.reservationFor[1].arrivalTime).format('ddd, MMM DD');
      subTitle = `${depart} - ${arrival}`;
    } else if (payload.reservationFor[0].departureTime) {
      depart = moment(payload.reservationFor[0].departureTime).format('dddd, MMM DD');
      subTitle = depart;
    }
  } else if (payload.reservationFor.length === 1) {
    if (payload.reservationFor[0].departureTime) {
      status = `Departs - ${moment(payload.reservationFor[0].departureTime).format('h:mm a')}`;
    }

    if (payload.reservationFor[0].departureTime) {
      depart = moment(payload.reservationFor[0].departureTime).format('dddd, MMM DD');
      subTitle = depart;
    } else {
      subTitle = 'Upcoming Trip';
    }
  }

  let displayData = {
    type: 'train',
    id: sift_id,
    title: title,
    subtitle: subTitle,
    backupIcon: 'train',
    destination: title,
    dates: subTitle,
    times: status,
  };

  return {
    type: 'train',
    backupIcon: 'train',
    startTime: startTime,
    sift: sift,
    title: title,
    status: status,
    subtitle: subTitle,
    emailTime: email_time,
    provider: providerName,
    dates: subTitle,
    vendor: payload['x-vendorId'],
    imageQuery: imageQuery,
    displayData: displayData,
    uniqueId: createId(sift),
  };
};

const createId = (sift) => {
  let uniqueId;
  const { payload: pl } = sift;

  if (pl.reservationId) {
    uniqueId = 'trainId:' + pl.reservationId;
  } else {
    uniqueId = 'trainId:' + String(sift.sift_id);
  }

  uniqueId = uniqueId.replace("'", '');
  uniqueId = uniqueId.toUpperCase();
  return uniqueId;
};
