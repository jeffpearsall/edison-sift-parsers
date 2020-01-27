# Edison Sift Parsers

A javascript library that takes the Edison Sift API results and returns the optimal fields (title, subtitle, etc) for presentation. Also includes a simplified API for fetching vendors and travel images.

## Sift Domain Parsers

`flightParser(sift)`

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
| `vendor`     | string | The vendor's ID to use with the Vendor API                |
| `departures` | array  | Array of departure objects                                |
| `airport`    | object | The airport object if found in `AirportMapping`           |
| `city`       | string | A cleaned string with just the name of the departure city |
| `imageQuery` | string | The string that should be provided to image api           |
| `cancelled`  | bool   | If the flight was cancelled                               |
| `uniqueId`   | string | ID used to removing duplicate sifts                       |

| departure Property | Type   | Description                                 |
| ------------------ | ------ | ------------------------------------------- |
| `departureTime`    | string | DateTime string for when the flight departs |
| `arrivaltime`      | string | DateTime string for when the flight arrives |
| `airport`          | string | The arrival airport IATA code               |
| `city`             | string | Arrival airport city name                   |
| `destination`      | bool   | If this flight is the final destination     |
