import * as React from "react";
import { Content, Text, Button, Icon } from "native-base";
import {
  DrawerItems,
  SafeAreaView,
  createDrawerNavigator,
} from "react-navigation";
import { StyleSheet } from "react-native";
import { LogoutComponent } from "../components/apollo-components";
import { BookingStack, HiringStock } from "./ProviderStack";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const ProvidersDrawer = createDrawerNavigator(
  {
    Booking: { screen: BookingStack },
    Hiring: { screen: HiringStock },
  },
  {
    contentComponent: props => (
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: "always", horizontal: "never" }}
      >
        <Content>
          <DrawerItems {...props} />
        </Content>
        <LogoutComponent>
          {mutate => (
            <Button
              icon
              block
              light
              onPress={async () => {
                await mutate();
                props.navigation.navigate("Auth");
              }}
            >
              <Icon type="Entypo" name="logout" />
              <Text>Logout</Text>
            </Button>
          )}
        </LogoutComponent>
      </SafeAreaView>
    ),
    initialRouteName: "Book",
  }
);