import moment from 'moment';

export const SiftBillParser = async (sifts) => {
  let bills = [];
  for (let sift of sifts) {
    const pl = sift.payload;

    let title, date, price, paymentUrl, emailSubject, startTime;
    let subTitle = '';
    let emailTime = sift.email_time;

    if (pl.description) {
      title = pl.description;
    } else {
      title = 'Upcoming Bill';
    }

    if (pl['x-emailSubject']) {
      emailSubject = pl['x-emailSubject'];
    }

    if (pl.url) {
      paymentUrl = pl.url;
    }

    if (pl.totalPaymentDue) {
      if (pl.totalPaymentDue.price) {
        // Add $ symbol
        if (pl.totalPaymentDue.price[0] !== '$') {
          pl.totalPaymentDue.price = `$${pl.totalPaymentDue.price}`;
          price = pl.totalPaymentDue.price;
        } else {
          price = pl.totalPaymentDue.price;
        }

        // removing zeroes
        if (pl.totalPaymentDue.price[0].slice(pl.totalPaymentDue.price[0] - 3, pl.totalPaymentDue.price[0]) === '.00') {
          pl.totalPaymentDue.price[0] = pl.totalPaymentDue.price[0].slice(0, pl.totalPaymentDue.price[0] - 3);
        }

        subTitle = pl.totalPaymentDue.price;
      }
    } else if (pl.paymentDueDate) {
      const dueDate = moment(pl.paymentDueDate).format('MMM D');
      subTitle = `Due on ${dueDate}`;
    }

    if (pl.paymentDueDate) {
      startTime = pl.paymentDueDate;
      date = pl.paymentDueDate;
    } else {
      date = emailTime;
    }

    // if (!startTime) {
    //   startTime = moment.unix(emailTime).toISOString();
    // }

    let displayData = {
      type: 'bill',
      startTime: moment.unix(emailTime),
      id: sift.sift_id,
      title: title,
      subtitle: subTitle,
      date: date,
      backupIcon: 'finance',
      price: price,
      emailSubject: emailSubject,
      paymentUrl: paymentUrl,
    };

    let payload = {
      type: 'bill',
      backupIcon: 'finance',
      sift: sift,
      title: title,
      subtitle: subTitle,
      emailTime: emailTime,
      startTime: startTime,
      vendor: pl['x-vendorId'],
      displayData: JSON.stringify(displayData),
    };

    bills.push(payload);
  }

  createIds(bills);

  return bills;
};

const createIds = (sifts) => {
  for (let sift of sifts) {
    const pl = sift.sift.payload;

    if (pl.totalPaymentDue.price && pl.paymentDueDate) {
      sift.uniqueId = pl.totalPaymentDue.price + pl.paymentDueDate;
    } else {
      sift.uniqueId = String(sift.sift.sift_id);
    }

    sift.uniqueId = sift.uniqueId.replace("'", '');
    sift.uniqueId = sift.uniqueId.toUpperCase();
  }
};
