export const getMergedPayloads = (sifts) => {
  const uniqueIds = [...new Set(sifts.map((sift) => sift.uniqueId))];
  const masterSifts = [];

  for (const id of uniqueIds) {
    let list = sifts.filter((sift) => sift.uniqueId === id);
    let masterPayload = list[0].sift.payload;

    if (list.length > 1) {
      for (let i = 1; i < list.length; i++) {
        if (list[i].sift.payload != null) {
          mergeKeys(masterPayload, list[i].sift.payload);
        }
      }
    }

    masterSifts.push({
      uniqueId: id,
      payload: JSON.stringify(masterPayload),
    });
  }

  return masterSifts;
};

const mergeKeys = (obj, other) => {
  const keys = Object.keys(obj);
  for (let key of keys) {
    // Nested object
    if (obj[key] === Object(obj[key]) && other[key] != undefined) {
      if (obj[key].length && obj[key].length < other[key].length) {
        // Found an array, if the replacement is bigger, use that
        obj[key] = other[key];
      } else {
        mergeKeys(obj[key], other[key]);
      }
    } else if (!obj[key] && other[key]) {
      obj[key] = other[key];
    }
  }
};
