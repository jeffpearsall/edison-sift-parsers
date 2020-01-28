import moment from 'moment';

export const cruiseParser = (sift) => {
  const { payload, email_time, sift_id } = sift;

  let subTitle = '';
  let emailTime = email_time;
  let title, brokerName, status, startTime;

  if (payload) {
    if (payload.broker) {
      if (payload.broker.name) {
        brokerName = payload.broker.name;
      }
    }

    if (brokerName) {
      title = `${brokerName} Cruise`;
    } else {
      title = 'Cruise';
    }

    if (payload.reservationFor) {
      if (payload.reservationFor.name) {
        title = `Cruise to ${payload.reservationFor.name}`;
      }
    }

    if (payload.departureTime) {
      startTime = moment(payload.departureTime).toISOString();

      let pickupDay = moment(payload.departureTime).format('ddd, MMM D');
      let pickupTime = moment(payload.departureTime).format('h:mm a');

      if (payload.reservationFor && payload.reservationFor['x-days']) {
        subTitle = `${pickupDay} for ${payload.reservationFor['x-days']} days`;
      } else {
        subTitle = pickupDay;
      }

      status = `Departs ${pickupTime}`;
    } else if (payload.departLocation) {
      if (payload.departLoction.name) {
        subTitle = `Departing from ${payload.departLocation.name}`;
      }
    } else {
      subTitle = 'Upcoming Trip';
    }
  }

  let displayData = {
    type: 'cruise',
    startTime: moment.unix(startTime),
    id: sift_id,
    title: title,
    subtitle: subTitle,
    backupIcon: 'categoryCruise',
    destination: title,
    dates: subTitle,
    times: status ? status : ' ',
  };

  return {
    type: 'cruise',
    sift: sift,
    title: title,
    subtitle: subTitle,
    emailTime: emailTime,
    startTime: startTime,
    destination: title,
    dates: subTitle,
    times: status ? status : ' ',
    vendor: payload['x-vendorId'],
    displayData: displayData,
    uniqueId: createId(sift),
  };
};

const createId = (sift) => {
  let uniqueId;
  const { payload } = sift;

  if (payload && payload.reservationId) {
    uniqueId = 'cruiseId:' + payload.reservationId;
  } else {
    uniqueId = 'cruiseId:' + String(sift.sift_id);
  }

  uniqueId = uniqueId.replace("'", '');
  uniqueId = uniqueId.toUpperCase();

  return uniqueId;
};
