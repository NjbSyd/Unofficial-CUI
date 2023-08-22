import React from "react";
import {View, Modal, StyleSheet, Text} from "react-native";
import AnimatedLottieView from "lottie-react-native";

const LoadingPopup = ({visible, text}) => {
  return (
      <Modal animationType="fade" transparent={true} visible={visible}>
        <View style={styles.container}>
          <View style={styles.popup}>
            <AnimatedLottieView
                style={{
                  flex: 1,
                  alignSelf: "center",
                }}
                source={require("../../assets/Images/Loading.json")}
                autoPlay
                autoSize={true}
            />
            {text && <Text>{text}</Text>}
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  popup: {
    width: "50%",
    height: "15%",
    backgroundColor: "rgba(55,159,234,0.75)",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 30,
    height: 30,
  },
  txt: {
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
});

export default LoadingPopup;
