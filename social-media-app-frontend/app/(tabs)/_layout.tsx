import CustomTabBar from "@/components/ui/CustomTabBar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getToken } from "@/utils/auth";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  
  useEffect(() => {
    const checkUser = async () => {
      const token = await getToken();

      if (!token) {
        setIsLoggedIn(false);
        router.push("/login");
      } else {
        setIsLoggedIn(true);
      }
    };

    checkUser();
  }, [router]);

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="post" options={{ title: "Post" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
