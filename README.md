# Edison Sift Parsers

A javascript library that takes the Edison Sift API results and returns the optimal fields (title, subtitle, etc) for presentation. Also includes a simplified API for fetching vendors and travel images.

## Getting Started

Add the package with: `yarn add https://github.com/decrews/edison-sift-parsers.git`

Example:

```javascript
import { flightParser, getSiftVendor } from 'edison-sift-parsers';

const parsedFlight = flightParser(sift);
const flightVendor = await getSiftVendor(parsedFlight);
const flightImage = await getTravelImage(parsedFlight.city);
```

## Sift Domain Parsers

Sift parsers take the original response and return a payload for display purposes.

### `flightParser(sift)`

<details>
<summary>properties</summary>

| Property            | Type   | Description                                                       |
| ------------------- | ------ | ----------------------------------------------------------------- |
| `type`              | string | 'flight'                                                          |
| `sift`              | object | The original sift payload                                         |
| `title`             | string | Title for the card                                                |
| `status`            | string | Flight status                                                     |
| `subtitle`          | string | Subtitle for the card                                             |
| `emailTime`         | number | Unix time for the associated email                                |
| `endTime`           | string | DateTime string for when the last flight ends                     |
| `startTime`         | string | DateTime string for when the first flight departs                 |
| `departures`        | array  | Array of departure objects                                        |
| `airport`           | object | The airport object if found in `AirportMapping`                   |
| `travelers`         | array  | Array of names for the passengers for the flight                  |
| `reservationNumber` | string | The reservation number for the flight                             |
| `checkinData`       | object | the data necessary to check into a flight (AirlineCheckinMapping) |
| `broker`            | string | The broker of the reservation                                     |
| `city`              | string | A cleaned string with just the name of the departure city         |
| `cancelled`         | bool   | If the flight was cancelled                                       |
| `vendor`            | string | The vendor's ID to use with the Vendor API                        |
| `uniqueId`          | string | ID used to removing duplicate sifts                               |

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

| Property            | Type   | Description                                              |
| ------------------- | ------ | -------------------------------------------------------- |
| `type`              | string | 'hotel'                                                  |
| `sift`              | object | The original sift payload                                |
| `title`             | string | Title for the card                                       |
| `subtitle`          | string | Subtitle for the card                                    |
| `emailTime`         | number | Unix time for the associated email                       |
| `endTime`           | string | DateTime string for when the hotel reservation ends      |
| `startTime`         | string | DateTime string for when the hotel reservation begins    |
| `dates`             | string | The dates for the reservation                            |
| `reservationNumber` | string | The reservation number                                   |
| `hotelName`         | string | The name of the hotel or room                            |
| `telephone`         | string | The phone number for the reservation                     |
| `address`           | string | The street address of the reservation                    |
| `rooms`             | string | The number of rooms in the reservation                   |
| `roomType`          | string | The kind of room for the reservation (e.g. double queen) |
| `days`              | string | Number of days for the reservation                       |
| `broker`            | string | The broker for the reservation                           |
| `destination`       | string | The location of the reservation                          |
| `city`              | string | The city for the hotel                                   |
| `vendor`            | string | The vendor's ID to use with the Vendor API               |
| `uniqueId`          | string | ID used to removing duplicate sifts                      |

</details>

### `rentalParser(sift)`

<details>
<summary>properties</summary>

| Property            | Type   | Description                                     |
| ------------------- | ------ | ----------------------------------------------- |
| `type`              | string | 'rental'                                        |
| `sift`              | object | The original sift payload                       |
| `startTime`         | string | DateTime string for when the reservation begins |
| `title`             | string | Title for the card                              |
| `status`            | string | Rental status                                   |
| `subtitle`          | string | Subtitle for the card                           |
| `emailTime`         | number | Unix time for the associated email              |
| `pickupTime`        | string | DateTime string for the pickup time             |
| `dropoffTime`       | string | DateTime string for the pickup time             |
| `pickupLocation`    | string | The address where the car is picked up          |
| `dropoffLocation`   | string | The address where the car is dropped off        |
| `reservationNumber` | string | The reservation number                          |
| `carName`           | string | The make and model of car being rented          |
| `underName`         | string | The name the reservation is under               |
| `destination`       | string | The location of the reservation                 |
| `city`              | string | The city for the rental reservation             |
| `vendor`            | string | The vendor's ID to use with the Vendor API      |
| `uniqueId`          | string | ID used to removing duplicate sifts             |

</details>

### `trainParser(sift)`

<details>
<summary>properties</summary>

| Property            | Type   | Description                                     |
| ------------------- | ------ | ----------------------------------------------- |
| `type`              | string | 'train'                                         |
| `sift`              | object | The original sift payload                       |
| `startTime`         | string | DateTime string for when the reservation begins |
| `title`             | string | Title for the card                              |
| `status`            | string | Rental status                                   |
| `subtitle`          | string | Subtitle for the card                           |
| `provider`          | string | The provider                                    |
| `emailTime`         | number | Unix time for the associated email              |
| `dates`             | string | The dates for the reservation                   |
| `travelers`         | array  | The names of the travlers                       |
| `reservationNumber` | string | The reservation number                          |
| `trainNumber`       | string | The train number                                |
| `city`              | string | The destination city                            |
| `vendor`            | string | The vendor's ID to use with the Vendor API      |
| `uniqueId`          | string | ID used to removing duplicate sifts             |

</details>

### `trainParser(sift)`

<details>
<summary>properties</summary>

| Property    | Type   | Description                                     |
| ----------- | ------ | ----------------------------------------------- |
| `type`      | string | 'train'                                         |
| `sift`      | object | The original sift payload                       |
| `startTime` | string | DateTime string for when the reservation begins |
| `title`     | string | Title for the card                              |
| `status`    | string | Rental status                                   |
| `subtitle`  | string | Subtitle for the card                           |
| `provider`  | string | The provider                                    |
| `emailTime` | number | Unix time for the associated email              |
| `dates`     | string | The dates for the reservation                   |
| `city`      | string | The destination city                            |
| `vendor`    | string | The vendor's ID to use with the Vendor API      |
| `uniqueId`  | string | ID used to removing duplicate sifts             |

</details>

### `cruiseParser(sift)`

<details>
<summary>properties</summary>

| Property            | Type   | Description                                     |
| ------------------- | ------ | ----------------------------------------------- |
| `type`              | string | 'cruise'                                        |
| `sift`              | object | The original sift payload                       |
| `title`             | string | Title for the card                              |
| `subtitle`          | string | Subtitle for the card                           |
| `emailTime`         | number | Unix time for the associated email              |
| `startTime`         | string | DateTime string for when the reservation begins |
| `destination`       | string | DateTime string for when the reservation begins |
| `dates`             | string | The dates for the reservation                   |
| `times`             | string | The times for the reservation                   |
| `cruiseLine`        | string | The name of the cruise line                     |
| `reservationNumber` | string | The reservation number                          |
| `phone`             | string | The phone number for the reservation            |
| `address`           | string | The address for the reservation (departure)     |
| `vendor`            | string | The vendor's ID to use with the Vendor API      |
| `uniqueId`          | string | ID used to removing duplicate sifts             |

</details>

### `purchaseParser(sift)`

<details>
<summary>properties</summary>

| Property        | Type   | Description                                              |
| --------------- | ------ | -------------------------------------------------------- |
| `type`          | string | 'purchase'                                               |
| `sift`          | object | The original sift payload                                |
| `title`         | string | Title for the card                                       |
| `subtitle`      | string | Subtitle for the card                                    |
| `emailTime`     | number | Unix time for the associated email                       |
| `subcategories` | array  | Array of categories the purchase belongs to              |
| `itemOffered`   | string | The name of the first item in the purchase, if it exists |
| `orderNumber`   | string | The order number for the purchase                        |
| `date`          | string | DateTime string for the purchase time                    |
| `price`         | string | The total for the purchase                               |
| `total`         | string | The total purchase price including tax                   |
| `currency`      | string | The currency used for the purchase (e.g. USD)            |
| `tax`           | string | The amount of the tax for a purhcase                     |
| `items`         | array  | Array of items in the purhcase as objects                |
| `shipping`      | string | The shipping cost                                        |
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
| `items`          | array  | array of objects for each item in the package  |
| `shipDate`       | string | DateTime for when the package ships            |
| `shipDate`       | string | DateTime for when the package ships            |
| `shipperName`    | string | The name of the shipping provider              |
| `broker`         | string | The broker for the package                     |
| `vendor`         | string | The vendor's ID to use with the Vendor API     |
| `uniqueId`       | string | ID used to removing duplicate sifts            |

</details>

### `restaurantParser(sift)`

<details>
<summary>properties</summary>

| Property         | Type   | Description                                |
| ---------------- | ------ | ------------------------------------------ |
| `type`           | string | 'restaurant'                               |
| `sift`           | object | The original sift payload                  |
| `title`          | string | Title for the card                         |
| `subtitle`       | string | Subtitle for the card                      |
| `emailTime`      | number | Unix time for the associated email         |
| `startTime`      | string | DateTime for when the reservation starts   |
| `date`           | string | The date of the reservation                |
| `time`           | string | The time the reservation starts            |
| `phone`          | string | The phone number for the reseravtion       |
| `address`        | string | The address of the reservation location    |
| `partySize`      | string | How many people the reservation is for     |
| `restaurantName` | string | The restaurant name                        |
| `vendor`         | string | The vendor's ID to use with the Vendor API |
| `uniqueId`       | string | ID used to removing duplicate sifts        |

</details>

### `eventParser(sift)`

<details>
<summary>properties</summary>

| Property       | Type   | Description                                |
| -------------- | ------ | ------------------------------------------ |
| `type`         | string | 'event'                                    |
| `sift`         | object | The original sift payload                  |
| `title`        | string | Title for the card                         |
| `subtitle`     | string | Subtitle for the card                      |
| `emailTime`    | number | Unix time for the associated email         |
| `startTime`    | string | DateTime for when the reservation starts   |
| `ticketUrl`    | string | The URL for the ticket                     |
| `date`         | string | The date of the reservation                |
| `time`         | string | The time the reservation starts            |
| `address`      | string | The location of the event                  |
| `locationName` | string | The name of the event venue                |
| `provider`     | string | The name of the provider (seller)          |
| `vendor`       | string | The vendor's ID to use with the Vendor API |
| `uniqueId`     | string | ID used to removing duplicate sifts        |

</details>

### `billParser(sift)`

<details>
<summary>properties</summary>

| Property       | Type   | Description                                |
| -------------- | ------ | ------------------------------------------ |
| `type`         | string | 'bill'                                     |
| `sift`         | object | The original sift payload                  |
| `title`        | string | Title for the card                         |
| `subtitle`     | string | Subtitle for the card                      |
| `emailTime`    | number | Unix time for the associated email         |
| `startTime`    | string | DateTime of the bill due date              |
| `price`        | array  | The bill amount                            |
| `dueDate`      | string | The due date of the bill                   |
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

Merges sifts with the same uniqueId into a more complete payload for that purchase, flight, etc. Helpful in removing duplicate sifts.

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

Accepts the parsed sifts and configuration with sift credentials and returns array of corrisponding vendor data. Each vendor is only fetched once

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

## getSiftVendor

Accepts a parsed sift and a configuration object with sift credentials. Returns the vendor for that sift if it exists.

```javascript
getSiftVendors(sift, config);
```

Arguments:

- sift: Object
- config: `{ user, token, env }`

Valid `env` values:

- `development`
- `staging`
- `production`

Returns: **Promise**

- success: The vendor data.

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

---

## getAirlineCheckinMapping

```javascript
getAirlineCheckinMapping(vendorId);
```

Returns: The url to check in, the name or id of the input field on the page, and the name of the airline for a specific vendor id.
