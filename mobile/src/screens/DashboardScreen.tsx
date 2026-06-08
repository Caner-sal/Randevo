import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Animated, RefreshControl } from "react-native";
import { apiFetch } from "../api/client";
import type { AnalyticsSummary, MobileSession } from "../types";
import { useI18n } from "../i18n";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, Clock, CheckCircle2, ChevronRight, CalendarDays } from "lucide-react-native";

interface Props {
  session: MobileSession;
  onOpenAppointments: () => void;
  onOpenTodayAppointments: () => void;
}

export default function DashboardScreen({ session, onOpenAppointments, onOpenTodayAppointments }: Props) {
  const { t } = useI18n();
  const [stats, setStats] = useState<AnalyticsSummary["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Entry animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const loadStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await apiFetch<AnalyticsSummary>("/api/mobile/analytics", {}, session.accessToken);
      setStats(res.data);
    } catch {
      Alert.alert(t("common_error"), t("dashboard_analytics_load_error"));
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start();
      }
    }
  }, [session.accessToken, t, fadeAnim, slideAnim]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const onRefresh = useCallback(() => {
    loadStats(true);
  }, [loadStats]);

  // Time-based greeting
  const hour = new Date().getHours();
  let greetingKey = "greeting_morning";
  if (hour >= 12 && hour < 18) {
    greetingKey = "greeting_afternoon";
  } else if (hour >= 18) {
    greetingKey = "greeting_evening";
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4f46e5", "#3730a3"]} style={styles.headerBackground}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{t(greetingKey)}</Text>
            <Text style={styles.userName}>{session.user.name}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("dashboard_today")}</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#4f46e5" />
        ) : (
          <Animated.View style={[styles.statsGrid, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <StatCard label={t("dashboard_today")} value={stats?.todayAppointments ?? 0} icon={<Clock color="#3b82f6" size={24} />} color="#eff6ff" accent="#3b82f6" />
            <StatCard label={t("dashboard_this_week")} value={stats?.weekAppointments ?? 0} icon={<Calendar color="#8b5cf6" size={24} />} color="#f5f3ff" accent="#8b5cf6" />
            <StatCard label={t("dashboard_this_month")} value={stats?.monthAppointments ?? 0} icon={<CheckCircle2 color="#10b981" size={24} />} color="#ecfdf5" accent="#10b981" />
            <StatCard label={t("dashboard_pending")} value={stats?.pendingAppointments ?? 0} icon={<Clock color="#f59e0b" size={24} />} color="#fffbeb" accent="#f59e0b" />
          </Animated.View>
        )}

        <Animated.View style={[styles.actionContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.actionCard} onPress={onOpenTodayAppointments} activeOpacity={0.8}>
            <LinearGradient colors={["#4f46e5", "#6366f1"]} style={styles.actionGradient}>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>{t("dashboard_today_appointments")}</Text>
                <Text style={styles.actionSub}>{t("dashboard_today_appointments_sub")}</Text>
              </View>
              <ChevronRight color="#fff" size={24} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCardSecondary} onPress={onOpenAppointments} activeOpacity={0.8}>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitleSecondary}>{t("dashboard_view_appointments")}</Text>
              <Text style={styles.actionSubSecondary}>{t("dashboard_appointments_sub")}</Text>
            </View>
            <CalendarDays color="#4f46e5" size={24} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, icon, color, accent }: { label: string; value: number; icon: React.ReactNode; color: string; accent: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerBackground: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting: { fontSize: 16, fontFamily: "Inter_500Medium", color: "#c7d2fe" },
  userName: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#ffffff", marginTop: 4 },
  content: { flex: 1, padding: 24, marginTop: -20 },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#1e293b" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16, marginBottom: 32 },
  statCard: { backgroundColor: "#fff", borderRadius: 20, padding: 20, width: "47%", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  iconContainer: { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  statValue: { fontSize: 28, fontFamily: "Inter_700Bold", marginBottom: 4 },
  statLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#64748b" },
  actionContainer: { gap: 16, paddingBottom: 40 },
  actionCard: { borderRadius: 20, shadowColor: "#4f46e5", shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  actionGradient: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 24, borderRadius: 20 },
  actionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff", marginBottom: 4 },
  actionSub: { fontSize: 14, fontFamily: "Inter_400Regular", color: "#e0e7ff" },
  actionCardSecondary: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 24, backgroundColor: "#fff", borderRadius: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  actionTitleSecondary: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#1e293b", marginBottom: 4 },
  actionSubSecondary: { fontSize: 14, fontFamily: "Inter_400Regular", color: "#64748b" },
});
