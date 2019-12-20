import { SiftFlightParser } from './parsers/SiftFlightParser';
import { SiftHotelParser } from './parsers/SiftHotelParser';
import { SiftRentalParser } from './parsers/SiftRentalParser';
import { SiftTrainParser } from './parsers/SiftTrainParser';
import { SiftCruiseParser } from './parsers/SiftCruiseParser';
import { SiftPurchaseParser } from './parsers/SiftPurchaseParser';
import { SiftPackageParser } from './parsers/SiftPackageParser';
import { SiftRestaurantParser } from './parsers/SiftRestaurantParser';
import { SiftEventParser } from './parsers/SiftEventParser';
import { SiftBillParser } from './parsers/SiftBillParser';
import { SiftBoardingPassParser } from './parsers/SiftBoardingPassParser';
import { GetSiftVendors, getTravelImages } from './apis/apis';

module.exports = {
  SiftFlightParser,
  SiftHotelParser,
  SiftRentalParser,
  SiftTrainParser,
  SiftCruiseParser,
  SiftPurchaseParser,
  SiftPackageParser,
  SiftRestaurantParser,
  SiftEventParser,
  SiftBillParser,
  SiftBoardingPassParser,
  GetSiftVendors,
  getTravelImages,
};
