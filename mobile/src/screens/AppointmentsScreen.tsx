import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, SectionList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, ScrollView } from "react-native";
import { apiFetch, ApiError } from "../api/client";
import type { Appointment } from "../api/client";
import { useI18n } from "../i18n";
import { ArrowLeft, Clock, User, Scissors, Calendar } from "lucide-react-native";

interface Props {
  token: string;
  todayOnly?: boolean;
  refreshKey?: number;
  onSelectAppointment: (id: string) => void;
  onBack?: () => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#fef3c7", text: "#d97706" },
  CONFIRMED: { bg: "#dbeafe", text: "#2563eb" },
  COMPLETED: { bg: "#d1fae5", text: "#059669" },
  CANCELLED: { bg: "#f3f4f6", text: "#6b7280" },
  NO_SHOW: { bg: "#fee2e2", text: "#ef4444" }
};

const CACHE_KEY = "slotpilot_mobile_appointments_cache";

interface AppointmentSection {
  title: string;
  data: Appointment[];
}

export default function AppointmentsScreen({ token, todayOnly, refreshKey, onSelectAppointment, onBack }: Props) {
  const { locale, t } = useI18n();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCachedBanner, setShowCachedBanner] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    let url = "/api/mobile/appointments?limit=100";
    if (todayOnly) {
      const now = new Date();
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      url += `&dateFrom=${start.toISOString()}&dateTo=${end.toISOString()}`;
    }
    try {
      const res = await apiFetch<{ data: Appointment[] }>(url, {}, token);
      setAppointments(res.data ?? []);
      setShowCachedBanner(false);
      if (!todayOnly) {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(res.data ?? []));
      }
    } catch (err) {
      if (!todayOnly) {
        const cachedRaw = await AsyncStorage.getItem(CACHE_KEY);
        const cached = cachedRaw ? (JSON.parse(cachedRaw) as Appointment[]) : [];
        if (cached.length > 0) {
          setAppointments(cached);
          setShowCachedBanner(true);
        } else {
          Alert.alert(t("common_error"), t("appointments_load_error"));
        }
      } else {
        Alert.alert(t("common_error"), t("appointments_load_error"));
      }
      if (err instanceof ApiError && err.status === 403) {
        Alert.alert(t("common_error"), t("common_forbidden"));
      }
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, [token, todayOnly, t]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshKey]);

  const onRefresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  // Group appointments by date
  const sections = React.useMemo(() => {
    const map = new Map<string, Appointment[]>();
    const now = new Date();
    const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const tomorrowStr = todayStr + 86400000;

    appointments.forEach((app) => {
      const d = new Date(app.startTime);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      
      let title = d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
      if (dayStart === todayStr) {
        title = t("dashboard_today") + " (" + title + ")";
      } else if (dayStart === tomorrowStr) {
        title = "Yarın" + " (" + title + ")"; // we can add 'tomorrow' to i18n later or just keep generic
      }

      if (!map.has(title)) map.set(title, []);
      map.get(title)!.push(app);
    });

    const result: AppointmentSection[] = [];
    map.forEach((data, title) => {
      // Sort within the group
      data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      result.push({ title, data });
    });
    
    // Maintain chronological order for sections
    return result; // API usually returns sorted, so groups are naturally sorted
  }, [appointments, locale, t]);

  const headerTitle = todayOnly ? t("dashboard_today_appointments") : t("appointments_title");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft color="#1e293b" size={24} />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
        <Text style={styles.title}>{headerTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      {showCachedBanner && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{t("appointments_cached_banner")}</Text>
          <Text style={styles.bannerSubText}>{t("appointments_offline_banner")}</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#4f46e5" />
      ) : appointments.length === 0 ? (
        <ScrollView 
          contentContainerStyle={styles.emptyContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />}
        >
          <Calendar color="#cbd5e1" size={64} style={{ marginBottom: 16 }} />
          <Text style={styles.emptyText}>{t("appointments_empty")}</Text>
        </ScrollView>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 24, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionTitle}>{title}</Text>
          )}
          renderItem={({ item }) => {
            const statusStyle = STATUS_COLORS[item.status] || STATUS_COLORS.PENDING;
            return (
              <TouchableOpacity style={styles.card} onPress={() => onSelectAppointment(item.id)} activeOpacity={0.7}>
                <View style={styles.cardHeader}>
                  <View style={styles.timeContainer}>
                    <Clock color="#4f46e5" size={16} />
                    <Text style={styles.timeText}>
                      {new Date(item.startTime).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>{t(`status_${item.status.toLowerCase()}`)}</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <User color="#64748b" size={16} />
                    <Text style={styles.customerName}>{item.customer.fullName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Scissors color="#64748b" size={16} />
                    <Text style={styles.serviceName}>{`${item.service.name} • ${item.staff.name}`}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "flex-start" },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#1e293b" },
  banner: { backgroundColor: "#fef3c7", padding: 12, marginHorizontal: 24, marginTop: 16, borderRadius: 12, borderWidth: 1, borderColor: "#fde68a" },
  bannerText: { color: "#92400e", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  bannerSubText: { color: "#b45309", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40, minHeight: 400 },
  emptyText: { color: "#94a3b8", textAlign: "center", fontFamily: "Inter_500Medium", fontSize: 16 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#64748b", marginTop: 16, marginBottom: 12, marginLeft: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  timeContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  timeText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1e293b" },
  statusBadge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  statusText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginBottom: 16 },
  detailsContainer: { gap: 10 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  customerName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: "#334155" },
  serviceName: { fontFamily: "Inter_400Regular", fontSize: 14, color: "#64748b" },
});
