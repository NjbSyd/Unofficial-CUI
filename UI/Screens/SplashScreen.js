import { View, StyleSheet, Image, Text } from "react-native";
import AnimatedLottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { PopulateGlobalState } from "../../BackEnd/RequestGenerator";
import { useDispatch } from "react-redux";
import BannerAds from "../../Ads/BannerAd";

export default function SplashScreen({ navigation }) {
  const StateDispatcher = useDispatch();
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  useEffect(() => {
    setLoadingText("Checking Internet Connection...");
  }, []);

  const onAnimationFinish = async () => {
    setInitialAnimationDone(true);
    try {
      await PopulateGlobalState(setLoadingText, StateDispatcher);
      setTimeout(() => {
        navigation.navigate("ApplicationEntry");
      }, 1500);
    } catch (error) {
      setLoadingText(error);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <AnimatedLottieView
        style={styles.splashContainer}
        source={require("../../assets/Images/SplashScreen.json")}
        resizeMode="center"
        autoPlay
        speed={1}
        loop={false}
        onAnimationFinish={onAnimationFinish}
        autoSize
      />
      {initialAnimationDone && (
        <>
          <AnimatedLottieView
            style={styles.progressContainer}
            source={require("../../assets/Images/Progress.json")}
            resizeMode="center"
            autoPlay
            loop
            autoSize
          />
          <Image
            style={styles.image}
            source={require("../../assets/Images/icon.png")}
          />
          <View
            style={{ position: "absolute", bottom: "27%", alignSelf: "center" }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "rgb(255,255,255)",
                marginVertical: 40,
                alignSelf: "center",
                fontWeight: "100",
                letterSpacing: 1,
              }}
            >
              {loadingText}
            </Text>
          </View>
          <View
            style={{ position: "absolute", bottom: "5%", alignSelf: "center" }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.2)",
                fontStyle: "italic",
                includeFontPadding: true,
                letterSpacing: 3,
              }}
            >
              Made with ❤ by NS
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: "10%",
    width: "100%",
  },
  splashContainer: {
    width: "1000%",
    height: "100%",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "40%",
    zIndex: 1,
    alignSelf: "center",
    position: "absolute",
    top: "20%",
  },
});
