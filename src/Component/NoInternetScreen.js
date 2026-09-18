import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NoInternetScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📡 No Internet Connection</Text>
      <Text style={styles.subtitle}>
        Internet connection is required to use this app.
      </Text>
    </View>
  );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#E53935",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});
