import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./Main";
import Game from "./Game";

const Stack = createStackNavigator();

export default function Navigate() {
  const mainOptions = {
    headerStyle: { backgroundColor: "#F60", height: 80 },
    headerTitleStyle: {
      fontWeight: "700",
      color: "#333",
      fontSize: 20,
      color: "black",
    },
    title: "",
    headerTitleAlign: "center",
  };
  const otherOptions = {
    headerShown: false,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Main} options={mainOptions} />
        <Stack.Screen name="Game" component={Game} options={otherOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
