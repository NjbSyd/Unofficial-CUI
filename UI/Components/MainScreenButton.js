import { Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";

const RenderButton = (
  iconName,
  screenName,
  screenDescription,
  icon = true,
  buttonWidth,
  navigation
) => {
  return (
    <TouchableOpacity
      style={[styles.button, { width: buttonWidth, height: buttonWidth + 20 }]}
      onPress={() => navigation.navigate(screenName)}
    >
      {icon ? (
        <FontAwesome5 name={iconName} size={50} color="white" />
      ) : (
        <Image
          style={{
            width: "40%",
            height: "40%",
            resizeMode: "contain",
          }}
          source={require("../../assets/cui_logo_monochrome.png")}
        />
      )}
      <Text style={styles.buttonText}>{screenName}</Text>
      <Text
        style={{
          color: "white",
          textAlign: "center",
          fontSize: 12,
          margin: 20,
        }}
      >
        {screenDescription}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(15, 44, 76)",
    marginVertical: 10,
    borderRadius: 10,
    height: "35%",
    borderColor: "rgb(15, 44, 76)",
    borderWidth: 1,
  },
  buttonText: {
    color: "white",
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export { RenderButton };