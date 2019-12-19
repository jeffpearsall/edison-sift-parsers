import moment from 'moment';

export const SiftCruiseParser = async (sifts) => {
  let cruises = [];
  for (let sift of sifts) {
    let subTitle = '';
    let emailTime = sift.email_time;
    let title, brokerName, status, startTime;

    if (sift.payload) {
      if (sift.payload.broker) {
        if (sift.payload.broker.name) {
          brokerName = sift.payload.broker.name;
        }
      }

      if (brokerName) {
        title = `${brokerName} Cruise`;
      } else {
        title = 'Cruise';
      }

      if (sift.payload.reservationFor) {
        if (sift.payload.reservationFor.name) {
          title = `Cruise to ${sift.payload.reservationFor.name}`;
        }
      }

      if (sift.payload.departureTime) {
        startTime = moment(sift.payload.departureTime).toISOString();

        let pickupDay = moment(sift.payload.departureTime).format('ddd, MMM D');
        let pickupTime = moment(sift.payload.departureTime).format('h:mm a');

        if (sift.payload.reservationFor && sift.payload.reservationFor['x-days']) {
          subTitle = `${pickupDay} for ${sift.payload.reservationFor['x-days']} days`;
        } else {
          subTitle = pickupDay;
        }

        status = `Departs ${pickupTime}`;
      } else if (sift.payload.departLocation) {
        if (sift.payload.departLoction.name) {
          subTitle = `Departing from ${sift.payload.departLocation.name}`;
        }
      } else {
        subTitle = 'Upcoming Trip';
      }
    }

    let displayData = {
      type: 'cruise',
      startTime: moment.unix(startTime),
      id: sift.sift_id,
      title: title,
      subtitle: subTitle,
      backupIcon: 'categoryCruise',
      destination: title,
      dates: subTitle,
      times: status ? status : ' ',
    };

    let payload = {
      type: 'cruise',
      backupIcon: 'categoryCruise',
      unique: true,
      sift: sift,
      title: title,
      subtitle: subTitle,
      emailTime: emailTime,
      startTime: startTime,
      displayData: JSON.stringify(displayData),
      vendor: sift.payload['x-vendorId'],
    };

    cruises.push(payload);
  }

  createIds(cruises);
  return cruises;
};

const createIds = (sifts) => {
  for (let sift of sifts) {
    const { payload } = sift.sift;
    if (payload.reservationId) {
      sift.uniqueId = 'cruiseId:' + payload.reservationId;
    } else {
      sift.uniqueId = 'cruiseId:' + String(sift.sift.sift_id);
    }

    sift.uniqueId = sift.uniqueId.replace("'", '');
    sift.uniqueId = sift.uniqueId.toUpperCase();
  }
};
