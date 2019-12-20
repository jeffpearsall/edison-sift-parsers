import moment from 'moment';

moment.updateLocale('en', {
  calendar: {
    lastDay: '[Delivered Yesterday]',
    sameDay: '[Arriving Today]',
    nextDay: '[Arriving Tomorrow]',
    lastWeek: '[Arrived last] dddd',
    nextWeek: '[Arriving this] dddd',
    sameElse: '[Arriving] MM/DD',
  },
});

export const SiftPackageParser = async (sifts) => {
  let packages = [];

  for (let sift of sifts) {
    const { payload, email_time, sift_id } = sift;
    let itemName, trackingNumber, trackingUrl, title, subTitle, status, shipperName, shipDate, vendor, images;

    let startTime, endTime, arrivalDate;
    let productImage = null;

    // Provider Name
    if (payload.provider) {
      if (payload.provider.name) {
        shipperName = payload.provider.name;
      }
    }

    // Tracking
    if (payload.trackingNumber) {
      trackingNumber = payload.trackingNumber;
    }

    if (payload.trackingUrl) {
      trackingUrl = payload.trackingUrl;
    }

    // Item Name and Image
    if (payload.itemShipped) {
      images = payload.itemShipped.map((item) => item.image);

      if (payload.itemShipped[0]) {
        // Set the title based on item name
        if (payload.itemShipped[0].name) {
          itemName = payload.itemShipped[0].name;
          title = itemName;
        }

        // Set the primary image
        if (payload.itemShipped[0].image) {
          productImage = payload.itemShipped[0].image;
        }
      }
    }

    // Start Time
    if (email_time) {
      startTime = moment.unix(email_time).format();
      shipDate = moment.unix(email_time).format('MMM D');
    }

    // Arrival Date
    if (payload.expectedArrivalUntil) {
      endTime = payload.expectedArrivalUntil;
      arrivalDate = moment(endTime).format('MMM D');
    }

    const SECONDS_IN_DAY = 86400;
    const currentTime = moment().unix();
    const timeSinceEmail = currentTime - email_time;
    const daysSinceEmail = timeSinceEmail / SECONDS_IN_DAY;

    // Check if arrived
    if (payload.partOfOrder) {
      // Get vendor name
      if (payload.partOfOrder.broker) {
        vendor = payload.partOfOrder.broker.name;
      }

      if (payload.partOfOrder.orderStatus === 'http://schema.org/OrderDelivered') {
        subTitle = 'Package Delivered';
        status = 'Package Delivered';
        if (arrivalDate) {
          subTitle = `Delivered ${arrivalDate}`;
        }
      } else if (payload.partOfOrder.orderStatus === 'http://schema.org/OrderInTransit') {
        subTitle = 'In Transit';
        status = 'In Transit';
        if (arrivalDate) {
          subTitle = `Arriving ${arrivalDate}`;
        } else if (daysSinceEmail > 45) {
          // If more than 45 days, don't display anything
          subTitle = 'Package Delivery';
        }
      }
    }

    // Subject as a title backup
    if (!title && payload['x-emailSubject']) {
      title = payload['x-emailSubject'];
    }

    // Fallback Title and Subtitle
    if (!title) {
      title = 'Item Shipment';
    }

    if (!subTitle) {
      subTitle = 'Package Delivery';
    }

    if (!status) {
      status = 'Package Delivery';
    }

    if (status && payload.expectedArrivalUntil && status !== 'Package Delivered') {
      status = moment(payload.expectedArrivalUntil).calendar();
    } else if (status === 'Package Delivered') {
      status = subTitle;
    }

    const displayData = {
      type: 'shipment',
      id: sift_id,
      title: title,
      subtitle: subTitle,
      backupIcon: 'packages',
      status: status,
      shipDate: shipDate,
      featuredImage: productImage,
      shipperName: shipperName,
      vendor: vendor ? vendor : 'Your Package',
      images: images,
      trackingNumber: trackingNumber,
      trackingUrl: trackingUrl,
    };

    packages.push({
      type: 'shipment',
      backupIcon: 'packages',
      sift: sift,
      title: title,
      subtitle: subTitle,
      emailTime: email_time,
      status: status,
      startTime: startTime,
      endTime: endTime,
      trackingNumber: trackingNumber,
      primaryImage: productImage,
      displayData: displayData,
      vendor: payload['x-vendorId'],
      images: images,
      trackingUrl: trackingUrl,
      shipDate: shipDate,
      featuredImage: productImage,
      shipperName: shipperName,
      uniqueId: createId(sift),
    });
  }

  return packages;
};

const createId = (sift) => {
  let uniqueId;
  const { payload: pl } = sift;

  if (pl.partOfOrder.orderNumber && pl.partOfOrder.broker) {
    uniqueId = 'packageId:' + pl.partOfOrder.orderNumber + pl.partOfOrder.broker.name;
  } else if (pl.trackingNumber) {
    uniqueId = 'packageId:' + pl.trackingNumber;
  } else if (pl.trackingUrl) {
    uniqueId = 'packageId:' + pl.trackingUrl;
  } else {
    uniqueId = 'packageId:' + String(sift.sift_id);
  }

  uniqueId = uniqueId.replace("'", '');
  uniqueId = uniqueId.toUpperCase();

  return uniqueId;
};
