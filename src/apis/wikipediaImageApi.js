export async function getWikipediaImage(city) {
  let image;
  if (city) {
    let response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${city}&format=json&redirects=resolve&limit=1`
    );

    if (response && response.ok) {
      let data = await response.json();

      if (data && data.length === 4 && data[3].length >= 1) {
        let page = data[3][0].replace('https://en.wikipedia.org/wiki/', '');

        let imageResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${page}&prop=pageimages&format=json&pithumbsize=1000`
        );

        let imageData = await imageResponse.json();
        if (imageData && imageData.query && imageData.query.pages) {
          for (const pageNum in imageData.query.pages) {
            let pageData = imageData.query.pages[pageNum];
            if (pageData && pageData.thumbnail && pageData.thumbnail.source) {
              if (!pageData.thumbnail.source.includes('svg')) {
                image = pageData.thumbnail.source;
              }
            }
          }
        }
      }
    }
  }

  return image;
}
