import 'dotenv/config';

export default {
  expo: {
    name: "mobile_pandhi",
    slug: "pandhi",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    // IMPORTANT: Set to false - react-native-razorpay doesn't support new architecture yet
    newArchEnabled: false,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.hungerbox.pandhi",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      // Add cleartext traffic permission
      usesCleartextTraffic: true
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
      output: "single",
      meta: {
        "viewport": "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no"
      }
    },
    plugins: [
      "expo-font",
      [
        "expo-build-properties",
        {
          "android": {
            "usesCleartextTraffic": true
          }
        }
      ]
    ],
    extra: {
      // Add Razorpay key here
      razorpayKey: process.env.EXPO_PUBLIC_RAZORPAY_KEY || "rzp_test_CqJOLIOhHoCry6",
      eas: {
        "projectId": "5e5294e5-b880-4ada-9b99-38309ca326e1"
      }
    },
    owner: "pavan_2503"
  }
}