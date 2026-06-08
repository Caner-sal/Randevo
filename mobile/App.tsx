import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, CalendarDays, Calendar as CalendarIcon, User } from "lucide-react-native";

import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import AppointmentsScreen from "./src/screens/AppointmentsScreen";
import AppointmentDetailScreen from "./src/screens/AppointmentDetailScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { I18nProvider, useI18n } from "./src/i18n";
import { clearSession, loadSession, saveSession, toSession } from "./src/auth/session";
import type { MobileSession } from "./src/auth/session";
import type { MobileAuthPayload } from "./src/api/client";
import { mobileLogout, mobileRefresh } from "./src/api/client";

type MainTabParamList = {
  DashboardTab: undefined;
  AppointmentsTab: undefined;
  CalendarTab: undefined;
  ProfileTab: undefined;
};

type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  TodayAppointments: undefined;
  AppointmentDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function SplashScreen() {
  return (
    <View style={splashStyles.container}>
      <ActivityIndicator size="large" color="#4f46e5" />
    </View>
  );
}

const splashStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" },
});

// Main Tabs Component
function MainTabs({ session, refreshKey, onLogout }: { session: MobileSession, refreshKey: number, onLogout: () => void }) {
  const { t } = useI18n();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4f46e5",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 12,
        }
      }}
    >
      <Tab.Screen 
        name="DashboardTab" 
        options={{ 
          title: t("tab_home"),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      >
        {({ navigation }) => (
          <DashboardScreen
            session={session}
            onOpenAppointments={() => navigation.navigate("AppointmentsTab")}
            onOpenTodayAppointments={() => navigation.getParent()?.navigate("TodayAppointments")}
          />
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="AppointmentsTab" 
        options={{ 
          title: t("tab_appointments"),
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />
        }}
      >
        {({ navigation }) => (
          <AppointmentsScreen
            token={session.accessToken}
            refreshKey={refreshKey}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSelectAppointment={(id) => (navigation.getParent() as any)?.navigate("AppointmentDetail", { id })}
          />
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="CalendarTab" 
        options={{ 
          title: t("tab_calendar"),
          tabBarIcon: ({ color, size }) => <CalendarIcon color={color} size={size} />
        }}
      >
        {({ navigation }) => (
          <CalendarScreen
            token={session.accessToken}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSelectAppointment={(id) => (navigation.getParent() as any)?.navigate("AppointmentDetail", { id })}
          />
        )}
      </Tab.Screen>
      <Tab.Screen 
        name="ProfileTab" 
        options={{ 
          title: t("tab_profile"),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      >
        {() => (
          <ProfileScreen
            session={session}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [booting, setBooting] = useState(true);
  const [session, setSession] = useState<MobileSession | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const existing = await loadSession();
      if (!mounted) return;
      if (!existing) {
        setBooting(false);
        return;
      }

      if (existing.expiresAt > Date.now() + 30_000) {
        setSession(existing);
        setBooting(false);
        return;
      }

      try {
        const refreshed = await mobileRefresh({ refreshToken: existing.refreshToken });
        const next = toSession(refreshed);
        await saveSession(next);
        if (!mounted) return;
        setSession(next);
      } catch {
        await clearSession();
        if (!mounted) return;
        setSession(null);
      } finally {
        if (mounted) setBooting(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogin(payload: MobileAuthPayload) {
    const next = toSession(payload);
    setSession(next);
    await saveSession(next);
  }

  async function handleLogout() {
    const current = session;
    setSession(null);
    await clearSession();
    if (current?.refreshToken) {
      mobileLogout(current.refreshToken).catch(() => undefined);
    }
  }

  const handleStatusChanged = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const canUpdateStatus = useMemo(() => session?.roles.appRole !== "STAFF_MEMBER", [session?.roles.appRole]);

  return (
    <I18nProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {(booting || !fontsLoaded) ? (
            <Stack.Screen name="Login" component={SplashScreen} />
          ) : !session ? (
            <Stack.Screen name="Login">
              {() => <LoginScreen onLogin={handleLogin} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="MainTabs">
                {() => (
                  <MainTabs 
                    session={session} 
                    refreshKey={refreshKey} 
                    onLogout={handleLogout} 
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="TodayAppointments">
                {({ navigation }) => (
                  <AppointmentsScreen
                    token={session.accessToken}
                    todayOnly
                    refreshKey={refreshKey}
                    onSelectAppointment={(id) => navigation.navigate("AppointmentDetail", { id })}
                    onBack={() => navigation.goBack()}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="AppointmentDetail">
                {({ route, navigation }) => (
                  <AppointmentDetailScreen
                    appointmentId={route.params.id}
                    token={session.accessToken}
                    canUpdateStatus={Boolean(canUpdateStatus)}
                    onBack={() => navigation.goBack()}
                    onStatusChanged={handleStatusChanged}
                  />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </I18nProvider>
  );
}
