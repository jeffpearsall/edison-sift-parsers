import moment from 'moment';

export const SiftPurchaseParser = async (sifts) => {
  let purchases = [];
  for (let sift of sifts) {
    let title, emailSubject, price, orderDate, categories, itemOffered, primaryImage, date;
    let subTitle = '';
    let emailTime = sift.email_time;

    // Title
    if (sift.payload.seller) {
      if (sift.payload.seller.name) {
        title = sift.payload.seller.name;
      }
    } else if (sift.payload.description) {
      title = 'Purchase';
    }

    // Subtitle
    if (sift.payload['x-price']) {
      price = String(sift.payload['x-price']);
    }

    if (sift.payload['x-emailSubject']) {
      emailSubject = sift.payload['x-emailSubject'];
    }

    if (sift.payload.acceptedOffer) {
      if (sift.payload.acceptedOffer.length > 0) {
        if (sift.payload.acceptedOffer[0].itemOffered) {
          itemOffered = sift.payload.acceptedOffer[0].itemOffered.name;
        }
      }
    }

    if (sift.payload.acceptedOffer) {
      categories = sift.payload.acceptedOffer.map((item) => {
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
        if (sift.payload.acceptedOffer[0]) {
          if (sift.payload.acceptedOffer[0].price) {
            price = sift.payload.acceptedOffer[0].price;
          }
        }
      }
    }

    if (sift.payload.orderDate) {
      orderDate = moment(sift.payload.orderDate).format('MMM D');
      date = sift.payload.orderDate;
    } else {
      orderDate = moment.unix(emailTime).format('MMM D');
      date = emailTime;
    }

    if (price) {
      subTitle = `${price} - ${orderDate}`;
    } else {
      subTitle = `Purchase on ${orderDate}`;
    }

    if (sift.payload.acceptedOffer[0]) {
      if (sift.payload.acceptedOffer[0].itemOffered) {
        if (sift.payload.acceptedOffer[0].itemOffered.image) {
          primaryImage = sift.payload.acceptedOffer[0].itemOffered.image;
        }
      }
    }

    let displayData = {
      id: sift.sift_id,
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

    let purchasePayload = {
      type: 'purchase',
      backupIcon: 'packages',
      sift: sift,
      title: title,
      subtitle: subTitle,
      emailTime: emailTime,
      primaryImage: primaryImage,
      vendor: sift.payload['x-vendorId'],
      displayData: JSON.stringify(displayData),
      subcategories: JSON.stringify(categories),
    };

    purchases.push(purchasePayload);
  }

  createIds(purchases);
  return purchases;
};

const createIds = (sifts) => {
  for (let sift of sifts) {
    let pl = sift.sift.payload;
    if (pl.orderNumber) {
      sift.uniqueId = 'purchaseId:' + pl.orderNumber;
    } else if (pl['x-price'] && pl.broker.name) {
      sift.uniqueId = 'purchaseId:' + pl['x-price'] + pl.broker.name;
    } else {
      sift.uniqueId = 'purchaseId:' + String(sift.sift.sift_id);
    }

    sift.uniqueId = sift.uniqueId.replace("'", '');
    sift.uniqueId = sift.uniqueId.toUpperCase();
  }
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
