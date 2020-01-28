# Edison Sift Parsers

A javascript library that takes the Edison Sift API results and returns the optimal fields (title, subtitle, etc) for presentation. Also includes a simplified API for fetching vendors and travel images.

## Sift Domain Parsers

Sift parsers take the original response and return a payload for display purposes.

### `flightParser(sift)`

<details>
<summary>properties</summary>

| Property     | Type   | Description                                               |
| ------------ | ------ | --------------------------------------------------------- |
| `type`       | string | 'flight'                                                  |
| `backupIcon` | string | 'flight'                                                  |
| `sift`       | object | The original sift payload                                 |
| `title`      | string | Title for the card                                        |
| `status`     | string | Flight status                                             |
| `subtitle`   | string | Subtitle for the card                                     |
| `emailTime`  | number | Unix time for the associated email                        |
| `endTime`    | string | DateTime string for when the last flight ends             |
| `startTime`  | string | DateTime string for when the first flight departs         |
| `departures` | array  | Array of departure objects                                |
| `airport`    | object | The airport object if found in `AirportMapping`           |
| `city`       | string | A cleaned string with just the name of the departure city |
| `imageQuery` | string | The string that should be provided to image api           |
| `cancelled`  | bool   | If the flight was cancelled                               |
| `vendor`     | string | The vendor's ID to use with the Vendor API                |
| `uniqueId`   | string | ID used to removing duplicate sifts                       |

| departure Property | Type   | Description                                 |
| ------------------ | ------ | ------------------------------------------- |
| `departureTime`    | string | DateTime string for when the flight departs |
| `arrivaltime`      | string | DateTime string for when the flight arrives |
| `airport`          | string | The arrival airport IATA code               |
| `city`             | string | Arrival airport city name                   |
| `destination`      | bool   | If this flight is the final destination     |

</details>

### `hotelParser(sift)`

<details>
<summary>properties</summary>

| Property      | Type   | Description                                           |
| ------------- | ------ | ----------------------------------------------------- |
| `type`        | string | 'hotel'                                               |
| `backupIcon`  | string | 'lodging'                                             |
| `sift`        | object | The original sift payload                             |
| `title`       | string | Title for the card                                    |
| `subtitle`    | string | Subtitle for the card                                 |
| `emailTime`   | number | Unix time for the associated email                    |
| `endTime`     | string | DateTime string for when the hotel reservation ends   |
| `startTime`   | string | DateTime string for when the hotel reservation begins |
| `dates`       | string | The dates for the reservation                         |
| `destination` | string | The location of the reservation                       |
| `imageQuery`  | string | The string that should be provided to image api       |
| `vendor`      | string | The vendor's ID to use with the Vendor API            |
| `uniqueId`    | string | ID used to removing duplicate sifts                   |

</details>

### `rentalParser(sift)`

<details>
<summary>properties</summary>

| Property      | Type   | Description                                     |
| ------------- | ------ | ----------------------------------------------- |
| `type`        | string | 'rental'                                        |
| `backupIcon`  | string | 'carrental'                                     |
| `sift`        | object | The original sift payload                       |
| `startTime`   | string | DateTime string for when the reservation begins |
| `title`       | string | Title for the card                              |
| `status`      | string | Rental status                                   |
| `subtitle`    | string | Subtitle for the card                           |
| `emailTime`   | number | Unix time for the associated email              |
| `pickupTime`  | string | DateTime string for the pickup time             |
| `dropoffTime` | string | DateTime string for the pickup time             |
| `name`        | string | The name of the car in the reservation          |
| `destination` | string | The location of the reservation                 |
| `imageQuery`  | string | The string that should be provided to image api |
| `vendor`      | string | The vendor's ID to use with the Vendor API      |
| `uniqueId`    | string | ID used to removing duplicate sifts             |

</details>

### `trainParser(sift)`

<details>
<summary>properties</summary>

| Property     | Type   | Description                                     |
| ------------ | ------ | ----------------------------------------------- |
| `type`       | string | 'train'                                         |
| `backupIcon` | string | 'train'                                         |
| `sift`       | object | The original sift payload                       |
| `startTime`  | string | DateTime string for when the reservation begins |
| `title`      | string | Title for the card                              |
| `status`     | string | Rental status                                   |
| `subtitle`   | string | Subtitle for the card                           |
| `provider`   | string | The provider                                    |
| `emailTime`  | number | Unix time for the associated email              |
| `dates`      | string | The dates for the reservation                   |
| `imageQuery` | string | The string that should be provided to image api |
| `vendor`     | string | The vendor's ID to use with the Vendor API      |
| `uniqueId`   | string | ID used to removing duplicate sifts             |

</details>

### `trainParser(sift)`

<details>
<summary>properties</summary>

| Property     | Type   | Description                                     |
| ------------ | ------ | ----------------------------------------------- |
| `type`       | string | 'train'                                         |
| `backupIcon` | string | 'train'                                         |
| `sift`       | object | The original sift payload                       |
| `startTime`  | string | DateTime string for when the reservation begins |
| `title`      | string | Title for the card                              |
| `status`     | string | Rental status                                   |
| `subtitle`   | string | Subtitle for the card                           |
| `provider`   | string | The provider                                    |
| `emailTime`  | number | Unix time for the associated email              |
| `dates`      | string | The dates for the reservation                   |
| `imageQuery` | string | The string that should be provided to image api |
| `vendor`     | string | The vendor's ID to use with the Vendor API      |
| `uniqueId`   | string | ID used to removing duplicate sifts             |

</details>

### `cruiseParser(sift)`

<details>
<summary>properties</summary>

| Property      | Type   | Description                                     |
| ------------- | ------ | ----------------------------------------------- |
| `type`        | string | 'cruise'                                        |
| `backupIcon`  | string | 'categoryCruise'                                |
| `sift`        | object | The original sift payload                       |
| `title`       | string | Title for the card                              |
| `subtitle`    | string | Subtitle for the card                           |
| `emailTime`   | number | Unix time for the associated email              |
| `startTime`   | string | DateTime string for when the reservation begins |
| `destination` | string | DateTime string for when the reservation begins |
| `dates`       | string | The dates for the reservation                   |
| `times`       | string | The times for the reservation                   |
| `vendor`      | string | The vendor's ID to use with the Vendor API      |
| `uniqueId`    | string | ID used to removing duplicate sifts             |

</details>

### `purchaseParser(sift)`

<details>
<summary>properties</summary>

| Property        | Type   | Description                                              |
| --------------- | ------ | -------------------------------------------------------- |
| `type`          | string | 'purchase'                                               |
| `backupIcon`    | string | 'packages'                                               |
| `sift`          | object | The original sift payload                                |
| `title`         | string | Title for the card                                       |
| `subtitle`      | string | Subtitle for the card                                    |
| `emailTime`     | number | Unix time for the associated email                       |
| `subcategories` | array  | Array of categories the purchase belongs to              |
| `itemOffered`   | string | The name of the first item in the purchase, if it exists |
| `date`          | string | DateTime string for the purchase time                    |
| `price`         | string | The total for the purchase                               |
| `primaryImage`  | string | The photo of the first item if it exists                 |
| `vendor`        | string | The vendor's ID to use with the Vendor API               |
| `uniqueId`      | string | ID used to removing duplicate sifts                      |

</details>

### `packageParser(sift)`

<details>
<summary>properties</summary>

| Property         | Type   | Description                                    |
| ---------------- | ------ | ---------------------------------------------- |
| `type`           | string | 'shipment'                                     |
| `backupIcon`     | string | 'packages'                                     |
| `sift`           | object | The original sift payload                      |
| `title`          | string | Title for the card                             |
| `subtitle`       | string | Subtitle for the card                          |
| `emailTime`      | number | Unix time for the associated email             |
| `status`         | string | The status of the package                      |
| `startTime`      | string | DateTime for when the email arrived            |
| `endTime`        | string | DateTime for when the package should arrive    |
| `trackingNumber` | string | The purchase tracking number                   |
| `primaryImage`   | string | The image URL of the first item in the package |
| `images`         | array  | URLs for images in the package                 |
| `shipDate`       | string | DateTime for when the package ships            |
| `shipperName`    | string | The name of the shipping provider              |
| `vendor`         | string | The vendor's ID to use with the Vendor API     |
| `uniqueId`       | string | ID used to removing duplicate sifts            |

</details>

### `restaurantParser(sift)`

<details>
<summary>properties</summary>

| Property         | Type   | Description                                |
| ---------------- | ------ | ------------------------------------------ |
| `type`           | string | 'restaurant'                               |
| `backupIcon`     | string | 'categoryRestaurant'                       |
| `sift`           | object | The original sift payload                  |
| `title`          | string | Title for the card                         |
| `subtitle`       | string | Subtitle for the card                      |
| `emailTime`      | number | Unix time for the associated email         |
| `startTime`      | string | DateTime for when the reservation starts   |
| `date`           | string | The date of the reservation                |
| `time`           | string | The time the reservation starts            |
| `ticket`         | string | The URL for the ticket                     |
| `restaurantName` | string | The restaurant name                        |
| `vendor`         | string | The vendor's ID to use with the Vendor API |
| `uniqueId`       | string | ID used to removing duplicate sifts        |

</details>

### `eventParser(sift)`

<details>
<summary>properties</summary>

| Property     | Type   | Description                                |
| ------------ | ------ | ------------------------------------------ |
| `type`       | string | 'event'                                    |
| `backupIcon` | string | 'entertainment'                            |
| `sift`       | object | The original sift payload                  |
| `title`      | string | Title for the card                         |
| `subtitle`   | string | Subtitle for the card                      |
| `emailTime`  | number | Unix time for the associated email         |
| `startTime`  | string | DateTime for when the reservation starts   |
| `ticketUrl`  | string | The URL for the ticket                     |
| `date`       | string | The date of the reservation                |
| `time`       | string | The time the reservation starts            |
| `vendor`     | string | The vendor's ID to use with the Vendor API |
| `uniqueId`   | string | ID used to removing duplicate sifts        |

</details>

### `billParser(sift)`

<details>
<summary>properties</summary>

| Property       | Type   | Description                                |
| -------------- | ------ | ------------------------------------------ |
| `type`         | string | 'bill'                                     |
| `backupIcon`   | string | 'finance'                                  |
| `sift`         | object | The original sift payload                  |
| `title`        | string | Title for the card                         |
| `subtitle`     | string | Subtitle for the card                      |
| `emailTime`    | number | Unix time for the associated email         |
| `startTime`    | string | DateTime of the bill due date              |
| `price`        | array  | The bill amount                            |
| `date`         | string | The due date of the bill                   |
| `emailSubject` | string | The email subject line                     |
| `paymentUrl`   | string | The URL to pay the bill                    |
| `vendor`       | string | The vendor's ID to use with the Vendor API |
| `uniqueId`     | string | ID used to removing duplicate sifts        |

</details>

### `boardingPassParser(sift)`

<details>
<summary>properties</summary>

| Property        | Type   | Description                            |
| --------------- | ------ | -------------------------------------- |
| `type`          | string | 'boardingpass'                         |
| `backupIcon`    | string | 'flight'                               |
| `sift`          | object | The original sift payload              |
| `title`         | string | Title for the card                     |
| `subtitle`      | string | Subtitle for the card                  |
| `emailTime`     | number | Unix time for the associated email     |
| `startTime`     | string | DateTime of the departure              |
| `endTime`       | string | DateTime of the arrival                |
| `reservations`  | array  | Array of objects with reservation data |
| `reservationId` | string | The reservationId                      |
| `uniqueId`      | string | ID used to removing duplicate sifts    |

</details>

---

## getMergedPayloads

Merges parsed sift payloads by uniqueId. Prevents displaying duplicate sift payloads.

```javascript
getMergedPayloads(sifts);
```

Arguments:

- sifts: Array

Returns: Array of merged payloads with the uniqueId

```javascript
  [{ uniqueId, payload }, { uniqueId, payload }...]
```

---

## getSiftVendors

Accepts the parsed sifts and configuration with sift credentials and returns array of corrisponding vendor data.

```javascript
getSiftVendors(sifts, config);
```

Arguments:

- sifts: Array
- config: `{ user, token, env }`

Valid `env` values:

- `development`
- `staging`
- `production`

Returns: **Promise**

- success: Array of vendor data.

---

## getTravelImages

Accepts array of cities and returns images for each city.

```javascript
getTravelImages(cities);
```

Arguments:

- cities: Array

Returns: **Promise**

- success: Array of city photo URLs.

---

## getAirportMapping

```javascript
getAirportMapping(cities);
```

Returns: The mapping of IATA codes to addresses.
