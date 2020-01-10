import moment from 'moment';

export const billParser = (sift) => {
  const { payload, email_time, sift_id } = sift;

  let title, date, price, paymentUrl, emailSubject, startTime;
  let subTitle = '';

  if (payload.description) {
    title = payload.description;
  } else {
    title = 'Upcoming Bill';
  }

  if (payload['x-emailSubject']) {
    emailSubject = payload['x-emailSubject'];
  }

  if (payload.url) {
    paymentUrl = payload.url;
  }

  if (payload.totalPaymentDue) {
    if (payload.totalPaymentDue.price) {
      // Add $ symbol
      if (payload.totalPaymentDue.price[0] !== '$') {
        payload.totalPaymentDue.price = `$${payload.totalPaymentDue.price}`;
        price = payload.totalPaymentDue.price;
      } else {
        price = payload.totalPaymentDue.price;
      }

      // removing zeroes
      if (
        payload.totalPaymentDue.price[0].slice(
          payload.totalPaymentDue.price[0] - 3,
          payload.totalPaymentDue.price[0]
        ) === '.00'
      ) {
        payload.totalPaymentDue.price[0] = payload.totalPaymentDue.price[0].slice(
          0,
          payload.totalPaymentDue.price[0] - 3
        );
      }

      subTitle = payload.totalPaymentDue.price;
    }
  } else if (payload.paymentDueDate) {
    const dueDate = moment(payload.paymentDueDate).format('MMM D');
    subTitle = `Due on ${dueDate}`;
  }

  if (payload.paymentDueDate) {
    startTime = payload.paymentDueDate;
    date = payload.paymentDueDate;
  } else {
    date = email_time;
  }

  let displayData = {
    type: 'bill',
    startTime: moment.unix(email_time),
    id: sift_id,
    title: title,
    subtitle: subTitle,
    date: date,
    backupIcon: 'finance',
    price: price,
    emailSubject: emailSubject,
    paymentUrl: paymentUrl,
  };

  return {
    type: 'bill',
    backupIcon: 'finance',
    sift: sift,
    title: title,
    subtitle: subTitle,
    emailTime: email_time,
    startTime: startTime,
    price: price,
    emailSubject: emailSubject,
    paymentUrl: paymentUrl,
    date: date,
    vendor: payload['x-vendorId'],
    displayData: displayData,
    uniqueId: createId(sift),
  };
};

const createId = (sift) => {
  let uniqueId;

  if (sift.payload.totalPaymentDue.price && sift.payload.paymentDueDate) {
    uniqueId = sift.payload.totalPaymentDue.price + sift.payload.paymentDueDate;
  } else {
    uniqueId = String(sift.sift_id);
  }

  uniqueId = uniqueId.replace("'", '');
  uniqueId = uniqueId.toUpperCase();

  return uniqueId;
};
