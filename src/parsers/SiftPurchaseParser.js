import moment from 'moment';

export const SiftPurchaseParser = async (sifts) => {
  let purchases = [];
  for (let sift of sifts) {
    const { payload, email_time, sift_id } = sift;
    let title, emailSubject, price, orderDate, categories, itemOffered, primaryImage, date;
    let subTitle = '';

    // Title
    if (payload.seller) {
      if (payload.seller.name) {
        title = payload.seller.name;
      }
    } else if (payload.description) {
      title = 'Purchase';
    }

    // Subtitle
    if (payload['x-price']) {
      price = String(payload['x-price']);
    }

    if (payload['x-emailSubject']) {
      emailSubject = payload['x-emailSubject'];
    }

    if (payload.acceptedOffer) {
      if (payload.acceptedOffer.length > 0) {
        if (payload.acceptedOffer[0].itemOffered) {
          itemOffered = payload.acceptedOffer[0].itemOffered.name;
        }
      }
    }

    if (payload.acceptedOffer) {
      categories = payload.acceptedOffer.map((item) => {
        if (!item) {
          return null;
        }

        const category = receiptCategoryFilter[item.category];
        if (category) {
          return category;
        } else {
          return 'Other';
        }
      });

      // remove empty category item
      categories = categories.filter((category) => category);

      if (!price) {
        if (payload.acceptedOffer[0]) {
          if (payload.acceptedOffer[0].price) {
            price = payload.acceptedOffer[0].price;
          }
        }
      }
    }

    if (payload.orderDate) {
      orderDate = moment(payload.orderDate).format('MMM D');
      date = payload.orderDate;
    } else {
      orderDate = moment.unix(email_time).format('MMM D');
      date = email_time;
    }

    if (price) {
      subTitle = `${price} - ${orderDate}`;
    } else {
      subTitle = `Purchase on ${orderDate}`;
    }

    if (payload.acceptedOffer[0]) {
      if (payload.acceptedOffer[0].itemOffered) {
        if (payload.acceptedOffer[0].itemOffered.image) {
          primaryImage = payload.acceptedOffer[0].itemOffered.image;
        }
      }
    }

    let displayData = {
      id: sift_id,
      type: 'purchase',
      title: title,
      subtitle: subTitle,
      backupIcon: 'finance',
      price: price,
      date: date,
      primaryImage: primaryImage,
      emailSubject: emailSubject,
      itemOffered: itemOffered,
    };

    purchases.push({
      type: 'purchase',
      backupIcon: 'packages',
      sift: sift,
      title: title,
      subtitle: subTitle,
      emailTime: email_time,
      subcategories: JSON.stringify(categories),
      itemOffered: itemOffered,
      date: date,
      price: price,
      vendor: sift.payload['x-vendorId'],
      displayData: displayData,
      primaryImage: primaryImage,
      uniqueId: createId(sift),
    });
  }

  return purchases;
};

const createId = (sift) => {
  let uniqueId;
  const { payload: pl } = sift;

  if (pl.orderNumber) {
    uniqueId = 'purchaseId:' + pl.orderNumber;
  } else if (pl['x-price'] && pl.broker.name) {
    uniqueId = 'purchaseId:' + pl['x-price'] + pl.broker.name;
  } else {
    uniqueId = 'purchaseId:' + String(sift.sift_id);
  }

  uniqueId = uniqueId.replace("'", '');
  uniqueId = uniqueId.toUpperCase();

  return uniqueId;
};

const receiptCategoryFilter = Object.freeze({
  Appliances: 'Home Goods',
  'Home & Kitchen': 'Home Goods',
  'Tools & Home Improvement': 'Home Goods',

  'Flowers & Gifts': 'Gifts',
  'Gift Cards': 'Gifts',

  Magazines: 'Entertainment',
  'Movies & TV': 'Entertainment',
  Music: 'Entertainment',
  'Tickets & Events': 'Entertainment',

  Books: 'Books',
  Digital: 'Books',

  Shoes: 'Clothing & Accessories',
  Jewelry: 'Clothing & Accessories',
  'Clothing & Accessories': 'Clothing & Accessories',

  'Electronics & Accessories': 'Electronics & Software',
  'Software & Mobile Apps': 'Electronics & Software',

  'Musical Instruments': 'Other',
  Payments: 'Other',
  Other: 'Other',

  'Arts Crafts & Sewing': 'Hobbies',
  Automotive: 'Transportation',
  'Baby Products': 'Baby',
  'Grocery & Gourmet Food': 'Food',
  'Office Products': 'Office Supplies',
  'Online Services': 'Services',
  'Pet Supplies': 'Pets',
  'Sports & Outdoors': 'Sporting Goods',
});
