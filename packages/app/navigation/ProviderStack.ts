import { HiringScreen } from "./../screens/providers/HiringScreen";
import { BookingScreen } from "./../screens/providers/BookingScreen";
import { createStackNavigator } from "react-navigation";
import { ServiceRequestProcessScreen } from "../screens/ServiceRequestProgressScreen";

export const BookingStack = createStackNavigator(
  {
    Booking: BookingScreen,
    ServiceRequestProcess: ServiceRequestProcessScreen,
  },
  { initialRouteName: "Booking" }
);

export const HiringStock = createStackNavigator(
  {
    Hiring: HiringScreen,
    ServiceRequestProcess: ServiceRequestProcessScreen,
  },
  { initialRouteName: "Hiring" }
);
