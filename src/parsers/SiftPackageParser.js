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
    let itemName, trackingNumber, trackingUrl, title, subTitle, status, shipperName, shipDate, vendor, images;

    let startTime, endTime, arrivalDate;
    let emailTime = sift.email_time;
    let productImage = null;

    // Provider Name
    if (sift.payload.provider) {
      if (sift.payload.provider.name) {
        shipperName = sift.payload.provider.name;
      }
    }

    // Tracking
    if (sift.payload.trackingNumber) {
      trackingNumber = sift.payload.trackingNumber;
    }

    if (sift.payload.trackingUrl) {
      trackingUrl = sift.payload.trackingUrl;
    }

    // Item Name and Image
    if (sift.payload.itemShipped) {
      images = sift.payload.itemShipped.map((item) => item.image);

      if (sift.payload.itemShipped[0]) {
        // Set the title based on item name
        if (sift.payload.itemShipped[0].name) {
          itemName = sift.payload.itemShipped[0].name;
          title = itemName;
        }

        // Set the primary image
        if (sift.payload.itemShipped[0].image) {
          productImage = sift.payload.itemShipped[0].image;
        }
      }
    }

    // Start Time
    if (sift.email_time) {
      startTime = moment.unix(sift.email_time).format();
      shipDate = moment.unix(sift.email_time).format('MMM D');
    }

    // Arrival Date
    if (sift.payload.expectedArrivalUntil) {
      endTime = sift.payload.expectedArrivalUntil;
      arrivalDate = moment(endTime).format('MMM D');
    }

    const SECONDS_IN_DAY = 86400;
    const currentTime = moment().unix();
    const timeSinceEmail = currentTime - sift.email_time;
    const daysSinceEmail = timeSinceEmail / SECONDS_IN_DAY;

    // Check if arrived
    if (sift.payload.partOfOrder) {
      // Get vendor name
      if (sift.payload.partOfOrder.broker) {
        vendor = sift.payload.partOfOrder.broker.name;
      }

      if (sift.payload.partOfOrder.orderStatus === 'http://schema.org/OrderDelivered') {
        subTitle = 'Package Delivered';
        status = 'Package Delivered';
        if (arrivalDate) {
          subTitle = `Delivered ${arrivalDate}`;
        }
      } else if (sift.payload.partOfOrder.orderStatus === 'http://schema.org/OrderInTransit') {
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
    if (!title && sift.payload['x-emailSubject']) {
      title = sift.payload['x-emailSubject'];
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

    if (status && sift.payload.expectedArrivalUntil && status !== 'Package Delivered') {
      status = moment(sift.payload.expectedArrivalUntil).calendar();
    } else if (status === 'Package Delivered') {
      status = subTitle;
    }

    const displayData = {
      type: 'shipment',
      id: sift.sift_id,
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

    let payload = {
      type: 'shipment',
      backupIcon: 'packages',
      sift: sift,
      title: title,
      subtitle: subTitle,
      emailTime: emailTime,
      status: status,
      startTime: startTime,
      endTime: endTime,
      trackingNumber: trackingNumber,
      primaryImage: productImage,
      displayData: JSON.stringify(displayData),
      vendor: sift.payload['x-vendorId'],
    };

    packages.push(payload);
  }

  createIds(packages);
  return packages;
};

const createIds = (sifts) => {
  for (let sift of sifts) {
    const pl = sift.sift.payload;

    if (pl.partOfOrder.orderNumber && pl.partOfOrder.broker) {
      sift.uniqueId = 'packageId:' + pl.partOfOrder.orderNumber + pl.partOfOrder.broker.name;
    } else if (pl.trackingNumber) {
      sift.uniqueId = 'packageId:' + pl.trackingNumber;
    } else if (pl.trackingUrl) {
      sift.uniqueId = 'packageId:' + pl.trackingUrl;
    } else {
      sift.uniqueId = 'packageId:' + String(sift.sift.sift_id);
    }

    sift.uniqueId = sift.uniqueId.replace("'", '');
    sift.uniqueId = sift.uniqueId.toUpperCase();
  }
};
