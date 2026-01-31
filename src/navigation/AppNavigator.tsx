import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import EventListScreen from "../screens/EventListScreen";
import EventDashboardScreen from "../screens/EventDashboardScreen";
import AttendeeListScreen from "../screens/AttendeeListScreen";
import QRScannerScreen from "../screens/QRScannerScreen";

import { useAuthStore } from "../store/authStore";

export type RootStackParamList = {
  Login: undefined;
  EventList: undefined;
  EventDashboard: undefined;
  AttendeeListScreen: { eventId: string };
  AttendeeDetail: { eventId: string; attendeeId: string };
  QRScanner: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const loggedInUser = useAuthStore((state) => state.loggedInUser);

  return (
    <NavigationContainer>
    <Stack.Navigator
  initialRouteName={loggedInUser ? "EventList" : "Login"}
  screenOptions={{ headerShown: true }}
>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="EventList" component={EventListScreen} />
  <Stack.Screen name="EventDashboard" component={EventDashboardScreen} />
  <Stack.Screen name="AttendeeListScreen" component={AttendeeListScreen} />
  <Stack.Screen name="QRScanner" component={QRScannerScreen} />
</Stack.Navigator>

    </NavigationContainer>
  );
}
