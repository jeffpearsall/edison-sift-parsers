import { getCityPhoto } from './teleportApi';
import { getWikipediaImage } from './wikipediaImageApi';
import AirportMapping from '../data/AirportMapping.json';

const EdisonEnvironmentUrls = {
  development: 'https://mail-engineering.easilydo.com',
  staging: 'https://mail-staging.easilydo.com',
  production: 'https://mail.easilydo.com',
};

export const getSiftVendors = async (sifts, config) => {
  if (sifts.length === 0) {
    return [];
  }

  // get config data
  let { user, token, env } = config;

  if (!user || !token || !env) {
    console.warn('missing information in vendor configuration payload');
  }

  let vendors = sifts.map((sift) => {
    if (sift.sift.payload) {
      if (sift.sift.payload['x-vendorId']) {
        return sift.sift.payload['x-vendorId'];
      } else if (sift.sift.payload.partOfOrder) {
        return sift.sift.payload.partOfOrder['x-vendorId'];
      }
    }
  });

  // Get array of vendors
  vendors = Array.from(new Set(vendors)); // Make array unique

  let pArray = vendors.map((vendor) => {
    if (vendor) {
      const vendorInfoConfig = {
        id: vendor,
        user,
        token,
        env,
      };

      return GetVendorInfo(vendorInfoConfig);
    } else {
      return null;
    }
  });

  let vendorData = await Promise.all(pArray);
  let vendorDict = {};
  for (let i = 0; i < vendorData.length; i++) {
    vendorDict[vendors[i]] = vendorData[i];
  }
  let allVendors = sifts.map((sift) => {
    if (sift.sift.payload) {
      if (sift.sift.payload['x-vendorId'] && vendorDict[sift.sift.payload['x-vendorId']]) {
        return vendorDict[sift.sift.payload['x-vendorId']];
      } else if (sift.sift.payload.partOfOrder && vendorDict[sift.sift.payload.partOfOrder['x-vendorId']]) {
        return vendorDict[sift.sift.payload.partOfOrder['x-vendorId']];
      } else {
        // No vendor payload
        return '';
      }
    } else {
      // No sift payload
      return '';
    }
  });

  return allVendors;
};

export const getSiftVendor = (sift, config) => {
  // get config data
  let { user, token, env } = config;

  if (!user || !token || !env) {
    console.warn('missing information in vendor configuration payload');
  }

  let id;
  if (sift.sift.payload) {
    if (sift.sift.payload['x-vendorId']) {
      id = sift.sift.payload['x-vendorId'];
    }
  }

  if (id) {
    return GetVendorInfo({ id, user, token, env });
  } else {
    console.warn('missing vendor id');
  }
};

const GetVendorInfo = async ({ id, user, token, env }) => {
  if (!user || !token) {
    console.error('Unable to find user or token in GetVendorInfo');
    return;
  }

  const siftUrl = EdisonEnvironmentUrls[env];

  try {
    var response = await fetch(siftUrl + '/v1/vendor?vendor_id=' + id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ECAccessToken: token,
        username: user,
      },
    });

    if (response.ok) {
      try {
        let responseJson = await response.json();
        if (responseJson.result && responseJson.result.vendors) {
          return responseJson.result.vendors[0];
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error parsing JSON in GetVendorInfo');
        return null;
      }
    }
  } catch (error) {
    console.warn(error);
    return null;
  }
};

export const getTravelImages = async (cities) => {
  const teleportImages = await getImages(cities, getCityPhoto);

  let remainingCities = cities.map((city, index) => (teleportImages[index] ? null : city));

  let wikipediaImages = await getImages(remainingCities, getWikipediaImage);

  let cityImages = cities.map((city, index) => {
    if (teleportImages[index]) {
      return teleportImages[index];
    } else if (wikipediaImages[index]) {
      return wikipediaImages[index];
    } else {
      return null;
    }
  });

  return cityImages;
};

const getImages = async (cities, API) => {
  let uniquePlaces = Array.from(new Set(cities));
  let destinations = uniquePlaces.map((destination) => (destination ? API(destination) : null));
  let destinationImages = await Promise.all(destinations);

  let destinationDict = {};
  for (let i = 0; i < destinationImages.length; i++) {
    // creates a mapping between the airport name and the image
    destinationDict[uniquePlaces[i]] = destinationImages[i];
  }

  let photos = cities.map((city) => destinationDict[city]);
  return photos;
};

export const getAirportMapping = () => AirportMapping;
