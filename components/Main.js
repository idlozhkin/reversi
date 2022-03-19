import React, { useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

let maxScore = 0;

export default function Main({ navigation, route }) {
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@storage_Key");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@storage_Key", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData().then((value) => {
      if (value) {
        maxScore = value;
        navigation.setOptions({
          title: `Your score: ${maxScore ? maxScore : 0}`,
        });
      }
    });
    if (route.params) {
      Alert.alert("end game", route.params[0]);
      if (route.params[1] > maxScore) {
        maxScore = route.params[1];
        storeData(maxScore);
        navigation.setOptions({
          title: `Your score: ${maxScore ? maxScore : 0}`,
        });
      }
    }
  }, [route]);

  return (
    <View style={styles.main}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Game")}
      >
        <Text style={styles.title}>Easy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert("", "in future update")}
      >
        <Text style={styles.title}>Hard</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert("", "in future update")}
      >
        <Text style={styles.title}>Online</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#333",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "20%",
  },
  button: {
    width: "50%",
    height: 70,
    backgroundColor: "#f60",
    margin: "10%",
  },
  title: {
    marginTop: 5,
    fontSize: 40,
    textAlign: "center",
    color: "black",
  },
});
