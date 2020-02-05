const apiUrl = 'https://api.teleport.org/api/cities/';

export const getCityPhoto = async (city) => {
  if (!city) {
    console.error('error getting city photo, gotta provide a city...');
  }

  let url = encodeURI(`${apiUrl}?search=${city}`);
  const request = await timeoutPromise(fetch(url), 800);

  if (request && request.ok) {
    const result = await request.json();
    if (result) {
      let cityItem = await getCityItem(result);
      if (cityItem) {
        let urbanArea = await getUrbanArea(cityItem);
        if (urbanArea) {
          let cityPhoto = await getPhoto(urbanArea);
          if (cityPhoto) {
            return cityPhoto;
          }
        }
      }
    }

    return null;
  } else {
    console.warn('bad request to teleport API!');
  }
};

const getCityItem = async (result) => {
  if (result._embedded) {
    if (result._embedded['city:search-results'] && result._embedded['city:search-results'].length > 0) {
      let city = result._embedded['city:search-results'][0];

      if (city._links) {
        if (city._links['city:item']) {
          if (city._links['city:item'].href) {
            let cityItemRequest = await fetch(city._links['city:item'].href);
            if (cityItemRequest.ok) {
              let cityItem = await cityItemRequest.json();
              return cityItem;
            }
          }
        }
      }
    }
  }

  console.warn('UNABLE TO GET CITY ITEM');
  return null;
};

const getUrbanArea = async (cityItem) => {
  if (!cityItem) {
    console.error('you gotta provide a city item!');
  }

  if (cityItem._links) {
    if (cityItem._links['city:urban_area']) {
      if (cityItem._links['city:urban_area'].href) {
        let urbanAreaRequest = await fetch(cityItem._links['city:urban_area'].href);
        if (urbanAreaRequest.ok) {
          let urbanArea = await urbanAreaRequest.json();
          return urbanArea;
        }
      }
    }
  }

  console.warn('UNABLE TO GET URBAN AREA');
  return null;
};

const getPhoto = async (urbanArea) => {
  if (!urbanArea) {
    console.error('you gotta provide an urban area!');
  }

  if (urbanArea.slug) {
    const imageUrl = `https://api.teleport.org/api/urban_areas/slug:${urbanArea.slug}/images/`;
    let urbanAreaImageRequest = await fetch(imageUrl);
    if (urbanAreaImageRequest.ok) {
      let urbanAreaImages = await urbanAreaImageRequest.json();

      if (urbanAreaImages && urbanAreaImages.photos) {
        if (urbanAreaImages.photos.length > 0) {
          if (urbanAreaImages.photos[0].image) {
            if (urbanAreaImages.photos[0].image.mobile) {
              return urbanAreaImages.photos[0].image.mobile;
            }
          }
        }
      }
    }
  }

  console.warn('UNABLE TO GET PHOTO FROM URBAN AREA');
};

export const GetTeleportDestinationImages = async (cities) => {
  if (cities) {
    let cleanedCities = cities.map((city) => {
      if (city) {
        let index = city.indexOf('-');
        if (index != -1) {
          return city.slice(0, index);
        } else {
          return city;
        }
      } else {
        return null;
      }
    });

    let uniquePlaces = Array.from(new Set(cleanedCities));
    let cityPromises = uniquePlaces.map((destination) => (destination ? getCityPhoto(destination) : null));
    let destinationImages = await Promise.all(cityPromises);

    let destinationDict = {};
    for (let i = 0; i < destinationImages.length; i++) {
      // creates a mapping between the airport name and the image
      destinationDict[uniquePlaces[i]] = destinationImages[i];
    }

    let photos = cleanedCities.map((city) => destinationDict[city]);
    return photos;
  } else {
    return [];
  }
};

const timeoutPromise = (promise, ms = 5000) => {
  let timeout = new Promise(function(resolve, reject) {
    setTimeout(resolve, ms, null);
  });

  return Promise.race([promise, timeout]);
};
