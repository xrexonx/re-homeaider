import { createStackNavigator } from "react-navigation";
import { BookingScreen } from "./../screens/BookingScreen";
import { ServicesScreen } from "./../screens/ServicesScreen";

export const SeekersStack = createStackNavigator(
  {
    Booking: BookingScreen,
    Services: ServicesScreen,
  },
  { initialRouteName: "Booking" }
);