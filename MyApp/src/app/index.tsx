import * as SecureStore from "expo-secure-store";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { routes } from "@/constants/routes";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const accessToken =
          await SecureStore.getItemAsync("accessToken");

        setIsLoggedIn(!!accessToken);
      } catch (error) {
        console.error(
          "Failed to check authentication:",
          error
        );

        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (isLoggedIn) {
    return (
      <Redirect href="/(tabs)/dashboard" />
    );
  }

  return (
    <Redirect href={routes.onboarding.landingPage} />
  );
}